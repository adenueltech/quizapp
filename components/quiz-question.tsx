"use client"

import { motion } from "framer-motion"
import { CheckCircle, XCircle } from "lucide-react"

interface QuizQuestionProps {
  question: string
  options: string[]
  selectedAnswer: string
  correctAnswer: string
  answerSubmitted: boolean
  onSelectAnswer: (answer: string) => void
}

export function QuizQuestion({
  question,
  options,
  selectedAnswer,
  correctAnswer,
  answerSubmitted,
  onSelectAnswer,
}: QuizQuestionProps) {
  return (
    <div>
      <motion.h2
        className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600"
        animate={{
          scale: answerSubmitted ? [1, 1.03, 1] : 1,
        }}
        transition={{ duration: 0.5 }}
      >
        {question}
      </motion.h2>
      <div className="grid gap-3">
        {options.map((option, index) => {
          const isSelected = selectedAnswer === option
          const isCorrect = option === correctAnswer
          const isWrong = answerSubmitted && isSelected && !isCorrect

          return (
            <motion.div
              key={index}
              whileHover={!answerSubmitted ? { scale: 1.02 } : {}}
              whileTap={!answerSubmitted ? { scale: 0.98 } : {}}
              animate={
                answerSubmitted
                  ? isCorrect
                    ? {
                        scale: [1, 1.05, 1],
                        boxShadow: ["0 0 0 rgba(0,0,0,0)", "0 0 20px rgba(72, 187, 120, 0.7)", "0 0 0 rgba(0,0,0,0)"],
                      }
                    : isWrong
                      ? {
                          x: [0, -10, 10, -10, 0],
                          boxShadow: [
                            "0 0 0 rgba(0,0,0,0)",
                            "0 0 20px rgba(245, 101, 101, 0.7)",
                            "0 0 0 rgba(0,0,0,0)",
                          ],
                        }
                      : {}
                  : {}
              }
              transition={{
                duration: 0.5,
                boxShadow: {
                  repeat: answerSubmitted && (isCorrect || isWrong) ? Number.POSITIVE_INFINITY : 0,
                  repeatType: "reverse",
                  duration: 1.5,
                },
              }}
              onClick={() => onSelectAnswer(option)}
              className={`
                relative p-4 rounded-xl cursor-pointer border-2 transition-all
                ${isSelected ? "border-purple-500 dark:border-purple-400" : "border-gray-200 dark:border-gray-700"}
                ${answerSubmitted && isCorrect ? "bg-green-100 dark:bg-green-900/30 border-green-500" : ""}
                ${isWrong ? "bg-red-100 dark:bg-red-900/30 border-red-500" : ""}
                ${!answerSubmitted ? "hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-lg" : ""}
                ${answerSubmitted ? "cursor-default" : ""}
              `}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg">{option}</span>
                {answerSubmitted && isCorrect && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <CheckCircle className="text-green-600 dark:text-green-400 ml-2 h-6 w-6" />
                  </motion.div>
                )}
                {isWrong && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <XCircle className="text-red-600 dark:text-red-400 ml-2 h-6 w-6" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
