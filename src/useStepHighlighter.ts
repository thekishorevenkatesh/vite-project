import * as THREE from "three";
import { useEffect } from "react";

const COMPONENT_TO_MESH: Record<string, string[]> = {
  IGNITION_KEY: ["Scene282"],
  FUEL_TANK: ["Key_led"],
  FUEL_CAN: ["fuel_can_fuel_can"],
  SIDE_STAND: ["Side_stand_"],
  KILL_SWITCH: ["KillSwitch"],
  START_BUTTON: ["StartButton"],
};

export function useStepHighlighter(
  scene: THREE.Scene,
  component?: string
) {
  useEffect(() => {
    if (!component) return;

    scene.traverse(obj => {
      if (!(obj as THREE.Mesh).isMesh) return;

      const mesh = obj as THREE.Mesh;
      const targets = COMPONENT_TO_MESH[component] || [];

      const shouldHighlight = targets.some(t =>
        mesh.name.startsWith(t)
      );

      if (shouldHighlight) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.emissive.set("#1e6bff");
        mat.emissiveIntensity = 0.9;
      }
    });

    return () => {
      scene.traverse(obj => {
        if ((obj as THREE.Mesh).isMesh) {
          const mat = (obj as THREE.Mesh)
            .material as THREE.MeshStandardMaterial;
          mat.emissive.set("#000000");
          mat.emissiveIntensity = 0;
        }
      });
    };
  }, [scene, component]);
}
