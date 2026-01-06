import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { Bike } from "./bike";
import { FuelCan } from "./fuelCan";

type Props = {
  setFuelLevel: (v: number) => void;
  isFuelLidOpen: boolean;
  showMessage: (msg: string) => void;
};

export function Showroom({ setFuelLevel, isFuelLidOpen, showMessage }: Props) {
  const { scene } = useGLTF("/showroom.glb");

  const bikeRef = useRef<THREE.Object3D>(null);

  const FUEL_CAN_START: [number, number, number] = [0.9, 0.05, 1.9];

  return (
    <>
      <primitive object={scene} />

      <group ref={bikeRef}>
        <Bike />
      </group>
      <group position={FUEL_CAN_START}>
        <FuelCan
          isFuelLidOpen={isFuelLidOpen}
          onFillFuel={() => setFuelLevel(100)}
          showMessage={showMessage}
          onFuelFilled={() => {
            window.dispatchEvent(new Event("STEP_NEXT"));
          }}
        />
      </group>
    </>
  );
}

useGLTF.preload("/Show room v1(1).glb");
