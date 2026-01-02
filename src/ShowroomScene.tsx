import { useState, useEffect } from "react";
import { OrbitControls } from "@react-three/drei";
import { Showroom } from "./Showroom";
import { BikeInteractionController } from "./bikeInteraction";
import { CommonPopup } from "./CommonPopup";

interface ShowroomProps {
  setFuelLevel: (v: number) => void;
  fuelLevel: number;
  isFuelLidOpen: boolean;
  setIsFuelLidOpen: (v: boolean) => void;
}

export function ShowroomScene({
  setFuelLevel,
  fuelLevel,
  isFuelLidOpen,
  setIsFuelLidOpen,
}: ShowroomProps) {
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  // auto-hide popup
  useEffect(() => {
    if (!popupMessage) return;
    const t = setTimeout(() => setPopupMessage(null), 2000);
    return () => clearTimeout(t);
  }, [popupMessage]);

  return (
    <>
      {/* 🔔 COMMON POPUP */}
      <CommonPopup message={popupMessage} />

      <color attach="background" args={["#111111"]} />
      <ambientLight intensity={0.6} />

      <directionalLight position={[5, 8, 5]} intensity={2} />
      <directionalLight position={[-4, 6, -3]} intensity={1} />

      <spotLight position={[0, 6, -6]} intensity={1.8} />
      <spotLight position={[0, 10, 0]} intensity={1.2} />

      <Showroom
        setFuelLevel={setFuelLevel}
        isFuelLidOpen={isFuelLidOpen}
        showMessage={setPopupMessage}
      />

      <BikeInteractionController
        onFuelLidChange={setIsFuelLidOpen}
        fuelLevel={fuelLevel}
        showMessage={setPopupMessage}
      />

      <OrbitControls
        target={[0, 1, 0]}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
}
