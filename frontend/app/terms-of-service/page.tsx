"use client"
import Link from "next/link"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { useEffect } from "react"

export default function TermsOfServicePage() {
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
            <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
            <div className="prose prose-invert prose-purple max-w-none">
              <p>Last updated: January 29, 2025</p>

              <h2>Introduction</h2>
              <p>
                Welcome to Reverse.Pictures. These terms and conditions outline the rules and regulations for the use of
                our website and services.
              </p>
              <p>
                By accessing this website, we assume you accept these terms and conditions in full. Do not continue to
                use Reverse.Pictures if you do not accept all of the terms and conditions stated on this page.
              </p>

              <h2>License to Use Website</h2>
              <p>
                Unless otherwise stated, Reverse.Pictures and/or its licensors own the intellectual property rights for
                all material on Reverse.Pictures. All intellectual property rights are reserved.
              </p>
              <p>
                You may view and/or print pages from https://reverse.pictures for your own personal use subject to
                restrictions set in these terms and conditions.
              </p>

              <h2>Restrictions</h2>
              <p>You are specifically restricted from all of the following:</p>
              <ul>
                <li>Publishing any website material in any other media</li>
                <li>Selling, sublicensing and/or otherwise commercializing any website material</li>
                <li>Publicly performing and/or showing any website material</li>
                <li>Using this website in any way that is or may be damaging to this website</li>
                <li>Using this website in any way that impacts user access to this website</li>
                <li>
                  Using this website contrary to applicable laws and regulations, or in any way may cause harm to the
                  website, or to any person or business entity
                </li>
              </ul>

              <h2>Your Content</h2>
              <p>
                In these terms and conditions, "Your Content" shall mean any audio, video, text, images, or other
                material you choose to display on this website. By displaying Your Content, you grant Reverse.Pictures a
                non-exclusive, worldwide, irrevocable, royalty-free, sublicensable license to use, reproduce, adapt,
                publish, translate and distribute it in any and all media.
              </p>
              <p>
                Your Content must be your own and must not be infringing on any third party's rights. Reverse.Pictures
                reserves the right to remove any of Your Content from this website at any time without notice.
              </p>

              <h2>No Warranties</h2>
              <p>
                This website is provided "as is," with all faults, and Reverse.Pictures makes no express or implied
                representations or warranties, of any kind related to this website or the materials contained on this
                website.
              </p>

              <h2>Limitation of Liability</h2>
              <p>
                In no event shall Reverse.Pictures, nor any of its officers, directors, and employees, be held liable
                for anything arising out of or in any way connected with your use of this website, whether such
                liability is under contract, tort or otherwise.
              </p>

              <h2>Indemnification</h2>
              <p>
                You hereby indemnify to the fullest extent Reverse.Pictures from and against any and all liabilities,
                costs, demands, causes of action, damages, and expenses arising in any way related to your breach of any
                of the provisions of these terms.
              </p>

              <h2>Severability</h2>
              <p>
                If any provision of these terms is found to be invalid under any applicable law, such provisions shall
                be deleted without affecting the remaining provisions herein.
              </p>

              <h2>Variation of Terms</h2>
              <p>
                Reverse.Pictures is permitted to revise these terms at any time as it sees fit, and by using this
                website you are expected to review these terms on a regular basis.
              </p>

              <h2>Governing Law & Jurisdiction</h2>
              <p>
                These terms will be governed by and interpreted in accordance with the laws of the country/state where
                Reverse.Pictures is based, and you submit to the non-exclusive jurisdiction of the state and federal
                courts located there for the resolution of any disputes.
              </p>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  )
}

