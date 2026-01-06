// useDashboardAnimation.ts
import { useEffect, useRef } from "react";
import {
    Scene,
    Texture,
    TextureLoader,
    RepeatWrapping,
    Mesh,
    MeshBasicMaterial,
} from "three";

type DashboardConfig = {
    scene: Scene;
    offSpriteUrl: string; // static OFF image
    onSpriteUrl: string;  // sprite sheet
    enabled: boolean; // key ON / OFF
};

const COLS = 5;
const ROWS = 6;
const FRAMES = 27;
const FRAME_INTERVAL = 50; // ms

const DASHBOARD_NAME = "Speedometer";

export function useDashboardAnimation({
    scene,
    offSpriteUrl,
    onSpriteUrl,
    enabled,
}: DashboardConfig) {
    const meshRef = useRef<Mesh | null>(null);
    const materialRef = useRef<MeshBasicMaterial | null>(null);
    const onTextureRef = useRef<Texture | null>(null);
    const offTextureRef = useRef<Texture | null>(null);
    const intervalRef = useRef<number | null>(null);
    const hasPlayedRef = useRef(false);
    const BASE_OFFSET_X = -0.006;
    const BASE_OFFSET_Y = 0.0035;




    // ---------- bind dashboard mesh & material ----------
    useEffect(() => {
        if (!scene) return;

        scene.traverse((obj) => {
            if (!(obj instanceof Mesh)) return;
            if (obj.name !== DASHBOARD_NAME) return;

            meshRef.current = obj;

            const originalMat = obj.material as MeshBasicMaterial;

            const clonedMat = originalMat.clone();
            clonedMat.map = null;
            clonedMat.transparent = true;
         
            obj.material = clonedMat;
            materialRef.current = clonedMat;

            const loader = new TextureLoader();

            /* OFF texture (static) */
            loader.load(
                offSpriteUrl,
                (tex) => {
                    tex.flipY = false;
                    tex.offset.set(BASE_OFFSET_X, BASE_OFFSET_Y);
                    offTextureRef.current = tex;

                    if (!enabled) {
                        clonedMat.map = tex;
                    }
                },
                undefined,
                (err) => console.error(" OFF texture load failed", err)
            );

            /* ON texture (sprite sheet) */
            loader.load(
                onSpriteUrl,
                (tex) => {
                    tex.wrapS = RepeatWrapping;
                    tex.wrapT = RepeatWrapping;
                    tex.repeat.set(1 / COLS, 1 / ROWS);
                    tex.flipY = false;

                    onTextureRef.current = tex;
                },
                undefined,
                (err) => console.error(" ON texture load failed", err)
            );
        });
    }, [scene, offSpriteUrl, onSpriteUrl]);

    // ---------- frame setter ----------
    function setFrame(frame: number) {
        const tex = onTextureRef.current;
        if (!tex) return;

        const safe = Math.max(0, Math.min(frame, FRAMES - 1));
        const col = safe % COLS;
        const row = Math.floor(safe / COLS);

        tex.offset.set(
            col / COLS + BASE_OFFSET_X,
            1 - (row + 1) / ROWS + BASE_OFFSET_Y
        );
    };

    // ---------- animation (KEY DRIVEN) ----------
    useEffect(() => {
        const material = materialRef.current;
        if (!material) return;

        /* Stop previous animation */
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        /* 🔴 KEY OFF */
        if (!enabled) {
            hasPlayedRef.current = false;
            if (offTextureRef.current) {
                material.map = offTextureRef.current;
                material.map.offset.set(BASE_OFFSET_X, BASE_OFFSET_Y);
                material.map.repeat.set(1, 1);
                material.needsUpdate = true;
            }
            return;
        }

        /* 🟢 KEY ON (play once) */
        if (hasPlayedRef.current) return;
        hasPlayedRef.current = true;

        if (!onTextureRef.current) return;

        material.map = onTextureRef.current;
        material.map.offset.set(0, 0);
        material.needsUpdate = true;
        setFrame(0);

        let frame = 0;

        intervalRef.current = window.setInterval(() => {
            frame++;

            if (frame >= FRAMES) {
                clearInterval(intervalRef.current!);
                intervalRef.current = null;
                return;
            }

            setFrame(frame);
        }, FRAME_INTERVAL);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [enabled]);
}
