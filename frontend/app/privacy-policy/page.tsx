"use client"
import Link from "next/link"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { useEffect } from "react"

export default function PrivacyPolicyPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
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
          <article className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-8">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            <div className="prose prose-invert prose-purple max-w-none">
              <p>Last updated: January 29, 2025</p>

              <h2>Our Commitment to Privacy</h2>
              <p>
                At Reverse.Pictures, we are committed to protecting your privacy. This privacy policy explains our
                approach to data collection and how we ensure your information remains secure.
              </p>

              <h2>No Data Collection Policy</h2>
              <p>
                <strong>We do not collect, store, or process any user data.</strong> When you use our reverse image
                search service or browse our website, no personal information is gathered from you.
              </p>

              <h2>No Cookies Policy</h2>
              <p>Our site does not use any cookies at all. We do not implement:</p>
              <ul>
                <li>Tracking cookies</li>
                <li>Analytics cookies</li>
                <li>Third-party cookies</li>
                <li>Session cookies</li>
                <li>Preference cookies</li>
              </ul>
              <p>
                This means your browsing experience on our site is completely private, with no tracking mechanisms in
                place.
              </p>

              <h2>No Third-Party Sharing</h2>
              <p>
                We do not sell, rent, or share any user data with third parties, simply because we do not collect any
                data to share.
              </p>

              <h2>Image Search Functionality</h2>
              <p>
                When you upload an image for our reverse image search service, the image is only temporarily processed
                for the search operation and is immediately deleted afterward. We do not retain copies of your uploaded
                images.
              </p>

              <h2>No Analytics</h2>
              <p>We do not use Google Analytics or any other analytics platforms to track user behavior on our site.</p>

              <h2>Security</h2>
              <p>
                Even though we don't collect user data, we still implement standard security measures to protect our
                website from unauthorized access or cyber attacks.
              </p>

              <h2>Children's Privacy</h2>
              <p>
                Our service is not directed to individuals under the age of 13, and we do not knowingly collect or
                solicit personal information from children.
              </p>

              <h2>Changes to This Privacy Policy</h2>
              <p>
                If we ever update this policy, we will post the changes on this page with a new "Last updated" date. We
                encourage you to review this Privacy Policy periodically to stay informed about our privacy practices.
              </p>

              <h2>Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at privacy@reverse.pictures.</p>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  )
}

