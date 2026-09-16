"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Link from "next/link";
import { ringFlavors, categoryColors } from "@/lib/flavors";

const BG = "#07080b";
const RADIUS = 3.1;

function RingNodes({ progressRef }: { progressRef: { current: number } }) {
  const groupRef = useRef<THREE.Group>(null);

  const nodes = useMemo(
    () =>
      ringFlavors.map((flavor, i) => {
        const angle = (i / ringFlavors.length) * Math.PI * 2;
        return {
          flavor,
          position: new THREE.Vector3(Math.cos(angle) * RADIUS, 0, Math.sin(angle) * RADIUS),
          color: categoryColors[flavor.category],
        };
      }),
    []
  );

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    group.rotation.y += delta * (0.12 + progressRef.current * 0.5);
  });

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <group key={node.flavor.slug} position={node.position}>
          <mesh>
            <icosahedronGeometry args={[0.15, 1]} />
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={0.4}
              roughness={0.3}
              metalness={0.1}
            />
          </mesh>
          <Html center zIndexRange={[10, 0]} occlude={false}>
            <Link
              href={`/geschmack/${node.flavor.slug}`}
              className="flavor-node-box"
              style={{ "--node-color": node.color } as CSSProperties}
            >
              <span style={{ color: node.color, fontWeight: 600 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flavor-node-box-name">{node.flavor.name}</span>
            </Link>
          </Html>
        </group>
      ))}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[RADIUS, 0.008, 8, 80]} />
        <meshBasicMaterial color="#2f7f96" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

export default function FlavorRingCanvas({
  progressRef,
  lite,
}: {
  progressRef: { current: number };
  lite: boolean;
}) {
  // See VapeCanvasScene: without preventDefault() on 'webglcontextlost' the
  // browser never restores the context, permanently blacking out the ring.
  // Force a clean remount instead of trusting in-place restoration.
  const [canvasKey, setCanvasKey] = useState(0);
  const recoveryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (recoveryTimer.current) clearTimeout(recoveryTimer.current);
    };
  }, []);

  return (
    <Canvas
      key={canvasKey}
      dpr={lite ? 1 : [1, 1.5]}
      gl={{ antialias: !lite, alpha: false, powerPreference: "high-performance" }}
      camera={{ fov: 34, near: 0.1, far: 40, position: [0, 5, 9] }}
      onCreated={({ scene, camera, gl }) => {
        scene.background = new THREE.Color(BG);
        scene.fog = new THREE.Fog(new THREE.Color(BG), 7, 16);
        // Aim slightly above the ring plane so the nearest node (which
        // projects lowest on screen) sits well clear of the bottom edge
        // instead of having its label clipped by the container.
        camera.lookAt(0, 0.6, 0);

        const canvas = gl.domElement;
        canvas.addEventListener(
          "webglcontextlost",
          (event) => {
            event.preventDefault();
            if (recoveryTimer.current) clearTimeout(recoveryTimer.current);
            recoveryTimer.current = setTimeout(() => setCanvasKey((k) => k + 1), 300);
          },
          false
        );
      }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 5, 3]} intensity={1} color="#eaf9ff" />
      <RingNodes progressRef={progressRef} />
      <EffectComposer multisampling={lite ? 0 : 4}>
        <Bloom intensity={lite ? 0.3 : 0.45} luminanceThreshold={0.4} luminanceSmoothing={0.9} mipmapBlur={!lite} />
      </EffectComposer>
    </Canvas>
  );
}
