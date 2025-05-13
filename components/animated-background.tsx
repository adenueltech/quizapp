"use client"

import { useRef, useMemo } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { quizCategories } from "@/data/quiz-data"

// Simplified background for better performance
export function AnimatedBackground({
  progress = 0,
  score = 0,
  totalQuestions = 5,
  showConfetti = false,
  category = "general",
}) {
  const galaxyRef = useRef()
  const { mouse } = useThree()

  // Get theme colors based on category
  const themeColors = quizCategories[category]?.theme || {
    primary: "#0a0a2a",
    secondary: "#ff5ebd",
    accent: "#5efff7",
  }

  // Stars component - simplified
  const Stars = () => {
    const positions = useMemo(() => {
      const positions = []
      for (let i = 0; i < 1000; i++) {
        positions.push(
          (Math.random() - 0.5) * 100, // x
          (Math.random() - 0.5) * 100, // y
          (Math.random() - 0.5) * 100, // z
        )
      }
      return new Float32Array(positions)
    }, [])

    const starRef = useRef()

    useFrame(({ clock }) => {
      if (starRef.current) {
        starRef.current.rotation.y = clock.getElapsedTime() * 0.02
      }
    })

    return (
      <points ref={starRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.2} color="#ffffff" sizeAttenuation transparent opacity={0.8} />
      </points>
    )
  }

  // Confetti effect - simplified
  const Confetti = ({ active }) => {
    const confettiCount = 100
    const confettiRef = useRef()

    const confettiPositions = useMemo(() => {
      if (!active) return new Float32Array([])

      const positions = []
      for (let i = 0; i < confettiCount * 3; i++) {
        positions.push((Math.random() - 0.5) * 10, Math.random() * 10, (Math.random() - 0.5) * 10)
      }
      return new Float32Array(positions)
    }, [active])

    const confettiColors = useMemo(() => {
      if (!active) return new Float32Array([])

      const colors = []
      const colorOptions = [
        [1, 0.3, 0.7], // pink
        [0.3, 1, 0.9], // cyan
        [1, 0.8, 0], // yellow
        [0.4, 1, 0.6], // green
      ]

      for (let i = 0; i < confettiCount; i++) {
        const color = colorOptions[Math.floor(Math.random() * colorOptions.length)]
        colors.push(...color)
      }
      return new Float32Array(colors)
    }, [active])

    useFrame(() => {
      if (confettiRef.current && active) {
        const positions = confettiRef.current.geometry.attributes.position.array

        for (let i = 0; i < positions.length; i += 3) {
          // Apply gravity
          positions[i + 1] -= 0.05

          // Reset particles that fall below a certain point
          if (positions[i + 1] < -10) {
            positions[i + 1] = 10
          }
        }

        confettiRef.current.geometry.attributes.position.needsUpdate = true
      }
    })

    if (!active || confettiPositions.length === 0) return null

    return (
      <points ref={confettiRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={confettiCount} array={confettiPositions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={confettiCount} array={confettiColors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.3} vertexColors transparent opacity={0.8} />
      </points>
    )
  }

  // Category-specific background elements
  const CategoryElements = () => {
    const groupRef = useRef()

    useFrame(({ clock }) => {
      if (groupRef.current) {
        groupRef.current.rotation.y = clock.getElapsedTime() * 0.1
      }
    })

    // Render different elements based on category
    switch (category) {
      case "science":
        return (
          <group ref={groupRef}>
            {/* Atom model */}
            <mesh position={[0, 0, -15]}>
              <sphereGeometry args={[1, 32, 32]} />
              <meshStandardMaterial color={themeColors.secondary} />
            </mesh>
            {/* Electron orbits */}
            {[0, 1, 2].map((i) => (
              <mesh key={i} position={[0, 0, -15]} rotation={[(Math.PI / 4) * i, (Math.PI / 3) * i, 0]}>
                <torusGeometry args={[3 + i, 0.05, 16, 100]} />
                <meshStandardMaterial
                  color={themeColors.accent}
                  emissive={themeColors.accent}
                  emissiveIntensity={0.5}
                />
              </mesh>
            ))}
          </group>
        )

      case "history":
        return (
          <group ref={groupRef}>
            {/* Ancient columns */}
            {[-5, 0, 5].map((x) => (
              <mesh key={x} position={[x, -3, -15]}>
                <cylinderGeometry args={[1, 1, 6, 16]} />
                <meshStandardMaterial color={themeColors.secondary} />
              </mesh>
            ))}
            {/* Base */}
            <mesh position={[0, -6, -15]}>
              <boxGeometry args={[15, 0.5, 5]} />
              <meshStandardMaterial color={themeColors.accent} />
            </mesh>
          </group>
        )

      case "geography":
        return (
          <group ref={groupRef}>
            {/* Globe */}
            <mesh position={[0, 0, -15]}>
              <sphereGeometry args={[4, 32, 32]} />
              <meshStandardMaterial color={themeColors.secondary} />
            </mesh>
            {/* Continents - simplified */}
            <mesh position={[0, 0, -10.9]}>
              <sphereGeometry args={[4.1, 32, 32]} />
              <meshStandardMaterial color={themeColors.accent} wireframe />
            </mesh>
          </group>
        )

      case "entertainment":
        return (
          <group ref={groupRef}>
            {/* Film reel */}
            <mesh position={[0, 0, -15]}>
              <torusGeometry args={[3, 0.5, 16, 100]} />
              <meshStandardMaterial color={themeColors.secondary} />
            </mesh>
            {/* Film holes */}
            {Array(8)
              .fill(0)
              .map((_, i) => {
                const angle = (i / 8) * Math.PI * 2
                return (
                  <mesh key={i} position={[Math.cos(angle) * 3, Math.sin(angle) * 3, -15]}>
                    <cylinderGeometry args={[0.2, 0.2, 0.6, 16]} />
                    <meshStandardMaterial color="#000000" />
                  </mesh>
                )
              })}
          </group>
        )

      // Default/general category
      default:
        return (
          <group ref={groupRef}>
            {/* Simple floating spheres */}
            <mesh position={[5, 2, -10]}>
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial color={themeColors.secondary} />
            </mesh>
            <mesh position={[-5, -3, -8]}>
              <sphereGeometry args={[0.8, 16, 16]} />
              <meshStandardMaterial color={themeColors.accent} />
            </mesh>
            <mesh position={[8, -5, -12]}>
              <sphereGeometry args={[1.2, 16, 16]} />
              <meshStandardMaterial color={themeColors.secondary} />
            </mesh>
          </group>
        )
    }
  }

  useFrame(({ clock }) => {
    if (galaxyRef.current) {
      // Basic rotation
      galaxyRef.current.rotation.y = clock.getElapsedTime() * 0.05
    }
  })

  return (
    <>
      {/* Gradient background based on category theme */}
      <color attach="background" args={[themeColors.primary]} />

      {/* Stars with animation */}
      <Stars />

      {/* Rotating galaxy group */}
      <group ref={galaxyRef}>
        <CategoryElements />
      </group>

      {/* Basic lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#ffffff" />

      {/* Confetti effect when triggered */}
      <Confetti active={showConfetti} />
    </>
  )
}
