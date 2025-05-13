"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-red-200 dark:border-red-900">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Something went wrong!</h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          We encountered an error while loading the quiz. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={reset}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Try again
          </Button>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="border-purple-300 dark:border-purple-700"
          >
            Reload page
          </Button>
        </div>
      </div>
    </div>
  )
}
