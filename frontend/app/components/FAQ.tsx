"use client"

import { useState } from "react"

const faqs = [
  {
    question: "What file types are supported?",
    answer: "We support common image formats including JPG, PNG, GIF, and WebP. Maximum file size is 10MB.",
  },
  {
    question: "How accurate are the results?",
    answer:
      "Our AI-powered search combines multiple search engines to provide the most accurate results possible. Results are ranked by similarity score.",
  },
  {
    question: "Is my data kept private?",
    answer:
      "Yes! We don't store your uploaded images. They are only temporarily processed for search and then immediately deleted.",
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div key={index} className="bg-white bg-opacity-10 rounded-lg overflow-hidden">
          <button
            className="w-full p-6 text-left focus:outline-none"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">{faq.question}</h3>
              <svg
                className={`w-6 h-6 transform transition-transform ${openIndex === index ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          {openIndex === index && (
            <div className="p-6 pt-0">
              <p>{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

