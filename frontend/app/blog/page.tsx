import Link from "next/link"

const blogPosts = [
  {
    slug: "power-of-ai-in-reverse-image-search",
    title: "The Power of AI in Reverse Image Search",
    excerpt: "Discover how AI is revolutionizing reverse image search technology and its applications.",
  },
  // Add more blog posts here
]

export default function BlogIndex() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Reverse.Pictures Blog</h1>
      <div className="space-y-8">
        {blogPosts.map((post) => (
          <article key={post.slug} className="border-b pb-8">
            <h2 className="text-2xl font-semibold mb-2">
              <Link href={`/blog/${post.slug}`} className="text-purple-600 hover:text-purple-800">
                {post.title}
              </Link>
            </h2>
            <p className="text-gray-600 mb-4">{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`} className="text-purple-600 hover:text-purple-800">
              Read more &rarr;
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}

