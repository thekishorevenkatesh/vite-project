import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";

export function Bike() {
  const gltf = useGLTF("/Bike.glb");

  useEffect(() => {
    const scene = gltf.scene;

    // 🔹 Compute bounding box
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    box.getSize(size);
    box.getCenter(center);

    // 🔹 Scale bike to fit showroom
    const maxAxis = Math.max(size.x, size.y, size.z);
    const targetSize = 4.5; // showroom-friendly size
    const scale = targetSize / maxAxis;
    scene.scale.setScalar(scale);

    // 🔹 Recalculate after scaling
    box.setFromObject(scene);
    box.getCenter(center);

    // 🔹 Center bike
    scene.position.sub(center);

    // 🔹 Place bike on floor (Y = 0)
    box.setFromObject(scene);
    scene.position.y -= box.min.y;

    // 🔹 Enable shadows
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }, [gltf]);

  return (
    <primitive
      object={gltf.scene}
      position={[0, 0, -0]}
      rotation={[0, Math.PI / 2, 0]}
      scale={1.2}
    />
  );
}

useGLTF.preload("/Bike.glb");
