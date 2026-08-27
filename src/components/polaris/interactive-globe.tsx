import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { latLonToVec3, worldGeoData } from "@/lib/geojson-simplified";

interface InteractiveGlobeProps {
  className?: string;
}

export function InteractiveGlobe({ className }: InteractiveGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeRef = useRef<THREE.Group | null>(null);
  const [hoveredLocation, setHoveredLocation] = useState<string>("");

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0e27);

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    );
    camera.position.z = 2.5;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    rendererRef.current = renderer;
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight,
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Create globe group
    const globeGroup = new THREE.Group();
    globeRef.current = globeGroup;
    scene.add(globeGroup);

    // Globe sphere geometry
    const geometry = new THREE.IcosahedronGeometry(1, 64);

    // Create canvas texture for Earth
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d")!;

    // Draw Earth surface
    // Ocean blue
    ctx.fillStyle = "#1a4d7a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw continents in greenish-brown
    ctx.fillStyle = "#2d5a3d";
    for (const continent of worldGeoData.continents) {
      ctx.beginPath();
      let first = true;
      for (const [lon, lat] of continent.points) {
        const x = ((lon + 180) / 360) * canvas.width;
        const y = ((90 - lat) / 180) * canvas.height;
        if (first) {
          ctx.moveTo(x, y);
          first = false;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.fill();
    }

    // Add subtle grid lines for latitude
    ctx.strokeStyle = "rgba(100, 150, 200, 0.15)";
    ctx.lineWidth = 1;
    for (let lat = -80; lat <= 80; lat += 20) {
      const y = ((90 - lat) / 180) * canvas.height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Longitude lines
    for (let lon = -180; lon <= 180; lon += 20) {
      const x = ((lon + 180) / 360) * canvas.width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.encoding = THREE.sRGBEncoding;

    const material = new THREE.MeshPhongMaterial({
      map: texture,
      emissive: new THREE.Color(0x111827),
      emissiveIntensity: 0.3,
      shininess: 5,
    });

    const globe = new THREE.Mesh(geometry, material);
    globeGroup.add(globe);

    // Use NASA's public Blue Marble texture for recognizable geography, with
    // the generated map remaining visible until the remote asset is ready.
    const earthTexture = new THREE.TextureLoader().load(
      "https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57730/land_ocean_ice_2048.jpg",
      (loadedTexture) => {
        loadedTexture.encoding = THREE.sRGBEncoding;
        material.map = loadedTexture;
        material.needsUpdate = true;
      },
    );

    // Atmosphere glow
    const atmosphereGeometry = new THREE.IcosahedronGeometry(1.02, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x4da6ff,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globeGroup.add(atmosphere);

    // Stars background
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 400;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 200;
      positions[i + 1] = (Math.random() - 0.5) * 200;
      positions[i + 2] = (Math.random() - 0.5) * 200;
    }
    starsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.7,
      opacity: 0.6,
      transparent: true,
    });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x87ceeb, 0.3);
    rimLight.position.set(-5, -3, -5);
    scene.add(rimLight);

    // Interaction state
    const state = {
      isDragging: false,
      previousMousePosition: { x: 0, y: 0 },
      mouseVelocity: { x: 0, y: 0 },
      rotationVelocity: { x: 0, y: 0 },
      damping: 0.95,
      autoRotateSpeed: 0.0003,
    };

    // Mouse events
    const getPointer = (e: MouseEvent) => {
      const bounds = renderer.domElement.getBoundingClientRect();
      return new THREE.Vector2(
        ((e.clientX - bounds.left) / bounds.width) * 2 - 1,
        -((e.clientY - bounds.top) / bounds.height) * 2 + 1,
      );
    };

    const onMouseDown = (e: MouseEvent) => {
      state.isDragging = true;
      state.previousMousePosition = { x: e.clientX, y: e.clientY };
      state.rotationVelocity = { x: 0, y: 0 };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (state.isDragging) {
        const deltaX = e.clientX - state.previousMousePosition.x;
        const deltaY = e.clientY - state.previousMousePosition.y;

        state.rotationVelocity.x = deltaY * 0.01;
        state.rotationVelocity.y = deltaX * 0.01;

        globeGroup.rotation.x += state.rotationVelocity.x;
        globeGroup.rotation.y += state.rotationVelocity.y;

        state.previousMousePosition = { x: e.clientX, y: e.clientY };
      } else {
        // Check for hover over locations
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(getPointer(e), camera);
        globeGroup.updateMatrixWorld();

        let closestCity = "";
        let minDistance = Infinity;

        for (const city of worldGeoData.cities) {
          const vec = latLonToVec3(city.lat, city.lon);
          const cityPoint = new THREE.Vector3(...vec).applyMatrix4(globeGroup.matrixWorld);
          const cityDistance = raycaster.ray.distanceToPoint(cityPoint);
          if (cityDistance < 0.3 && cityDistance < minDistance) {
            minDistance = cityDistance;
            closestCity = city.name;
          }
        }

        setHoveredLocation(closestCity);
      }
    };

    const onMouseUp = () => {
      state.isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z += e.deltaY * 0.001;
      camera.position.z = Math.max(1.5, Math.min(4, camera.position.z));
    };

    // Click for ripple effect
    const onClick = (e: MouseEvent) => {
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(getPointer(e), camera);

      const intersects = raycaster.intersectObject(globe);
      if (intersects.length > 0) {
        createRipple(intersects[0].point);
      }
    };

    const createRipple = (point: THREE.Vector3) => {
      const rippleGeometry = new THREE.BufferGeometry();
      const rippleMaterial = new THREE.LineBasicMaterial({
        color: 0x4da6ff,
        transparent: true,
        opacity: 0.8,
      });

      const rippleVertices = [];
      const rippleRadius = 0.3;
      for (let i = 0; i < 32; i++) {
        const angle = (i / 32) * Math.PI * 2;
        const x = point.x + rippleRadius * Math.cos(angle);
        const y = point.y + rippleRadius * Math.sin(angle);
        const z = point.z + rippleRadius * Math.sin(angle);
        rippleVertices.push(x, y, z);
      }

      rippleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(rippleVertices), 3),
      );

      const ripple = new THREE.LineLoop(rippleGeometry, rippleMaterial);
      globeGroup.add(ripple);

      // Animate ripple expansion and fade
      let frame = 0;
      const maxFrames = 60;
      const originalScale = 1;

      const animateRipple = () => {
        frame++;
        ripple.scale.multiplyScalar(1.03);
        rippleMaterial.opacity = 0.8 * (1 - frame / maxFrames);

        if (frame < maxFrames) {
          requestAnimationFrame(animateRipple);
        } else {
          globeGroup.remove(ripple);
          rippleGeometry.dispose();
          rippleMaterial.dispose();
        }
      };

      animateRipple();
    };

    renderer.domElement.addEventListener("mousedown", onMouseDown);
    renderer.domElement.addEventListener("mousemove", onMouseMove);
    renderer.domElement.addEventListener("mouseup", onMouseUp);
    renderer.domElement.addEventListener("click", onClick);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (!state.isDragging) {
        // Auto-rotate when idle
        globeGroup.rotation.y += state.autoRotateSpeed;

        // Apply inertia damping
        state.rotationVelocity.x *= state.damping;
        state.rotationVelocity.y *= state.damping;

        if (
          Math.abs(state.rotationVelocity.x) > 0.0001 ||
          Math.abs(state.rotationVelocity.y) > 0.0001
        ) {
          globeGroup.rotation.x += state.rotationVelocity.x;
          globeGroup.rotation.y += state.rotationVelocity.y;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("mousedown", onMouseDown);
      renderer.domElement.removeEventListener("mousemove", onMouseMove);
      renderer.domElement.removeEventListener("mouseup", onMouseUp);
      renderer.domElement.removeEventListener("click", onClick);
      renderer.domElement.removeEventListener("wheel", onWheel);

      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }

      geometry.dispose();
      atmosphereGeometry.dispose();
      starsGeometry.dispose();
      material.dispose();
      atmosphereMaterial.dispose();
      starsMaterial.dispose();
      texture.dispose();
      earthTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className={className}>
      <div
        ref={containerRef}
        className="relative h-full w-full rounded-lg overflow-hidden"
        style={{ userSelect: "none" }}
      />
      {hoveredLocation && (
        <div className="absolute bottom-4 left-4 rounded-lg bg-black/60 px-3 py-2 text-xs font-semibold text-cyan-400 backdrop-blur-sm border border-cyan-400/30">
          {hoveredLocation}
        </div>
      )}
    </div>
  );
}
