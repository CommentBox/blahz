import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import ClientWrapper from "./components/ClientWrapper"

export const metadata = {
  title: "AI Reverse Image Search | Find Similar Images Instantly | Reverse.Pictures",
  description: "Upload an image to find similar pictures across the web. Fast, free, and accurate AI-powered reverse image search for all devices.",
}

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <meta name="theme-color" content="#6B46C1" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="canonical" href="https://reverse.pictures" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        <meta
          name="keywords"
          content="reverse image search, AI image search, similar images, visual search engine, image recognition, Reverse.Pictures"
        />
      </head>
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 text-white`}>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  )
}



import './globals.css'
