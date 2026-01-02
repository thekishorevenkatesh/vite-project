import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import { IntroScene } from "./IntroScene";
import { ShowroomScene } from "./ShowroomScene";
import { FuelGauge } from "./FuelGauge";

export default function App() {
  const [entered, setEntered] = useState(false);
  const [fuelLevel, setFuelLevel] = useState(0);
  const [isFuelLidOpen, setIsFuelLidOpen] = useState(false);
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative", // MUST be here
      }}
    >
      {/* ✅ HTML UI MUST BE OUTSIDE CANVAS */}
      {entered && <FuelGauge fuel={fuelLevel} />}

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
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
