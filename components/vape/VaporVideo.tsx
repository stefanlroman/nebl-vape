"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import { basePath } from "@/lib/basePath";

const VIDEO_URL = `${basePath}/vapor/smoke.mp4`;

function useSmokeVideo(startAt: number) {
  const { video, texture } = useMemo(() => {
    const video = document.createElement("video");
    video.src = VIDEO_URL;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous";
    video.preload = "auto";
    // Some browsers throttle or never start decoding a <video> that's
    // never attached to the DOM, which left the texture blank — mount it
    // off-screen instead of just holding a detached element.
    video.style.position = "fixed";
    video.style.width = "2px";
    video.style.height = "2px";
    video.style.left = "-9999px";
    video.style.top = "0";
    video.style.opacity = "0";
    video.style.pointerEvents = "none";

    const texture = new THREE.VideoTexture(video);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return { video, texture };
  }, []);

  useEffect(() => {
    document.body.appendChild(video);
    const onLoaded = () => {
      video.currentTime = startAt;
      video.play().catch(() => {});
    };
    video.addEventListener("loadedmetadata", onLoaded);
    video.load();
    return () => {
      video.removeEventListener("loadedmetadata", onLoaded);
      video.pause();
      if (video.parentNode) video.parentNode.removeChild(video);
    };
  }, [video, startAt]);

  return { video, texture };
}

function SmokeLayer({
  originY,
  intensityRef,
  startAt,
  width,
  height,
  xOffset,
  tint,
  speed,
}: {
  originY: number;
  intensityRef: { current: number };
  startAt: number;
  width: number;
  height: number;
  xOffset: number;
  tint: THREE.Color;
  speed: number;
}) {
  const { video, texture } = useSmokeVideo(startAt);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const smoothed = useRef(0);

  useEffect(() => {
    return () => texture.dispose();
  }, [texture]);

  useFrame(({ clock }) => {
    smoothed.current += (intensityRef.current - smoothed.current) * 0.05;
    const intensity = Math.max(0.38, smoothed.current);
    const t = clock.getElapsedTime() * speed;

    // Some browsers only mark a VideoTexture dirty via
    // requestVideoFrameCallback while the video is actively progressing;
    // if playback ever stalls (autoplay throttling, tab backgrounding) the
    // upload silently stops. Forcing it every frame is cheap for one or
    // two small planes and guarantees the GPU texture stays in sync.
    if (video.readyState >= video.HAVE_CURRENT_DATA) {
      texture.needsUpdate = true;
    }

    if (materialRef.current) {
      materialRef.current.opacity = intensity * 0.6;
    }
    if (meshRef.current) {
      const bob = Math.sin(t) * 0.03;
      // Bottom edge of the plane sits right at the mouthpiece opening so
      // the smoke visibly originates there instead of floating above it.
      meshRef.current.position.y = originY + height * 0.08 + bob;
      meshRef.current.position.x = xOffset + Math.sin(t * 0.6) * 0.03;
      const scale = 1 + intensity * 0.18 + Math.sin(t * 0.8) * 0.03;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <Billboard>
      <mesh ref={meshRef}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          ref={materialRef}
          map={texture}
          color={tint}
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </Billboard>
  );
}

export default function VaporVideo({
  originY,
  intensityRef,
  lite,
}: {
  originY: number;
  intensityRef: { current: number };
  lite: boolean;
}) {
  return (
    <group>
      <SmokeLayer
        originY={originY}
        intensityRef={intensityRef}
        startAt={0.4}
        width={0.55}
        height={1.4}
        xOffset={0}
        tint={new THREE.Color("#cdeeff")}
        speed={0.22}
      />
      {!lite && (
        <SmokeLayer
          originY={originY}
          intensityRef={intensityRef}
          startAt={2.1}
          width={0.38}
          height={1}
          xOffset={0.02}
          tint={new THREE.Color("#e2d3ff")}
          speed={0.3}
        />
      )}
    </group>
  );
}
