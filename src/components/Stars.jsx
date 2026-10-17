import React, { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";


const numParticles = 5000;
const velocity = 0.05; // Movement speed
const phaseVelocity = 1.35;
const amplitude = 0.0001;
const topY = 1.25;
const bottomY = -1.75;
const width = 2.4;

const Stars = (props) => {
  const ref = useRef();
  const positions = useRef(new Float32Array(numParticles * 3));
  const phases = useRef(new Float32Array(numParticles));

  // Initialize particles
  for (let i = 0; i < numParticles; i++) {
    positions.current[i * 3] = Math.random() * width - width / 2; // x-axis
    positions.current[i * 3 + 1] = Math.random() * (topY - bottomY) + bottomY; // Random Y
    positions.current[i * 3 + 2] = Math.random() * width - width / 2; // z-axis
    phases.current[i] = Math.random() * Math.PI * 2;
  }

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    for (let i = 0; i < numParticles; i++) {
      positions.current[i * 3] += Math.sin(time * phaseVelocity + phases.current[i]) * amplitude;
      positions.current[i * 3 + 2] += Math.sin(time * phaseVelocity + phases.current[i]) * amplitude;
      
      // Move up
      positions.current[i * 3 + 1] += velocity * delta;

      // Wrap particles smoothly
      if (positions.current[i * 3 + 1] > topY) {
        positions.current[i * 3 + 1] -= (topY - bottomY); // Instead of resetting directly, offset smoothly
      }
    }

    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group rotation={[0, 0, 0]}>
      <Points ref={ref} positions={positions.current} stride={3} frustumCulled {...props}>
        <PointMaterial color="ffffff" transparent size={0.002} sizeAttenuation depthWrite={false} />
      </Points>
    </group>
  );
};

const StarsCanvas = () => {
  return (
    <div className="w-full h-auto absolute inset-0 z-1">
      <Canvas camera={{ position: [0, 0, 1] }} exposure={1.2}>
        <Suspense fallback={null}>
          <Stars />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default StarsCanvas;