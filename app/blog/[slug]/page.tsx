import { notFound } from 'next/navigation';
import BlogDetailClient from './BlogDetailClient';
import { generateBlogPostSEO } from '../../seo.config';
import connectDB from '@/lib/db';
import BlogPost from '@/models/BlogPost';

// Helper function to create URL-friendly slugs (for fallback)
const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '-');
};

// ✅ Fetch post from database by slug
const getPostBySlug = async (slug: string) => {
  await connectDB();
  const post = await BlogPost.findOne({ slug, published: true }).lean();
  return post ? JSON.parse(JSON.stringify(post)) : null;
};

// ✅ Fetch related posts from database
const getRelatedPosts = async (category: string, currentSlug: string) => {
  await connectDB();
  const posts = await BlogPost.find({ 
    category, 
    slug: { $ne: currentSlug },
    published: true 
  })
    .sort({ publishedAt: -1 })
    .limit(3)
    .lean();
  return posts.map(post => JSON.parse(JSON.stringify(post)));
};

// ✅ Generate static paths for all blog posts
export async function generateStaticParams() {
  await connectDB();
  const posts = await BlogPost.find({ published: true }).select('slug').lean();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  // Await the params promise
  const { slug } = await params;
  
  // ✅ Fetch post from database
  const post = await getPostBySlug(slug);
  
  if (!post) {
    notFound();
  }

  // ✅ Get related posts from database
  const relatedPosts = await getRelatedPosts(post.category, post.slug);

  // Pass data to client component
  return <BlogDetailClient post={post} relatedPosts={relatedPosts} />;
}

// ✅ Generate metadata for SEO
//@ts-ignore
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const seo = generateBlogPostSEO({
    title: post.title,
    excerpt: post.excerpt,
    image: post.featuredImage || '',
    category: post.category,
    author: post.author,
    date: post.publishedAt,
    tags: post.tags || [],
  });
  
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      type: 'article',
      title: seo.title,
      description: seo.description,
      url: `https://techsolutions.dev/blog/${post.slug}`,
      images: [{
        url: post.featuredImage || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80',
        width: 1200,
        height: 630,
        alt: post.title,
      }],
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags || [],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: [post.featuredImage || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80'],
    },
    alternates: {
      canonical: `https://techsolutions.dev/blog/${post.slug}`,
    },
  };
}