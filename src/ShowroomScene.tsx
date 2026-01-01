import { OrbitControls } from "@react-three/drei";
import { Showroom } from "./Showroom";
import { BikeInteractionController } from "./bikeInteraction";
import { CameraController } from "./CameraController";
interface ShowroomProps {
  onExitShowroom: () => void; // function to go back to first screen
}

export function ShowroomScene({ onExitShowroom }: ShowroomProps) {
  return (
    <>
      {/* Scene background */}
      <color attach="background" args={["#111111"]} />

      {/* Lighting */}
      <ambientLight intensity={0.6} />

      <directionalLight
        position={[5, 8, 5]}
        intensity={2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <directionalLight position={[-4, 6, -3]} intensity={1} />

      <spotLight
        position={[0, 6, -6]}
        intensity={1.8}
        angle={Math.PI / 4}
        penumbra={0.7}
      />

      <spotLight
        position={[0, 10, 0]}
        intensity={1.2}
        angle={Math.PI / 3}
        penumbra={1}
      />

      {/* Showroom + Bike + Fuel Can */}
      <Showroom />
      <BikeInteractionController />
      <CameraController onExit={onExitShowroom} />

      {/* Controls */}
      <OrbitControls
        enableRotate={false}
        enablePan={false}
        // enableZoom={false}
        target={[0, 1, 0]}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
}
