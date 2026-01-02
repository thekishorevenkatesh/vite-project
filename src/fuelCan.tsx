import { useGLTF, Html } from "@react-three/drei";
import { forwardRef, useEffect, useMemo, useState } from "react";
import * as THREE from "three";

type Props = {
  position: [number, number, number];
  onFillFuel: () => void;
  isFuelLidOpen: boolean;
  showMessage: (msg: string) => void;
};

export const FuelCan = forwardRef<THREE.Object3D, Props>(
  ({ position, onFillFuel, isFuelLidOpen ,showMessage }, ref) => {
    const { scene } = useGLTF("/fuel_can.glb");

    const [hovered, setHovered] = useState(false);
    const [showError, setShowError] = useState(false);

    // clone materials for glow
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
        mat.emissive.set(hovered ? "#ffae00" : "#000000");
        mat.emissiveIntensity = hovered ? 0.6 : 0;
      });
    }, [hovered, materials]);

    // auto-hide error after 2 seconds
    useEffect(() => {
      if (!showError) return;
      const t = setTimeout(() => setShowError(false), 2000);
      return () => clearTimeout(t);
    }, [showError]);

    return (
      <primitive
        ref={ref}
        object={scene}
        position={position}
        scale={0.6}
        onPointerOver={(e: any) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e: any) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = "default";
        }}
      >
        {/* Fill Fuel button */}
        {hovered && (
          <Html position={[0, 0.3, 0]} center distanceFactor={8}>
            <div
              onClick={(e) => {
                e.stopPropagation();

                if (!isFuelLidOpen) {
                  showMessage("Open fuel lid first");
                  return;
                }

                onFillFuel();
              }}
              style={{
                padding: "5px 10px",
                background: "rgba(0,0,0,0.85)",
                color: "#fff",
                borderRadius: 4,
                fontSize: 10,
                cursor: "pointer",
                userSelect: "none",
                whiteSpace: "nowrap",
              }}
            >
              Fill Fuel
            </div>
          </Html>
        )}

        {/* Error popup */}
        {showError && (
          <Html center>
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                padding: "10px 16px",
                background: "rgba(200,0,0,0.9)",
                color: "#fff",
                borderRadius: 6,
                fontSize: 14,
                whiteSpace: "nowrap",
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              Open fuel lid first
            </div>
          </Html>
        )}
      </primitive>
    );
  }
);

useGLTF.preload("/fuel_can.glb");
