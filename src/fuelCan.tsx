import { useGLTF } from "@react-three/drei";
import { forwardRef, useEffect, useMemo, useState, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

type Props = {
  onFillFuel: () => void;
  isFuelLidOpen: boolean;
  showMessage: (msg: string) => void;
  onFuelFilled?: () => void;
};

type PourState =
  | "idle"
  | "movingToTank"
  | "tilting"
  | "pouring"
  | "returning";

export const FuelCan = forwardRef<THREE.Object3D, Props>(
  ({ onFillFuel, isFuelLidOpen, showMessage, onFuelFilled }, ref) => {
    const { scene } = useGLTF("/fuel_can.glb");

    const localRef = useRef<THREE.Object3D | null>(null);

    const [hovered, setHovered] = useState(false);
    const [showError, setShowError] = useState(false);
    const [pourState, setPourState] = useState<PourState>("idle");

    const originalPosition = useRef(new THREE.Vector3());
    const originalRotation = useRef(new THREE.Euler());

    // Capture original transform
    useEffect(() => {
      if (!localRef.current) return;
      originalPosition.current.copy(localRef.current.position);
      originalRotation.current.copy(localRef.current.rotation);
    }, []);

    const tankPosition = useMemo(
      () => new THREE.Vector3(-0.85, 1.3, -2.45),
      []
    );

    const pourRotation = useMemo(
      () => new THREE.Euler(Math.PI / 2.2, 0, 0),
      []
    );

    // Clone materials for hover glow
    const materials = useMemo(() => {
      const mats: THREE.MeshStandardMaterial[] = [];
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.material = (mesh.material as THREE.MeshStandardMaterial).clone();
          mats.push(mesh.material as THREE.MeshStandardMaterial);
        }
      });
      return mats;
    }, [scene]);

    useEffect(() => {
      materials.forEach((mat) => {
        mat.emissive.set(hovered ? "#1e6bff" : "#000000");
        mat.emissiveIntensity = hovered ? 0.6 : 0;
      });
    }, [hovered, materials]);

    useEffect(() => {
      if (!showError) return;
      const t = setTimeout(() => setShowError(false), 2000);
      return () => clearTimeout(t);
    }, [showError]);

    useFrame(() => {
      if (!localRef.current) return;
      const obj = localRef.current;

      switch (pourState) {
        case "movingToTank":
          obj.position.lerp(tankPosition, 0.05);
          if (obj.position.distanceTo(tankPosition) < 0.02) {
            setPourState("tilting");
          }
          break;

        case "tilting":
          obj.rotation.x = THREE.MathUtils.lerp(
            obj.rotation.x,
            pourRotation.x,
            0.08
          );
          if (Math.abs(obj.rotation.x - pourRotation.x) < 0.02) {
            setPourState("pouring");
            setTimeout(() => {
              setPourState("returning");
            }, 500);
          }
          break;

        case "returning":
          obj.position.lerp(originalPosition.current, 0.05);
          obj.rotation.x = THREE.MathUtils.lerp(
            obj.rotation.x,
            originalRotation.current.x,
            0.08
          );

          const finishedReturning =
            obj.position.distanceTo(originalPosition.current) < 0.02 &&
            Math.abs(obj.rotation.x - originalRotation.current.x) < 0.02;

          if (finishedReturning) {
            setPourState("idle");
            onFuelFilled?.();
          }
          break;
      }
    });

    return (
      <group
        ref={(node) => {
          localRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        scale={0.6}
      >
        <primitive object={scene} />

        {pourState === "idle" && (
          <mesh
            position={[0, 0.25, 0]}
            scale={[0.3, 0.1, 0.3]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onPointerDown={(e) => {
              e.stopPropagation();

              if (!isFuelLidOpen) {
                showMessage("Open fuel lid first");
                setShowError(true);
                return;
              }

              console.log("🚀 Starting pour animation");
              setPourState("movingToTank");
              onFillFuel();
            }}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
        )}
      </group>
    );
  }
);

useGLTF.preload("/fuel_can.glb");
