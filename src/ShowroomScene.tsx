import { useState, useEffect, useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

import { Showroom } from "./Showroom";
import { BikeInteractionController } from "./bikeInteraction";
import { CommonPopup } from "./CommonPopup";
import { STEPS } from "./steps";
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
  /* ------------------------------------------------------------------ */
  /* CAMERA + CONTROLS RESET (CRITICAL FIX) */
  /* ------------------------------------------------------------------ */
  const { camera, scene } = useThree();
  const controlsRef = useRef<any>(null);

 useEffect(() => {
  requestAnimationFrame(() => {
    camera.position.set(0, 1.6, 6);
    camera.lookAt(0, 1, 0);

    if (controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.target.set(0, 1, 0);
      controlsRef.current.update();
    }
  });
}, []);
  /* ------------------------------------------------------------------ */
  /* POPUP STATE */
  /* ------------------------------------------------------------------ */
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!popupMessage) return;
    const t = setTimeout(() => setPopupMessage(null), 2000);
    return () => clearTimeout(t);
  }, [popupMessage]);

  /* ------------------------------------------------------------------ */
  /* STEP LOGIC */
  /* ------------------------------------------------------------------ */
  const currentStep = STEPS[currentStepIndex];

  const handleMeshClick = (meshName: string) => {
    const component = currentStep?.functionalComponent?.[0]?.component;
    if (!component) return;

    const validMeshes = STEP_COMPLETION_MAP[component] || [];
    const matched = validMeshes.some((m) => meshName.startsWith(m));

    if (matched) {
      setTimeout(() => {
        window.dispatchEvent(new Event("STEP_NEXT"));
      }, 300);
    }
  };

  // 🔹 Highlight current step component
  useStepHighlighter(
    scene,
    currentStep?.functionalComponent?.[0]?.component
  );

  /* ------------------------------------------------------------------ */
  /* RENDER */
  /* ------------------------------------------------------------------ */
  return (
    <>
      {/* 🔔 POPUP */}
      <CommonPopup message={popupMessage} />

      {/* 🔹 SCENE SETUP */}
      <color attach="background" args={["#111111"]} />
      <ambientLight intensity={0.6} />

      {/* 🔹 LIGHTING */}
      <spotLight position={[0, 10, 10]} intensity={2} angle={0.3} penumbra={0.3} />
      <spotLight position={[0, 10, -10]} intensity={2} angle={0.3} penumbra={0.3} />
      <spotLight position={[10, 6, 0]} intensity={1.9} angle={0.3} penumbra={0.3} />
      <spotLight position={[-10, 6, 0]} intensity={1.9} angle={0.3} penumbra={0.3} />
      <spotLight position={[0, 15, 0]} intensity={2} angle={0.4} penumbra={0.2} />

      <directionalLight position={[5, 8, 5]} intensity={1.5} />
      <directionalLight position={[-4, 6, -3]} intensity={1.0} />

      {/* 🔹 SHOWROOM CONTENT */}
      <Showroom
        setFuelLevel={setFuelLevel}
        isFuelLidOpen={isFuelLidOpen}
        showMessage={setPopupMessage}
      />

      {/* 🔹 BIKE INTERACTIONS */}
      <BikeInteractionController
        onFuelLidChange={setIsFuelLidOpen}
        fuelLevel={fuelLevel}
        showMessage={setPopupMessage}
        onMeshClick={handleMeshClick}
      />

      {/* 🔹 ORBIT CONTROLS (LOCKED + RESET) */}
      <OrbitControls
        ref={controlsRef}
        target={[0, 1, 0]}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        enableDamping
        dampingFactor={0.1}
        rotateSpeed={0.8}
        panSpeed={0.05}
        minDistance={1.5}
        maxDistance={3.25}
      />
    </>
  );
}
