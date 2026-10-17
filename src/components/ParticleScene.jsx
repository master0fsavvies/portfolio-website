import React, { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 1000;
const SPEED = 0.002;
const MAX_DISTANCE = 1.5;
const AREA = 20;
const MAX_MOUSE_DISTANCE = 0.3;
const PARALLAX_STRENGTH = 0.1;

const ParticleScene = () => {
  const { camera, gl } = useThree();

  const positions = useMemo(() => {
    const data = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      data.push({
        pos: new THREE.Vector3(
          Math.random() * AREA - AREA / 2,
          Math.random() * AREA - AREA / 2,
          Math.random() * AREA - AREA / 2
        ),
        dir: new THREE.Vector3(
          Math.random() * 2 - 1,
          Math.random() * 2 - 1,
          0
        ).normalize().multiplyScalar(SPEED),
      });
    }
    return data;
  }, []);

  const mouse = useRef(new THREE.Vector2());
  const mouseWorld = useRef(new THREE.Vector3());
  const currentYaw = useRef(0);
  const currentPitch = useRef(0);

  const lineGeometry = useRef();
  const pointRef = useRef();

  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = gl.domElement.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [gl]);

  useFrame(() => {
    // Smooth camera rotation
    currentYaw.current = THREE.MathUtils.lerp(
      currentYaw.current,
      mouse.current.x * PARALLAX_STRENGTH,
      0.05
    );
    currentPitch.current = THREE.MathUtils.lerp(
      currentPitch.current,
      mouse.current.y * PARALLAX_STRENGTH * 0.6,
      0.05
    );

    const radius = 10;
    const x = Math.sin(currentYaw.current) * radius;
    const z = Math.cos(currentYaw.current) * radius;
    const y = currentPitch.current * radius;

    camera.position.set(x, y, z);
    camera.lookAt(0, 0, 0);

    // Move particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i].pos.add(positions[i].dir);
      ["x", "y", "z"].forEach((axis) => {
        if (positions[i].pos[axis] > AREA / 2) positions[i].pos[axis] = -AREA / 2;
        if (positions[i].pos[axis] < -AREA / 2) positions[i].pos[axis] = AREA / 2;
      });
    }

    const pointPositions = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const { x, y, z } = positions[i].pos;
      pointPositions.push(x, y, z);
    }
    pointRef.current.geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(pointPositions, 3)
    );
    pointRef.current.geometry.attributes.position.needsUpdate = true;

    // Raycast to z=0 plane
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse.current, camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    raycaster.ray.intersectPlane(plane, mouseWorld.current);

    const linePositions = [];
    const lineColors = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const a = positions[i].pos;

      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const b = positions[j].pos;
        const dist = a.distanceTo(b);
        if (dist < MAX_DISTANCE) {
          const t = dist / MAX_DISTANCE;
          const alpha = 1 - Math.pow(t, 2);
          const color = new THREE.Color(1, 1, 1);
          linePositions.push(a.x, a.y, a.z, b.x, b.y, b.z);
          for (let k = 0; k < 2; k++) {
            lineColors.push(color.r * alpha, color.g * alpha, color.b * alpha);
          }
        }
      }

      const projected = a.clone().project(camera);
      const dx = projected.x - mouse.current.x;
      const dy = projected.y - mouse.current.y;
      const screenDist = Math.sqrt(dx * dx + dy * dy);

      if (screenDist < MAX_MOUSE_DISTANCE) {
        const t = screenDist / MAX_MOUSE_DISTANCE;
        const alpha = 1 - Math.pow(t, 2);
        const color = new THREE.Color(1, 1, 1);
        linePositions.push(a.x, a.y, a.z, mouseWorld.current.x, mouseWorld.current.y, mouseWorld.current.z);
        for (let k = 0; k < 2; k++) {
          lineColors.push(color.r * alpha, color.g * alpha, color.b * alpha);
        }
      }
    }

    lineGeometry.current.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(linePositions, 3)
    );
    lineGeometry.current.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(lineColors, 3)
    );
    lineGeometry.current.attributes.position.needsUpdate = true;
    lineGeometry.current.attributes.color.needsUpdate = true;
  });

  return (
    <>
      <points ref={pointRef}>
        <bufferGeometry />
        <pointsMaterial size={2} color="white" />
      </points>

      <lineSegments>
        <bufferGeometry ref={lineGeometry} />
        <lineBasicMaterial vertexColors transparent opacity={0.5} />
      </lineSegments>
    </>
  );
};

export default ParticleScene;
