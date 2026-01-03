import { Calendar, User, ArrowRight, Tag, Clock } from 'lucide-react'
import Link from 'next/link'

const blogPosts = [
  {
    id: 1,
    title: 'The Future of Web Development: Next.js 14 Features',
    excerpt: 'Explore the latest features in Next.js 14 and how they revolutionize modern web development.',
    category: 'Web Development',
    author: 'Alex Johnson',
    date: '2024-01-15',
    readTime: '5 min read',
    tags: ['Next.js', 'React', 'TypeScript'],
    image: '/api/placeholder/600/400',
    featured: true
  },
  {
    id: 2,
    title: 'Building Scalable Mobile Apps with React Native',
    excerpt: 'Best practices and architecture patterns for building enterprise-grade mobile applications.',
    category: 'Mobile Development',
    author: 'Sarah Chen',
    date: '2024-01-10',
    readTime: '8 min read',
    tags: ['React Native', 'Mobile', 'Performance'],
    image: '/api/placeholder/600/400',
    featured: true
  },
  {
    id: 3,
    title: 'AI Integration in Modern Applications',
    excerpt: 'How to effectively integrate AI capabilities into your existing applications.',
    category: 'AI & Machine Learning',
    author: 'Mike Rodriguez',
    date: '2024-01-05',
    readTime: '6 min read',
    tags: ['AI', 'ChatGPT', 'Automation'],
    image: '/api/placeholder/600/400',
    featured: false
  },
  {
    id: 4,
    title: 'Performance Optimization Techniques',
    excerpt: 'Advanced techniques to optimize web application performance and Core Web Vitals.',
    category: 'Web Development',
    author: 'Emma Wilson',
    date: '2023-12-28',
    readTime: '7 min read',
    tags: ['Performance', 'SEO', 'Optimization'],
    image: '/api/placeholder/600/400',
    featured: false
  },
  {
    id: 5,
    title: 'State Management in Large Applications',
    excerpt: 'Comparing different state management solutions for complex React applications.',
    category: 'Web Development',
    author: 'David Kim',
    date: '2023-12-20',
    readTime: '9 min read',
    tags: ['State Management', 'Redux', 'Zustand'],
    image: '/api/placeholder/600/400',
    featured: false
  },
  {
    id: 6,
    title: 'Building RESTful APIs with Node.js',
    excerpt: 'Complete guide to building secure and scalable REST APIs using Node.js.',
    category: 'Backend Development',
    author: 'Lisa Wang',
    date: '2023-12-15',
    readTime: '10 min read',
    tags: ['Node.js', 'API', 'Backend'],
    image: '/api/placeholder/600/400',
    featured: false
  }
]

const categories = ['All', 'Web Development', 'Mobile Development', 'AI & Machine Learning', 'Backend Development']

export default function BlogPage() {
  return (
    <div className="section-padding py-20">
      {/* Hero */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Tech Insights & 
          <span className="gradient-text block">Tutorials</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Latest articles on web development, mobile apps, AI, and technology trends
        </p>
      </div>

      {/* Featured Posts */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 flex items-center">
          <span className="w-3 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3" />
          Featured Articles
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {blogPosts.filter(post => post.featured).map(post => (
            <div
              key={post.id}
              className="glass-effect rounded-2xl overflow-hidden hover-lift group"
            >
              <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-5xl opacity-20">
                    {post.category.includes('Web') && '🌐'}
                    {post.category.includes('Mobile') && '📱'}
                    {post.category.includes('AI') && '🤖'}
                    {post.category.includes('Backend') && '⚙️'}
                  </div>
                </div>
                
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-full">
                    Featured
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
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
                
                <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {post.excerpt}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <Link
                  href={`/blog/${post.id}`}
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Read Article
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
        <div className="flex flex-wrap gap-3">
          {categories.map(category => (
            <button
              key={category}
              className="px-5 py-2.5 rounded-lg glass-effect hover-lift font-medium"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* All Posts */}
      <div>
        <h2 className="text-2xl font-bold mb-8 flex items-center">
          <span className="w-3 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3" />
          Latest Articles
        </h2>
        
        <div className="space-y-6">
          {blogPosts.map(post => (
            <div
              key={post.id}
              className="glass-effect p-6 rounded-xl hover-lift group"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="md:w-48 flex-shrink-0">
                  <div className="h-32 md:h-24 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                    <span className="text-3xl opacity-30">
                      {post.category.includes('Web') && '🌐'}
                      {post.category.includes('Mobile') && '📱'}
                      {post.category.includes('AI') && '🤖'}
                      {post.category.includes('Backend') && '⚙️'}
                    </span>
                  </div>
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-center flex-wrap gap-4 mb-3">
                    <span className="px-3 py-1 text-sm rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                      {post.category}
                    </span>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {post.date}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{post.author}</span>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 2).map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <Link
                        href={`/blog/${post.id}`}
                        className="flex items-center text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                      >
                        Read
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="mt-20 glass-effect rounded-2xl p-8 md:p-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Subscribe to my newsletter for the latest tech insights, tutorials, and updates
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-6 py-3 rounded-lg glass-effect focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Subscribe
            </button>
          </form>
          
          <p className="text-sm text-gray-500 mt-4">
            No spam, unsubscribe at any time
          </p>
        </div>
      </div>
    </div>
  )
}