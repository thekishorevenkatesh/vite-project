import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { IntroScene } from "./IntroScene";
import { ShowroomScene } from "./ShowroomScene";
import { FuelGauge } from "./FuelGauge";
import { STEPS } from "./steps";

// 🔹 NAV BUTTON STYLES
const navButtonStyle: React.CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: "50%",
  border: "none",
  background: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
  transition: "all 0.2s ease",
};

const disabledStyle: React.CSSProperties = {
  opacity: 0.4,
  cursor: "not-allowed",
};

export default function App() {
  const [entered, setEntered] = useState(false);
  const [fuelLevel, setFuelLevel] = useState(0);
  const [isFuelLidOpen, setIsFuelLidOpen] = useState(false);

  // 🔹 STEP STATE
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = STEPS[currentStepIndex];

  // 🔹 AUTO STEP ADVANCE LISTENER
  useEffect(() => {
    const nextStep = () => {
      setCurrentStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    };
    window.addEventListener("STEP_NEXT", nextStep);
    return () => window.removeEventListener("STEP_NEXT", nextStep);
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
      }}
    >
      {/* 🔹 FUEL HUD */}
      {entered && <FuelGauge fuel={fuelLevel} />}

      {/* 🔹 STEP UI (TOP CENTER) */}
      {entered && (
        <div
          style={{
            position: "absolute",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 12,
            zIndex: 50,
          }}
        >
          {/* ◀ PREV BUTTON */}
          <button
            disabled={currentStepIndex === 0}
            onClick={() => setCurrentStepIndex((i) => Math.max(i - 1, 0))}
            style={{
              ...navButtonStyle,
              ...(currentStepIndex === 0 ? disabledStyle : {}),
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                d="M15 18l-6-6 6-6"
                fill="none"
                stroke="#333"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* STEP CARD */}
          <div
            style={{
              padding: "12px 18px",
              color: "rgba(0,0,0,0.75)",
              background: "#fff",
              borderRadius: 10,
              minWidth: 340,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 14,
                marginBottom: 6,
              }}
            >
              Step {currentStepIndex + 1} / {STEPS.length}
            </div>
            <strong>{currentStep.name}</strong>
            <div
              style={{
                fontSize: 12,
                marginTop: 6,
                opacity: 0.85,
              }}
            >
              {currentStep.description}
            </div>
          </div>

          {/* NEXT BUTTON ▶ */}
          <button
            disabled={currentStepIndex === STEPS.length - 1}
            onClick={() =>
              setCurrentStepIndex((i) => Math.min(i + 1, STEPS.length - 1))
            }
            style={{
              ...navButtonStyle,
              ...(currentStepIndex === STEPS.length - 1 ? disabledStyle : {}),
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                d="M9 6l6 6-6 6"
                fill="none"
                stroke="#333"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}

      {/* 🔹 THREE CANVAS */}
      <Canvas
        style={{ width: "100%", height: "100%" }}
        camera={{ position: [0, 1.6, 6], fov: 45, near: 0.1, far: 100 }}
        shadows
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          {!entered ? (
            <IntroScene onEnter={() => setEntered(true)} />
          ) : (
            <ShowroomScene
              fuelLevel={fuelLevel}
              setFuelLevel={setFuelLevel}
              isFuelLidOpen={isFuelLidOpen}
              setIsFuelLidOpen={setIsFuelLidOpen}
              currentStepIndex={currentStepIndex}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
