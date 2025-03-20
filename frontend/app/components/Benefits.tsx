"use client"

import { motion } from "framer-motion"

export default function Benefits() {
  const benefits = [
    {
      title: "Find Sources",
      description:
        "Discover the original source of images, track down higher resolution versions, or find where an image has been used online.",
    },
    {
      title: "Verify Authenticity",
      description:
        "Check if an image has been modified or find similar images to verify its authenticity and original context.",
    },
    {
      title: "Research & Inspiration",
      description: "Find similar artworks, designs, or photographs for research or creative inspiration.",
    },
  ]

  return (
    <section id="benefits" className="py-16">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold mb-8 text-center"
        >
          How Can Reverse Image Lookup Benefit Its Users?
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-white bg-opacity-10 p-6 rounded-lg"
            >
              <h3 className="text-xl font-semibold mb-4">{benefit.title}</h3>
              <p>{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

