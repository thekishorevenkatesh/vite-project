import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

type FuelStreamProps = {
    canRef: React.RefObject<THREE.Object3D | null>;
    enabled: boolean; // controlled by tilt / pourState
};

export function FuelStream({ canRef, enabled }: FuelStreamProps) {
    const meshRef = useRef<THREE.Mesh>(null!);
    const materialRef = useRef<THREE.ShaderMaterial>(null!);

    /* ---------------- World helpers ---------------- */
    const spoutWorldPos = new THREE.Vector3();
    const targetWorldPos = new THREE.Vector3();
    const emitDir = new THREE.Vector3(0, -1, 0);

    /* ---------------- Cylinder geometry for stream ---------------- */
    const geometry = useMemo(() => {
        // Create a tapered cylinder (wider at top, narrower at bottom)
        const geo = new THREE.CylinderGeometry(0.04, 0.02, 2, 16, 20, true);
        geo.translate(0, -1, 0); // Move origin to top
        return geo;
    }, []);

    /* ---------------- Custom shader material ---------------- */
    const shaderMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                opacity: { value: 0.7 },
                color: { value: new THREE.Color(0xffdd44) } // Yellowish fuel color
            },
            vertexShader: `
                uniform float time;
                varying vec2 vUv;
                varying float vOpacity;
                
                void main() {
                    vUv = uv;
                    vec3 pos = position;
                    
                    // Add slight wave/turbulence to stream
                    float wave = sin(pos.y * 10.0 + time * 3.0) * 0.01;
                    pos.x += wave;
                    pos.z += wave * 0.5;
                    
                    // Fade out at bottom
                    vOpacity = smoothstep(0.0, 0.3, uv.y);
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform float opacity;
                uniform vec3 color;
                varying vec2 vUv;
                varying float vOpacity;
                
                void main() {
                    // Create flowing texture pattern
                    float pattern = sin(vUv.x * 20.0) * sin(vUv.y * 15.0) * 0.1 + 0.9;
                    
                    vec3 finalColor = color * pattern;
                    float finalOpacity = opacity * vOpacity;
                    
                    gl_FragColor = vec4(finalColor, finalOpacity);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false
        });
    }, []);

    useFrame((state) => {
        if (!canRef.current || !meshRef.current || !materialRef.current) {
            return;
        }

        const can = canRef.current;

        if (enabled) {
            // Update shader time uniform for animation
            materialRef.current.uniforms.time.value = state.clock.elapsedTime;

            /* ----------- Spout offset in LOCAL space ----------- */
            const spoutOffset = new THREE.Vector3(0, 0.45, 0.12);

            /* ----------- Compute pour direction in LOCAL space ----------- */
            emitDir.set(0.025, 1.01, -0.45).normalize(); // Pour downward with slight forward tilt

            /* ----------- Calculate target position (where stream ends) ----------- */
            targetWorldPos.copy(spoutOffset).add(emitDir.clone().multiplyScalar(1.5));

            /* ----------- Position and orient the stream mesh ----------- */
            meshRef.current.position.copy(spoutOffset);

            // Look at target to orient the stream
            meshRef.current.lookAt(targetWorldPos);

            // Rotate 90 degrees to align cylinder correctly
            meshRef.current.rotateX(Math.PI / 2);

            // Make stream visible
            meshRef.current.visible = true;
        } else {
            // Hide stream when not pouring
            meshRef.current.visible = false;
        }
    });

    return (
        <>
            <mesh ref={meshRef} geometry={geometry} material={shaderMaterial} visible={false}>
                <primitive object={shaderMaterial} ref={materialRef} attach="material" />
            </mesh>
            
            {/* Visualize spout position and local axes
            <group position={[0, 0.5, 0.2]}>
                {/* X axis - Red line *
                <line>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            args={[new Float32Array([0, 0, 0, 0.3, 0, 0]), 3]}
                        />
                    </bufferGeometry>
                    <lineBasicMaterial color="red" />
                </line>
                
                {/* Y axis - Green line 
                <line>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            args={[new Float32Array([0, 0, 0, 0, 0.3, 0]), 3]}
                        />
                    </bufferGeometry>
                    <lineBasicMaterial color="green" />
                </line>
                
                {/* Z axis - Blue line 
                <line>
                    <bufferGeometry>
                        <bufferAttribute
                            attach="attributes-position"
                            args={[new Float32Array([0, 0, 0, 0, 0, 0.3]), 3]}
                        />
                    </bufferGeometry>
                    <lineBasicMaterial color="blue" />
                </line>
                
                {/* Small sphere at origin *
                <mesh>
                    <sphereGeometry args={[0.03]} />
                    <meshBasicMaterial color="yellow" />
                </mesh>
            </group> */}
        </>
    );
}