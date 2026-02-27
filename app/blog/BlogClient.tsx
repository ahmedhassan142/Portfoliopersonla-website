'use client'

import { useState, useEffect } from 'react'
import ChatWidget from '@/components/Shared/ChatWidget'
import { Calendar, User, ArrowRight, Clock, Eye, Heart, Tag, Search, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'


// Define Blog Post interface matching dental website pattern
interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  author: string
  authorRole: string
  date: string
  readTime: string
  tags: string[]
  image: string
  featured: boolean
  views: number
  likes: number
}

// Helper function to create URL-friendly slugs (same as dental website)
const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '-')
}

const blogPosts: BlogPost[] = [
  // Existing Posts with slugs added
  {
    slug: createSlug('The Future of Web Development: Next.js 14 Features'),
    title: 'The Future of Web Development: Next.js 14 Features',
    excerpt: 'Explore the latest features in Next.js 14 including server actions, partial prerendering, and improved metadata handling. Learn how these innovations are revolutionizing modern web development.',
    category: 'Web Development',
    author: 'Alex Johnson',
    authorRole: 'Senior Developer',
    date: 'Jan 15, 2024',
    readTime: '5 min read',
    tags: ['Next.js', 'React', 'TypeScript'],
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    featured: true,
    views: 1234,
    likes: 89,
  },
  {
    slug: createSlug('Building Scalable Mobile Apps with React Native'),
    title: 'Building Scalable Mobile Apps with React Native',
    excerpt: 'Best practices and architecture patterns for building enterprise-grade mobile applications. Learn about state management, navigation, and performance optimization.',
    category: 'Mobile Development',
    author: 'Sarah Chen',
    authorRole: 'Mobile Lead',
    date: 'Jan 10, 2024',
    readTime: '8 min read',
    tags: ['React Native', 'Mobile', 'Performance'],
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80',
    featured: true,
    views: 987,
    likes: 67,
  },
  {
    slug: createSlug('AI Integration in Modern Applications'),
    title: 'AI Integration in Modern Applications',
    excerpt: 'How to effectively integrate AI capabilities into your existing applications using OpenAI, LangChain, and vector databases. Real-world examples and strategies.',
    category: 'AI & Machine Learning',
    author: 'Mike Rodriguez',
    authorRole: 'AI Engineer',
    date: 'Jan 5, 2024',
    readTime: '6 min read',
    tags: ['AI', 'ChatGPT', 'Machine Learning'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    featured: false,
    views: 756,
    likes: 45,
  },
  {
    slug: createSlug('Performance Optimization Techniques'),
    title: 'Performance Optimization Techniques',
    excerpt: 'Advanced techniques to optimize web application performance and Core Web Vitals. Learn about code splitting, image optimization, and caching strategies.',
    category: 'Web Development',
    author: 'Emma Wilson',
    authorRole: 'Performance Specialist',
    date: 'Dec 28, 2023',
    readTime: '7 min read',
    tags: ['Performance', 'SEO', 'Optimization'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2015&q=80',
    featured: false,
    views: 654,
    likes: 34,
  },
  {
    slug: createSlug('State Management in Large Applications'),
    title: 'State Management in Large Applications',
    excerpt: 'Comparing different state management solutions for complex React applications. Redux Toolkit, Zustand, Jotai, and Context API use cases.',
    category: 'Web Development',
    author: 'David Kim',
    authorRole: 'Frontend Architect',
    date: 'Dec 20, 2023',
    readTime: '9 min read',
    tags: ['State Management', 'Redux', 'Zustand'],
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    featured: false,
    views: 543,
    likes: 28,
  },
  {
    slug: createSlug('Building RESTful APIs with Node.js'),
    title: 'Building RESTful APIs with Node.js',
    excerpt: 'Complete guide to building secure and scalable REST APIs using Node.js, Express, and MongoDB. Includes authentication and validation.',
    category: 'Backend Development',
    author: 'Lisa Wang',
    authorRole: 'Backend Lead',
    date: 'Dec 15, 2023',
    readTime: '10 min read',
    tags: ['Node.js', 'API', 'Backend'],
    image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80',
    featured: false,
    views: 432,
    likes: 23,
  },
  {
    slug: createSlug('Mastering TypeScript: Advanced Patterns'),
    title: 'Mastering TypeScript: Advanced Patterns',
    excerpt: 'Deep dive into advanced TypeScript patterns including generics, conditional types, and mapped types for type-safe code.',
    category: 'Web Development',
    author: 'Alex Johnson',
    authorRole: 'Senior Developer',
    date: 'Jan 18, 2024',
    readTime: '7 min read',
    tags: ['TypeScript', 'JavaScript', 'Programming'],
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-4.0.3&auto=format&fit=crop&w=2128&q=80',
    featured: true,
    views: 892,
    likes: 56,
  },
  {
    slug: createSlug('DevOps Best Practices for 2024'),
    title: 'DevOps Best Practices for 2024',
    excerpt: 'Essential DevOps practices including CI/CD pipelines, Docker containers, and Kubernetes orchestration for modern applications.',
    category: 'DevOps',
    author: 'Michael Chen',
    authorRole: 'DevOps Engineer',
    date: 'Jan 12, 2024',
    readTime: '8 min read',
    tags: ['DevOps', 'Docker', 'Kubernetes'],
    image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    featured: false,
    views: 678,
    likes: 41,
  },
  // NEW AI-FOCUSED POSTS with slugs
  {
    slug: createSlug('AI Agents: The Future of Autonomous Systems'),
    title: 'AI Agents: The Future of Autonomous Systems',
    excerpt: 'Discover how AI agents are transforming business automation. Learn about autonomous agents, multi-agent systems, and how they can handle complex tasks without human intervention.',
    category: 'AI & Machine Learning',
    author: 'Mike Rodriguez',
    authorRole: 'AI Engineer',
    date: 'Feb 10, 2024',
    readTime: '9 min read',
    tags: ['AI Agents', 'Autonomous Systems', 'Machine Learning', 'LangChain'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    featured: true,
    views: 2345,
    likes: 178,
  },
  {
    slug: createSlug('The AI Revolution: How Generative AI is Reshaping Industries'),
    title: 'The AI Revolution: How Generative AI is Reshaping Industries',
    excerpt: 'From GPT-4 to DALL-E 3 and beyond, explore how generative AI is revolutionizing content creation, software development, design, and business operations across every industry.',
    category: 'AI & Machine Learning',
    author: 'Sarah Chen',
    authorRole: 'AI Research Lead',
    date: 'Feb 5, 2024',
    readTime: '12 min read',
    tags: ['Generative AI', 'GPT-4', 'DALL-E', 'AI Revolution'],
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=1965&q=80',
    featured: true,
    views: 3456,
    likes: 267,
  },
  {
    slug: createSlug('LangChain: Building Powerful AI Workflows'),
    title: 'LangChain: Building Powerful AI Workflows',
    excerpt: 'Master LangChain for building sophisticated AI applications. Learn about chains, agents, memory, tools, and how to orchestrate multiple AI components for complex, real-world tasks.',
    category: 'AI & Machine Learning',
    author: 'Alex Johnson',
    authorRole: 'Senior Developer',
    date: 'Feb 1, 2024',
    readTime: '15 min read',
    tags: ['LangChain', 'AI Workflows', 'Agents', 'LLM'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    featured: true,
    views: 1876,
    likes: 143,
  }
]

const categories: string[] = [
  'All',
  'Web Development',
  'Mobile Development',
  'AI & Machine Learning',
  'Backend',
  'DevOps',
  'Cloud Computing',
  'Security'
]

const popularTags: string[] = [
  'Next.js', 'React', 'TypeScript', 'Node.js', 'Python',
  'AI', 'Machine Learning', 'AI Agents', 'LangChain', 'Generative AI',
  'DevOps', 'Cloud', 'Security'
]

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(blogPosts)
  const [visiblePosts, setVisiblePosts] = useState<number>(6)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  // Filter posts based on category, search, and tag
  useEffect(() => {
    let filtered = blogPosts

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter(post => 
        post.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
      )
    }

    setFilteredPosts(filtered)
  }, [selectedCategory, searchQuery, selectedTag])

  const handleTagClick = (tag: string): void => {
    if (selectedTag === tag) {
      setSelectedTag(null)
    } else {
      setSelectedTag(tag)
    }
  }

  const clearFilters = (): void => {
    setSelectedCategory('All')
    setSearchQuery('')
    setSelectedTag(null)
  }

  const loadMore = (): void => {
    setVisiblePosts(prev => prev + 6)
  }

  const featuredPosts = filteredPosts.filter(post => post.featured)
  const latestPosts = filteredPosts.filter(post => !post.featured)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative w-full h-[750px] min-h-[750px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80")',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-purple-900/80 to-blue-900/90" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center px-4">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-white text-sm font-medium">Latest Tech Insights</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-white">Tech Insights</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 block mt-2">
                & Tutorials
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-10 leading-relaxed">
              Stay ahead with the latest in web development, mobile apps, AI, 
              and technology trends. Expert insights and practical tutorials.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles by title, author, or tags..."
                  className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-xl rounded-2xl text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Popular Tags */}
            <div className="flex flex-wrap justify-center gap-3">
              {popularTags.slice(0, 8).map((tag, index) => (
                <button
                  key={index}
                  onClick={() => handleTagClick(tag)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors border ${
                    selectedTag === tag
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border-white/20'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding py-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Categories */}
          <div className="mb-12">
            <div className="flex flex-wrap gap-3">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Active Filters */}
            {(selectedCategory !== 'All' || searchQuery || selectedTag) && (
              <div className="mt-4 flex items-center justify-end">
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-600 hover:text-red-700 flex items-center"
                >
                  Clear filters
                  <X className="w-4 h-4 ml-1" />
                </button>
              </div>
            )}

            {/* Results Count */}
            <div className="mt-6 text-center">
              <span className="text-gray-500 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
                Showing {filteredPosts.length} of {blogPosts.length} articles
              </span>
            </div>
          </div>

          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <div className="mb-20">
              <h2 className="text-3xl font-bold mb-10 flex items-center">
                <span className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-4" />
                Featured Articles
              </h2>
              
              <div className="grid lg:grid-cols-2 gap-8">
                {featuredPosts.slice(0, 2).map(post => (
                  <article
                    key={post.slug}
                    className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                  >
                    {/* Image */}
                    <div className="relative h-72 overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
                          {post.category}
                        </span>
                      </div>
                      
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-purple-600 text-white text-sm font-semibold rounded-full">
                          Featured
                        </span>
                      </div>
                    </div>

                    <div className="p-8">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {post.author}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {post.date}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {post.readTime}
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>

                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {post.tags.slice(0, 3).map(tag => (
                            <button
                              key={tag}
                              onClick={() => handleTagClick(tag)}
                              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300 hover:bg-blue-600 hover:text-white transition-colors"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {post.views}
                          </span>
                          <span className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {post.likes}
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold hover:gap-2 transition-all"
                        >
                          Read Full Article
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* Latest Articles */}
          <div>
            <h2 className="text-3xl font-bold mb-10 flex items-center">
              <span className="w-1.5 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-4" />
              Latest Articles
            </h2>

            {latestPosts.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {latestPosts.slice(0, visiblePosts).map(post => (
                    <article
                      key={post.slug}
                      className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                            {post.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {post.date}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {post.readTime}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h3>

                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {post.tags.slice(0, 2).map(tag => (
                            <button
                              key={tag}
                              onClick={() => handleTagClick(tag)}
                              className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300 hover:bg-blue-600 hover:text-white transition-colors"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {post.author}
                          </span>
                          <Link
                            href={`/blog/${post.slug}`}
                            className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline inline-flex items-center"
                          >
                            Read More
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Load More */}
                {visiblePosts < latestPosts.length && (
                  <div className="text-center mt-12">
                    <button
                      onClick={loadMore}
                      className="px-8 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      Load More Articles
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4 opacity-30">🔍</div>
                <h3 className="text-2xl font-bold mb-2">No articles found</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* AI Revolution Banner */}
          <div className="mt-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              The AI Revolution is Here
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Stay ahead of the curve with our latest articles on AI agents, LLMs, and generative AI
            </p>
            <button
              onClick={() => setSelectedCategory('AI & Machine Learning')}
              className="inline-flex items-center px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Explore AI Articles
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>

          {/* Newsletter */}
          <div className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Get the latest tech insights and tutorials delivered to your inbox
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-6 py-4 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Subscribe
              </button>
            </form>
            
            <p className="text-sm text-white/60 mt-4">
              No spam, unsubscribe at any time
            </p>
          </div>

          {/* Chat Widget */}
          <div id="chat-widget">
            <ChatWidget />
          </div>
        </div>
      </section>
    </div>
  )
}