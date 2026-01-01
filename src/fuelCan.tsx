import { useGLTF } from "@react-three/drei";
import { forwardRef } from "react";
import * as THREE from "three";

type Props = {
  position: [number, number, number];
  onGrab: () => void;
  onMove: (ray: THREE.Ray) => void;
  onRelease: () => void;
};

export const FuelCan = forwardRef<THREE.Object3D, Props>(
  ({ position, onGrab, onMove, onRelease }, ref) => {
    const { scene } = useGLTF("/fuel_can.glb");

    return (
      <primitive
        ref={ref}
        object={scene}
        position={position}
        scale={0.6}
        onPointerDown={(e:any) => {
          e.stopPropagation();
          e.target.setPointerCapture(e.pointerId);
          onGrab();
        }}
        onPointerMove={(e:any) => {
          if (e.target.hasPointerCapture(e.pointerId)) {
            onMove(e.ray);
          }
        }}
        onPointerUp={(e:any) => {
          e.stopPropagation();
          e.target.releasePointerCapture(e.pointerId);
          onRelease();
        }}
      />
    );
  }
);


useGLTF.preload("/fuel_can.glb");
