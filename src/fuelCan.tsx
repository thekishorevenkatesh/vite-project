import { useGLTF, Html } from "@react-three/drei";
import { forwardRef, useEffect, useMemo, useState, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

type Props = {
  // position: [number, number, number];
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
  ({ onFillFuel, isFuelLidOpen, showMessage, onFuelFilled }) => {
    const { scene } = useGLTF("/fuel_can.glb");

    const localRef = useRef<THREE.Object3D | null>(null);

    const [hovered, setHovered] = useState(false);
    const [showError, setShowError] = useState(false);
    const [pourState, setPourState] = useState<PourState>("idle");

    const originalPosition = useRef(new THREE.Vector3());
    const originalRotation = useRef(new THREE.Euler());

    /* ---------------- Capture original transform ---------------- */
    useEffect(() => {

      if (!localRef.current) return;
      originalPosition.current.copy(localRef.current.position);
      originalRotation.current.copy(localRef.current.rotation);
    }, []);



    /* ---------------------------------- */
    /* Target pour transform               */
    /* ---------------------------------- */
    const tankPosition = useMemo(
      () => new THREE.Vector3(-0.85, 1.3, -2.45), // adjust later
      []
    );

    const pourRotation = useMemo(
      () => new THREE.Euler(Math.PI / 2.2, 0, 0),
      []
    );


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
        mat.emissive.set(hovered ? "#1e6bff" : "#000000");
        mat.emissiveIntensity = hovered ? 0.6 : 0;
      });
    }, [hovered, materials]);

    // auto-hide error after 2 seconds
    useEffect(() => {
      if (!showError) return;
      const t = setTimeout(() => setShowError(false), 2000);
      return () => clearTimeout(t);
    }, [showError]);

    /**------------Animation loop-------------------- */
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
            }, 500); // wait half sec
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
          if (
            finishedReturning
          ) {
            setPourState("idle");
            onFuelFilled?.();
          }
          break;
      }
    });


    return (
      <primitive
        ref={localRef}
        object={scene}
        scale={0.6}
        onPointerOver={(e: any) => {
          e.stopPropagation();
          if (pourState !== "idle") return;
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
        {hovered && pourState === "idle" && (
          <Html position={[0, 0.2, 0]} center distanceFactor={8}>
            <div
              onClick={(e) => {
                e.stopPropagation();

                if (!isFuelLidOpen) {
                  showMessage("Open fuel lid first");
                  return;
                }

                console.log("🚀 Starting pour animation");
                setPourState("movingToTank");
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
