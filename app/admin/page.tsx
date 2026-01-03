'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import {
  Users,
  Briefcase,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Settings,
  LogOut,
} from 'lucide-react'
import toast from 'react-hot-toast'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function DashboardPage() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState('7d')
  
  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify')
        if (!response.ok) {
          router.push('/admin/login')
        }
      } catch (error) {
        router.push('/admin/login')
      }
    }
    checkAuth()
  }, [router])
  
  const { data: stats, error: statsError } = useSWR(
    `/api/admin/stats?range=${timeRange}`,
    fetcher,
    { refreshInterval: 30000 }
  )
  
  const { data: recentContacts } = useSWR(
    '/api/contact?limit=5&status=new',
    fetcher
  )
  
  const { data: recentProjects } = useSWR(
    '/api/projects?limit=3',
    fetcher
  )
  
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'DELETE' })
      toast.success('Logged out successfully')
      router.push('/admin/login')
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="glass-effect border-b">
        <div className="section-padding py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold gradient-text">Dashboard</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Welcome back, Admin
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="glass-effect px-4 py-2 rounded-lg"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              <button
                onClick={() => router.push('/admin/settings')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-red-600"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="section-padding py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: 'New Leads',
              value: stats?.data?.newLeads || 0,
              change: '+12%',
              icon: <Users />,
              color: 'from-blue-500 to-cyan-500',
              link: '/admin/contacts',
            },
            {
              title: 'Active Projects',
              value: stats?.data?.activeProjects || 0,
              change: '+3',
              icon: <Briefcase />,
              color: 'from-purple-500 to-pink-500',
              link: '/admin/projects',
            },
            {
              title: 'Pending Quotes',
              value: stats?.data?.pendingQuotes || 0,
              change: '-5',
              icon: <FileText />,
              color: 'from-orange-500 to-red-500',
              link: '/admin/quotes',
            },
            {
              title: 'Revenue',
              value: `$${(stats?.data?.revenue || 0).toLocaleString()}`,
              change: '+18%',
              icon: <DollarSign />,
              color: 'from-green-500 to-teal-500',
              link: '/admin/reports',
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="glass-effect p-6 rounded-xl cursor-pointer hover-lift"
              onClick={() => router.push(stat.link)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center text-white`}>
                  {stat.icon}
                </div>
                <span className={`text-sm font-semibold ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-gray-600 dark:text-gray-400">{stat.title}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Leads */}
          <div className="lg:col-span-2">
            <div className="glass-effect rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Recent Leads</h2>
                <button
                  onClick={() => router.push('/admin/contacts')}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                {recentContacts?.data?.map((contact: any) => (
                  <div
                    key={contact._id}
                    className="flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                    onClick={() => router.push(`/admin/contacts/${contact._id}`)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white">
                        {contact.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{contact.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {contact.company || 'No company'} • {contact.service}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        contact.priority === 'high' || contact.priority === 'urgent'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {contact.priority}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8 text-gray-500">
                    No recent leads
                  </div>
                )}
              </div>
            </div>

            {/* Recent Projects */}
            <div className="glass-effect rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Recent Projects</h2>
                <button
                  onClick={() => router.push('/admin/projects')}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View All
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {recentProjects?.data?.map((project: any) => (
                  <div
                    key={project._id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover-lift cursor-pointer"
                    onClick={() => router.push(`/portfolio/${project.slug}`)}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-8 h-8 rounded-lg ${
                        project.category === 'web' ? 'bg-blue-100 text-blue-600' :
                        project.category === 'app' ? 'bg-purple-100 text-purple-600' :
                        'bg-orange-100 text-orange-600'
                      } flex items-center justify-center`}>
                        {project.category === 'web' ? '🌐' :
                         project.category === 'app' ? '📱' : '🤖'}
                      </div>
                      <h3 className="font-bold">{project.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies?.slice(0, 3).map((tech: string) => (
                        <span
                          key={tech}
                          className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )) || (
                  <div className="col-span-2 text-center py-8 text-gray-500">
                    No recent projects
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions & Activity */}
          <div className="space-y-8">
            <div className="glass-effect rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
              
              <div className="space-y-4">
                {[
                  {
                    title: 'Add New Project',
                    description: 'Create portfolio entry',
                    action: () => router.push('/admin/projects/new'),
                    icon: <Briefcase />,
                  },
                  {
                    title: 'Send Quote',
                    description: 'Create and send quote',
                    action: () => router.push('/admin/quotes/new'),
                    icon: <FileText />,
                  },
                  {
                    title: 'Add Testimonial',
                    description: 'Add client testimonial',
                    action: () => router.push('/admin/testimonials/new'),
                    icon: <MessageSquare />,
                  },
                  {
                    title: 'Write Blog Post',
                    description: 'Create new blog content',
                    action: () => router.push('/admin/blog/new'),
                    icon: <FileText />,
                  },
                ].map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
                        {action.icon}
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {action.description}
                        </div>
                      </div>
                    </div>
                    <span className="text-blue-600 dark:text-blue-400">→</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="glass-effect rounded-xl p-6">
              <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
              
              <div className="space-y-4">
                {[
                  { action: 'Quote sent to', client: 'Acme Corp', time: '2 hours ago', type: 'quote' },
                  { action: 'Project completed', client: 'Startup XYZ', time: '1 day ago', type: 'project' },
                  { action: 'New lead from', client: 'John Smith', time: '2 days ago', type: 'lead' },
                  { action: 'Blog post published', client: 'AI Trends 2024', time: '3 days ago', type: 'blog' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'quote' ? 'bg-green-100 text-green-600' :
                      activity.type === 'project' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'lead' ? 'bg-purple-100 text-purple-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {activity.type === 'quote' ? '$' :
                       activity.type === 'project' ? '📁' :
                       activity.type === 'lead' ? '👤' : '📝'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium">{activity.action}</span>{' '}
                        <span className="font-semibold">{activity.client}</span>
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}