"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ── Voice-reactive halo ring — pulses with the real voice amplitude ──
function VoiceRing({ ampRef }) {
  const ring = useRef();
  const ring2 = useRef();
  const mat = useRef();
  const mat2 = useRef();
  useFrame(() => {
    const amp = ampRef.current;
    const s = 1 + amp * 0.16;
    if (ring.current) {
      ring.current.scale.x += (s - ring.current.scale.x) * 0.2;
      ring.current.scale.y += (s - ring.current.scale.y) * 0.2;
      ring.current.rotation.z += 0.0015;
    }
    if (ring2.current) {
      const s2 = 1 + amp * 0.28;
      ring2.current.scale.x += (s2 - ring2.current.scale.x) * 0.12;
      ring2.current.scale.y += (s2 - ring2.current.scale.y) * 0.12;
      ring2.current.rotation.z -= 0.001;
    }
    if (mat.current) mat.current.opacity += ((0.25 + amp * 0.55) - mat.current.opacity) * 0.15;
    if (mat2.current) mat2.current.opacity += ((0.08 + amp * 0.3) - mat2.current.opacity) * 0.15;
  });
  return (
    <>
      <mesh ref={ring} position={[0, 0, -0.5]}>
        <ringGeometry args={[0.92, 0.955, 128]} />
        <meshBasicMaterial ref={mat} color="#4f8dff" transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ring2} position={[0, 0, -0.6]}>
        <ringGeometry args={[1.0, 1.015, 128]} />
        <meshBasicMaterial ref={mat2} color="#7dd3fc" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}

// ── Drifting "data point" particles behind the photo ──
function Particles({ ampRef }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const count = 90;
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 0.55 + Math.random() * 0.75;
      p[i * 3] = Math.cos(a) * r;
      p[i * 3 + 1] = Math.sin(a) * r;
      p[i * 3 + 2] = -0.8 - Math.random() * 1.2;
    }
    return p;
  }, []);
  useFrame((_, d) => {
    if (!ref.current) return;
    ref.current.rotation.z += d * (0.03 + ampRef.current * 0.12);
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3}
          array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.018} color="#6ea8ff" transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

// ── A few slow-orbiting wireframe shapes = the "3D" flavour ──
function Orbiters({ ampRef }) {
  const g = useRef();
  useFrame((state, d) => {
    if (!g.current) return;
    g.current.rotation.y += d * 0.15;
    g.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    const s = 1 + ampRef.current * 0.05;
    g.current.scale.set(s, s, s);
  });
  const mat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#3b6fe0", wireframe: true, transparent: true, opacity: 0.35 }),
    []
  );
  return (
    <group ref={g}>
      <mesh material={mat} position={[1.05, 0.55, -1.2]}>
        <icosahedronGeometry args={[0.16, 0]} />
      </mesh>
      <mesh material={mat} position={[-1.1, -0.35, -1.4]}>
        <octahedronGeometry args={[0.13, 0]} />
      </mesh>
      <mesh material={mat} position={[0.85, -0.75, -1.1]}>
        <torusGeometry args={[0.1, 0.035, 8, 24]} />
      </mesh>
      <mesh material={mat} position={[-0.9, 0.8, -1.3]}>
        <boxGeometry args={[0.16, 0.16, 0.16]} />
      </mesh>
    </group>
  );
}

export default function StageFX({ ampRef }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.2], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ background: "transparent" }}
    >
      <VoiceRing ampRef={ampRef} />
      <Particles ampRef={ampRef} />
      <Orbiters ampRef={ampRef} />
    </Canvas>
  );
}
