"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { basePath } from "@/lib/basePath";

const MODEL_URL = `${basePath}/models/vape.glb`;
const TARGET_HEIGHT = 3;

export default function VapeModel({
  progressRef,
  onReady,
}: {
  progressRef: { current: number };
  onReady: (originY: number) => void;
}) {
  const { scene } = useGLTF(MODEL_URL);
  const groupRef = useRef<THREE.Group>(null);
  const smoothed = useRef(0);
  const readyRef = useRef(false);

  const prepared = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const scale = size.y > 0 ? TARGET_HEIGHT / size.y : 1;
    clone.scale.setScalar(scale);
    clone.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = false;
        child.receiveShadow = false;
        if (child.material) {
          const mat = child.material as THREE.MeshStandardMaterial;
          mat.envMapIntensity = 1.1;
        }
      }
    });

    return { object: clone, topY: (size.y * scale) / 2 };
  }, [scene]);

  useEffect(() => {
    if (readyRef.current) return;
    readyRef.current = true;
    onReady(prepared.topY * 0.97);
  }, [prepared, onReady]);

  useFrame(({ clock }, delta) => {
    const group = groupRef.current;
    if (!group) return;
    smoothed.current += (progressRef.current - smoothed.current) * 0.05;

    group.rotation.y += delta * (0.18 + smoothed.current * 0.35);
    group.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.03 + smoothed.current * 0.08;
    group.position.y = Math.sin(clock.getElapsedTime() * 0.6) * 0.05;
  });

  return (
    <group ref={groupRef}>
      <primitive object={prepared.object} />
    </group>
  );
}

useGLTF.preload(MODEL_URL);
