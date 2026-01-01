import { Html } from "@react-three/drei";

export function About({ onClose }: { onClose: () => void }) {
  return (
    <Html center>
      <div style={styles.container}>
        <h1 style={styles.title}>About This Project</h1>

        <div style={styles.content}>
          <h2>1. Project Overview</h2>
          <ul>
            <li>Interactive 3D motorcycle showroom and training experience.</li>
            <li>Built with:
              <ul>
                <li>React + TypeScript</li>
                <li>@react-three/fiber</li>
                <li>@react-three/drei</li>
                <li>Three.js</li>
                <li>Vite (local dev on 5173)</li>
              </ul>
            </li>
            <li>Goal: Step-by-step interaction with real motorcycle components for:
              <ul>
                <li>Service training</li>
                <li>Assembly / disassembly training</li>
                <li>Operator familiarization</li>
              </ul>
            </li>
            <li>Not a game or simple 3D viewer.</li>
          </ul>

          <h2>2. Scene Structure</h2>
          <ul>
            <li>Core 3D assets:
              <ul>
                <li>showroom.glb → environment (platform, walls, lights)</li>
                <li>Bike.glb → motorcycle with correctly named meshes</li>
                <li>fuel_can.glb → separate interactive object</li>
              </ul>
            </li>
            <li>Scene hierarchy:
              <ul>
                <li>Canvas</li>
                <li>IntroScene (HTML overlay)</li>
                <li>Showroom</li>
                <li>Bike</li>
                <li>Interactive meshes</li>
                <li>FuelCan</li>
              </ul>
            </li>
            <li>Refining relative positioning for physical realism.</li>
          </ul>

          <h2>3. Interaction System</h2>
          <ul>
            <li>Central controller: <code>BikeInteractionController.tsx</code></li>
            <li>Uses Raycaster for mouse → ray → mesh detection.</li>
            <li>Mesh-name–based logic.</li>
            <li>Maintains original rotations and positions.</li>
            <li>Internal state guards mimic real-world mechanical dependencies:
              <ul>
                <li>seatRemoved</li>
                <li>sidePanelRemoved</li>
                <li>batteryRemoved</li>
                <li>killSwitchOn</li>
                <li>fuelOpen</li>
                <li>standOpen</li>
              </ul>
            </li>
            <li>Prevents invalid actions (e.g., must remove seat before side panel).</li>
          </ul>

          <h2>4. Fuel Can Interaction</h2>
          <ul>
            <li>Desired behavior:
              <ul>
                <li>Placed near bike</li>
                <li>Click + hold → grab fuel can</li>
                <li>Move to fuel tank</li>
                <li>Detect proximity → trigger fueling animation or lock position</li>
              </ul>
            </li>
            <li>Current issues:
              <ul>
                <li>Wrong initial placement</li>
                <li>Typing errors with <code>Object3D | null</code></li>
                <li>Interaction not triggering consistently</li>
                <li>Raycasting + dragging conflict</li>
                <li>Scene origin confusion</li>
              </ul>
            </li>
          </ul>

          <h2>5. Camera & Controls</h2>
          <ul>
            <li>Camera does NOT rotate with mouse; angle changes only via UI buttons.</li>
            <li>Camera must stay within showroom bounds.</li>
            <li>OrbitControls sometimes caused:
              <ul>
                <li>Camera leaving bounds</li>
                <li>Top/Bottom views breaking raycasting</li>
                <li>Losing interaction when exiting showroom</li>
              </ul>
            </li>
          </ul>

          <h2>6. UI & Flow</h2>
          <ul>
            <li>Intro scene implemented: “Click to Enter Showroom”.</li>
            <li>Clean HTML overlay UI.</li>
            <li>Target style: professional, industrial, training-grade (not flashy).</li>
          </ul>

          <h2>7. Audio Interaction</h2>
          <ul>
            <li>Bike turn-on sound tied to <code>toggleKillSwitch</code>.</li>
            <li>Future plan:
              <ul>
                <li>Click sounds</li>
                <li>Mechanical feedback</li>
                <li>Success/failure cues</li>
              </ul>
            </li>
          </ul>
        </div>

        <button style={styles.button} onClick={onClose}>
          Close
        </button>
      </div>
    </Html>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    background: "rgba(17, 17, 17, 0.95)",
    borderRadius: "14px",
    padding: "30px 40px",
    width: "600px",
    maxHeight: "80vh",
    overflowY: "auto",
    textAlign: "left",
    boxShadow: "0 25px 60px rgba(0, 0, 0, 0.6)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
  },
  title: {
    fontSize: "28px",
    fontWeight: 600,
    color: "#ffcc00",
    marginBottom: "16px",
    textAlign: "center",
  },
  content: {
    fontSize: "14px",
    color: "#f5f5f5",
    lineHeight: 1.5,
    marginBottom: "20px",
  },
  button: {
    display: "block",
    margin: "0 auto",
    background: "#ffcc00",
    color: "#1b1b1b",
    border: "none",
    borderRadius: "6px",
    padding: "12px 24px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
  },
};
