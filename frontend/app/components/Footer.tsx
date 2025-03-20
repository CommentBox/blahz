"use client"

import type React from "react"

import Link from "next/link"

export default function Footer() {
  // Function to handle FAQ link click
  const handleFAQClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault() // Always prevent default navigation

    // Get the FAQ element
    const faqElement = document.getElementById("faq")

    // If the element exists, scroll to it
    if (faqElement) {
      faqElement.scrollIntoView({ behavior: "smooth" })

      // Dispatch a custom event to toggle the FAQ
      window.dispatchEvent(new CustomEvent("toggleFAQ"))

      // Don't update the URL hash to keep it at root "/"
    } else if (window.location.pathname !== "/") {
      // If we're not on the home page, navigate to the home page
      window.location.href = "/"
    }
  }

  // Function to handle How It Works link click
  const handleHowItWorksClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault() // Always prevent default navigation

    // Get the How It Works element
    const howItWorksElement = document.getElementById("how-it-works")

    // If the element exists, scroll to it
    if (howItWorksElement) {
      howItWorksElement.scrollIntoView({ behavior: "smooth" })

      // Dispatch a custom event to toggle the How It Works section
      window.dispatchEvent(new CustomEvent("toggleHowItWorks"))

      // Don't update the URL hash to keep it at root "/"
    } else if (window.location.pathname !== "/") {
      // If we're not on the home page, navigate to the home page
      window.location.href = "/"
    }
  }

  return (
    <footer className="bg-purple-900 bg-opacity-50 py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">About AI Reverse Image Search</h3>
            <p className="text-purple-200">
              Discover visually similar images using our advanced AI-powered reverse image search technology.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/#how-it-works"
                  className="text-purple-200 hover:text-white transition-colors"
                  onClick={handleHowItWorksClick}
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="text-purple-200 hover:text-white transition-colors"
                  onClick={handleFAQClick}
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-purple-200 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-purple-200 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p className="text-purple-200">Questions or feedback? Contact us at support@reverse.pictures</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-purple-800 text-center text-purple-200">
          <p>&copy; {new Date().getFullYear()} Reverse Pictures. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
