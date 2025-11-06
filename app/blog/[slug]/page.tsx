import BlogPostClient from "./BlogPostClient"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return <BlogPostClient slug={params.slug} />
}

export async function generateStaticParams() {
  return [
    { slug: "rise-of-micro-influencers-canada" },
    { slug: "2025-influencer-marketing-trends" },
    { slug: "roi-measurement-best-practices" },
    { slug: "building-authentic-partnerships" },
    { slug: "platform-update-january-2025" },
  ]
}
