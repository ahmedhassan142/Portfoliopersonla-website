'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ChatWidget from '@/components/Shared/ChatWidget'
import { 
  ExternalLink, 
  Github, 
  Search, 
  Filter, 
  Eye,
  ArrowRight,
  Star,
  Code,
  Smartphone,
  Cpu,
  Globe,
  Award,
  Briefcase,
  X
} from 'lucide-react'

const projects = [
  {
    id: 1,
    title: 'MAN SALON WEBSITE',
    category: 'web',
    description: 'Full-stack salon management system with booking, payments, and admin dashboard.',
    image: '/images/portfolio/man.jpg',
    tech: ['Mongodb', 'NextJs', 'Typescript', 'React'],
    liveUrl: 'https://mansalon-lyy2-git-main-ahmed-hassans-projects-96c42d63.vercel.app',
    githubUrl: 'https://github.com/ahmedhassan142/Mansalon',
    featured: true,
    completion: '2024',
    client: 'Salon Chain'
  },
  {
    id: 2,
    title: 'Health & Fitness App',
    category: 'mobile',
    description: 'Mobile application with workout tracking, nutrition plans, and AI coaching.',
    image: '/images/portfolio/gyms.jpg',
    tech: ['Mongodb', 'NextJs', 'Typescript', 'React'],
    liveUrl: 'https://fitnesswebsite-git-main-ahmed-hassans-projects-96c42d63.vercel.app',
    githubUrl: 'https://github.com/ahmedhassan142/fitnesswebsite',
    featured: true,
    completion: '2024',
    client: 'Fitness Startup'
  },
  {
    id: 3,
    title: 'ERP BASED RESTAURANT WEBSITE',
    category: 'web',
    description: 'Full-service restaurant platform with online ordering and table reservations.',
    image: '/images/portfolio/restaurant.jpg',
    tech: ['Mongodb', 'NextJs', 'Typescript', 'React'],
    liveUrl: "https://restaurantapps-git-main-ahmed-hassans-projects-96c42d63.vercel.app",
    githubUrl: 'https://github.com/ahmedhassan142/Restaurant',
    featured: false,
    completion: '2023',
    client: 'Restaurant Group'
  },
  {
    id: 4,
    title: 'AI Chatbot System',
    category: 'ai',
    description: 'Intelligent customer support chatbot with natural language processing.',
    image: '/images/portfolio/Aibots.jpg',
    tech: ['OpenAI API', 'Node.js', 'React', 'Socket.io'],
    liveUrl: 'https://ai-chatbot-git-main-ahmed-hassans-projects-96c42d63.vercel.app/',
    githubUrl: 'https://github.com/ahmedhassan142/AI-Chatbot',
    featured: true,
    completion: '2024',
    client: 'Tech Corp'
  },
  {
    id: 5,
    title: 'DENTIST WEBSITE',
    category: 'web',
    description: 'Dental clinic website with appointment booking and patient portal.',
    image: '/images/portfolio/dentist.jpg',
    tech: ['Mongodb', 'NextJs', 'Typescript', 'React'],
    liveUrl: "https://dentistwebsite-git-main-ahmed-hassans-projects-96c42d63.vercel.app",
    githubUrl: 'https://github.com/ahmedhassan142/Dentistwebsite',
    featured: false,
    completion: '2023',
    client: 'Dental Clinic'
  },
  {
    id: 6,
    title: 'Simple RESTAURANT WEBSITE',
    category: 'web',
    description: 'Full-service restaurant platform with online ordering and table reservations.',
    image: '/images/portfolio/restaurant.jpg',
    tech: ['React', 'Mongodb', 'Nextjs'],
    liveUrl: "https://simple-restaurant-nwzy-git-main-ahmed-hassans-projects-96c42d63.vercel.app/",
    githubUrl: 'https://github.com/ahmedhassan142/Restaurant',
    featured: false,
    completion: '2023',
    client: 'Local Restaurant'
  },
  {
    id: 7,
    title: 'REAL TIME CHAT App',
    category: 'mobile',
    description: 'Real-time messaging app with video calls and file sharing.',
    image: '/images/portfolio/Chat-app.jpg',
    tech: ['React', 'Mongodb', 'Nextjs', 'Express'],
    liveUrl: 'https://the-chafrontend-git-main-ahmed-hassans-projects-96c42d63.vercel.app',
    githubUrl: 'https://github.com/ahmedhassan142/the-chafrontend',
    featured: false,
    completion: '2024',
    client: 'Social Startup'
  },
  {
    id: 8,
    title: 'Real Estate Platform',
    category: 'web',
    description: 'Property listing platform with virtual tours and agent dashboard.',
    image: '/images/portfolio/Chat-app.jpg',
    tech: ['React', 'Mongodb', 'Nextjs'],
    liveUrl: 'https://real-estate-git-main-ahmed-hassans-projects-96c42d63.vercel.app/',
    githubUrl: 'https://github.com/ahmedhassan142/the-chafrontend',
    featured: false,
    completion: '2024',
    client: 'Real Estate Agency'
  },
  {
    id: 9,
    title: 'E-Learning Platform',
    category: 'web',
    description: 'Online learning management system with video courses and assessments.',
    image: '/images/portfolio/Chat-app.jpg',
    tech: ['React', 'Mongodb', 'Nextjs'],
    liveUrl: 'https://real-estate-git-main-ahmed-hassans-projects-96c42d63.vercel.app',
    githubUrl: 'https://github.com/ahmedhassan142/the-chafrontend',
    featured: true,
    completion: '2024',
    client: 'Education Tech'
  }
]

const categories = [
  { id: 'all', label: 'All Projects', icon: <Briefcase className="w-4 h-4" /> },
  { id: 'web', label: 'Web Development', icon: <Globe className="w-4 h-4" /> },
  { id: 'mobile', label: 'Mobile Apps', icon: <Smartphone className="w-4 h-4" /> },
  { id: 'ai', label: 'AI Solutions', icon: <Cpu className="w-4 h-4" /> }
]

const stats = [
  { value: '50+', label: 'Projects Completed', icon: <Briefcase className="w-6 h-6" /> },
  { value: '30+', label: 'Happy Clients', icon: <Award className="w-6 h-6" /> },
  { value: '95%', label: 'Client Satisfaction', icon: <Star className="w-6 h-6" /> },
  { value: '100%', label: 'On-Time Delivery', icon: <Code className="w-6 h-6" /> }
]

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null)

  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.tech.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         project.client?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleImageError = (projectId: number) => {
    setImageErrors(prev => ({ ...prev, [projectId]: true }))
  }

  const featuredProjects = filteredProjects.filter(p => p.featured)
  const regularProjects = filteredProjects.filter(p => !p.featured)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative w-full h-[700px] min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Gradient */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2015&q=80")',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-purple-900/80 to-blue-900/90" />
          {/* Pattern Overlay */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat'
            }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto text-center px-4">
          <div className="animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8">
              <Star className="w-4 h-4 text-yellow-300" />
              <span className="text-white text-sm font-medium">Showcasing Excellence in Every Project</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-white">Featured</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 block mt-2">
                Projects
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-10 leading-relaxed">
              Showcasing innovative solutions that have helped businesses succeed and transform their digital presence with cutting-edge technology.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto mb-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding py-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Filters & Search */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
              {/* Categories */}
              <div className="flex items-center space-x-4 overflow-x-auto pb-2 lg:pb-0">
                <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl capitalize transition-all duration-300 ${
                        selectedCategory === category.id
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/30'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md'
                      }`}
                    >
                      {category.icon}
                      <span>{category.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Search */}
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects by name, tech, or client..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Results Count */}
            <div className="text-center mb-6">
              <span className="text-gray-500 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm">
                Showing {filteredProjects.length} of {projects.length} projects
              </span>
            </div>
          </div>

          {/* Featured Projects */}
          {featuredProjects.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-8 flex items-center">
                <span className="w-1.5 h-8 bg-gradient-to-b from-yellow-500 to-orange-500 rounded-full mr-4" />
                Featured Projects
              </h2>
              <div className="grid lg:grid-cols-2 gap-8">
                {featuredProjects.map(project => (
                  <div
                    key={project.id}
                    className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                  >
                    {/* Project Image */}
                    <div className="relative h-72 overflow-hidden">
                      {!imageErrors[project.id] ? (
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={() => handleImageError(project.id)}
                          priority
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                          <div className="text-6xl opacity-20">
                            {project.category === 'web' && '🌐'}
                            {project.category === 'mobile' && '📱'}
                            {project.category === 'ai' && '🤖'}
                          </div>
                        </div>
                      )}
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                      
                      {/* Featured Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-semibold rounded-full flex items-center">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </span>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-sm rounded-full capitalize border border-white/30">
                          {project.category}
                        </span>
                      </div>

                      {/* Project Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <div className="flex items-center gap-2 text-sm text-white/80 mb-2">
                          <span>{project.completion}</span>
                          <span>•</span>
                          <span>{project.client}</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                        <p className="text-white/80 line-clamp-2">{project.description}</p>
                      </div>

                      {/* Hover Actions */}
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-white rounded-full hover:scale-110 transition-transform"
                        >
                          <ExternalLink className="w-5 h-5 text-gray-900" />
                        </a>
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-gray-900 rounded-full hover:scale-110 transition-transform"
                        >
                          <Github className="w-5 h-5 text-white" />
                        </a>
                        <button
                          onClick={() => setSelectedProject(project)}
                          className="p-3 bg-blue-600 rounded-full hover:scale-110 transition-transform"
                        >
                          <Eye className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Projects */}
          <div>
            <h2 className="text-2xl font-bold mb-8 flex items-center">
              <span className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-4" />
              All Projects
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularProjects.map(project => (
                <div
                  key={project.id}
                  className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    {!imageErrors[project.id] ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={() => handleImageError(project.id)}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                        <div className="text-5xl opacity-20">
                          {project.category === 'web' && '🌐'}
                          {project.category === 'mobile' && '📱'}
                          {project.category === 'ai' && '🤖'}
                        </div>
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full capitalize">
                        {project.category}
                      </span>
                    </div>

                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white rounded-full hover:scale-110 transition-transform"
                      >
                        <ExternalLink className="w-4 h-4 text-gray-900" />
                      </a>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-900 rounded-full hover:scale-110 transition-transform"
                      >
                        <Github className="w-4 h-4 text-white" />
                      </a>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {project.title}
                      </h3>
                      <span className="text-xs text-gray-500">{project.completion}</span>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.slice(0, 3).map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech.length > 3 && (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                          +{project.tech.length - 3}
                        </span>
                      )}
                    </div>

                    {/* View Details Button */}
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium hover:gap-2 transition-all"
                    >
                      View Details
                      <ArrowRight className="ml-1 w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* No Results */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4 opacity-30">🔍</div>
              <h3 className="text-2xl font-bold mb-2">No projects found</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all')
                  setSearchQuery('')
                }}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Stats Section */}
          <div className="mt-20 glass-effect rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '95%', label: 'Client Satisfaction' },
                { value: '50+', label: 'Projects Delivered' },
                { value: '30+', label: 'Technologies' },
                { value: '100%', label: 'On-Time Delivery' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                  <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Have a Project in Mind?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Let's discuss how we can create something amazing together and bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 inline-flex items-center justify-center"
              >
                Start a Project
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/services"
                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 inline-flex items-center justify-center"
              >
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="relative h-64 md:h-80">
              {!imageErrors[selectedProject.id] ? (
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                  <div className="text-8xl opacity-20">
                    {selectedProject.category === 'web' && '🌐'}
                    {selectedProject.category === 'mobile' && '📱'}
                    {selectedProject.category === 'ai' && '🤖'}
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
              
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                ✕
              </button>

              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="flex items-center gap-3 text-sm text-white/80 mb-2">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full">
                    {selectedProject.category}
                  </span>
                  <span>{selectedProject.completion}</span>
                  <span>{selectedProject.client}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">{selectedProject.title}</h2>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              <div className="prose dark:prose-invert max-w-none">
                <h3 className="text-xl font-bold mb-4">Project Overview</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {selectedProject.description}
                </p>

                <h3 className="text-xl font-bold mb-4">Technologies Used</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedProject.tech.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                    <h4 className="font-semibold mb-2">Project Type</h4>
                    <p className="text-gray-600 dark:text-gray-300 capitalize">{selectedProject.category} Development</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                    <h4 className="font-semibold mb-2">Client</h4>
                    <p className="text-gray-600 dark:text-gray-300">{selectedProject.client}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity text-center flex items-center justify-center"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Live Demo
                  </a>
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors text-center flex items-center justify-center"
                  >
                    <Github className="w-5 h-5 mr-2" />
                    View Code
                  </a>
                </div>
                 <div id="chat-widget">
        <ChatWidget />
      </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}