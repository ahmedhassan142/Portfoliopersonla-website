'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Calendar, Clock, User, Tag, ArrowRight, ChevronRight, 
  ChevronLeft, Eye, ThumbsUp, Share2, Bookmark, 
  Facebook, Twitter, Linkedin, Mail, Sparkles,
  AlertCircle, Phone, MessageCircle, X
} from 'lucide-react';
import ChatWidget from '@/components/Shared/ChatWidget';

// Types
interface Author {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  twitter: string;
  github: string;
}

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: Author;
  date: string;
  readTime: string;
  tags: string[];
  image: string;
  views: number;
  likes: number;
}

interface BlogDetailClientProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export default function BlogDetailClient({ post, relatedPosts }: BlogDetailClientProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post.title;
    
    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`
    };
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank');
    }
    setShowShareMenu(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      
      {/* ========== HERO SECTION WITH BREADCRUMB ========== */}
      <section className="relative h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-blue-900/80 to-purple-900/90" />
        </div>
        
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="text-white">
            <div className="flex items-center text-sm mb-4">
              <Link href="/" className="hover:text-blue-200 transition-colors">
                Home
              </Link>
              <ChevronRight className="w-4 h-4 mx-2" />
              <Link href="/blog" className="hover:text-blue-200 transition-colors">
                Blog
              </Link>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="text-blue-200">{post.category}</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 max-w-3xl">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/80">
              <span className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                {post.author.name}
              </span>
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {post.readTime}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========== MAIN CONTENT ========== */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Main Article Column */}
            <div className="lg:col-span-2">
              <article className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
                
                {/* Article Meta */}
                <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {post.author.avatar}
                    </div>
                    <div className="ml-3">
                      <p className="font-semibold text-gray-900 dark:text-white">{post.author.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{post.author.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 ml-auto">
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {post.views.toLocaleString()} views
                    </span>
                    <span className="flex items-center">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      {post.likes}
                    </span>
                  </div>
                </div>

                {/* Featured Image */}
                <div className="relative h-[400px] rounded-2xl overflow-hidden mb-8 group">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-6 left-6">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      {post.category}
                    </span>
                  </div>

                  {/* Interaction Buttons */}
                  <div className="absolute bottom-6 right-6 flex items-center space-x-2">
                    <button
                      onClick={() => setIsLiked(!isLiked)}
                      className="p-3 bg-white/20 backdrop-blur-lg rounded-full hover:bg-white/30 transition-colors"
                      aria-label="Like article"
                    >
                      <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-blue-500 text-blue-500' : 'text-white'}`} />
                    </button>
                    <button
                      onClick={() => setIsBookmarked(!isBookmarked)}
                      className="p-3 bg-white/20 backdrop-blur-lg rounded-full hover:bg-white/30 transition-colors"
                      aria-label="Bookmark article"
                    >
                      <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-blue-500 text-blue-500' : 'text-white'}`} />
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setShowShareMenu(!showShareMenu)}
                        className="p-3 bg-white/20 backdrop-blur-lg rounded-full hover:bg-white/30 transition-colors"
                        aria-label="Share article"
                      >
                        <Share2 className="w-5 h-5 text-white" />
                      </button>
                      
                      {/* Share Menu */}
                      {showShareMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                          <button
                            onClick={() => handleShare('facebook')}
                            className="w-full flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <Facebook className="w-4 h-4 mr-3 text-blue-600" />
                            Facebook
                          </button>
                          <button
                            onClick={() => handleShare('twitter')}
                            className="w-full flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <Twitter className="w-4 h-4 mr-3 text-blue-400" />
                            Twitter
                          </button>
                          <button
                            onClick={() => handleShare('linkedin')}
                            className="w-full flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <Linkedin className="w-4 h-4 mr-3 text-blue-700" />
                            LinkedIn
                          </button>
                          <button
                            onClick={() => handleShare('email')}
                            className="w-full flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <Mail className="w-4 h-4 mr-3 text-gray-600" />
                            Email
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Article Content */}
                <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-white">
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>

                {/* Tags Section */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Tag className="w-5 h-5 mr-2 text-blue-500" />
                      Related Topics
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/blog?tag=${tag.toLowerCase()}`}
                          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-blue-600 hover:text-white transition-colors text-sm font-medium"
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Author Bio */}
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                      {post.author.avatar}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{post.author.name}</h3>
                      <p className="text-blue-600 dark:text-blue-400 text-sm mb-2">{post.author.role}</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{post.author.bio}</p>
                      <div className="flex gap-3 mt-3">
                        <a href={`https://twitter.com/${post.author.twitter}`} target="_blank" rel="noopener" className="text-gray-500 hover:text-blue-400 transition-colors">
                          <Twitter className="w-4 h-4" />
                        </a>
                        <a href={`https://github.com/${post.author.github}`} target="_blank" rel="noopener" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                          <Linkedin className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            {/* ========== SIDEBAR ========== */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Quick Contact Card */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl shadow-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Need Tech Advice?</h3>
                <p className="text-white/90 mb-6 text-sm">
                  Have questions about your project? Our team is here to help.
                </p>
                <div className="space-y-3">
                  <Link
                    href="/contact"
                    className="flex items-center p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5 mr-3" />
                    <div>
                      <p className="text-sm font-medium">Contact Us</p>
                      <p className="text-xs text-white/80">Get a free consultation</p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-blue-500" />
                    You May Also Like
                  </h3>
                  <div className="space-y-4">
                    {relatedPosts.map((related) => (
                      <Link
                        key={related.slug}
                        href={`/blog/${related.slug}`}
                        className="block group"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={related.image}
                              alt={related.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm line-clamp-2">
                              {related.title}
                            </h4>
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                              <Clock className="w-3 h-3 mr-1" />
                              {related.readTime}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========== BACK TO BLOG ========== */}
      <div className="border-t border-gray-200 dark:border-gray-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-purple-600 dark:hover:text-purple-400 font-semibold transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to All Articles
          </Link>
        </div>
      </div>

      {/* Chat Widget */}
      <ChatWidget />
    </main>
  );
}