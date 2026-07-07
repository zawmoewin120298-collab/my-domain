import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { cn } from "@/lib/utils";

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Convert latitude/longitude to 3D cartesian coordinates
 */
function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

// ============================================================================
// Atmosphere Shader Shaders
// ============================================================================

const atmosphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragmentShader = `
  uniform vec3 atmosphereColor;
  uniform float intensity;
  uniform float fresnelPower;
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    float fresnel = pow(1.0 - abs(dot(vNormal, normalize(-vPosition))), fresnelPower);
    gl_FragColor = vec4(atmosphereColor, fresnel * intensity);
  }
`;

// ============================================================================
// Main Globe3D Component
// ============================================================================

const defaultConfig = {
  radius: 2,
  globeColor: "#05050a",
  textureUrl: "https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg",
  bumpMapUrl: "https://unpkg.com/three-globe@2.31.0/example/img/earth-topology.png",
  showAtmosphere: false,
  atmosphereColor: "#3b82f6",
  atmosphereIntensity: 0.6,
  atmosphereBlur: 3.0,
  bumpScale: 1,
  autoRotateSpeed: 0.4,
  enableZoom: false,
  enablePan: false,
  minDistance: 4,
  maxDistance: 12,
  ambientIntensity: 0.8,
  pointLightIntensity: 2.0,
  backgroundColor: null,
};

export function Globe3D({
  markers = [],
  config = {},
  className,
  onMarkerClick: _onMarkerClick,
  onMarkerHover: _onMarkerHover,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const avatarRefs = useRef([]);
  const markerTipObjects = useRef([]);
  const [_hoveredIndex, _setHoveredIndex] = useState(null);
  const [webglError, setWebglError] = useState(false);

  const mergedConfig = { ...defaultConfig, ...config };

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth || 1;
    const height = containerRef.current.clientHeight || 1;

    // 1. Create Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, mergedConfig.radius * 3.2);

    // 3. Renderer
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    } catch (e) {
      console.warn("WebGL is not supported or was blocked by an extension:", e);
      setWebglError(true);
      return;
    }

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, mergedConfig.ambientIntensity);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, mergedConfig.pointLightIntensity);
    dirLight1.position.set(mergedConfig.radius * 5, mergedConfig.radius * 3, mergedConfig.radius * 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x88ccff, mergedConfig.pointLightIntensity * 0.4);
    dirLight2.position.set(-mergedConfig.radius * 4, mergedConfig.radius * 2, -mergedConfig.radius * 3);
    scene.add(dirLight2);

    // 5. Globe Group (contains globe mesh and markers for rotation)
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Load Textures
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = "anonymous";

    const earthTexture = textureLoader.load(mergedConfig.textureUrl);
    earthTexture.colorSpace = THREE.SRGBColorSpace;
    const bumpTexture = textureLoader.load(mergedConfig.bumpMapUrl);

    // Globe Mesh
    const globeGeometry = new THREE.SphereGeometry(mergedConfig.radius, 64, 64);
    const globeMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      bumpMap: bumpTexture,
      bumpScale: mergedConfig.bumpScale * 0.05,
      roughness: 0.8,
      metalness: 0.1,
    });
    const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
    globeGroup.add(globeMesh);

    // Atmosphere Mesh
    let atmosphereMesh;
    if (mergedConfig.showAtmosphere) {
      const fresnelPower = 6.0; // Higher power = thinner, softer glow
      const atmosphereMaterial = new THREE.ShaderMaterial({
        uniforms: {
          atmosphereColor: { value: new THREE.Color(mergedConfig.atmosphereColor) },
          intensity: { value: mergedConfig.atmosphereIntensity },
          fresnelPower: { value: fresnelPower },
        },
        vertexShader: atmosphereVertexShader,
        fragmentShader: atmosphereFragmentShader,
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
      });

      // Atmosphere is slightly larger than the globe
      const atmosphereGeometry = new THREE.SphereGeometry(mergedConfig.radius * 1.04, 64, 32);
      atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
      scene.add(atmosphereMesh);
    }

    // 6. Build markers and pins inside globeGroup
    const tips = [];
    const markerGroups = [];

    markers.forEach((marker) => {
      const markerGroup = new THREE.Group();

      const surfacePos = latLngToVector3(marker.lat, marker.lng, mergedConfig.radius * 1.001);
      const topPos = latLngToVector3(marker.lat, marker.lng, mergedConfig.radius * 1.16);

      // Pin line
      const direction = topPos.clone().sub(surfacePos).normalize();
      const lineHeight = topPos.distanceTo(surfacePos);
      const lineCenter = surfacePos.clone().lerp(topPos, 0.5);

      const lineGeometry = new THREE.CylinderGeometry(0.003, 0.003, lineHeight, 8);
      const lineMaterial = new THREE.MeshBasicMaterial({
        color: 0x94a3b8,
        transparent: true,
        opacity: 0.5,
      });
      const lineMesh = new THREE.Mesh(lineGeometry, lineMaterial);
      
      // Orient cylinder
      const quaternion = new THREE.Quaternion();
      quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
      lineMesh.position.copy(lineCenter);
      lineMesh.quaternion.copy(quaternion);
      markerGroup.add(lineMesh);

      // Cone at surface
      const coneGeometry = new THREE.ConeGeometry(0.012, 0.035, 8);
      const coneMaterial = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      const coneMesh = new THREE.Mesh(coneGeometry, coneMaterial);
      coneMesh.position.copy(surfacePos);
      coneMesh.quaternion.copy(quaternion);
      markerGroup.add(coneMesh);

      // Tip Object3D (for tracking world coords)
      const tipObject = new THREE.Object3D();
      tipObject.position.copy(topPos);
      markerGroup.add(tipObject);
      tips.push(tipObject);

      globeGroup.add(markerGroup);
      markerGroups.push({ lineMaterial, coneMaterial });
    });

    markerTipObjects.current = tips;

    // 7. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = mergedConfig.enablePan;
    controls.enableZoom = mergedConfig.enableZoom;
    controls.minDistance = mergedConfig.minDistance;
    controls.maxDistance = mergedConfig.maxDistance;
    controls.rotateSpeed = 0.5;

    // 8. Animation & Render Loop
    let animationFrameId;
    const tempV = new THREE.Vector3();

    const animate = () => {
      // Auto rotation
      if (mergedConfig.autoRotateSpeed > 0) {
        globeGroup.rotation.y += (mergedConfig.autoRotateSpeed * 0.005);
      }

      controls.update();

      // Render Three.js scene
      renderer.render(scene, camera);

      // Update absolute positioned React avatars
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        markers.forEach((marker, index) => {
          const el = avatarRefs.current[index];
          const tip = tips[index];
          if (!el || !tip) return;

          // Get world position of the tip
          tip.getWorldPosition(tempV);

          // Dot product: positive = facing camera, negative = behind
          const markerDir = tempV.clone().normalize();
          const camDir = camera.position.clone().normalize();
          const dot = markerDir.dot(camDir);

          const isVisible = dot > 0.05; // Slightly lax threshold to prevent sudden cuts on the edge

          if (!isVisible) {
            el.style.opacity = "0";
            el.style.pointerEvents = "none";
            return;
          }

          // Project to 2D
          tempV.project(camera);

          const x = (tempV.x * 0.5 + 0.5) * width;
          const y = (-(tempV.y * 0.5) + 0.5) * height;

          el.style.opacity = "1";
          el.style.pointerEvents = "auto";
          el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 9. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const w = containerRef.current?.clientWidth || 0;
        const h = containerRef.current?.clientHeight || 0;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // 10. Cleanups
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();

      // Dispose all Three.js objects in the scene
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      
      earthTexture.dispose();
      bumpTexture.dispose();
      scene.clear();
    };
  }, [markers]);

  if (webglError) {
    return (
      <div
        className={cn("relative flex items-center justify-center w-full h-[500px] bg-slate-900/5 rounded-xl border border-slate-800/20", className)}
      >
        <div className="text-center p-6 flex flex-col items-center">
          <svg className="w-12 h-12 text-slate-400 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-slate-500 font-medium text-sm">Interactive globe unavailable</p>
          <p className="text-slate-500/70 text-xs mt-1 max-w-[250px]">Please enable WebGL or disable extensions that may be blocking hardware acceleration.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden w-full h-[500px]", className)}
      style={{
        background: mergedConfig.backgroundColor || "transparent",
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
      
    </div>
  );
}
