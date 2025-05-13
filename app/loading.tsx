export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-16 h-16 border-4 border-t-purple-500 border-purple-200 rounded-full animate-spin"></div>
      <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">Loading Quiz...</p>
    </div>
  )
}
