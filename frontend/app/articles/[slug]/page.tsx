import Link from "next/link"
import { notFound } from "next/navigation"
import posts from "../../data/posts"

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = posts[params.slug as keyof typeof posts]

  if (!post) {
    return {
      title: "Post Not Found | Reverse.Pictures",
    }
  }

  return {
    title: `${post.title} | Reverse.Pictures`,
    description: post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.content.substring(0, 160),
      type: "article",
      url: `https://reverse.pictures/${params.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.content.substring(0, 160),
    },
  }
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const post = posts[params.slug as keyof typeof posts]

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800">
      <div className="max-w-4xl mx-auto px-4 py-16">
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
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-purple-300">{post.category}</span>
              <span className="text-purple-400">•</span>
              <time className="text-sm text-purple-300">
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            </div>
            <h1 className="text-3xl font-bold text-white">{post.title}</h1>
          </div>
          <div
            className="prose prose-invert prose-purple max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
    </div>
  )
}

