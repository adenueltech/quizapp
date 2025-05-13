"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

// Confetti piece component
const ConfettiPiece = ({ position, color, velocity, rotationSpeed, scale = 1 }) => {
  const meshRef = useRef()

  // Random shape selection
  const geometry = useMemo(() => {
    const shapes = [
      new THREE.BoxGeometry(0.1, 0.1, 0.02),
      new THREE.CircleGeometry(0.05, 6),
      new THREE.PlaneGeometry(0.1, 0.1),
    ]
    return shapes[Math.floor(Math.random() * shapes.length)]
  }, [])

  useFrame(() => {
    if (meshRef.current) {
      // Apply gravity and velocity
      meshRef.current.position.x += velocity.x
      meshRef.current.position.y += velocity.y
      meshRef.current.position.z += velocity.z

      // Apply drag/air resistance
      velocity.y -= 0.005 // Gravity
      velocity.x *= 0.99 // Horizontal drag
      velocity.z *= 0.99 // Depth drag

      // Random rotation
      meshRef.current.rotation.x += rotationSpeed.x
      meshRef.current.rotation.y += rotationSpeed.y
      meshRef.current.rotation.z += rotationSpeed.z
    }
  })

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      {geometry}
      <meshStandardMaterial color={color} side={THREE.DoubleSide} />
    </mesh>
  )
}

export function ConfettiEffect({ count = 100, active = false, position = [0, 0, 0] }) {
  // Generate confetti pieces when active changes to true
  const confetti = useMemo(() => {
    if (!active) return []

    const pieces = []
    const colors = ["#ff5ebd", "#5efff7", "#ffcc00", "#66ff99", "#ff9efc", "#9efdff", "#ffcc66", "#ff88ee"]

    for (let i = 0; i < count; i++) {
      pieces.push({
        id: i,
        position: [
          position[0] + (Math.random() - 0.5) * 2,
          position[1] + (Math.random() - 0.5) * 0.5,
          position[2] + (Math.random() - 0.5) * 2,
        ],
        velocity: {
          x: (Math.random() - 0.5) * 0.1,
          y: Math.random() * 0.1 + 0.05,
          z: (Math.random() - 0.5) * 0.1,
        },
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.1,
          y: (Math.random() - 0.5) * 0.1,
          z: (Math.random() - 0.5) * 0.1,
        },
        color: colors[Math.floor(Math.random() * colors.length)],
        scale: Math.random() * 0.5 + 0.5,
      })
    }

    return pieces
  }, [active, count, position])

  return (
    <group>
      {confetti.map((piece) => (
        <ConfettiPiece
          key={piece.id}
          position={piece.position}
          velocity={piece.velocity}
          rotationSpeed={piece.rotationSpeed}
          color={piece.color}
          scale={piece.scale}
        />
      ))}
    </group>
  )
}
