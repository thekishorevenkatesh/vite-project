import * as THREE from "three";
import { useEffect, useRef } from "react";

const COMPONENT_TO_MESH: Record<string, string[]> = {
  IGNITION_KEY: ["Scene282"],
  FUEL_TANK: ["Key_led"],
  FUEL_CAN: ["fuel_can_fuel_can"],
  SIDE_STAND: ["Side_stand_"],
  KILL_SWITCH: ["KillSwitch"],
  START_BUTTON: ["StartButton"],
};

type MaterialSnapshot = {
  emissive: THREE.Color;
  emissiveIntensity: number;
};

export function useStepHighlighter(
  scene: THREE.Scene,
  component?: string
) {
  const highlightedMeshes = useRef<THREE.Mesh[]>([]);
  const originalMaterials = useRef<
    Map<THREE.Mesh, MaterialSnapshot>
  >(new Map());

  const clock = useRef(new THREE.Clock());

  useEffect(() => {
    if (!component) return;

    const targets = COMPONENT_TO_MESH[component] ?? [];

    // 🔹 Find & store target meshes
    scene.traverse(obj => {
      if (!(obj instanceof THREE.Mesh)) return;

      const match = targets.some(t =>
        obj.name.toLowerCase().includes(t.toLowerCase())
      );

      if (!match) return;

      const material = obj.material as THREE.MeshStandardMaterial;
      if (!material?.emissive) return;

      // Store original material state once
      if (!originalMaterials.current.has(obj)) {
        originalMaterials.current.set(obj, {
          emissive: material.emissive.clone(),
          emissiveIntensity: material.emissiveIntensity ?? 0,
        });
      }

      highlightedMeshes.current.push(obj);
    });

    let rafId: number;

    // 🔹 Animate pulse
    const animate = () => {
      const t = clock.current.getElapsedTime();
      const pulse = 0.6 + Math.sin(t * 3) * 0.3;

      highlightedMeshes.current.forEach(mesh => {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.emissive.set("#1e6bff");
        mat.emissiveIntensity = pulse;
      });

      rafId = requestAnimationFrame(animate);
    };

    animate();

    // 🔹 Cleanup: restore materials
    return () => {
      cancelAnimationFrame(rafId);

      highlightedMeshes.current.forEach(mesh => {
        const snapshot = originalMaterials.current.get(mesh);
        if (!snapshot) return;

        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.emissive.copy(snapshot.emissive);
        mat.emissiveIntensity = snapshot.emissiveIntensity;
      });

      highlightedMeshes.current = [];
    };
  }, [scene, component]);
}
