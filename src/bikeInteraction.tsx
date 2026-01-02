import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
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
  const listener = useRef<AudioListener | null>(null);
  const startSound = useRef<Audio | null>(null);
  const engineLoopSound = useRef<Audio | null>(null);

  // Store original transforms once
  useEffect(() => {
    scene.traverse((obj) => {
      if (obj.name && !originalRotations.current.has(obj.name)) {
        originalRotations.current.set(obj.name, obj.rotation.clone());
        originalPositions.current.set(obj.name, obj.position.clone());
      }
    });
  }, [scene]);

  // Load sounds
  useEffect(() => {
    const audioListener = new AudioListener();
    camera.add(audioListener);
    listener.current = audioListener;

    const loader = new AudioLoader();

    const start = new Audio(audioListener);
    loader.load("/sounds/apache-not-starting.mp3", (buffer) => {
      start.setBuffer(buffer);
      start.setVolume(0.7);
    });
    startSound.current = start;

    const loop = new Audio(audioListener);
    loader.load("/sounds/apache_start_loop.mp3", (buffer) => {
      loop.setBuffer(buffer);
      loop.setLoop(true);
      loop.setVolume(0.6);
    });
    engineLoopSound.current = loop;

    return () => {
      camera.remove(audioListener);
    };
  }, [camera]);

  // Click handling
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
      // SEAT
      if (mesh.name === "Seat") removeSeat(mesh);
      // side panel
      if (mesh.name === "RSPanel") removeSidePanel(mesh);
      if (mesh.name === "Battery") removeBattery(mesh);
    };

    gl.domElement.addEventListener("pointerdown", onClick);
    return () => gl.domElement.removeEventListener("pointerdown", onClick);
  }, [camera, scene, gl, fuelLevel]);

  function reset(obj: Object3D) {
    const original = originalRotations.current.get(obj.name);
    if (original) obj.rotation.copy(original);
  }

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
  }

  function toggleFuel(obj: Object3D) {
    // 🔑 Key must be OFF to open fuel lid
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
    // 🔒 Key dependency
    if (!keyOn.current) {
      showMessage("Turn key ON first");
      return;
    }

    // ⛽ Fuel lid dependency
    if (fuelOpen.current) {
      showMessage("Close fuel lid first");
      return;
    }

    // 🦵 Side stand dependency
    if (standOpen.current) {
      showMessage("Lift side stand first");
      return;
    }

    reset(obj);
    killSwitchOn.current = !killSwitchOn.current;
    obj.rotateZ(killSwitchOn.current ? Math.PI : 0);

    if (killSwitchOn.current) {
      startSound.current?.play();

      if (fuelLevel === 100 && engineLoopSound.current) {
        engineLoopSound.current.play();
      }
    } else {
      engineLoopSound.current?.stop();
    }

    console.log(
      "Kill:",
      killSwitchOn.current,
      "| Fuel:",
      fuelLevel,
      "| Stand:",
      standOpen.current ? "DOWN" : "UP",
      "| Fuel Lid:",
      fuelOpen.current ? "OPEN" : "CLOSED"
    );
  }

  // Safety: stop engine if fuel drops
  useEffect(() => {
    if (fuelLevel < 100 && engineLoopSound.current?.isPlaying) {
      engineLoopSound.current.stop();
    }
  }, [fuelLevel]);

  function removeSeat(obj: Object3D) {
    reset(obj);
    seatRemoved.current = !seatRemoved.current;
    if (seatRemoved.current) {
      obj.position.set(2, 0.5, 0);
      console.log("Seat removed");
    } else {
      if (sidePanelRemoved.current) {
        console.log("Restore sidePanel first");
        seatRemoved.current = true;
        return;
      }
      const originalPosition =
        originalPositions.current.get(obj.name) || obj.position.clone();
      obj.position.copy(originalPosition);
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
      obj.position.set(-2, 0.5, 0); // Move the side panel outside the bike
      console.log("Side panel removed");
    } else {
      if (batteryRemoved.current) {
        console.log("Restore battery first");
        sidePanelRemoved.current = true;
        return;
      }
      const originalPosition =
        originalPositions.current.get(obj.name) || obj.position.clone();
      obj.position.copy(originalPosition); // Restore original position
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
      obj.position.set(-3, 0.5, 0); // Move the battery outside the bike
      console.log("Battery removed");
    } else {
      const originalPosition =
        originalPositions.current.get(obj.name) || obj.position.clone();
      obj.position.copy(originalPosition);
      console.log("Battery restored");
    }
  }
  return null;
}
