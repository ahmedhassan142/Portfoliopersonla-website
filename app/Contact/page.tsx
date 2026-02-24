'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import toast from 'react-hot-toast'
import { 
  Send, 
  Calendar, 
  MessageSquare, 
  FileText, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight,
  Clock,
  CheckCircle,
  Facebook,
  Twitter,
  Linkedin,
  Github,
  Loader2,
  Navigation,
  Instagram,
  X
} from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import ServiceQuoteForm from '../../components/Client/ServiceQuoteForm'
import Cal, { getCalApi } from "@calcom/embed-react"

// Dynamically import ChatWidget to avoid SSR issues
const ChatWidget = dynamic(() => import('../../components/Shared/ChatWidget'), {
  ssr: false,
  loading: () => null
})

// Contact API route
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.enum(['web', 'app', 'ai', 'consultation', 'other']),
  budget: z.enum(['<5k', '5k-10k', '10k-25k', '25k-50k', '50k+', 'undecided']),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

const contactMethods = [
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: 'Live Chat',
    description: 'Chat with us instantly',
    action: 'Start Chat',
    color: 'from-blue-500 to-cyan-500',
    actionType: 'chat'
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: 'Schedule Call',
    description: 'Book a 30-min consultation',
    action: 'Schedule Now',
    color: 'from-purple-500 to-pink-500',
    actionType: 'calendar'
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: 'Get Quote',
    description: 'Detailed project estimate',
    action: 'Request Quote',
    color: 'from-orange-500 to-red-500',
    actionType: 'quote'
  }
]

const faqs = [
  {
    question: 'How quickly do you respond?',
    answer: 'We typically respond within 2-4 hours during business hours.'
  },
  {
    question: 'Do you work with international clients?',
    answer: 'Yes, we work with clients worldwide across different time zones.'
  },
  {
    question: 'What information do you need for a quote?',
    answer: 'Project scope, timeline, budget range, and specific requirements.'
  }
]

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showQuoteForm, setShowQuoteForm] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Initialize Cal.com
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({"namespace":"30min"});
      cal("ui", {"hideEventTypeDetails":false,"layout":"month_view"});
    })();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const logger = {
    info: (message: string, data?: any) => {
      console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data || '')
    },
    error: (message: string, error?: any) => {
      console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error || '')
    },
    success: (message: string, data?: any) => {
      console.log(`[SUCCESS] ${new Date().toISOString()} - ${message}`, data || '')
    }
  }

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    logger.info('Submitting contact form', data)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      logger.info('Contact API response', result)

      if (response.ok) {
        toast.success(
          <div>
            <div className="flex items-center mb-2">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span className="font-bold">Message Sent Successfully!</span>
            </div>
            <p className="text-sm">We'll get back to you within 24 hours.</p>
            <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">
              Check your email for confirmation. Reference ID: {result.data?.id}
            </p>
          </div>,
          { 
            duration: 8000,
            icon: '✅',
          }
        )
        
        logger.success('Contact form submitted successfully', { id: result.data?.id })
        reset()
      } else {
        toast.error(
          <div>
            <p className="font-bold mb-1">Submission Failed</p>
            <p className="text-sm">{result.message || 'Please try again'}</p>
            {result.errors && (
              <ul className="text-xs mt-2 list-disc list-inside">
                {result.errors.map((err: string, i: number) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            )}
          </div>,
          { duration: 6000 }
        )
        logger.error('Contact form submission failed', result)
      }
    } catch (error) {
      logger.error('Network error in contact form', error)
      toast.error(
        <div>
          <p className="font-bold mb-1">Network Error</p>
          <p className="text-sm">Please check your internet connection and try again.</p>
        </div>,
        { duration: 5000 }
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContactMethod = (method: typeof contactMethods[0]) => {
    switch(method.actionType) {
      case 'quote':
        setShowQuoteForm(true)
        break
      case 'calendar':
        setShowCalendar(true)
        break
      case 'chat':
        const chatElement = document.getElementById('chat-widget')
        if (chatElement) {
          chatElement.scrollIntoView({ behavior: 'smooth' })
          if (typeof window !== 'undefined' && (window as any).openChat) {
            (window as any).openChat()
          }
        } else {
          toast.success('Chat feature coming soon!')
        }
        break
      default:
        toast.success('Feature coming soon!')
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Cal.com Modal */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full h-[80vh] overflow-hidden shadow-2xl relative">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold">Schedule a Meeting</h3>
              <button
                onClick={() => setShowCalendar(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Cal.com Embed */}
            <div className="w-full h-[calc(100%-4rem)]">
              <Cal
                namespace="30min"
                calLink="ahmed-hassan-vnusbw/30min"
                style={{ width: "100%", height: "100%", overflow: "scroll" }}
                config={{
                  "layout": "month_view",
                  "useSlotsViewOnSmallScreen": "true"
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative w-full h-[700px] min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background with Gradient */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80")',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-purple-900/80 to-blue-900/90" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }} />
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center px-4">
          <div className="animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white text-sm font-medium">✨ Free Consultation Available</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-white">Get In</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 block mt-2">
                Touch
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-12 leading-relaxed">
              Have a project in mind? Let's discuss how we can bring your ideas to life 
              with cutting-edge technology and innovative solutions.
            </p>

            {/* Quick Contact Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm text-gray-300">Support Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">Instant</div>
                <div className="text-sm text-gray-300">Scheduling</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">100%</div>
                <div className="text-sm text-gray-300">Free Consultation</div>
              </div>
            </div>

            {/* Contact Methods Grid */}
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {contactMethods.map((method, index) => (
                <button
                  key={index}
                  onClick={() => handleContactMethod(method)}
                  className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 border border-white/20"
                >
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r ${method.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                    {method.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">{method.title}</h3>
                  <p className="text-sm text-gray-300 mb-3">{method.description}</p>
                  <span className="text-blue-300 text-sm group-hover:text-white transition-colors">
                    {method.action} →
                  </span>
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

      {/* Main Contact Section */}
      <section className="section-padding py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Contact Info Cards */}
            {[
              {
                icon: <Mail className="w-6 h-6" />,
                title: 'Email Us',
                value: 'ah770643@gmail.com',
                link: 'mailto:ah770643@gmail.com',
                response: 'Within 24 hours'
              },
              {
                icon: <Phone className="w-6 h-6" />,
                title: 'Call Us',
                value: '+92 300 1234567',
                link: 'tel:+923001234567',
                response: 'Mon-Fri, 9am-6pm'
              },
              {
                icon: <MapPin className="w-6 h-6" />,
                title: 'Visit Us',
                value: 'Garden East, Karachi, Pakistan',
                link: 'https://www.google.com/maps/search/?api=1&query=Garden+East+Karachi',
                response: 'By appointment'
              }
            ].map((item, index) => (
              <a
                key={index}
                href={item.link}
                target={item.icon.type === MapPin ? '_blank' : undefined}
                rel={item.icon.type === MapPin ? 'noopener noreferrer' : undefined}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">{item.value}</p>
                    <p className="text-sm text-green-600 dark:text-green-400">{item.response}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold mb-2">Send us a Message</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register('name')}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      {...register('email')}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Phone Field */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <input
                      {...register('phone')}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      placeholder="+92 300 1234567"
                    />
                  </div>

                  {/* Company Field */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Company
                    </label>
                    <input
                      {...register('company')}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      placeholder="Your Company"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Service Field */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Service Needed <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('service')}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    >
                      <option value="">Select a service</option>
                      <option value="web">Web Development</option>
                      <option value="app">App Development</option>
                      <option value="ai">AI Integration</option>
                      <option value="consultation">Consultation</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.service && (
                      <p className="text-red-500 text-sm mt-1">{errors.service.message}</p>
                    )}
                  </div>

                  {/* Budget Field */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Budget Range <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('budget')}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    >
                      <option value="">Select budget</option>
                      <option value="<5k">Less than $5,000</option>
                      <option value="5k-10k">$5,000 - $10,000</option>
                      <option value="10k-25k">$10,000 - $25,000</option>
                      <option value="25k-50k">$25,000 - $50,000</option>
                      <option value="50k+">$50,000+</option>
                      <option value="undecided">Not sure yet</option>
                    </select>
                    {errors.budget && (
                      <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>
                    )}
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Project Details <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register('message')}
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                    placeholder="Tell us about your project, goals, and requirements..."
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 w-5 h-5" />
                    </>
                  )}
                </button>

                {/* Form Footer */}
                <p className="text-sm text-gray-500 text-center">
                  By submitting, you agree to our{' '}
                  <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </form>
            </div>

            {/* Right Column - FAQ & Social */}
            <div className="space-y-8">
              {/* Cal.com Promo Card */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
                <h3 className="text-xl font-bold mb-2 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Free Scheduling
                </h3>
                <p className="text-white/90 mb-4">
                  Book a 30-minute consultation directly on my calendar. It's free and easy!
                </p>
                <button
                  onClick={() => setShowCalendar(true)}
                  className="w-full py-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors flex items-center justify-center"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Now
                </button>
              </div>

              {/* FAQ Section */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
                <h3 className="text-xl font-bold mb-6">Frequently Asked Questions</h3>
                <div className="space-y-6">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-0 pb-6 last:pb-0">
                      <h4 className="font-semibold mb-2 flex items-start">
                        <span className="text-blue-600 mr-2">Q:</span>
                        {faq.question}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 flex items-start">
                        <span className="text-green-600 mr-2">A:</span>
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Response Time Card */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                <Clock className="w-12 h-12 mb-4 opacity-90" />
                <h3 className="text-xl font-bold mb-4">Quick Response Guarantee</h3>
                <ul className="space-y-3">
                  {[
                    'Emails replied within 24 hours',
                    'Phone calls returned same day',
                    'Live chat instant response',
                    'Quotes within 48 hours'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social Links */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
                <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Follow us on social media for updates and tech insights
                </p>
                <div className="flex space-x-4">
                  {[
                    { icon: <Facebook />, link: 'https://www.facebook.com/ahmedhassanahh', label: 'Facebook' },
                    { icon: <Instagram />, link: 'https://www.instagram.com/ahmed6154hassan/?hl=en', label: 'Instagram' },
                    { icon: <Linkedin />, link: 'https://www.linkedin.com/in/ahmed-hassan-7a3a90212/', label: 'LinkedIn' },
                    { icon: <Github />, link: 'https://github.com/ahmedhassan142', label: 'GitHub' }
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-blue-600 hover:text-white transition-all duration-300"
                      aria-label={social.label}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-96 relative">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28949.5987766254!2d67.0011!3d24.8607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e066fe7b7b9%3A0x8f1e3a4b5c6d7e8f!2sGarden%20East%2C%20Karachi%2C%20Pakistan!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          className="grayscale hover:grayscale-0 transition-all duration-500"
          title="Tech Solutions Location - Garden East, Karachi"
        />
        
        <div className="absolute bottom-8 right-8 z-10">
          <a
            href="https://www.google.com/maps/search/?api=1&query=Garden+East+Karachi"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-6 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <Navigation className="w-5 h-5 text-blue-600 mr-2 group-hover:scale-110 transition-transform" />
            <span className="text-gray-700 dark:text-gray-300">Get Directions</span>
          </a>
        </div>
      </section>

      {/* Quote Form Modal */}
      {showQuoteForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-4 sm:mb-6 sticky top-0 bg-white dark:bg-gray-900 z-10 pb-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl sm:text-2xl font-bold">Get Detailed Quote</h3>
              <button
                onClick={() => setShowQuoteForm(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>
            <ServiceQuoteForm onClose={() => setShowQuoteForm(false)} />
          </div>
        </div>
      )}

      {/* Chat Widget */}
      <div id="chat-widget">
        <ChatWidget />
      </div>
    </div>
  )
}