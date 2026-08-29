import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { mesh as topoMesh } from "topojson-client";
import type { Topology } from "topojson-specification";
import { MapPin, RotateCcw, Snowflake, Sun, X } from "lucide-react";
import { expeditions } from "@/lib/data/expeditions";
import { researchItems } from "@/lib/data/research";
import { latLonToVec3, worldGeoData } from "@/lib/geojson-simplified";
import type { Expedition } from "@/lib/data/types";
import { cn } from "@/lib/utils";

interface InteractiveGlobeProps {
  className?: string;
  onSelect?: (expedition: Expedition) => void;
}

type GlobeMarker = Expedition & { category: "Research station" | "Expedition" };

const markers: GlobeMarker[] = expeditions.map((expedition) => ({
  ...expedition,
  category: expedition.location.toLowerCase().includes("station")
    ? "Research station"
    : "Expedition",
}));

const markerColors = { Active: 0x34d399, Upcoming: 0xfbbf24, Completed: 0x38bdf8 };

function createFallbackTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);
  const ocean = context.createLinearGradient(0, 0, 0, canvas.height);
  ocean.addColorStop(0, "#081d36");
  ocean.addColorStop(0.3, "#0d2b4e");
  ocean.addColorStop(0.5, "#07182c");
  ocean.addColorStop(0.7, "#0d2b4e");
  ocean.addColorStop(1, "#081d36");
  context.fillStyle = ocean;
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Blue continents (no green land)
  context.fillStyle = "#184572";
  for (const continent of worldGeoData.continents) {
    context.beginPath();
    continent.points.forEach((point, index) => {
      const lon = point[0];
      const lat = point[1];
      if (lon === undefined || lat === undefined) return;
      const x = ((lon + 180) / 360) * canvas.width;
      const y = ((90 - lat) / 180) * canvas.height;
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    });
    context.fill();
  }

  // Polar ice caps
  context.fillStyle = "#a8e0f5";
  context.fillRect(0, 0, canvas.width, 45);
  context.fillRect(0, canvas.height - 70, canvas.width, 70);

  const texture = new THREE.CanvasTexture(canvas);
  texture.encoding = THREE.sRGBEncoding;
  return texture;
}

function processBlueTexture(sourceImage: HTMLImageElement): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = sourceImage.width || 2048;
  canvas.height = sourceImage.height || 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);
  try {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]!;
      const g = data[i + 1]!;
      const b = data[i + 2]!;

      const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      const isSnow = r > 190 && g > 190 && b > 190;

      if (isSnow) {
        data[i] = Math.min(255, 175 + lum * 80);
        data[i + 1] = Math.min(255, 220 + lum * 35);
        data[i + 2] = 255;
      } else {
        // Map all continents and surface relief to pure scientific polar blue
        data[i] = Math.round(8 + lum * 28);
        data[i + 1] = Math.round(28 + lum * 85);
        data[i + 2] = Math.round(62 + lum * 140);
      }
    }

    ctx.putImageData(imgData, 0, 0);
  } catch {
    // If CORS prevents pixel manipulation, canvas remains
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.encoding = THREE.sRGBEncoding;
  texture.needsUpdate = true;
  return texture;
}

function toPosition(lat: number, lon: number, radius: number) {
  return new THREE.Vector3(...latLonToVec3(lat, lon)).multiplyScalar(radius);
}

function currentSunPosition() {
  const now = new Date();
  const day = Math.floor(
    (Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) -
      Date.UTC(now.getUTCFullYear(), 0, 0)) /
      86400000,
  );
  const declination = 23.44 * Math.sin(((360 / 365) * (day - 81) * Math.PI) / 180);
  const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60;
  const longitude = (12 - utcHours) * 15;
  return toPosition(declination, longitude, 5);
}

export function InteractiveGlobe({ className, onSelect }: InteractiveGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const onSelectRef = useRef(onSelect);
  const [selected, setSelected] = useState<GlobeMarker | null>(null);
  const [hovered, setHovered] = useState<GlobeMarker | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [showMarkers, setShowMarkers] = useState(true);
  const [showIce, setShowIce] = useState(true);
  const [dayLight, setDayLight] = useState(true);
  const [zoomRequest, setZoomRequest] = useState(0);

  onSelectRef.current = onSelect;
  const [resetView, setResetView] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 3.1);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.domElement.className = "block mx-auto w-full h-full";
    container.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    globeGroup.position.set(0, 0, 0);
    scene.add(globeGroup);
    const earthGeometry = new THREE.SphereGeometry(1, 96, 96);
    const fallbackTexture = createFallbackTexture();
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: fallbackTexture,
      shininess: 24,
      specular: new THREE.Color(0x3882a8),
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    globeGroup.add(earth);

    let loadedBlueTexture: THREE.CanvasTexture | null = null;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      loadedBlueTexture = processBlueTexture(img);
      earthMaterial.map = loadedBlueTexture;
      earthMaterial.needsUpdate = true;
    };
    img.src =
      "https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57730/land_ocean_ice_2048.jpg";

    const surfaceNormal = new THREE.TextureLoader().load(
      "https://threejs.org/examples/textures/planets/earth_normal_2048.jpg",
      (texture: THREE.Texture) => {
        earthMaterial.normalMap = texture;
        earthMaterial.normalScale.set(0.22, 0.22);
        earthMaterial.needsUpdate = true;
      },
    );
    const surfaceSpecular = new THREE.TextureLoader().load(
      "https://threejs.org/examples/textures/planets/earth_specular_2048.jpg",
      (texture: THREE.Texture) => {
        earthMaterial.specularMap = texture;
        earthMaterial.needsUpdate = true;
      },
    );

    const countryBorders = new THREE.Group();
    const borderMaterial = new THREE.LineBasicMaterial({
      color: 0xd9f7ff,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    });
    countryBorders.renderOrder = 2;
    globeGroup.add(countryBorders);
    let bordersDisposed = false;
    void fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then((response) => (response.ok ? response.json() : null))
      .then((topology: Topology | null) => {
        if (!topology || bordersDisposed) return;
        const countriesObj = topology.objects["countries"];
        if (!countriesObj) return;
        const borders = topoMesh(topology, countriesObj as Parameters<typeof topoMesh>[1]);
        borders.coordinates.forEach((segment) => {
          const points = segment
            .map(([lon, lat]) => {
              if (lon === undefined || lat === undefined) return null;
              return new THREE.Vector3(...latLonToVec3(lat, lon)).multiplyScalar(1.008);
            })
            .filter((p): p is THREE.Vector3 => p !== null);
          if (points.length > 0) {
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            countryBorders.add(new THREE.Line(geometry, borderMaterial));
          }
        });
      })
      .catch(() => undefined);

    const cloudMaterial = new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load(
        "https://threejs.org/examples/textures/planets/earth_clouds_1024.png",
      ),
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const clouds = new THREE.Mesh(new THREE.SphereGeometry(1.018, 64, 64), cloudMaterial);
    globeGroup.add(clouds);

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.045, 64, 64),
      new THREE.MeshBasicMaterial({
        color: 0x58b9e6,
        transparent: true,
        opacity: 0.16,
        side: THREE.BackSide,
      }),
    );
    globeGroup.add(atmosphere);
    const iceMaterial = new THREE.MeshPhongMaterial({
      color: 0xd9f4ff,
      transparent: true,
      opacity: 0.82,
    });
    const northIce = new THREE.Mesh(
      new THREE.SphereGeometry(1.006, 64, 32, 0, Math.PI * 2, 0, Math.PI / 8),
      iceMaterial,
    );
    const southIce = new THREE.Mesh(
      new THREE.SphereGeometry(1.006, 64, 32, 0, Math.PI * 2, Math.PI - Math.PI / 8, Math.PI / 8),
      iceMaterial,
    );
    globeGroup.add(northIce, southIce);

    const markerGroup = new THREE.Group();
    globeGroup.add(markerGroup);
    const markerMeshes = new Map<THREE.Object3D, GlobeMarker>();
    markers.forEach((marker) => {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.027, 12, 12),
        new THREE.MeshBasicMaterial({ color: markerColors[marker.status] }),
      );
      mesh.position.copy(toPosition(marker.lat, marker.lon, 1.035));
      markerGroup.add(mesh);
      markerMeshes.set(mesh, marker);
    });

    const starsGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(420 * 3);
    for (let index = 0; index < starPositions.length; index += 3) {
      const radius = 18 + Math.random() * 22;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[index] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[index + 1] = radius * Math.cos(phi);
      starPositions[index + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    starsGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xc9e8f3,
      size: 0.035,
      transparent: true,
      opacity: 0.45,
    });
    scene.add(new THREE.Points(starsGeometry, starsMaterial));
    const ambientLight = new THREE.AmbientLight(0x6f8da3, 0.2);
    const sunLight = new THREE.DirectionalLight(0xfff6e6, dayLight ? 2.1 : 0.58);
    sunLight.position.copy(currentSunPosition());
    scene.add(ambientLight, sunLight);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const state = {
      dragging: false,
      moved: false,
      previousX: 0,
      previousY: 0,
      velocityX: 0,
      velocityY: 0,
      targetQuaternion: null as THREE.Quaternion | null,
    };
    const resize = () => {
      const width = container.clientWidth;
      const height = Math.max(container.clientHeight, 260);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const updatePointer = (event: PointerEvent) => {
      const bounds = renderer.domElement.getBoundingClientRect();
      pointer.set(
        ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
      );
    };
    const hitMarker = () => {
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(markerGroup.children, false)[0];
      return hit ? (markerMeshes.get(hit.object) ?? null) : null;
    };
    const onPointerDown = (event: PointerEvent) => {
      state.dragging = true;
      state.moved = false;
      state.previousX = event.clientX;
      state.previousY = event.clientY;
      state.velocityX = 0;
      state.velocityY = 0;
      state.targetQuaternion = null;
      renderer.domElement.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      updatePointer(event);
      if (state.dragging) {
        const deltaX = event.clientX - state.previousX;
        const deltaY = event.clientY - state.previousY;
        state.moved ||= Math.abs(deltaX) + Math.abs(deltaY) > 3;

        // Unconstrained 360 degree rotation in all directions
        const rotY = new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(0, 1, 0),
          deltaX * 0.005,
        );
        const rotX = new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(1, 0, 0),
          deltaY * 0.005,
        );

        globeGroup.quaternion.premultiply(rotX);
        globeGroup.quaternion.premultiply(rotY);

        state.velocityX = deltaY * 0.005;
        state.velocityY = deltaX * 0.005;
        state.previousX = event.clientX;
        state.previousY = event.clientY;
        return;
      }
      setHovered(hitMarker());
      const bounds = container.getBoundingClientRect();
      setHoverPosition({ x: event.clientX - bounds.left, y: event.clientY - bounds.top });
    };
    const onPointerUp = (event: PointerEvent) => {
      state.dragging = false;
      renderer.domElement.releasePointerCapture(event.pointerId);
      if (!state.moved) {
        const marker = hitMarker();
        if (marker) {
          setSelected(marker);
          onSelectRef.current?.(marker);
          const markerPos = toPosition(marker.lat, marker.lon, 1).normalize();
          const currentWorldPos = markerPos.clone().applyQuaternion(globeGroup.quaternion);
          const deltaQ = new THREE.Quaternion().setFromUnitVectors(
            currentWorldPos,
            new THREE.Vector3(0, 0, 1),
          );
          state.targetQuaternion = deltaQ.multiply(globeGroup.quaternion.clone());
        }
      }
    };
    const onPointerLeave = () => setHovered(null);
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", resize);
    resize();

    let animationFrame = 0;
    const animate = () => {
      animationFrame = requestAnimationFrame(animate);
      if (!state.dragging) {
        if (state.targetQuaternion) {
          globeGroup.quaternion.slerp(state.targetQuaternion, 0.06);
          if (globeGroup.quaternion.angleTo(state.targetQuaternion) < 0.002) {
            state.targetQuaternion = null;
          }
        } else if (Math.abs(state.velocityX) > 0.00002 || Math.abs(state.velocityY) > 0.00002) {
          const qX = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(1, 0, 0),
            state.velocityX,
          );
          const qY = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 1, 0),
            state.velocityY,
          );
          globeGroup.quaternion.premultiply(qX);
          globeGroup.quaternion.premultiply(qY);
          state.velocityX *= 0.92;
          state.velocityY *= 0.92;
        }
      }
      markerGroup.visible = showMarkers;
      northIce.visible = showIce;
      southIce.visible = showIce;
      sunLight.intensity = dayLight ? 2.1 : 0.58;
      renderer.render(scene, camera);
    };
    animate();
    return () => {
      bordersDisposed = true;
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("pointerleave", onPointerLeave);
      cameraRef.current = null;
      earthGeometry.dispose();
      earthMaterial.dispose();
      fallbackTexture.dispose();
      loadedBlueTexture?.dispose();
      surfaceNormal.dispose();
      surfaceSpecular.dispose();
      countryBorders.children.forEach((border) => {
        if (border instanceof THREE.Line) {
          border.geometry.dispose();
        }
      });
      borderMaterial.dispose();
      cloudMaterial.map?.dispose();
      cloudMaterial.dispose();
      clouds.geometry.dispose();
      atmosphere.geometry.dispose();
      (atmosphere.material as THREE.Material).dispose();
      northIce.geometry.dispose();
      southIce.geometry.dispose();
      iceMaterial.dispose();
      markerGroup.children.forEach((marker) => {
        if (marker instanceof THREE.Mesh) {
          marker.geometry.dispose();
          if (Array.isArray(marker.material)) {
            marker.material.forEach((m) => m.dispose());
          } else if (marker.material) {
            (marker.material as THREE.Material).dispose();
          }
        }
      });
      starsGeometry.dispose();
      starsMaterial.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [dayLight, resetView, showIce, showMarkers]);

  const handleZoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.position.z = THREE.MathUtils.clamp(
        cameraRef.current.position.z - 0.35,
        1.85,
        4.6,
      );
    }
  };

  const handleZoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.position.z = THREE.MathUtils.clamp(
        cameraRef.current.position.z + 0.35,
        1.85,
        4.6,
      );
    }
  };

  const linkedResearch = selected
    ? researchItems.filter((item) => item.expeditionId === selected.id)
    : [];
  const hoveredResearch = hovered
    ? researchItems.find((item) => item.expeditionId === hovered.id)
    : undefined;
  const activeCount = markers.filter((marker) => marker.status === "Active").length;
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-[#06121f] flex items-center justify-center mx-auto",
        className,
      )}
    >
      <div
        ref={containerRef}
        className="h-full min-h-[300px] w-full flex items-center justify-center touch-none"
      />
      <div className="absolute left-3 top-3 flex flex-wrap gap-2 rounded-xl border border-white/10 bg-[#071827]/80 p-2 text-[10px] text-slate-200 backdrop-blur-md">
        <button
          onClick={() => setDayLight((value) => !value)}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-2 py-1.5",
            dayLight ? "bg-amber-400/20 text-amber-200" : "bg-slate-700/70 text-slate-400",
          )}
          title="Toggle day lighting"
        >
          <Sun size={13} /> Day light
        </button>
        <button
          onClick={() => setShowMarkers((value) => !value)}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-2 py-1.5",
            showMarkers ? "bg-emerald-400/20 text-emerald-200" : "bg-slate-700/70 text-slate-400",
          )}
          title="Toggle research markers"
        >
          <MapPin size={13} /> Research activity
        </button>
        <button
          onClick={() => setShowIce((value) => !value)}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-2 py-1.5",
            showIce ? "bg-cyan-400/20 text-cyan-200" : "bg-slate-700/70 text-slate-400",
          )}
          title="Toggle polar ice caps"
        >
          <Snowflake size={13} /> Polar ice
        </button>
      </div>
      <button
        onClick={() => setResetView((value) => value + 1)}
        className="absolute right-3 top-3 rounded-lg border border-white/10 bg-[#071827]/80 p-2 text-slate-300 backdrop-blur-md hover:text-white"
        title="Reset globe view"
        aria-label="Reset globe view"
      >
        <RotateCcw size={14} />
      </button>
      <div className="absolute right-3 bottom-3 flex items-center gap-1 rounded-xl border border-white/10 bg-[#071827]/85 p-1 text-[10px] text-slate-300 backdrop-blur-md">
        <button
          onClick={handleZoomOut}
          className="rounded-lg px-2 py-1.5 text-base leading-none hover:bg-white/10"
          title="Zoom out"
          aria-label="Zoom out"
        >
          −
        </button>
        <button
          onClick={handleZoomIn}
          className="rounded-lg px-2 py-1.5 text-base leading-none hover:bg-white/10"
          title="Zoom in"
          aria-label="Zoom in"
        >
          +
        </button>
      </div>
      <div className="absolute bottom-3 left-3 rounded-xl border border-white/10 bg-[#071827]/85 px-3 py-2 text-[10px] text-slate-300 backdrop-blur-md">
        <p className="font-mono uppercase tracking-wider text-cyan-200">Earth observation view</p>
        <p className="mt-1">
          {markers.length} missions · {activeCount} active · use controls to zoom
        </p>
      </div>
      {hovered && !selected && (
        <div
          className="pointer-events-none absolute z-20 w-[220px] overflow-hidden rounded-lg border border-cyan-300/40 bg-[#071827]/95 text-[11px] text-white shadow-xl"
          style={{
            left: Math.min(
              hoverPosition.x + 12,
              16 + Math.max(0, (containerRef.current?.clientWidth ?? 240) - 236),
            ),
            top: Math.min(
              hoverPosition.y + 12,
              Math.max(12, (containerRef.current?.clientHeight ?? 300) - 150),
            ),
          }}
        >
          {(hovered.imageUrl ?? hoveredResearch?.imageUrl) && (
            <img
              src={hovered.imageUrl ?? hoveredResearch?.imageUrl}
              alt={hovered.location}
              className="h-20 w-full object-cover"
            />
          )}
          <div className="p-3">
            <p className="font-semibold text-cyan-200">{hovered.location}</p>
            <p className="mt-0.5 text-slate-300">
              {hovered.category} · Research {hovered.status === "Active" ? "ACTIVE" : "INACTIVE"}
            </p>
            <p className="mt-2 line-clamp-3 leading-relaxed text-slate-300">
              {hovered.objective ?? hovered.description ?? "Polar science field activity"}
            </p>
            {hoveredResearch && (
              <p className="mt-2 truncate border-t border-white/10 pt-2 text-cyan-100">
                Research: {hoveredResearch.title}
              </p>
            )}
          </div>
        </div>
      )}
      {selected && (
        <div className="absolute bottom-3 right-3 z-20 w-[min(290px,calc(100%-1.5rem))] rounded-xl border border-cyan-300/30 bg-[#071827]/95 p-4 text-white shadow-2xl backdrop-blur-md">
          <button
            onClick={() => setSelected(null)}
            className="absolute right-2 top-2 text-slate-400 hover:text-white"
            aria-label="Close location details"
          >
            <X size={14} />
          </button>
          <p className="font-mono text-[10px] uppercase tracking-wider text-cyan-200">
            {selected.region} · {selected.category}
          </p>
          <h3 className="mt-1 pr-5 text-sm font-semibold">{selected.location}</h3>
          <p className="mt-1 text-[11px] text-slate-300">{selected.name}</p>
          <p className="mt-3 text-[11px] leading-relaxed text-slate-300">
            {selected.objective ?? selected.description}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/10 pt-3 text-[10px]">
            <span className="text-slate-400">
              Lead researcher
              <br />
              <strong className="text-slate-200">{selected.lead ?? "Not listed"}</strong>
            </span>
            <span className="text-slate-400">
              Status
              <br />
              <strong className="text-emerald-300">{selected.status}</strong>
            </span>
          </div>
          {linkedResearch.length > 0 && (
            <p className="mt-3 border-t border-white/10 pt-2 text-[10px] text-cyan-200">
              {linkedResearch.length} linked research paper{linkedResearch.length > 1 ? "s" : ""}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
