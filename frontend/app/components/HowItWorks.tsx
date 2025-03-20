"use client"

import { motion } from "framer-motion"

export default function HowItWorks() {
  const steps = [
    {
      title: "Upload Your Image",
      description:
        "Simply drag and drop your image into the upload area or click to select a file from your device. We support common image formats like JPG, PNG, and GIF.",
    },
    {
      title: "AI Analysis",
      description:
        "Our advanced AI algorithms analyze your image, extracting key features and patterns to find visually similar images.",
    },
    {
      title: "View Results",
      description:
        "Browse through a curated list of visually similar images from multiple sources across the web, complete with similarity scores and source links.",
    },
  ]

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-white bg-opacity-10 p-6 rounded-lg"
            >
              <h3 className="text-xl font-semibold mb-4 text-purple-300">{step.title}</h3>
              <p>{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

