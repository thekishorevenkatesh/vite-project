import { useState, useEffect } from "react";
import { OrbitControls } from "@react-three/drei";
import { Showroom } from "./Showroom";
import { BikeInteractionController } from "./bikeInteraction";
import { CommonPopup } from "./CommonPopup";
import { STEPS } from "./steps";
import { useThree } from "@react-three/fiber";
import { useStepHighlighter } from "./useStepHighlighter";
import { STEP_COMPLETION_MAP } from "./stepCompletionMap";

interface ShowroomProps {
  setFuelLevel: (v: number) => void;
  fuelLevel: number;
  isFuelLidOpen: boolean;
  setIsFuelLidOpen: (v: boolean) => void;
  currentStepIndex: number;
}

export function ShowroomScene({
  setFuelLevel,
  fuelLevel,
  isFuelLidOpen,
  setIsFuelLidOpen,
  currentStepIndex,
}: ShowroomProps) {
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  const { scene } = useThree();

  const currentStep = STEPS[currentStepIndex];
  const handleMeshClick = (meshName: string) => {
    const component = currentStep?.functionalComponent?.[0]?.component;

    if (!component) return;

    const validMeshes = STEP_COMPLETION_MAP[component] || [];

    const matched = validMeshes.some((m) => meshName.startsWith(m));

    if (matched) {
      // move to next step automatically
      setTimeout(() => {
        // slight delay feels more natural
        window.dispatchEvent(new Event("STEP_NEXT"));
      }, 300);
    }
  };
  // 🔹 HIGHLIGHT CURRENT STEP COMPONENT
  useStepHighlighter(scene, currentStep?.functionalComponent?.[0]?.component);

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
      {/* 🔹 STUDIO SPOTLIGHT SETUP */}
      <spotLight
        position={[0, 10, 10]}
        intensity={2}
        angle={0.3}
        penumbra={0.3}
      />
      <spotLight
        position={[0, 10, -10]}
        intensity={2.0}
        angle={0.3}
        penumbra={0.3}
      />
      <spotLight
        position={[10, 6, 0]}
        intensity={1.9}
        angle={0.3}
        penumbra={0.3}
      />
      <spotLight
        position={[-10, 6, 0]}
        intensity={1.9}
        angle={0.3}
        penumbra={0.3}
      />
      <spotLight
        position={[0, 15, 0]}
        intensity={2.0}
        angle={0.4}
        penumbra={0.2}
      />{" "}
      {/* top light */}
      {/* 🔹 ADD DIRECTIONAL LIGHTS FOR SHADOWS */}
      <directionalLight position={[5, 8, 5]} intensity={1.5} />
      <directionalLight position={[-4, 6, -3]} intensity={1.0} />
      <Showroom
        setFuelLevel={setFuelLevel}
        isFuelLidOpen={isFuelLidOpen}
        showMessage={setPopupMessage}
      />
      <BikeInteractionController
        onFuelLidChange={setIsFuelLidOpen}
        fuelLevel={fuelLevel}
        showMessage={setPopupMessage}
        onMeshClick={handleMeshClick}
      />
      <OrbitControls
        target={[0, 1, 0]}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        enableDamping
        dampingFactor={0.1}
        rotateSpeed={0.8}
        panSpeed={0.05}
        minDistance={1.5}
        maxDistance={6}
      />
    </>
  );
}
