"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, ArrowLeft, Trash2 } from "lucide-react"
import { quizCategories } from "@/data/quiz-data"

interface LeaderboardProps {
  onBack: () => void;
}

export function Leaderboard({ onBack }: LeaderboardProps) {
  interface Score {
    id: string;
    score: number;
    maxScore: number;
    category: string;
    difficulty: string;
    date: string;
  }

  const [scores, setScores] = useState<Score[]>([])
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterDifficulty, setFilterDifficulty] = useState("all")
  const [activeTab, setActiveTab] = useState("highscores")

  // Load scores from local storage
  useEffect(() => {
    try {
      const savedScores = JSON.parse(localStorage.getItem("quizScores") || "[]") || []
      setScores(savedScores)
    } catch (error) {
      console.error("Error loading scores:", error)
      setScores([])
    }
  }, [])

  // Filter scores based on selected category and difficulty
  const filteredScores = scores.filter((score) => {
    const categoryMatch = filterCategory === "all" || score.category === filterCategory
    const difficultyMatch = filterDifficulty === "all" || score.difficulty === filterDifficulty
    return categoryMatch && difficultyMatch
  })

  // Sort scores for high scores tab
  const highScores = [...filteredScores].sort((a, b) => b.score - a.score).slice(0, 10)

  // Sort scores for recent scores tab
  const recentScores = [...filteredScores].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10)

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Calculate percentage score
  const calculatePercentage = (score: number, maxScore: number): number => {
    return Math.round((score / maxScore) * 100)
  }

  // Clear all scores
  const clearScores = () => {
    if (window.confirm("Are you sure you want to clear all scores? This cannot be undone.")) {
      localStorage.removeItem("quizScores")
      setScores([])
    }
  }

  return (
    <Card className="p-6 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-2 border-purple-300 dark:border-purple-700 rounded-2xl shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Quiz
        </Button>
        <h2 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
          Leaderboard
        </h2>
        <Button variant="ghost" onClick={clearScores} className="p-2 text-red-500 hover:text-red-700">
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex gap-2 mb-4">
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="bg-white/80 dark:bg-gray-900/80 border-purple-300 dark:border-purple-700">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.keys(quizCategories).map((cat) => (
              <SelectItem key={cat} value={cat}>
                {quizCategories[cat as keyof typeof quizCategories].name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
          <SelectTrigger className="bg-white/80 dark:bg-gray-900/80 border-purple-300 dark:border-purple-700">
            <SelectValue placeholder="Filter by difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="highscores">High Scores</TabsTrigger>
          <TabsTrigger value="recent">Recent Scores</TabsTrigger>
        </TabsList>

        <TabsContent value="highscores">
          {highScores.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-200 dark:border-purple-800">
                    <th className="px-4 py-2 text-left">Rank</th>
                    <th className="px-4 py-2 text-left">Score</th>
                    <th className="px-4 py-2 text-left">Category</th>
                    <th className="px-4 py-2 text-left">Difficulty</th>
                    <th className="px-4 py-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {highScores.map((score, index) => (
                    <tr key={`high-${score.id}-${index}`} className="border-b border-purple-100 dark:border-purple-900">
                      <td className="px-4 py-2 flex items-center">
                        {index === 0 && <Trophy className="h-5 w-5 text-yellow-500 mr-1" />}
                        {index === 1 && <Trophy className="h-5 w-5 text-gray-400 mr-1" />}
                        {index === 2 && <Trophy className="h-5 w-5 text-amber-700 mr-1" />}
                        {index + 1}
                      </td>
                      <td className="px-4 py-2">
                        <div className="font-bold">{score.score}</div>
                        <div className="text-xs text-gray-500">{calculatePercentage(score.score, score.maxScore)}%</div>
                      </td>
                      <td className="px-4 py-2">{quizCategories[score.category as keyof typeof quizCategories]?.name || score.category}</td>
                      <td className="px-4 py-2 capitalize">{score.difficulty}</td>
                      <td className="px-4 py-2 text-sm">{formatDate(score.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No scores yet. Complete a quiz to see your scores here!
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent">
          {recentScores.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-200 dark:border-purple-800">
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Score</th>
                    <th className="px-4 py-2 text-left">Category</th>
                    <th className="px-4 py-2 text-left">Difficulty</th>
                  </tr>
                </thead>
                <tbody>
                  {recentScores.map((score, index) => (
                    <tr key={`recent-${score.id}-${index}`} className="border-b border-purple-100 dark:border-purple-900">
                      <td className="px-4 py-2 text-sm">{formatDate(score.date)}</td>
                      <td className="px-4 py-2">
                        <div className="font-bold">{score.score}</div>
                        <div className="text-xs text-gray-500">{calculatePercentage(score.score, score.maxScore)}%</div>
                      </td>
                      <td className="px-4 py-2">{quizCategories[score.category as keyof typeof quizCategories]?.name || score.category}</td>
                      <td className="px-4 py-2 capitalize">{score.difficulty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No scores yet. Complete a quiz to see your scores here!
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  )
}