"use client"

import { useMemo } from "react"

import { useRef, useState, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

// Interactive floating question mark
export function FloatingQuestionMark({ position, color = "#ffcc00", scale = 1, onClick }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Bobbing motion
      meshRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 2) * 0.1

      // Rotation
      meshRef.current.rotation.y += 0.01

      // Scale effect when hovered
      meshRef.current.scale.x = scale * (hovered ? 1.2 : 1)
      meshRef.current.scale.y = scale * (hovered ? 1.2 : 1)
      meshRef.current.scale.z = scale * (hovered ? 1.2 : 1)

      // Pulse effect when clicked
      if (clicked) {
        const pulse = Math.sin(clock.getElapsedTime() * 10) * 0.1 + 1
        meshRef.current.scale.x *= pulse
        meshRef.current.scale.y *= pulse
        meshRef.current.scale.z *= pulse

        // Reset click state after animation
        if (clock.getElapsedTime() % 2 > 1.9) {
          setClicked(false)
        }
      }
    }
  })

  const handleClick = (e) => {
    e.stopPropagation()
    setClicked(true)
    if (onClick) onClick()
  }

  return (
    <group position={[position[0], position[1], position[2]]}>
      {/* Question mark shape */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        <torusGeometry args={[0.3, 0.1, 16, 32, 5]} />
        <meshStandardMaterial
          color={hovered ? "#ffffff" : color}
          emissive={color}
          emissiveIntensity={hovered ? 0.8 : 0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {/* Dot of the question mark */}
      <mesh position={[0, -0.5, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color={hovered ? "#ffffff" : color}
          emissive={color}
          emissiveIntensity={hovered ? 0.8 : 0.3}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </group>
  )
}

// Interactive ripple effect
export function RippleEffect({ position = [0, 0, 0], color = "#5efff7" }) {
  const meshRef = useRef()
  const [ripples, setRipples] = useState([])
  const { mouse, viewport } = useThree()

  // Create a new ripple on mouse move
  useEffect(() => {
    const interval = setInterval(() => {
      // Convert mouse position to world coordinates
      const x = (mouse.x * viewport.width) / 2
      const z = -(mouse.y * viewport.height) / 2

      if (Math.abs(x) > 0.1 || Math.abs(z) > 0.1) {
        const newRipple = {
          id: Date.now(),
          position: [x, position[1], z],
          scale: 0.1,
          opacity: 1,
          color: color,
        }

        setRipples((prev) => [...prev.slice(-5), newRipple]) // Keep only the last 5 ripples
      }
    }, 300) // Create a new ripple every 300ms if mouse is moving

    return () => clearInterval(interval)
  }, [mouse, viewport, position, color])

  // Animate ripples
  useFrame(() => {
    setRipples(
      (prev) =>
        prev
          .map((ripple) => ({
            ...ripple,
            scale: ripple.scale + 0.1, // Expand
            opacity: ripple.opacity - 0.02, // Fade out
          }))
          .filter((ripple) => ripple.opacity > 0), // Remove completely faded ripples
    )
  })

  return (
    <group position={position}>
      {ripples.map((ripple) => (
        <mesh key={ripple.id} position={ripple.position} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[ripple.scale, ripple.scale + 0.1, 32]} />
          <meshBasicMaterial color={ripple.color} transparent opacity={ripple.opacity} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  )
}

// Cartoon character that reacts to quiz progress
export function CartoonMascot({ position, progress, score, totalQuestions }) {
  const groupRef = useRef()
  const [mood, setMood] = useState("neutral") // neutral, happy, sad

  // Update mood based on score
  useEffect(() => {
    if (score === 0) {
      setMood("neutral")
    } else if (score / totalQuestions > 0.6) {
      setMood("happy")
    } else {
      setMood("sad")
    }
  }, [score, totalQuestions])

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Bobbing motion
      groupRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 1.5) * 0.1

      // Different animations based on mood
      if (mood === "happy") {
        groupRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 3) * 0.1
      } else if (mood === "sad") {
        groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 1) * 0.05
      } else {
        groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.1
      }
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.5, 1, 8, 16]} />
        <meshStandardMaterial color="#ff9efc" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color="#ff9efc" />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.2, 1.1, 0.6]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh position={[0.2, 1.1, 0.6]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Mouth - changes with mood */}
      {mood === "happy" && (
        <mesh position={[0, 0.8, 0.6]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.2, 0.05, 16, 32, Math.PI]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
      )}
      {mood === "sad" && (
        <mesh position={[0, 0.8, 0.6]}>
          <torusGeometry args={[0.2, 0.05, 16, 32, Math.PI]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
      )}
      {mood === "neutral" && (
        <mesh position={[0, 0.8, 0.6]}>
          <boxGeometry args={[0.3, 0.05, 0.05]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
      )}

      {/* Progress indicator */}
      <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.6, 0.7, 32]} />
        <meshBasicMaterial color="#333333" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.99, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.6, 0.7, 32, 32, 0, progress * Math.PI * 2]} />
        <meshBasicMaterial color="#66ff99" side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

// Confetti piece component
const ConfettiPieceComponent = ({ position, color, velocity, rotationSpeed, scale = 1 }) => {
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
        <ConfettiPieceComponent
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
