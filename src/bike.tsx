import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

export function Bike() {
  const gltf = useGLTF("/Bike.glb");

  // ✅ CLONE THE SCENE (CRITICAL)
  const bikeScene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  useEffect(() => {
    // 🔹 Reset scale & position defensively
    bikeScene.scale.set(1, 1, 1);
    bikeScene.position.set(0, 0, 0);

    // 🔹 Compute bounding box
    const box = new THREE.Box3().setFromObject(bikeScene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    // 🔹 Normalize size
    const maxAxis = Math.max(size.x, size.y, size.z);
    const targetSize =2.5;
    const scale = targetSize / maxAxis;

    bikeScene.scale.setScalar(scale);

    // 🔹 Recenter
    box.setFromObject(bikeScene);
    box.getCenter(center);
    bikeScene.position.sub(center);

    // 🔹 Place on ground
    box.setFromObject(bikeScene);
    bikeScene.position.y -= box.min.y;

    // 🔹 Shadows
    bikeScene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }, [bikeScene]);

  return (
    <primitive
      object={bikeScene}
      rotation={[0, Math.PI / 2, 0]}
    />
  );
}

useGLTF.preload("/Bike.glb");
