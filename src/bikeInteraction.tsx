import { useThree } from "@react-three/fiber";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  Raycaster,
  Vector2,
  Object3D,
  Euler,
  Vector3,
  AudioListener,
  Audio,
  AudioLoader,
} from "three";
import { Html } from "@react-three/drei";

type Props = {
  onFuelLidChange: (open: boolean) => void;
  fuelLevel: number;
  showMessage: (msg: string) => void;
};

export function BikeInteractionController({
  onFuelLidChange,
  fuelLevel,
  showMessage,
}: Props) {
  const { camera, scene, gl } = useThree();

  // ------------------ REFS ------------------
  const raycaster = useRef(new Raycaster());
  const mouse = useRef(new Vector2());

  const originalPositions = useRef<Map<string, Vector3>>(new Map());
  const originalRotations = useRef<Map<string, Euler>>(new Map());

  const keyOn = useRef(false);
  const standOpen = useRef(false);
  const fuelOpen = useRef(false);
  const killSwitchOn = useRef(false);

  const seatRemoved = useRef(false);
  const sidePanelRemoved = useRef(false);
  const batteryRemoved = useRef(false);

  const engineStartedOnce = useRef(false);

  const listener = useRef<AudioListener | null>(null);
  const startSound = useRef<Audio | null>(null);
  const engineLoopSound = useRef<Audio | null>(null);

  const [popupMsg, setPopupMsg] = useState<string | null>(null);

  // ------------------ AUTO HIDE POPUP ------------------
  useEffect(() => {
    if (!popupMsg) return;

    const timer = setTimeout(() => {
      setPopupMsg(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, [popupMsg]);
  // ------------------ STORE ORIGINAL TRANSFORMS ------------------
  useEffect(() => {
    scene.traverse((obj) => {
      if (obj.name && !originalRotations.current.has(obj.name)) {
        originalRotations.current.set(obj.name, obj.rotation.clone());
        originalPositions.current.set(obj.name, obj.position.clone());
      }
    });
  }, [scene]);

  // ------------------ LOAD SOUNDS ------------------
  useEffect(() => {
    const audioListener = new AudioListener();
    camera.add(audioListener);
    listener.current = audioListener;

    const loader = new AudioLoader();

    // Start sound
    const start = new Audio(audioListener);
    loader.load(
      "/sounds/apache-not-starting.mp3",
      (buffer) => {
        console.log("✅ Start sound loaded");
        start.setBuffer(buffer);
        start.setVolume(0.7);
      },
      undefined,
      (err) => console.error("❌ Start sound failed to load", err)
    );
    startSound.current = start;

    // Engine loop sound
    const loop = new Audio(audioListener);
    loader.load(
      "/sounds/apache-start-loop.mp3",
      (buffer) => {
        console.log("✅ Engine loop sound loaded");
        loop.setBuffer(buffer);
        loop.setLoop(true);
        loop.setVolume(0.6);
      },
      undefined,
      (err) => console.error("❌ Engine loop sound failed to load", err)
    );
    engineLoopSound.current = loop;

    return () => {
      camera.remove(audioListener);
    };
  }, [camera]);

  // ------------------ RESET HELPER ------------------
  function reset(obj: Object3D) {
    const rot = originalRotations.current.get(obj.name);
    if (rot) obj.rotation.copy(rot);
  }

  // ------------------ TOGGLE FUNCTIONS ------------------
  function toggleKey(obj: Object3D) {
    reset(obj);
    keyOn.current = !keyOn.current;
    obj.rotateX(keyOn.current ? Math.PI / 3 : 0);
    console.log("Key:", keyOn.current ? "ON" : "OFF");
  }

  function toggleStand(obj: Object3D) {
    reset(obj);
    standOpen.current = !standOpen.current;
    obj.rotateZ(standOpen.current ? Math.PI / 3 : 0);
    console.log("Side Stand:", standOpen.current ? "DOWN" : "UP");
  }

  function toggleFuel(obj: Object3D) {
    if (keyOn.current) {
      showMessage("Turn key OFF to open fuel lid");
      return;
    }
    reset(obj);
    fuelOpen.current = !fuelOpen.current;
    obj.rotateY(fuelOpen.current ? Math.PI / 2 : 0);
    onFuelLidChange(fuelOpen.current);
    console.log("Fuel Cap:", fuelOpen.current ? "OPEN" : "CLOSE");
  }

  function toggleKillSwitch(obj: Object3D) {
    if (!keyOn.current) {
      showMessage("Turn key ON first");
      return;
    }
    if (fuelOpen.current) {
      showMessage("Close fuel lid first");
      return;
    }
    if (standOpen.current) {
      showMessage("Lift side stand first");
      return;
    }

    reset(obj);
    killSwitchOn.current = !killSwitchOn.current;
    obj.rotateZ(killSwitchOn.current ? Math.PI : 0);
    console.log("Kill Switch:", killSwitchOn.current ? "ON" : "OFF");

    if (killSwitchOn.current) {
      startSound.current?.play();
      tryStartEngine();
    } else {
      engineLoopSound.current?.stop();
      engineStartedOnce.current = false;
    }
  }

  // ------------------ ENGINE START ------------------
  const tryStartEngine = useCallback(() => {
    if (
      keyOn.current &&
      killSwitchOn.current &&
      fuelLevel === 100 &&
      !fuelOpen.current &&
      !standOpen.current &&
      engineLoopSound.current &&
      engineLoopSound.current.buffer &&
      !engineLoopSound.current.isPlaying
    ) {
      if (listener.current?.context.state === "suspended") {
        listener.current.context.resume();
      }

      console.log("🔥 Engine loop started");
      engineLoopSound.current.play();

      if (!engineStartedOnce.current) {
        engineStartedOnce.current = true;
        setPopupMsg(
          "🎉 Congratulations! Fuel filled and engine started successfully."
        );
      }
    }
  }, [fuelLevel]);

  // ------------------ STOP ENGINE ON FUEL DROP ------------------
  useEffect(() => {
    if (fuelLevel < 100 && engineLoopSound.current?.isPlaying) {
      console.log("⛔ Fuel dropped, stopping engine");
      engineLoopSound.current.stop();
      engineStartedOnce.current = false;
    }
  }, [fuelLevel]);

  // ------------------ REMOVE / RESTORE PARTS ------------------
  function removeSeat(obj: Object3D) {
    reset(obj);
    seatRemoved.current = !seatRemoved.current;

    if (seatRemoved.current) {
      obj.position.set(2, 0.5, 0);
      console.log("Seat removed");
    } else {
      if (sidePanelRemoved.current) {
        console.log("Restore side panel first");
        seatRemoved.current = true;
        return;
      }
      const pos = originalPositions.current.get(obj.name);
      if (pos) obj.position.copy(pos);
      console.log("Seat restored");
    }
  }

  function removeSidePanel(obj: Object3D) {
    if (!seatRemoved.current) {
      console.log("Remove seat first");
      return;
    }
    reset(obj);
    sidePanelRemoved.current = !sidePanelRemoved.current;

    if (sidePanelRemoved.current) {
      obj.position.set(-2, 0.5, 0);
      console.log("Side panel removed");
    } else {
      if (batteryRemoved.current) {
        console.log("Restore battery first");
        sidePanelRemoved.current = true;
        return;
      }
      const pos = originalPositions.current.get(obj.name);
      if (pos) obj.position.copy(pos);
      console.log("Side panel restored");
    }
  }

  function removeBattery(obj: Object3D) {
    if (!sidePanelRemoved.current) {
      console.log("Remove side panel first");
      return;
    }
    reset(obj);
    batteryRemoved.current = !batteryRemoved.current;

    if (batteryRemoved.current) {
      obj.position.set(-3, 0.5, 0);
      console.log("Battery removed");
    } else {
      const pos = originalPositions.current.get(obj.name);
      if (pos) obj.position.copy(pos);
      console.log("Battery restored");
    }
  }

  // ------------------ MOUSE CLICK HANDLER ------------------
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, camera);
      const hits = raycaster.current.intersectObjects(scene.children, true);
      if (!hits.length) return;

      const mesh = hits[0].object;

      if (mesh.name === "Scene282") toggleKey(mesh);
      if (mesh.name.startsWith("Side_stand_")) toggleStand(mesh);
      if (mesh.name === "Key_led") toggleFuel(mesh);
      if (mesh.name === "KillSwitch") toggleKillSwitch(mesh);
      if (mesh.name === "Seat") removeSeat(mesh);
      if (mesh.name === "RSPanel") removeSidePanel(mesh);
      if (mesh.name === "Battery") removeBattery(mesh);
    };

    gl.domElement.addEventListener("pointerdown", onClick);
    return () => gl.domElement.removeEventListener("pointerdown", onClick);
  }, [camera, scene, gl, tryStartEngine]);

  // ------------------ POPUP ------------------
  return popupMsg ? (
    <Html position={[0, 0.3, 0]}>
      <div
        style={{
          color: "rgba(255, 255, 255, 0.9)",
          background: "#049451ff",
          width: "450px",
          padding: "16px 24px",
          borderRadius: "12px",
          fontWeight: "bold",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {popupMsg}
      </div>
    </Html>
  ) : null;
}
