"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

function MascotModel({ animate }: { animate: boolean }) {
  const { scene } = useGLTF("/3d-octopus.glb");
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (animate && ref.current) {
      const t = clock.getElapsedTime();
      ref.current.rotation.y = t * 0.5;
      ref.current.position.y = Math.sin(t) * 0.1;
    }
  });

  return (
    <group ref={ref} scale={0.4} position={[0, 0, 0]}>
      <primitive object={scene} />
    </group>
  );
}

export default function ModelPage() {
  const [isAnimating, setIsAnimating] = useState(true);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        background: "#f9fafb",
      }}
    >
      <Canvas camera={{ position: [0, 1.5, 4], fov: 35 }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[2, 2, 5]} intensity={1.2} />
        <MascotModel animate={isAnimating} />
        <OrbitControls enablePan={false} />
      </Canvas>

      {/* 하단 버튼 UI */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <button
          onClick={() => setIsAnimating((prev) => !prev)}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            background: "#111827",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {isAnimating ? "애니메이션 정지" : "애니메이션 시작"}
        </button>
      </div>
    </div>
  );
}
