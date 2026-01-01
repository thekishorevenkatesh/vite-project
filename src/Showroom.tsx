// src/components/Showroom.tsx
import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { Bike } from "./bike";
import { FuelCan } from "./fuelCan";
import { useFuelCanInteraction } from "./fuelCanInteraction";

export function Showroom() {
  const { scene } = useGLTF("/showroom.glb");

  const bikeRef = useRef<THREE.Object3D>(null);
  const fuelRef = useRef<THREE.Object3D>(null);

  const fuel = useFuelCanInteraction(fuelRef, bikeRef);

  const FUEL_CAN_START: [number, number, number] = [
    0.9, // left of bike
    0.05, // platform height
    1.9, // slightly forward
  ];

  return (
    <>
      {/* 🏢 Showroom */}
      <primitive object={scene} />

      {/* 🏍 Bike */}
      <group ref={bikeRef}>
        <Bike />
      </group>

      {/* ⛽ Fuel Can */}
      <FuelCan
        ref={fuelRef}
        position={FUEL_CAN_START}
        onGrab={fuel.grab}
        onMove={fuel.move}
        onRelease={fuel.release}
      />
    </>
  );
}

useGLTF.preload("/showroom.glb");
