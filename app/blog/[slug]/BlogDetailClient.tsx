'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, User, ArrowLeft, Clock, Eye, Heart, Tag, Loader2, Share2, ImageIcon, Sparkles, CheckCircle } from 'lucide-react'
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
  source?: string
}

interface BlogDetailClientProps {
  post: BlogPost
  relatedPosts: BlogPost[]
}

// ✅ Default image if no featured image
const defaultImage = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80'

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

  // ✅ Parse content with proper heading detection
  const parseContent = (content: string): string => {
    if (!content) return ''
    
    // Convert markdown-style headings to HTML
    let parsed = content
      // Convert ## Heading to <h2>Heading</h2>
      .replace(/^##\s+(.+)$/gm, (match, heading) => {
        return `\n\n<h2>${heading}</h2>\n\n`
      })
      // Convert ### Heading to <h3>Heading</h3>
      .replace(/^###\s+(.+)$/gm, (match, heading) => {
        return `\n\n<h3>${heading}</h3>\n\n`
      })
      // Convert #### Heading to <h4>Heading</h4>
      .replace(/^####\s+(.+)$/gm, (match, heading) => {
        return `\n\n<h4>${heading}</h4>\n\n`
      })
      // Convert **bold** to <strong>bold</strong>
      .replace(/\*\*(.+?)\*\*/g, (match, text) => {
        return `<strong>${text}</strong>`
      })
      // Convert *italic* to <em>italic</em>
      .replace(/\*(.+?)\*/g, (match, text) => {
        return `<em>${text}</em>`
      })
      // Convert bullet points
      .replace(/^\*\s+(.+)$/gm, (match, item) => {
        return `<li>${item}</li>`
      })
      // Wrap consecutive bullet points in <ul>
      .replace(/(<li>.*<\/li>\n?)+/g, (match) => {
        return `<ul>${match}</ul>`
      })
      // Convert newlines to <br /> for paragraphs
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br />')
    
    // Wrap in paragraphs if not already wrapped
    if (!parsed.startsWith('<')) {
      parsed = `<p>${parsed}</p>`
    }
    
    return parsed
  }

  // ✅ Get reading time
  const getReadingTime = (content: string): number => {
    if (!content) return 1
    const words = content.replace(/[#*]/g, '').split(/\s+/).length
    return Math.max(1, Math.ceil(words / 200))
  }

  // ✅ Check if content is AI generated
  const isAIGenerated = post.source === '' || post.author === ''

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

        {/* ✅ Featured Image with fallback */}
        <div className="w-full h-[400px] rounded-2xl overflow-hidden mb-8 relative">
          <img
            src={post.featuredImage || defaultImage}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {!post.featuredImage && (
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-blue-600/30 flex items-center justify-center">
              <div className="text-white text-center">
                <ImageIcon className="w-16 h-16 mx-auto mb-2 opacity-50" />
                <p className="text-sm opacity-50">No featured image</p>
              </div>
            </div>
          )}
        </div>

        {/* ✅ Category Tag + AI Badge */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Link
            href={`/blog?category=${encodeURIComponent(post.category)}`}
            className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 transition-colors"
          >
            {post.category}
          </Link>
          
          {/* ✅ AI Content Generator Badge */}
          {isAIGenerated && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium rounded-full">
              <Sparkles className="w-3 h-3" />
              AI Generated
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          {post.title}
        </h1>

        {/* ✅ Metadata with AI Content Generator label */}
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
            {getReadingTime(post.content)} min read
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
          
          {/* ✅ AI Content Generator label in metadata */}
          {isAIGenerated && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs rounded-full">
              <Sparkles className="w-3 h-3" />
              {/* AI Content Generator */}
            </span>
          )}
        </div>

        {/* ✅ Content with proper heading detection */}
        <div 
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: parseContent(post.content) }}
        />

        {/* ✅ SEO Keywords Section - Displayed at the BOTTOM of content */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                SEO Keywords
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({post.tags.length} keywords)
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-600 hover:text-white transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
            {/* <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              💡 These keywords help search engines understand your content
            </p> */}
          </div>
        )}

        {/* ✅ AI Content Generator Footer */}
        {isAIGenerated && (
          <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              {/* <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Generated by AI Content Writer
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  This content was created using advanced AI technology
                </p>
              </div> */}
              <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
            </div>
          </div>
        )}

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
                  <div className="h-40 overflow-hidden relative">
                    <img
                      src={relatedPost.featuredImage || defaultImage}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    {!relatedPost.featuredImage && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-white/50" />
                      </div>
                    )}
                  </div>
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