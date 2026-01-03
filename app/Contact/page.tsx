'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import toast from 'react-hot-toast'
import { Send, Calendar, MessageSquare, FileText } from 'lucide-react'
import ChatWidget from '@/components/Shared/ChatWidget'
import ServiceQuoteForm from '@/components/Client/ServiceQuoteForm'

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

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showQuoteForm, setShowQuoteForm] = useState(false)
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success('Message sent successfully! We will get back to you soon.')
        reset()
        
        // Send email notification
        await fetch('/api/email/contact-confirmation', {
          method: 'POST',
          body: JSON.stringify(data),
        })
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="section-padding py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Have a project in mind? Choose how you'd like to connect with us.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Quick Contact Options */}
          {[
            {
              icon: <MessageSquare />,
              title: 'Quick Chat',
              description: 'Instant messaging for quick questions',
              action: () => toast.success('Opening chat...'),
              color: 'from-blue-500 to-cyan-500',
            },
            {
              icon: <Calendar />,
              title: 'Book Call',
              description: 'Schedule a 30-minute consultation',
              action: () => window.open('https://cal.com/techservices', '_blank'),
              color: 'from-purple-500 to-pink-500',
            },
            {
              icon: <FileText />,
              title: 'Get Quote',
              description: 'Detailed project estimate',
              action: () => setShowQuoteForm(true),
              color: 'from-orange-500 to-red-500',
            },
          ].map((option, index) => (
            <button
              key={index}
              onClick={option.action}
              className={`glass-effect p-6 rounded-xl text-center hover-lift`}
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r ${option.color} flex items-center justify-center text-white text-2xl`}>
                {option.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{option.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{option.description}</p>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="glass-effect p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6">Send Detailed Inquiry</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Your Name *
                  </label>
                  <input
                    {...register('name')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-2 focus:outline-blue-500 transition"
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-2 focus:outline-blue-500 transition"
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    {...register('phone')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-2 focus:outline-blue-500 transition"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Company
                  </label>
                  <input
                    {...register('company')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-2 focus:outline-blue-500 transition"
                    placeholder="Your Company"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Service Needed *
                  </label>
                  <select
                    {...register('service')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-2 focus:outline-blue-500 transition"
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

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Budget Range *
                  </label>
                  <select
                    {...register('budget')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-2 focus:outline-blue-500 transition"
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

              <div>
                <label className="block text-sm font-medium mb-2">
                  Project Details *
                </label>
                <textarea
                  {...register('message')}
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-2 focus:outline-blue-500 transition resize-none"
                  placeholder="Tell us about your project..."
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                <Send className="ml-2 w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Quote Form Modal */}
          {showQuoteForm && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">Get Detailed Quote</h3>
                  <button
                    onClick={() => setShowQuoteForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <ServiceQuoteForm onClose={() => setShowQuoteForm(false)} />
              </div>
            </div>
          )}

          {/* Contact Info & FAQ */}
          <div className="space-y-8">
            <div className="glass-effect p-6 rounded-xl">
              <h3 className="font-bold text-xl mb-4">Contact Channels</h3>
              <div className="space-y-4">
                {[
                  { label: 'Email', value: 'contact@techsolutions.dev', type: 'email' },
                  { label: 'Phone', value: '+1 (555) 123-4567', type: 'phone' },
                  { label: 'WhatsApp', value: '+1 (555) 123-4567', type: 'whatsapp' },
                  { label: 'Telegram', value: '@techsolutions', type: 'telegram' },
                ].map((channel, index) => (
                  <a
                    key={index}
                    href={
                      channel.type === 'email'
                        ? `mailto:${channel.value}`
                        : channel.type === 'phone'
                        ? `tel:${channel.value}`
                        : '#'
                    }
                    className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <div>
                      <div className="font-medium">{channel.label}</div>
                      <div className="text-gray-600 dark:text-gray-400">{channel.value}</div>
                    </div>
                    <span className="text-blue-600 dark:text-blue-400">→</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Response Time */}
            <div className="glass-effect p-6 rounded-xl">
              <h3 className="font-bold text-xl mb-4">Response Time</h3>
              <div className="space-y-3">
                {[
                  { type: 'Email', time: 'Within 24 hours' },
                  { type: 'Phone Call', time: 'Same business day' },
                  { type: 'Live Chat', time: 'Instant' },
                  { type: 'Quote Request', time: '48 hours' },
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{item.type}</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  )
}