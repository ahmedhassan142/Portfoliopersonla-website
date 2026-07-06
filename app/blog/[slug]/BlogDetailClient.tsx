'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, User, ArrowLeft, Clock, Eye, Heart, Tag, Loader2, Share2 } from 'lucide-react'
import ChatWidget from '@/components/Shared/ChatWidget'

interface Author {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  twitter: string;
  github: string;
}

interface BlogPost {
  _id: string
  slug: string
  title: string
  content: string
  excerpt: string
  category: string
  author: string
  authorRole?: string
  tags: string[]
  publishedAt: string
  readingTime: number
  featured: boolean
  stats: {
    views: number
    likes: number
    shares: number
  }
  featuredImage?: string
}

interface BlogDetailClientProps {
  post: BlogPost
  relatedPosts: BlogPost[]
}

export default function BlogDetailClient({ post, relatedPosts }: BlogDetailClientProps) {
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.stats?.likes || 0)

  const handleLike = async () => {
    if (liked) return
    
    try {
      const res = await fetch(`/api/blog/${post._id}/like`, {
        method: 'POST',
      })
      
      if (res.ok) {
        setLiked(true)
        setLikesCount(prev => prev + 1)
      }
    } catch (error) {
      console.error('Failed to like post:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/blog"
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="w-full h-[400px] rounded-2xl overflow-hidden mb-8">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        {/* Category Tag */}
        <div className="mb-4">
          <Link
            href={`/blog?category=${encodeURIComponent(post.category)}`}
            className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 transition-colors"
          >
            {post.category}
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          {post.title}
        </h1>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
          <span className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            {post.author}
          </span>
          <span className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {post.readingTime || 1} min read
          </span>
          <span className="flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            {post.stats?.views || 0} views
          </span>
          <button
            onClick={handleLike}
            className={`flex items-center transition-colors ${liked ? 'text-red-500' : 'hover:text-red-500'}`}
          >
            <Heart className={`w-4 h-4 mr-1 ${liked ? 'fill-red-500' : ''}`} />
            {likesCount} likes
          </button>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-blue-600 hover:text-white transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Content */}
        <div 
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Share Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Share2 className="w-5 h-5 mr-2" />
            Share this article
          </h3>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Twitter
            </button>
            <button 
              onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
              className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
            >
              Facebook
            </button>
            <button 
              onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              LinkedIn
            </button>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost._id}
                  href={`/blog/${relatedPost.slug}`}
                  className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {relatedPost.featuredImage && (
                    <div className="h-40 overflow-hidden">
                      <img
                        src={relatedPost.featuredImage}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Chat Widget */}
      <div id="chat-widget">
        <ChatWidget />
      </div>
    </div>
  )
}