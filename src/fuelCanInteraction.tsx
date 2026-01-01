import { type RefObject, useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function useFuelCanInteraction(
  fuelRef: RefObject<THREE.Object3D | null>,
  bikeRef: RefObject<THREE.Object3D | null>
) {
  const [dragging, setDragging] = useState(false);
  const [fueled, setFueled] = useState(false);

  const plane = useRef(new THREE.Plane());
  const tankPos = useRef(new THREE.Vector3(0,0,0));
  const hit = useRef(new THREE.Vector3());

  // 🔍 Find fuel tank snap position
  useEffect(() => {
    if (!bikeRef.current) return;

    const tank =
      bikeRef.current.getObjectByName("FuelTankSnap") ||
      bikeRef.current.getObjectByName("FuelTank");

    tank?.getWorldPosition(tankPos.current);
  }, []);

  // 🖱 Called on pointer move
  const move = (ray: THREE.Ray) => {
    if (!dragging || fueled || !fuelRef.current) return;

    // Horizontal plane at fuel can height
    plane.current.setFromNormalAndCoplanarPoint(
      new THREE.Vector3(0, 1, 0),
      fuelRef.current.position
    );

    ray.intersectPlane(plane.current, hit.current);
    fuelRef.current.position.copy(hit.current);
  };

  // 🧲 Release & snap
  const release = () => {
    if (!fuelRef.current || fueled) return;

    const dist = fuelRef.current.position.distanceTo(tankPos.current);

    if (dist < 0.4) {
      fuelRef.current.position.copy(tankPos.current);
      fuelRef.current.rotation.set(0, Math.PI / 1, 0);
      setFueled(true);
    }

    setDragging(false);
  };

  return {
    grab: () => !fueled && setDragging(true),
    move,
    release,
    fueled,
  };
}
