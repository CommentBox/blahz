"use client"

import { useState, useEffect, useRef } from "react"
import { getAllPosts } from "./data/posts"
import Header from "./components/Header"
import Hero from "./components/Hero"
import Footer from "./components/Footer"
import FAQ from "./components/FAQ"
import HowItWorks from "./components/HowItWorks"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

export default function Home() {
  const [visiblePosts, setVisiblePosts] = useState(6)
  const [showFAQ, setShowFAQ] = useState(false)
  const [showHowItWorks, setShowHowItWorks] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const faqRef = useRef<HTMLDivElement>(null)
  const howItWorksRef = useRef<HTMLDivElement>(null)

  // Check if we should show sections based on URL hash
  useEffect(() => {
    // Check if the URL has #faq or #how-it-works
    if (window.location.hash === "#faq") {
      setShowFAQ(true)
      // Scroll to FAQ section after a short delay to ensure it's rendered
      setTimeout(() => {
        faqRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    } else if (window.location.hash === "#how-it-works") {
      setShowHowItWorks(true)
      // Scroll to How It Works section after a short delay to ensure it's rendered
      setTimeout(() => {
        howItWorksRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    }

    // Listen for hash changes
    const handleHashChange = () => {
      if (window.location.hash === "#faq") {
        setShowFAQ(true)
        setTimeout(() => {
          faqRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 100)
      } else if (window.location.hash === "#how-it-works") {
        setShowHowItWorks(true)
        setTimeout(() => {
          howItWorksRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 100)
      }
    }

    // Listen for custom events to toggle sections
    const handleToggleFAQ = () => {
      setShowFAQ((prevState) => !prevState)
    }

    const handleToggleHowItWorks = () => {
      setShowHowItWorks((prevState) => !prevState)
    }

    window.addEventListener("hashchange", handleHashChange)
    window.addEventListener("toggleFAQ", handleToggleFAQ)
    window.addEventListener("toggleHowItWorks", handleToggleHowItWorks)

    return () => {
      window.removeEventListener("hashchange", handleHashChange)
      window.removeEventListener("toggleFAQ", handleToggleFAQ)
      window.removeEventListener("toggleHowItWorks", handleToggleHowItWorks)
    }
  }, [])

  // Save scroll position before navigation
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem("scrollPosition", window.scrollY.toString())
      sessionStorage.setItem("visiblePosts", visiblePosts.toString())
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [visiblePosts])

  // Restore scroll position and visible posts on mount
  useEffect(() => {
    const savedVisiblePosts = sessionStorage.getItem("visiblePosts")
    if (savedVisiblePosts) {
      setVisiblePosts(Number.parseInt(savedVisiblePosts))
    }

    // Use requestAnimationFrame to ensure content is rendered
    requestAnimationFrame(() => {
      const savedScrollPosition = sessionStorage.getItem("scrollPosition")
      if (savedScrollPosition) {
        window.scrollTo(0, Number.parseInt(savedScrollPosition))
      }
    })
  }, [])

  // Handle link clicks to save scroll position
  const handleLinkClick = () => {
    sessionStorage.setItem("scrollPosition", window.scrollY.toString())
    sessionStorage.setItem("visiblePosts", visiblePosts.toString())
  }

  const allPosts = getAllPosts()
    .slice(0, visiblePosts)
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      date: post.date,
      excerpt: post.content.replace(/<[^>]*>/g, "").substring(0, 160) + "...",
    }))

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <Hero />

        {/* How It Works Section */}
        <section id="how-it-works" ref={howItWorksRef} className="mt-16 scroll-mt-24">
          {showHowItWorks && (
            <>
              <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-8 mb-16">
                <HowItWorks />
              </div>
            </>
          )}
        </section>

        {/* FAQ Section */}
        <section id="faq" ref={faqRef} className="mt-16 scroll-mt-24">
          {showFAQ && (
            <>
              <h2 className="text-3xl font-bold mb-8 text-center">FAQ</h2>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-8 mb-16">
                <FAQ />
              </div>
            </>
          )}
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Latest Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/articles/${post.slug}`}
                onClick={handleLinkClick}
                className="block bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 hover:bg-opacity-20 transition-all h-full"
              >
                <article>
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  <time className="text-sm text-purple-300 mb-3 block">{post.date}</time>
                  <p className="text-purple-200 text-sm mb-4">{post.excerpt}</p>
                  <div className="text-purple-300 text-sm">Read more →</div>
                </article>
              </Link>
            ))}
          </div>
          {visiblePosts < getAllPosts().length && (
            <div className="text-center mt-8">
              <button
                onClick={() => {
                  const newValue = visiblePosts + 6
                  sessionStorage.setItem("visiblePosts", newValue.toString())
                  setVisiblePosts(newValue)
                }}
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full transition-colors"
              >
                Show More
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
