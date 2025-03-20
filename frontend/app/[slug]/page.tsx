import { notFound } from "next/navigation";
import ArticleLayout from "../../components/ArticleLayout";
import posts from "../data/posts";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const awaitedParams = await params;
  const post = posts[awaitedParams.slug as keyof typeof posts];

  if (!post) {
    return {
      title: "Post Not Found | Reverse.Pictures",
    };
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
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const awaitedParams = await params;
  const slug = (awaitedParams.slug) as keyof typeof posts;
  const post = posts[slug];

  if (!post) {
    notFound();
  }

  return (
    <ArticleLayout title={post.title} date={post.date} category={post.category}>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </ArticleLayout>
  );
}
