"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import VapeModel from "./VapeModel";
import VaporVideo from "./VaporVideo";

const BG = "#07080b";

function PointerParallax({ progressRef }: { progressRef: { current: number } }) {
  const target = useRef(new THREE.Vector3(0, 0.4, 6.2));
  useFrame(({ camera, pointer }) => {
    const px = THREE.MathUtils.clamp(pointer.x, -1, 1);
    const py = THREE.MathUtils.clamp(pointer.y, -1, 1);
    target.current.set(px * 0.35, 0.4 + py * 0.18, 6.2 - progressRef.current * 0.6);
    camera.position.lerp(target.current, 0.04);
    camera.lookAt(0, 0.2, 0);
  });
  return null;
}

function Rig({ lite }: { lite: boolean }) {
  const { scene } = useThree();
  useEffect(() => {
    scene.fog = new THREE.Fog(new THREE.Color(BG), 7, lite ? 16 : 20);
    scene.background = new THREE.Color(BG);
  }, [scene, lite]);
  return null;
}

function PostFX({ lite }: { lite: boolean }) {
  return (
    <EffectComposer multisampling={lite ? 0 : 4}>
      <Bloom
        intensity={lite ? 0.35 : 0.5}
        luminanceThreshold={0.4}
        luminanceSmoothing={0.85}
        mipmapBlur={!lite}
      />
      <Vignette eskil={false} offset={0.2} darkness={0.85} />
    </EffectComposer>
  );
}

function Scene({
  progressRef,
  lite,
}: {
  progressRef: { current: number };
  lite: boolean;
}) {
  const [originY, setOriginY] = useState<number | null>(null);
  const handleReady = useCallback((y: number) => setOriginY(y), []);

  return (
    <>
      <Rig lite={lite} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 4]} intensity={1.2} color="#eaf9ff" />
      <pointLight position={[-3, 1, -2]} intensity={6} color="#a07bff" />
      <pointLight position={[2, -1, 2]} intensity={4} color="#6fe3ff" />

      <Suspense fallback={null}>
        <VapeModel progressRef={progressRef} onReady={handleReady} />
      </Suspense>

      {originY !== null && <VaporVideo originY={originY} intensityRef={progressRef} lite={lite} />}

      <PointerParallax progressRef={progressRef} />
      <PostFX lite={lite} />
    </>
  );
}

export default function VapeCanvasScene({
  progressRef,
  lite,
}: {
  progressRef: { current: number };
  lite: boolean;
}) {
  // GPU driver hiccups (e.g. macOS switching between integrated/discrete
  // graphics) fire 'webglcontextlost'. Without preventDefault() the browser
  // never attempts to restore it, permanently blacking out the canvas — so
  // we prevent the default AND force a clean remount (fresh <canvas>, fresh
  // context) rather than trust in-place restoration.
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
      dpr={lite ? 1 : [1, 1.6]}
      gl={{ antialias: !lite, alpha: false, powerPreference: "high-performance" }}
      camera={{ fov: 38, near: 0.1, far: 60, position: [0, 0.4, 6.2] }}
      onCreated={({ gl }) => {
        const canvas = gl.domElement;
        const handleLost = (event: Event) => {
          event.preventDefault();
          if (recoveryTimer.current) clearTimeout(recoveryTimer.current);
          recoveryTimer.current = setTimeout(() => setCanvasKey((k) => k + 1), 300);
        };
        canvas.addEventListener("webglcontextlost", handleLost, false);
      }}
    >
      <Scene progressRef={progressRef} lite={lite} />
    </Canvas>
  );
}
