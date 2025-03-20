"use client"

import { useEffect, useState } from "react"
import type React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface ArticleLayoutProps {
  title: string
  date: string
  category: string
  children: React.ReactNode
}

export default function ArticleLayout({ title, date, category, children }: ArticleLayoutProps) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setIsLoading(false)
    window.scrollTo(0, 0)
  }, [])

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const savedScrollPosition = sessionStorage.getItem("scrollPosition")
    router.back()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link
          href="/"
          className="text-purple-200 hover:text-white mb-8 inline-flex items-center"
          onClick={handleBackClick}
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-200"></div>
          </div>
        ) : (
          <article className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-8">
            <h1 className="text-3xl font-bold text-white mb-4">{title}</h1>
            <div className="mb-4 text-purple-200">
              <span>{date}</span>
              <span className="mx-2">•</span>
              <span>{category}</span>
            </div>
            <div className="prose prose-invert prose-purple max-w-none">{children}</div>
          </article>
        )}
      </div>
    </div>
  )
}

