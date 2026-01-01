import { useThree, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";

const TARGET = new THREE.Vector3(0, 1, 0);

const VIEWS = {
  back: new THREE.Vector3(0, 1.6, 6),
  front: new THREE.Vector3(0, 1.6, -6),
  left: new THREE.Vector3(-6, 1.6, 0),
  right: new THREE.Vector3(5, 1.6, 0),
  top: new THREE.Vector3(0, 3.5, -4.5),
};

export function CameraController({
  onExit,
}: {
  onExit: () => void;
}) {
  const { camera } = useThree();
  const desired = useRef(VIEWS.right.clone());

  useFrame(() => {
    camera.position.lerp(desired.current, 0.12);
    camera.lookAt(TARGET);
  });

  return (
    <Html position={[-1.8, 2.5, 0]}>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => (desired.current = VIEWS.back.clone())}>Back</button>
        <button onClick={() => (desired.current = VIEWS.left.clone())}>Left</button>
        <button onClick={() => (desired.current = VIEWS.right.clone())}>Right</button>
        <button onClick={() => (desired.current = VIEWS.front.clone())}>Front</button>
        <button onClick={() => (desired.current = VIEWS.top.clone())}>Top</button>
        <button onClick={() => (desired.current = VIEWS.right.clone())}>Reset</button>

        {/* EXIT */}
        <button
          onClick={onExit}
          style={{ marginLeft: 12, background: "#c62828", color: "#fff" }}
        >
          Exit
        </button>
      </div>
    </Html>
  );
}
