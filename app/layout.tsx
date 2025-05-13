import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nuelquiz',
  description: `🚀 3D Quiz App with Next.js & Tailwind CSS

Experience quizzes like never before! This sleek app features stunning 3D animations, a real-time timer, and a live leaderboard — all built with Next.js and Tailwind CSS. Fast, responsive, and insanely interactive. Learn, compete, and have fun!`,
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
