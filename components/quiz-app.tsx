"use client"
import { useState, useEffect, useCallback } from "react"
import { Canvas } from "@react-three/fiber"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle } from "lucide-react"
import { quizCategories } from "@/data/quiz-data"

// Import missing components or add their definitions
import { QuizQuestion } from "./quiz-question"
import { AnimatedBackground } from "./animated-background"
import { QuizTitle } from "./quiz-title"
import { Timer } from "./timer"
import { Leaderboard } from "./leaderboard"

// Difficulty settings
const difficultySettings = {
  easy: { timeLimit: 45, scoreMultiplier: 1 },
  medium: { timeLimit: 30, scoreMultiplier: 2 },
  hard: { timeLimit: 15, scoreMultiplier: 3 },
}

export default function QuizApp() {
  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [answerSubmitted, setAnswerSubmitted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [correctAnswer, setCorrectAnswer] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(30)

  // UI state
  const [isLoading, setIsLoading] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)
  const [error, setError] = useState<CanvasError | null>(null)
  const [use3D, setUse3D] = useState(true)
  const [activeTab, setActiveTab] = useState("quiz")

  // Settings
  const [difficulty, setDifficulty] = useState<keyof typeof difficultySettings>("medium")
  const [category, setCategory] = useState("general")

  // Current quiz data based on selected category
  const currentQuizData = quizCategories[category as keyof typeof quizCategories]?.questions || []

  // Force loading to end after 5 seconds even if 3D fails to load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  // Update progress bar
  useEffect(() => {
    if (currentQuizData.length > 0) {
      setProgress((currentQuestion / currentQuizData.length) * 100)
    }
  }, [currentQuestion, currentQuizData.length])

  // Reset timer when moving to a new question or changing difficulty
  useEffect(() => {
    if (difficultySettings[difficulty]) {
      setTimeRemaining(difficultySettings[difficulty].timeLimit)
    }
  }, [currentQuestion, difficulty])

  // Timer countdown
  useEffect(() => {
    if (answerSubmitted || showScore) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          // Auto-submit when time runs out
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [answerSubmitted, showScore, currentQuestion])

  // Handle time up
  const handleTimeUp = useCallback(() => {
    if (answerSubmitted || !currentQuizData[currentQuestion]) return

    setAnswerSubmitted(true)

    // Check if the selected answer is correct
    const isCorrect = selectedAnswer === currentQuizData[currentQuestion].correctAnswer

    if (isCorrect) {
      const pointsEarned = difficultySettings[difficulty].scoreMultiplier * 100
      setScore(score + pointsEarned)
      setCorrectAnswer(true)
      setShowConfetti(true)

      setTimeout(() => {
        setShowConfetti(false)
      }, 2000)
    } else {
      setCorrectAnswer(false)
    }

    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestion < currentQuizData.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer("")
        setAnswerSubmitted(false)
      } else {
        setShowScore(true)
        setShowConfetti(true)
        saveScore()
      }
    }, 1500)
  }, [answerSubmitted, currentQuestion, currentQuizData, score, selectedAnswer, difficulty])

  // Handle answer selection
  interface AnswerSelectHandler {
    (answer: string): void;
  }

  const handleAnswerSelect: AnswerSelectHandler = (answer) => {
    if (!answerSubmitted) {
      setSelectedAnswer(answer);
    }
  };

  // Handle answer submission
  const handleSubmitAnswer = () => {
    if (!selectedAnswer || answerSubmitted || !currentQuizData[currentQuestion]) return

    setAnswerSubmitted(true)
    const isCorrect = selectedAnswer === currentQuizData[currentQuestion].correctAnswer

    if (isCorrect) {
      const pointsEarned = difficultySettings[difficulty].scoreMultiplier * 100
      setScore(score + pointsEarned)
      setCorrectAnswer(true)
      setShowConfetti(true)

      setTimeout(() => {
        setShowConfetti(false)
      }, 2000)
    } else {
      setCorrectAnswer(false)
    }

    setTimeout(() => {
      if (currentQuestion < currentQuizData.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer("")
        setAnswerSubmitted(false)
      } else {
        setShowScore(true)
        setShowConfetti(true)
        saveScore()
      }
    }, 1500)
  }

  // Save score to local storage
  const saveScore = () => {
    try {
      // Get existing scores
      const existingScores = JSON.parse(localStorage.getItem("quizScores") || "[]") || []

      // Add new score
      const newScore = {
        id: Date.now(),
        score,
        category,
        difficulty,
        date: new Date().toISOString(),
        maxScore: currentQuizData.length * difficultySettings[difficulty].scoreMultiplier * 100,
      }

      // Save updated scores
      localStorage.setItem("quizScores", JSON.stringify([...existingScores, newScore]))
    } catch (error) {
      console.error("Error saving score:", error)
    }
  }

  // Reset quiz
  const resetQuiz = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowScore(false)
    setSelectedAnswer("")
    setAnswerSubmitted(false)
    setProgress(0)
    setShowConfetti(false)
    if (difficultySettings[difficulty]) {
      setTimeRemaining(difficultySettings[difficulty].timeLimit)
    }
  }

  // Handle canvas error
  interface CanvasError {
    message: string;
    name: string;
    stack?: string;
  }

  const handleCanvasError = (err: CanvasError) => {
    console.error("Canvas error:", err);
    setError(err);
    setUse3D(false);
    setIsLoading(false);
  };

  // Handle difficulty change
  interface DifficultyChangeHandler {
    (value: keyof typeof difficultySettings): void;
  }

  const handleDifficultyChange: DifficultyChangeHandler = (value) => {
    setDifficulty(value)
    resetQuiz()
  }

  // Handle category change
  interface CategoryChangeHandler {
    (value: string): void;
  }

  const handleCategoryChange: CategoryChangeHandler = (value) => {
    setCategory(value)
    resetQuiz()
  }

  // Check if quiz data exists
  if (!currentQuizData || currentQuizData.length === 0) {
    return (
      <div className="w-full h-[130vh] md:h-[140vh] rounded-xl overflow-hidden shadow-2xl relative flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-indigo-900 z-0"></div>
        <Card className="p-6 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-2 border-purple-300 dark:border-purple-700 rounded-2xl shadow-xl max-w-md mx-auto z-20">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
            <p>Error: Quiz data for selected category is not available.</p>
          </div>
          <Button 
            onClick={() => setCategory("general")} 
            className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-xl"
          >
            Return to General Quiz
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full h-[130vh] md:h-[140vh] rounded-xl overflow-hidden shadow-2xl relative">
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-pink-500 border-purple-200 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading Amazing Quiz...</p>
          </div>
        </div>
      )}

      {/* Fallback background if 3D fails */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-indigo-900 z-0"></div>

      {use3D && (
        <Canvas className="absolute inset-0 z-10" onCreated={() => setIsLoading(false)} onError={(e) => handleCanvasError({ message: (e.nativeEvent as ErrorEvent).message, name: "CanvasError" })}>
          <AnimatedBackground
            progress={progress / 100}
            score={score}
            totalQuestions={currentQuizData.length}
            showConfetti={showConfetti}
            category={category}
          />
          <QuizTitle category={category} quizCategories={quizCategories} />
        </Canvas>
      )}

      {error && (
        <div className="absolute top-4 left-4 right-4 z-20 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p>3D elements couldn't load. Using simplified background.</p>
          </div>
        </div>
      )}

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <div className="w-[90vw] max-w-xl pointer-events-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="quiz">Quiz</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            </TabsList>

            <TabsContent value="quiz">
              <div className="flex gap-2 mb-4">
                <Select value={category} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="bg-white/80 dark:bg-gray-900/80 border-purple-300 dark:border-purple-700">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(quizCategories).map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {quizCategories[cat as keyof typeof quizCategories].name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={difficulty} onValueChange={handleDifficultyChange}>
                  <SelectTrigger className="bg-white/80 dark:bg-gray-900/80 border-purple-300 dark:border-purple-700">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <AnimatePresence mode="wait">
                {!showScore ? (
                  <motion.div
                    key="question"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="p-6 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-2 border-purple-300 dark:border-purple-700 rounded-2xl shadow-xl">
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Question {currentQuestion + 1} of {currentQuizData.length}
                          </p>
                          <Timer
                            timeRemaining={timeRemaining}
                            totalTime={difficultySettings[difficulty].timeLimit}
                            isWarning={timeRemaining <= difficultySettings[difficulty].timeLimit / 3}
                            isDanger={timeRemaining <= difficultySettings[difficulty].timeLimit / 6}
                          />
                        </div>
                        <Progress value={progress} className="h-2 bg-purple-200 dark:bg-purple-950" />
                      </div>

                      {currentQuizData[currentQuestion] && (
                        <QuizQuestion
                          question={currentQuizData[currentQuestion].question}
                          options={currentQuizData[currentQuestion].options}
                          selectedAnswer={selectedAnswer}
                          correctAnswer={currentQuizData[currentQuestion].correctAnswer}
                          answerSubmitted={answerSubmitted}
                          onSelectAnswer={handleAnswerSelect}
                        />
                      )}

                      <div className="mt-4 text-right text-sm text-gray-600 dark:text-gray-400">
                        <span>Points per correct answer: {difficultySettings[difficulty]?.scoreMultiplier * 100}</span>
                      </div>

                      <Button
                        onClick={handleSubmitAnswer}
                        disabled={!selectedAnswer || answerSubmitted || !currentQuizData[currentQuestion]}
                        className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                      >
                        {answerSubmitted ? "Next Question..." : "Submit Answer"}
                      </Button>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    key="score"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="p-8 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-2 border-purple-300 dark:border-purple-700 rounded-2xl shadow-xl text-center">
                      <motion.h2
                        className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600"
                        animate={{
                          scale: [1, 1.05, 1],
                          rotate: [0, 2, -2, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: "reverse",
                        }}
                      >
                        Quiz Complete!
                      </motion.h2>
                      <motion.div
                        className="text-6xl font-bold mb-6"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                          delay: 0.3,
                        }}
                      >
                        {score}
                      </motion.div>
                      <div className="mb-6 text-gray-600 dark:text-gray-400">
                        <p>Category: {quizCategories[category as keyof typeof quizCategories]?.name || category}</p>
                        <p>Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</p>
                        <p>
                          Max possible score:{" "}
                          {currentQuizData.length * difficultySettings[difficulty].scoreMultiplier * 100}
                        </p>
                      </div>
                      <motion.p
                        className="text-xl mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        {score === currentQuizData.length * difficultySettings[difficulty].scoreMultiplier * 100
                          ? "Perfect score! You're amazing! 🎉"
                          : score >= (currentQuizData.length * difficultySettings[difficulty].scoreMultiplier * 100) / 2
                            ? "Good job! 👍"
                            : "Better luck next time! 💪"}
                      </motion.p>
                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          onClick={resetQuiz}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-105"
                        >
                          Play Again
                        </Button>
                        <Button
                          onClick={() => setActiveTab("leaderboard")}
                          variant="outline"
                          className="border-purple-300 dark:border-purple-700 font-bold py-3 rounded-xl transition-all transform hover:scale-105"
                        >
                          View Leaderboard
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="leaderboard">
              <Leaderboard
                onBack={() => {
                  setActiveTab("quiz")
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}