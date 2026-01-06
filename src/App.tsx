import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { IntroScene } from "./IntroScene";
import { ShowroomScene } from "./ShowroomScene";
import { FuelGauge } from "./FuelGauge";
import { STEPS } from "./steps";

// 🔹 NAV BUTTON STYLES (responsive)
const navButtonStyle: React.CSSProperties = {
  width: "4vw",
  height: "4vw",
  maxWidth: 42,
  maxHeight: 42,
  minWidth: 32,
  minHeight: 32,
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

  // 🔹 SCREEN WIDTH FOR RESPONSIVE FONTS
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // font sizes responsive
  const stepNumberFont = Math.min(16, windowWidth * 0.012);
  const stepDescFont = Math.min(14, windowWidth * 0.01);
  const stepNameFont = Math.min(18, windowWidth * 0.015);

  // FuelGauge size responsive
  const fuelGaugeSize = Math.min(120, windowWidth * 0.1);

  // 🔹 EXIT HANDLER
  const handleExit = () => {
    setEntered(false);
    setCurrentStepIndex(0);
    setFuelLevel(0);
    setIsFuelLidOpen(false);

    document.body.style.margin = "0";
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        fontFamily: "Open Sans, sans-serif",
      }}
    >
      {/* 🔹 EXIT BUTTON (ICONIC) */}
      {entered && (
        <button
          onClick={handleExit}
          title="Exit to Intro"
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            zIndex: 100,
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "none",
            background: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.05)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <svg width="55%" height="55%" viewBox="0 0 24 24">
            <path
              d="M12 2v10"
              stroke="#ff4d4f"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M6.38 6.38a8 8 0 1 0 11.24 0"
              fill="none"
              stroke="#ff4d4f"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}

      {/* 🔹 FUEL HUD */}
      {entered && <FuelGauge fuel={fuelLevel} size={fuelGaugeSize} />}

      {entered && (
        <div
          style={{
            position: "absolute",
            top: "2vh",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: windowWidth < 600 ? "0.5rem" : "1.5rem",
            flexDirection: windowWidth < 600 ? "column" : "row",
            zIndex: 50,
            width: windowWidth < 600 ? "90%" : "auto",
          }}
        >
          {/* ◀ PREV BUTTON */}
          <button
            disabled={currentStepIndex === 0}
            onClick={() => setCurrentStepIndex((i) => Math.max(i - 1, 0))}
            style={{
              ...navButtonStyle,
              ...(currentStepIndex === 0 ? disabledStyle : {}),
              width: windowWidth < 600 ? 36 : navButtonStyle.width,
              height: windowWidth < 600 ? 36 : navButtonStyle.height,
            }}
          >
            <svg width="50%" height="50%" viewBox="0 0 24 24">
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
              padding: windowWidth < 600 ? "10px" : "12px 2vw",
              color: "rgba(0,0,0,0.75)",
              background: "#fff",
              borderRadius: 10,
              minWidth: windowWidth < 600 ? "100%" : 220,
              maxWidth: 600,
              textAlign: "center",
              flexGrow: 1,
            }}
          >
            <div style={{ fontSize: stepNumberFont, marginBottom: 6 }}>
              Step {currentStepIndex + 1} / {STEPS.length}
            </div>
            <strong style={{ fontSize: stepNameFont }}>
              {currentStep.name}
            </strong>
            <div
              style={{
                fontSize: stepDescFont,
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
              width: windowWidth < 600 ? 36 : navButtonStyle.width,
              height: windowWidth < 600 ? 36 : navButtonStyle.height,
            }}
          >
            <svg width="50%" height="50%" viewBox="0 0 24 24">
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
        key={entered ? "showroom" : "intro"}
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
