"use client"

import { motion } from "framer-motion"
import { Clock } from "lucide-react"

interface TimerProps {
  timeRemaining: number
  totalTime: number
  isWarning?: boolean
  isDanger?: boolean
}

export function Timer({ timeRemaining, totalTime, isWarning = false, isDanger = false }: TimerProps) {
  // Calculate percentage for the circular progress
  const percentage = (timeRemaining / totalTime) * 100

  // Determine color based on time remaining
  const getColor = () => {
    if (isDanger) return "text-red-500 dark:text-red-400"
    if (isWarning) return "text-yellow-500 dark:text-yellow-400"
    return "text-green-500 dark:text-green-400"
  }

  return (
    <div className="flex items-center">
      <div className="relative w-8 h-8 mr-2">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            className="text-gray-200 dark:text-gray-700"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="40"
            cx="50"
            cy="50"
          />
          {/* Progress circle */}
          <motion.circle
            className={getColor()}
            strokeWidth="8"
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="40"
            cx="50"
            cy="50"
            initial={{ strokeDashoffset: 0 }}
            animate={{
              strokeDashoffset: 251.2 - (251.2 * percentage) / 100,
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            strokeDasharray="251.2"
            transform="rotate(-90 50 50)"
          />
        </svg>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={isDanger ? { scale: [1, 1.1, 1] } : {}}
          transition={{ repeat: isDanger ? Number.POSITIVE_INFINITY : 0, duration: 0.5 }}
        >
          <Clock className={`h-4 w-4 ${getColor()}`} />
        </motion.div>
      </div>
      <motion.span
        className={`font-bold ${getColor()}`}
        animate={isDanger ? { scale: [1, 1.1, 1] } : {}}
        transition={{ repeat: isDanger ? Number.POSITIVE_INFINITY : 0, duration: 0.5 }}
      >
        {timeRemaining}s
      </motion.span>
    </div>
  )
}
