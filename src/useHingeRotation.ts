import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

export function useHingeRotation(
  isOpen: boolean,
  openAngle: number,
  axis: 'x' | 'y' | 'z',
  speed = 5
) {
  const ref = useRef<THREE.Object3D>(null!)

  useFrame((_, delta) => {
    if (!ref.current) return

    const target = isOpen ? openAngle : 0
    ref.current.rotation[axis] = THREE.MathUtils.lerp(
      ref.current.rotation[axis],
      target,
      delta * speed
    )
  })

  return ref
}
