"use client"

import { useRef } from "react"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import { Text } from "@react-three/drei"

// Ensure we have the quiz categories data or provide defaults
const defaultTheme = {
  primary: "#0a0a2a",
  secondary: "#ff9500",
  accent: "#ff6d00",
}

interface QuizCategories {
  [key: string]: {
    name?: string;
    theme?: {
      primary?: string;
      secondary?: string;
      accent?: string;
    };
  };
}

export function QuizTitle({ category = "general", quizCategories }: { category?: string; quizCategories?: QuizCategories }) {
  const textRef = useRef<THREE.Group>(null)
  
  // Safely access quiz categories with fallbacks
  const categories = quizCategories || {}
  const currentCategory = categories[category] || {}
  
  // Get category name with fallback
  const categoryName = currentCategory.name || "Quiz Time!"
  
  // Get theme colors with fallback
  const themeColors = currentCategory.theme || defaultTheme

  useFrame(({ clock }) => {
    if (textRef.current) {
      // Add a gentle bobbing motion
      textRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.2
    }
  })

  return (
    <group position={[0, 5, 0]}>
      <group ref={textRef}>
        <Text 
          fontSize={2} 
          color={themeColors.secondary} 
          anchorX="center" 
          anchorY="middle" 
          position={[0, 0, 0]}
          material={undefined} // Use undefined to prevent the "expected 1 argument" error
        >
          {categoryName}
          <meshStandardMaterial 
            color={themeColors.secondary} 
            emissive={themeColors.accent} 
            emissiveIntensity={0.5} 
          />
        </Text>
      </group>
    </group>
  )
}

// Alternative implementation that doesn't rely on importing quizCategories
// This version accepts the category data directly from the parent component

export function QuizTitleAlt({ category = "general", categoryName = "Quiz Time!", themeColors = defaultTheme }) {
  const textRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (textRef.current) {
      // Add a gentle bobbing motion
      textRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.2
    }
  })

  return (
    <group position={[0, 5, 0]}>
      <group ref={textRef}>
        <Text 
          fontSize={2} 
          color={themeColors.secondary} 
          anchorX="center" 
          anchorY="middle" 
          position={[0, 0, 0]}
          material={undefined} // Prevent material conflict
        >
          {categoryName}
          <meshStandardMaterial 
            color={themeColors.secondary} 
            emissive={themeColors.accent} 
            emissiveIntensity={0.5} 
          />
        </Text>
      </group>
    </group>
  )
}