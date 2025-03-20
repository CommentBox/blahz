"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import posts from "../data/posts"

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const post = params?.slug ? posts[params.slug as keyof typeof posts] : null

  useEffect(() => {
    setIsLoading(false)
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const handleStart = () => setIsTransitioning(true)
    const handleComplete = () => setIsTransitioning(false)

    window.addEventListener("beforeunload", handleStart)
    window.addEventListener("load", handleComplete)

    return () => {
      window.removeEventListener("beforeunload", handleStart)
      window.removeEventListener("load", handleComplete)
    }
  }, [])

  if (!post && params?.slug) {
    notFound()
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 transition-opacity duration-300 ${
        isTransitioning ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link href="/" className="text-purple-200 hover:text-white mb-8 inline-flex items-center">
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
            <h1 className="text-3xl font-bold text-white mb-4">Articles</h1>
            <div className="prose prose-invert prose-purple max-w-none">
              <p>Browse our collection of articles about reverse image search and visual search technology.</p>
              <ul>
                {Object.values(posts).map((post) => (
                  <li key={post.slug}>
                    <Link href={`/${post.slug}`}>{post.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        )}
      </div>
    </div>
  )
}

