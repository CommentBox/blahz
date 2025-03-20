"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import FavoritesModal from "@/app/components/FavoritesModal";
import Link from "next/link"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchesLeft, setSearchesLeft] = useState(3);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  useEffect(() => {
    const storedSearches = localStorage.getItem("searchesLeft");
    if (storedSearches) {
      setSearchesLeft(Number.parseInt(storedSearches, 10));
    }
  }, []);

  const resetSearches = () => {
    setSearchesLeft(3);
    localStorage.setItem("searchesLeft", "3");
  };

  useEffect(() => {
    localStorage.setItem("searchesLeft", searchesLeft.toString());
  }, [searchesLeft]);

  const handleSearchButtonClick = async () => {
    if (!searchQuery) return;

    const formData = new FormData();
    formData.append("query", searchQuery);

    try {
      const response = await fetch("/app/api/search", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.error("Search request failed:", response.statusText);
        return;
      }

      const searchResults = await response.json();
      console.log("Search Results:", searchResults);
      alert(JSON.stringify(searchResults, null, 2)); // Display results in an alert for testing

    } catch (error) {
      console.error("Search error:", error); // Log the full error
      let errorMessage = "Search failed! See console for details.";
      if (error instanceof Response) {
        errorMessage = `Search failed! Status: ${error.status} ${error.statusText}. See console for details.`;
        const errorData = await error.json();
        console.error("Error response data:", errorData); // Log error response data
      }
      alert(errorMessage);
    }
  };

  const handleSearchInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearchButtonClick();
    }
  };


  // Function to handle FAQ link click
  const handleFAQClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsOpen(false);

    const faqElement = document.getElementById("faq");

    if (faqElement) {
      faqElement.scrollIntoView({ behavior: "smooth" });
      window.dispatchEvent(new CustomEvent("toggleFAQ"));
      window.history.pushState(null, "", "/#faq");
    }
  };

  // Function to handle How It Works link click
  const handleHowItWorksClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsOpen(false);

    const howItWorksElement = document.getElementById("how-it-works");

    if (howItWorksElement) {
      howItWorksElement.scrollIntoView({ behavior: "smooth" });
      window.dispatchEvent(new CustomEvent("toggleHowItWorks"));
      window.history.pushState(null, "", "/#how-it-works");
    }
  };

  return (
    <header className="bg-purple-900 bg-opacity-50 backdrop-blur-lg fixed top-0 left-0 right-0 z-50 px-4 py-3 sm:py-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <span className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Reverse Pictures
          </span>
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-pink-500 fill-current">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </Link>
        <div className="flex items-center gap-4 sm:gap-2">
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-2 bg-purple-800 bg-opacity-50 rounded-full px-3 py-1.5 text-sm font-medium">
              <span className="text-purple-300">{searchesLeft}</span>
              <span className="text-purple-200">{searchesLeft === 1 ? "search" : "searches"} left</span>
            </div>
            <button
              onClick={resetSearches}
              className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded-full transition-colors"
              aria-label="Reset searches"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <Link
              href="/#how-it-works"
              className="text-sm hover:text-purple-200 transition-colors"
              onClick={handleHowItWorksClick}
            >
              How It Works
            </Link>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="sm:hidden focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-md p-1 ml-2"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="sm:hidden bg-purple-900 bg-opacity-50 backdrop-blur-lg overflow-hidden"
        >
          <div className="container mx-auto py-2 flex flex-col space-y-2">
            <Link
              href="/#how-it-works"
              className="text-sm hover:text-purple-200 transition-colors py-2"
              onClick={handleHowItWorksClick}
            >
              How It Works
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
}
