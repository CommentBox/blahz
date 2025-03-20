"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useDropzone } from "react-dropzone"
import { useSearchSimilarImages } from "../hooks/useSearchSimilarImages"
import Link from "next/link"

export default function Hero() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles[0]) {
        setFile(acceptedFiles[0])
        const objectUrl = URL.createObjectURL(acceptedFiles[0])
        setPreviewUrl(objectUrl)
      }
    },
  })

  const { mutate, isPending, isError, error, data } = useSearchSimilarImages()

  const [searchesLeft, setSearchesLeft] = useState(3)

  useEffect(() => {
    const storedSearches = localStorage.getItem("searchesLeft")
    if (storedSearches) {
      setSearchesLeft(Number.parseInt(storedSearches, 10))
    } else {
      // Initialize with default value if not found in localStorage
      localStorage.setItem("searchesLeft", "3")
    }
  }, [])

  // Cleanup preview URL when component unmounts or when file changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const updateSearchesLeft = () => {
    const newSearchesLeft = searchesLeft - 1
    setSearchesLeft(newSearchesLeft)
    localStorage.setItem("searchesLeft", newSearchesLeft.toString())
  }

  const handleSearch = () => {
    if (file && searchesLeft > 0) {
      updateSearchesLeft()
      mutate(file)
    }
  }

  return (
    <section className="text-center mb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          AI-Powered Reverse Image Search
        </h1>
        <p className="text-lg sm:text-xl text-purple-200 mb-8">
          Upload an image to find similar pictures across the web.
          <br className="hidden sm:inline" />
          Fast, free, and accurate for all devices.
        </p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-purple-800 bg-opacity-50 p-6 rounded-lg shadow-lg mb-8"
        >
          <div
            {...getRootProps()}
            className="bg-purple-100 border-2 border-dashed border-purple-300 rounded-lg p-6 text-center cursor-pointer transition-all duration-300 hover:bg-purple-200"
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center space-y-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-purple-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-purple-700 font-semibold">Tap to upload an image</p>
              <p className="text-purple-600 text-sm">or drag and drop</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
        <button
          onClick={handleSearch}
          disabled={!file || searchesLeft === 0}
          className="w-full sm:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed text-white rounded-full transition-colors flex items-center justify-center gap-2 text-base"
          aria-label="Search for similar images"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Search
        </button>
        <button
          className="w-full sm:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors flex items-center justify-center gap-2 text-base"
          aria-label="Play instructional video"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Play Video
        </button>
      </div>

      {searchesLeft === 0 && (
        <p className="mt-4 text-red-400">You have no searches left. Please reset your searches in the header.</p>
      )}

      {file && previewUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex flex-col items-center gap-4"
        >
          <Image
            src={previewUrl || "/placeholder.svg"}
            alt="Preview of uploaded image"
            width={300}
            height={300}
            className="max-h-64 w-full max-w-sm mx-auto rounded-lg object-cover"
          />
        </motion.div>
      )}

      {isPending && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex justify-center items-center">
          <div className="w-8 h-8 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
          <p className="ml-4">Searching for similar images...</p>
        </motion.div>
      )}

      {isError && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-red-500">
          Error: {(error as Error).message}
        </motion.div>
      )}

      {data && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 results-grid" // Applied styles from static/style.css
        >
          {/* Flatten results from all engines into a single array */}
          {Object.values(data).flat().map((result: any, index: number) => {
             return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="result-card" // Applied styles from static/style.css
              >
                <div className="image-container">
                  <Image
                    src={result.thumbnail || "/placeholder.svg?height=200&width=200"} // Use thumbnail as src
                    alt={`Similar image: ${result.title}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                    onError={(e) => {
                      const container = e.currentTarget.closest('.image-container') as HTMLElement;
                      if (container) {
                        container.style.display = 'none';
                      }
                    }}
                  />
                   <i className="fas fa-heart heart-icon"></i>
                </div> 
                <div className="card-content">
                  <h3 className="result-title">{result.title || 'No Title'}</h3> {/* Use result.title */}
                  <div className="result-details">
                     {result.similarity && <p>Similarity: {result.similarity}%</p>}
                     {result.author && <p>Author: {result.author}</p>}
                     {result.engine && <p>Source: {result.engine}</p>}
                  </div>
                  <a href={result.url || '#'} target="_blank" rel="noopener noreferrer" className="view-button">
                    <i className="fas fa-external-link-alt"></i>
                    View Source
                  </a>
                </div>
              </motion.div>
            )})
          }
        </motion.div>
      )}

      <div className="mt-12 sm:mt-16 bg-purple-900 bg-opacity-50 rounded-lg p-4 sm:p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">
          Why Use Our AI Reverse Image Search?
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          {[
            "Advanced AI for accurate results",
            "Search multiple image databases",
            "Fast and efficient processing",
            "User-friendly on all devices",
            "Find inspiration and similar images",
            "Free high-accuracy matching",
            "Instant cloud-powered results",
          ].map((item, index) => (
            <li key={index} className="flex items-start bg-purple-800 bg-opacity-50 rounded-lg p-3">
              <svg
                className="w-5 h-5 text-purple-300 mr-2 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="text-sm sm:text-base">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12 sm:mt-16 bg-purple-900 bg-opacity-50 rounded-lg p-4 sm:p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">How It Works</h2>
        <ol className="space-y-3 max-w-2xl mx-auto">
          {[
            "Upload your image",
            "AI analyzes visual content",
            "Search our image database",
            "View similar images",
            "Explore detailed results",
          ].map((step, index) => (
            <li key={index} className="flex items-center bg-purple-800 bg-opacity-50 rounded-lg p-3">
              <span className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 text-sm">
                {index + 1}
              </span>
              <span className="text-sm sm:text-base">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-12 sm:mt-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Start Your Visual Search</h2>
        <p className="mb-4 sm:mb-6 text-base sm:text-lg">
          Experience AI-driven reverse image search. Upload now and discover visual possibilities!
        </p>
        <Link
          href="#"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 text-base"
        >
          Learn More
        </Link>
      </div>
    </section>
  );
}
