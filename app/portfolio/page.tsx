'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ExternalLink, Github, Search, Filter, Eye } from 'lucide-react'

const projects = [
  {
    id: 1,
    title: 'MAN SALON WEBSITE',
    category: 'web',
    description: 'Full-stack salon management system with booking, payments, and admin dashboard.',
    image: '/images/portfolio/man.jpg',
    tech: ['Mongodb', 'NextJs', 'Typescript','React'],
    liveUrl: 'https://mansalon-lyy2-git-main-ahmed-hassans-projects-96c42d63.vercel.app',
    githubUrl: 'https://github.com',
    featured: true
  },
  {
    id: 2,
    title: 'Health & Fitness App',
    category: 'mobile',
    description: 'Mobile application with workout tracking, nutrition plans, and AI coaching.',
    image: '/images/portfolio/gyms.jpg',
    tech: ['Mongodb', 'NextJs', 'Typescript','React'],
    liveUrl: 'https://fitnesswebsite-git-main-ahmed-hassans-projects-96c42d63.vercel.app',
    githubUrl: 'https://github.com',
    featured: true
  },
  {
    id: 3,
    title: 'RESTAURANT WEBSITE',
    category: 'web',
    description: 'Full-service restaurant platform with online ordering and table reservations.',
    image: '/images/portfolio/restaurant.jpg',
    tech: ['Mongodb', 'NextJs', 'Typescript','React'],
    liveUrl: "https://restaurant-git-main-ahmed-hassans-projects-96c42d63.vercel.app",
    githubUrl: 'https://github.com',
    featured: false
  },
  {
    id: 4,
    title: 'AI Chatbot System',
    category: 'ai',
    description: 'Intelligent customer support chatbot with natural language processing.',
    image: '/images/portfolio/Aibots.jpg',
    tech: ['OpenAI API', 'Node.js', 'React', 'Socket.io'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    featured: true
  },
  {
    id: 5,
    title: 'DENTIST WEBSITE',
    category: 'web',
    description: 'Dental clinic website with appointment booking and patient portal.',
    image: '/images/portfolio/dentist.jpg',
    tech: ['Mongodb', 'NextJs', 'Typescript','React'],
    liveUrl: "https://dentistwebsite-git-main-ahmed-hassans-projects-96c42d63.vercel.app",
    githubUrl: 'https://github.com',
    featured: false
  },
  {
    id: 6,
    title: 'REAL TIME CHAT App',
    category: 'mobile',
    description: 'Real-time messaging app with video calls and file sharing.',
    image: '/images/portfolio/Chat-app.jpg',
    tech: ['Express', 'React', 'Mongodb', 'Redis'],
    liveUrl: 'https://the-chafrontend-git-main-ahmed-hassans-projects-96c42d63.vercel.app',
    githubUrl: 'https://github.com',
    featured: false
  }
]

const categories = ['all', 'web', 'mobile', 'ai']

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})

  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.tech.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const handleImageError = (projectId: number) => {
    setImageErrors(prev => ({ ...prev, [projectId]: true }))
  }

  return (
    <div className="section-padding py-20">
      {/* Hero */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Featured
          <span className="gradient-text block">Projects</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Showcasing innovative solutions that have helped businesses succeed
        </p>
      </div>

      {/* Filters & Search */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full capitalize transition-colors ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'glass-effect hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full md:w-64 rounded-lg glass-effect focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="text-center mb-6">
          <span className="text-gray-500">
            Showing {filteredProjects.length} of {projects.length} projects
          </span>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {filteredProjects.map(project => (
          <div
            key={project.id}
            className={`glass-effect rounded-xl overflow-hidden hover-lift group ${
              project.featured ? 'md:col-span-2 lg:col-span-2' : ''
            }`}
          >
            {/* Project Image - FIXED THIS SECTION */}
            <div className="relative h-48 md:h-64 overflow-hidden">
              {/* Show image if no error, otherwise show fallback */}
              {!imageErrors[project.id] ? (
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={() => handleImageError(project.id)}
                  priority={project.featured}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                  <div className="text-5xl opacity-20">
                    {project.category === 'web' && '🌐'}
                    {project.category === 'mobile' && '📱'}
                    {project.category === 'ai' && '🤖'}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Image not found</p>
                    <p className="text-xs text-gray-500">Check: {project.image}</p>
                  </div>
                </div>
              )}
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              
              {/* Hover Overlay with Actions */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white rounded-full hover:scale-110 transition-transform"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-800 rounded-full hover:scale-110 transition-transform"
                >
                  <Github className="w-5 h-5 text-white" />
                </a>
                <button className="p-3 bg-blue-600 rounded-full hover:scale-110 transition-transform">
                  <Eye className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Featured Badge */}
              {project.featured && (
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold rounded-full">
                    Featured
                  </span>
                </div>
              )}
              
              {/* Category Badge */}
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full capitalize">
                  {project.category}
                </span>
              </div>
            </div>

            {/* Project Info */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 capitalize">
                  {project.category}
                </span>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">{(Math.random() * 1000).toFixed(0)} views</span>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {project.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {project.description}
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500">
                  {project.featured ? 'Enterprise Project' : 'Standard Project'}
                </div>
                <div className="flex items-center space-x-2">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                  >
                    Live Demo
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="glass-effect rounded-2xl p-8 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '95%', label: 'Client Satisfaction' },
            { value: '50+', label: 'Projects Delivered' },
            { value: '30+', label: 'Technologies Used' },
            { value: '100%', label: 'On-Time Delivery' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
              <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-6">Have a Project in Mind?</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Let's discuss how we can create something amazing together
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/contact"
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Start a Project
          </a>
          <a
            href="/services"
            className="px-8 py-3 glass-effect rounded-lg font-semibold hover-lift"
          >
            View Services
          </a>
        </div>
      </div>
    </div>
  )
}