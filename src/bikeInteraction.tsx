import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Raycaster, Vector2, Object3D, Euler, Vector3 } from "three";
import { AudioListener, Audio, AudioLoader } from "three";

export function BikeInteractionController() {
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
  const bikeOnSound = useRef<Audio | null>(null);

  // Store original rotations ONCE
  useEffect(() => {
    scene.traverse((obj) => {
      if (obj.name && !originalRotations.current.has(obj.name)) {
        originalRotations.current.set(obj.name, obj.rotation.clone());
        originalPositions.current.set(obj.name, obj.position.clone());
      }
    });
  }, [scene]);
  useEffect(() => {
    const audioListener = new AudioListener();
    camera.add(audioListener);
    listener.current = audioListener;

    const sound = new Audio(audioListener);
    const loader = new AudioLoader();

    loader.load("/sounds/apache-not-starting.mp3", (buffer) => {
      sound.setBuffer(buffer);
      sound.setVolume(0.7);
    });

    bikeOnSound.current = sound;

    return () => {
      camera.remove(audioListener);
    };
  }, [camera]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();

      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, camera);

      const hits = raycaster.current.intersectObjects(scene.children, true);

      if (!hits.length) return;

      const mesh = hits[0].object;
      console.log("Clicked mesh:", mesh.name);

      // KEY
      if (mesh.name === "Scene164") toggleKey(mesh);

      // SIDE STAND
      if (mesh.name.startsWith("Side_stand_")) toggleStand(mesh);

      // FUEL CAP
      if (mesh.name === "Key_led") toggleFuel(mesh);

      // KILL SWITCH
      if (mesh.name === "KillSwitch") toggleKillSwitch(mesh);
      // SEAT
      if (mesh.name === "Seat") removeSeat(mesh);
      // side panel
      if (mesh.name === "RSPanel") removeSidePanel(mesh);
      if (mesh.name === "Battery") removeBattery(mesh);
    };

    gl.domElement.addEventListener("pointerdown", onClick);
    return () => gl.domElement.removeEventListener("pointerdown", onClick);
  }, [camera, scene, gl]);

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
    console.log("Side Stand:", standOpen.current ? "OPEN" : "CLOSE");
  }

  function toggleFuel(obj: Object3D) {
    reset(obj);
    fuelOpen.current = !fuelOpen.current;
    obj.rotateY(fuelOpen.current ? Math.PI / 2 : 0);
    console.log("Fuel Cap:", fuelOpen.current ? "OPEN" : "CLOSE");
  }

  function toggleKillSwitch(obj: Object3D) {
    reset(obj);
    killSwitchOn.current = !killSwitchOn.current;

    obj.rotateZ(killSwitchOn.current ? Math.PI / 1 : 0);

    if (killSwitchOn.current && bikeOnSound.current) {
      if (bikeOnSound.current.isPlaying) {
        bikeOnSound.current.stop();
      }
      bikeOnSound.current.play();
    }

    console.log("Kill Switch:", killSwitchOn.current ? "ON" : "OFF");
  }

  //   function removeSeat(obj: Object3D) {
  //     reset(obj);
  //     seatRemoved.current = !seatRemoved.current;

  //     if (seatRemoved.current) {
  //       // create the plane once
  //       const plane = new Plane(new Vector3(0, 1, 0), 0);
  //       const intersection = new Vector3();

  //       const onMouseMove = (e: MouseEvent) => {
  //         const rect = gl.domElement.getBoundingClientRect();
  //         mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  //         mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  //         raycaster.current.setFromCamera(mouse.current, camera);
  //         if (raycaster.current.ray.intersectPlane(plane, intersection)) {
  //           // Smooth movement using lerp
  //           obj.position.lerp(intersection, 0.1); // 0.1 controls speed; smaller = slower
  //         }
  //       };

  //       const onMouseUp = () => {
  //         gl.domElement.removeEventListener("pointermove", onMouseMove);
  //         gl.domElement.removeEventListener("pointerup", onMouseUp);
  //         console.log("Seat placed");
  //       };

  //       gl.domElement.addEventListener("pointermove", onMouseMove);
  //       gl.domElement.addEventListener("pointerup", onMouseUp);
  //       console.log("Seat removed - drag to move");
  //     } else {
  //       const originalPosition =
  //         originalPositions.current.get(obj.name) || obj.position.clone();
  //       obj.position.copy(originalPosition);
  //       console.log("Seat restored");
  //     }
  //   }
  function removeSeat(obj: Object3D) {
    reset(obj);
    seatRemoved.current = !seatRemoved.current;
    if (seatRemoved.current) {
      obj.position.set(-200, 0, -100);
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
      obj.position.set(-300, 0, -100); // Move the side panel outside the bike
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
      obj.position.set(-400, 0, -100); // Move the battery outside the bike
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
