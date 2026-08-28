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
  category: expedition.location.toLowerCase().includes("station") ? "Research station" : "Expedition",
}));

const markerColors = { Active: 0x34d399, Upcoming: 0xfbbf24, Completed: 0x38bdf8 };

function createFallbackTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);
  const ocean = context.createLinearGradient(0, 0, 0, canvas.height);
  ocean.addColorStop(0, "#123653");
  ocean.addColorStop(0.5, "#0b4565");
  ocean.addColorStop(1, "#071b31");
  context.fillStyle = ocean;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#617b67";
  for (const continent of worldGeoData.continents) {
    context.beginPath();
    continent.points.forEach(([lon, lat], index) => {
      const x = ((lon + 180) / 360) * canvas.width;
      const y = ((90 - lat) / 180) * canvas.height;
      index === 0 ? context.moveTo(x, y) : context.lineTo(x, y);
    });
    context.fill();
  }
  return new THREE.CanvasTexture(canvas);
}

function toPosition(lat: number, lon: number, radius: number) {
  return new THREE.Vector3(...latLonToVec3(lat, lon)).multiplyScalar(radius);
}

export function InteractiveGlobe({ className, onSelect }: InteractiveGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onSelectRef = useRef(onSelect);
  const [selected, setSelected] = useState<GlobeMarker | null>(null);
  const [hovered, setHovered] = useState<GlobeMarker | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [showMarkers, setShowMarkers] = useState(true);
  const [showIce, setShowIce] = useState(true);
  const [dayLight, setDayLight] = useState(true);

  onSelectRef.current = onSelect;
  const [resetView, setResetView] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.z = 3.1;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    const earthGeometry = new THREE.SphereGeometry(1, 96, 96);
    const fallbackTexture = createFallbackTexture();
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: fallbackTexture,
      shininess: 18,
      specular: new THREE.Color(0x4b7890),
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    globeGroup.add(earth);
    const earthTexture = new THREE.TextureLoader().load("https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57730/land_ocean_ice_2048.jpg", (texture) => {
      texture.encoding = THREE.sRGBEncoding;
      earthMaterial.map = texture;
      earthMaterial.needsUpdate = true;
    });
    const surfaceNormal = new THREE.TextureLoader().load("https://threejs.org/examples/textures/planets/earth_normal_2048.jpg", (texture) => {
      earthMaterial.normalMap = texture;
      earthMaterial.normalScale.set(0.22, 0.22);
      earthMaterial.needsUpdate = true;
    });
    const surfaceSpecular = new THREE.TextureLoader().load("https://threejs.org/examples/textures/planets/earth_specular_2048.jpg", (texture) => {
      earthMaterial.specularMap = texture;
      earthMaterial.needsUpdate = true;
    });

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
        const borders = topoMesh(topology, topology.objects.countries);
        borders.coordinates.forEach((segment) => {
          const points = segment.map(([lon, lat]) => new THREE.Vector3(...latLonToVec3(lat, lon)).multiplyScalar(1.008));
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          countryBorders.add(new THREE.Line(geometry, borderMaterial));
        });
      })
      .catch(() => undefined);

    const cloudMaterial = new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load("https://threejs.org/examples/textures/planets/earth_clouds_1024.png"),
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const clouds = new THREE.Mesh(new THREE.SphereGeometry(1.018, 64, 64), cloudMaterial);
    globeGroup.add(clouds);

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.045, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0x58b9e6, transparent: true, opacity: 0.16, side: THREE.BackSide }),
    );
    globeGroup.add(atmosphere);
    const iceMaterial = new THREE.MeshPhongMaterial({ color: 0xd9f4ff, transparent: true, opacity: 0.82 });
    const northIce = new THREE.Mesh(new THREE.SphereGeometry(1.012, 64, 32, 0, Math.PI * 2, 0, Math.PI / 7), iceMaterial);
    const southIce = new THREE.Mesh(new THREE.SphereGeometry(1.012, 64, 32, 0, Math.PI * 2, Math.PI - Math.PI / 7, Math.PI / 7), iceMaterial);
    globeGroup.add(northIce, southIce);

    const markerGroup = new THREE.Group();
    globeGroup.add(markerGroup);
    const markerMeshes = new Map<THREE.Object3D, GlobeMarker>();
    markers.forEach((marker) => {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.027, 12, 12), new THREE.MeshBasicMaterial({ color: markerColors[marker.status] }));
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
    const starsMaterial = new THREE.PointsMaterial({ color: 0xc9e8f3, size: 0.035, transparent: true, opacity: 0.45 });
    scene.add(new THREE.Points(starsGeometry, starsMaterial));
    const ambientLight = new THREE.AmbientLight(0x6f8da3, 0.2);
    const sunLight = new THREE.DirectionalLight(0xfff6e6, dayLight ? 2.1 : 0.58);
    sunLight.position.set(4, 2, 5);
    scene.add(ambientLight, sunLight);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const state = { dragging: false, moved: false, previousX: 0, previousY: 0, velocityX: 0, velocityY: 0, target: null as THREE.Vector2 | null };
    const resize = () => {
      const width = container.clientWidth;
      const height = Math.max(container.clientHeight, 260);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const updatePointer = (event: PointerEvent) => {
      const bounds = renderer.domElement.getBoundingClientRect();
      pointer.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1, -((event.clientY - bounds.top) / bounds.height) * 2 + 1);
    };
    const hitMarker = () => {
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(markerGroup.children, false)[0];
      return hit ? markerMeshes.get(hit.object) ?? null : null;
    };
    const onPointerDown = (event: PointerEvent) => {
      state.dragging = true;
      state.moved = false;
      state.previousX = event.clientX;
      state.previousY = event.clientY;
      state.velocityX = 0;
      state.velocityY = 0;
      renderer.domElement.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      updatePointer(event);
      if (state.dragging) {
        const deltaX = event.clientX - state.previousX;
        const deltaY = event.clientY - state.previousY;
        state.moved ||= Math.abs(deltaX) + Math.abs(deltaY) > 3;
        state.velocityY = deltaX * 0.006;
        state.velocityX = deltaY * 0.004;
        globeGroup.rotation.y += state.velocityY;
        globeGroup.rotation.x = THREE.MathUtils.clamp(globeGroup.rotation.x + state.velocityX, -0.9, 0.9);
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
          const position = toPosition(marker.lat, marker.lon, 1);
          state.target = new THREE.Vector2(-Math.asin(position.y), Math.atan2(position.x, position.z));
        }
      }
    };
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      camera.position.z = THREE.MathUtils.clamp(camera.position.z + event.deltaY * 0.0015, 1.85, 4.6);
    };
    const onPointerLeave = () => setHovered(null);
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointerleave", onPointerLeave);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", resize);
    resize();

    let animationFrame = 0;
    const animate = () => {
      animationFrame = requestAnimationFrame(animate);
      if (!state.dragging) {
        clouds.rotation.y += 0.00008;
        globeGroup.rotation.y += state.velocityY;
        globeGroup.rotation.x = THREE.MathUtils.clamp(globeGroup.rotation.x + state.velocityX, -0.9, 0.9);
        state.velocityX *= 0.94;
        state.velocityY = state.velocityY * 0.94 + 0.00016;
        if (state.target) {
          globeGroup.rotation.x = THREE.MathUtils.lerp(globeGroup.rotation.x, state.target.x, 0.06);
          globeGroup.rotation.y = THREE.MathUtils.lerp(globeGroup.rotation.y, state.target.y, 0.06);
          if (Math.abs(globeGroup.rotation.y - state.target.y) < 0.002) state.target = null;
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
      renderer.domElement.removeEventListener("wheel", onWheel);
      earthGeometry.dispose();
      earthMaterial.dispose();
      fallbackTexture.dispose();
      earthTexture.dispose();
      surfaceNormal.dispose();
      surfaceSpecular.dispose();
      countryBorders.children.forEach((border) => border.geometry.dispose());
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
        marker.geometry.dispose();
        (marker.material as THREE.Material).dispose();
      });
      starsGeometry.dispose();
      starsMaterial.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [dayLight, resetView, showIce, showMarkers]);

  const linkedResearch = selected ? researchItems.filter((item) => item.expeditionId === selected.id) : [];
  const hoveredResearch = hovered ? researchItems.find((item) => item.expeditionId === hovered.id) : undefined;
  const activeCount = markers.filter((marker) => marker.status === "Active").length;
  return (
    <div className={cn("relative overflow-hidden rounded-2xl bg-[#06121f]", className)}>
      <div ref={containerRef} className="h-full min-h-[300px] w-full touch-none" />
      <div className="absolute left-3 top-3 flex flex-wrap gap-2 rounded-xl border border-white/10 bg-[#071827]/80 p-2 text-[10px] text-slate-200 backdrop-blur-md">
        <button onClick={() => setDayLight((value) => !value)} className={cn("flex items-center gap-1.5 rounded-lg px-2 py-1.5", dayLight ? "bg-amber-400/20 text-amber-200" : "bg-slate-700/70 text-slate-400")} title="Toggle day lighting"><Sun size={13} /> Day light</button>
        <button onClick={() => setShowMarkers((value) => !value)} className={cn("flex items-center gap-1.5 rounded-lg px-2 py-1.5", showMarkers ? "bg-emerald-400/20 text-emerald-200" : "bg-slate-700/70 text-slate-400")} title="Toggle research markers"><MapPin size={13} /> Research activity</button>
        <button onClick={() => setShowIce((value) => !value)} className={cn("flex items-center gap-1.5 rounded-lg px-2 py-1.5", showIce ? "bg-cyan-400/20 text-cyan-200" : "bg-slate-700/70 text-slate-400")} title="Toggle polar ice caps"><Snowflake size={13} /> Polar ice</button>
      </div>
      <button onClick={() => setResetView((value) => value + 1)} className="absolute right-3 top-3 rounded-lg border border-white/10 bg-[#071827]/80 p-2 text-slate-300 backdrop-blur-md hover:text-white" title="Reset globe view" aria-label="Reset globe view"><RotateCcw size={14} /></button>
      <div className="absolute bottom-3 left-3 rounded-xl border border-white/10 bg-[#071827]/85 px-3 py-2 text-[10px] text-slate-300 backdrop-blur-md"><p className="font-mono uppercase tracking-wider text-cyan-200">Earth observation view</p><p className="mt-1">{markers.length} missions · {activeCount} active · scroll to zoom</p></div>
      {hovered && !selected && <div className="pointer-events-none absolute z-20 w-[220px] overflow-hidden rounded-lg border border-cyan-300/40 bg-[#071827]/95 text-[11px] text-white shadow-xl" style={{ left: Math.min(hoverPosition.x + 12, 16 + Math.max(0, (containerRef.current?.clientWidth ?? 240) - 236)), top: Math.min(hoverPosition.y + 12, Math.max(12, (containerRef.current?.clientHeight ?? 300) - 150)) }}>
        {(hovered.imageUrl ?? hoveredResearch?.imageUrl) && <img src={hovered.imageUrl ?? hoveredResearch?.imageUrl} alt={hovered.location} className="h-20 w-full object-cover" />}
        <div className="p-3">
          <p className="font-semibold text-cyan-200">{hovered.location}</p>
          <p className="mt-0.5 text-slate-300">{hovered.category} · {hovered.status}</p>
          <p className="mt-2 line-clamp-3 leading-relaxed text-slate-300">{hovered.objective ?? hovered.description ?? "Polar science field activity"}</p>
          {hoveredResearch && <p className="mt-2 truncate border-t border-white/10 pt-2 text-cyan-100">Research: {hoveredResearch.title}</p>}
        </div>
      </div>}
      {selected && <div className="absolute bottom-3 right-3 z-20 w-[min(290px,calc(100%-1.5rem))] rounded-xl border border-cyan-300/30 bg-[#071827]/95 p-4 text-white shadow-2xl backdrop-blur-md"><button onClick={() => setSelected(null)} className="absolute right-2 top-2 text-slate-400 hover:text-white" aria-label="Close location details"><X size={14} /></button><p className="font-mono text-[10px] uppercase tracking-wider text-cyan-200">{selected.region} · {selected.category}</p><h3 className="mt-1 pr-5 text-sm font-semibold">{selected.location}</h3><p className="mt-1 text-[11px] text-slate-300">{selected.name}</p><p className="mt-3 text-[11px] leading-relaxed text-slate-300">{selected.objective ?? selected.description}</p><div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/10 pt-3 text-[10px]"><span className="text-slate-400">Lead researcher<br /><strong className="text-slate-200">{selected.lead ?? "Not listed"}</strong></span><span className="text-slate-400">Status<br /><strong className="text-emerald-300">{selected.status}</strong></span></div>{linkedResearch.length > 0 && <p className="mt-3 border-t border-white/10 pt-2 text-[10px] text-cyan-200">{linkedResearch.length} linked research paper{linkedResearch.length > 1 ? "s" : ""}</p>}</div>}
    </div>
  );
}
