import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import { IntroScene } from "./IntroScene";
import { ShowroomScene } from "./ShowroomScene";
import { About } from "./About"; // import the About overlay

export default function App() {
  const [entered, setEntered] = useState(false);
  const [showAbout, setShowAbout] = useState(false); // state for About overlay

  return (
    <>
      <Canvas
        style={{ width: "100vw", height: "100vh" }}
        camera={{ position: [0, 1.6, 6], fov: 45, near: 0.1, far: 100 }}
        shadows
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          {!entered ? (
            <IntroScene
              onEnter={() => setEntered(true)}
              onAbout={() => setShowAbout(true)} // open About overlay
            />
          ) : (
            <ShowroomScene onExitShowroom={() => setEntered(false)} />
          )}

          {/* Show About overlay on top of everything */}
          {showAbout && <About onClose={() => setShowAbout(false)} />}
        </Suspense>
      </Canvas>
    </>
  );
}
