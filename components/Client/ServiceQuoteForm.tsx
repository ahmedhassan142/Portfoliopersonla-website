'use client'

import { useState, useEffect } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import toast from 'react-hot-toast'
import {
  Plus,
  Trash2,
  Calculator,
  Download,
  Save,
  Send,
  ChevronRight,
  Check,
  Clock,
  DollarSign,
  Calendar,
} from 'lucide-react'
import { calculateQuote, QuoteInput, QuoteOutput } from '@/lib/quoteCalculator'

// Form Schema
const quoteSchema = z.object({
  // Step 1: Contact Information
  contact: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    company: z.string().optional(),
    website: z.string().url('Invalid URL').or(z.literal('')).optional(),
  }),
  
  // Step 2: Project Details
  project: z.object({
    title: z.string().min(5, 'Project title must be at least 5 characters'),
    description: z.string().min(20, 'Please provide a detailed description'),
    type: z.enum(['web', 'mobile', 'ai', 'consultation', 'maintenance']),
    subType: z.record(z.string(), z.array(z.string())).optional(),
  }),
  
  // Step 3: Features
  features: z.array(z.object({
    name: z.string().min(3, 'Feature name required'),
    description: z.string().min(10, 'Please describe this feature'),
    complexity: z.enum(['simple', 'medium', 'complex', 'very-complex']),
  })).min(1, 'Add at least one feature'),
  
  // Step 4: Design & Content
  design: z.object({
    tier: z.enum(['basic', 'standard', 'premium', 'custom']),
    customDesignNeeds: z.string().optional(),
  }),
  
  content: z.object({
    pages: z.number().min(0).default(0),
    blogPosts: z.number().min(0).default(0),
    products: z.number().min(0).default(0),
  }),
  
  // Step 5: Integrations
  integrations: z.array(z.string()),
  customIntegrations: z.string().optional(),
  
  // Step 6: Timeline & Budget
  timeline: z.object({
    startDate: z.string().optional(),
    deadline: z.string().optional(),
    urgency: z.enum(['flexible', 'standard', 'urgent', 'asap']),
    months: z.number().min(1).max(24),
  }),
  
  budget: z.object({
    range: z.object({
      min: z.number().min(0),
      max: z.number().min(0),
    }),
    currency: z.string().default('USD'),
    paymentTerms: z.enum(['upfront-50', 'milestone', 'monthly', 'project-completion']),
  }),
  
  // Step 7: Hosting & Maintenance
  hosting: z.object({
    tier: z.enum(['basic', 'standard', 'premium', 'enterprise']),
    needs: z.string().optional(),
  }),
  
  maintenance: z.object({
    tier: z.enum(['basic', 'standard', 'premium']),
    months: z.number().min(0).max(36),
  }),
  
  // Additional Info
  attachments: z.array(z.object({
    name: z.string(),
    url: z.string(),
    type: z.string(),
  })).optional(),
  
  notes: z.string().optional(),
})

type QuoteFormData = z.infer<typeof quoteSchema>

interface ServiceQuoteFormProps {
  onClose: () => void
}

// Available integrations
const AVAILABLE_INTEGRATIONS = [
  { id: 'payment', name: 'Payment Gateway (Stripe/PayPal)', category: 'payment' },
  { id: 'auth', name: 'User Authentication', category: 'auth' },
  { id: 'cms', name: 'Content Management System', category: 'cms' },
  { id: 'analytics', name: 'Analytics (Google Analytics)', category: 'analytics' },
  { id: 'email', name: 'Email Service (SendGrid/Mailchimp)', category: 'communication' },
  { id: 'sms', name: 'SMS Notifications', category: 'communication' },
  { id: 'social', name: 'Social Media Integration', category: 'social' },
  { id: 'maps', name: 'Maps & Location', category: 'maps' },
  { id: 'api', name: 'Custom API Integration', category: 'api' },
  { id: 'crm', name: 'CRM Integration', category: 'business' },
  { id: 'erp', name: 'ERP System', category: 'business' },
  { id: 'ai', name: 'AI/ML Services', category: 'ai' },
]

// Project subtypes
const PROJECT_SUBTYPES = {
  web: [
    'E-commerce Store',
    'Business Website',
    'Landing Page',
    'Web Application',
    'Dashboard',
    'Portal',
    'Blog/News Site',
    'Membership Site',
  ],
  mobile: [
    'iOS App',
    'Android App',
    'Cross-Platform App',
    'Hybrid App',
    'PWA (Progressive Web App)',
    'Mobile Game',
  ],
  ai: [
    'Chatbot',
    'AI Assistant',
    'Predictive Analytics',
    'Computer Vision',
    'Natural Language Processing',
    'Recommendation Engine',
    'Automation',
  ],
  consultation: [
    'Technical Review',
    'Architecture Design',
    'Code Audit',
    'Strategy Session',
    'Training',
  ],
  maintenance: [
    'Website Maintenance',
    'App Updates',
    'Security Monitoring',
    'Performance Optimization',
    'Backup Management',
  ],
}

export default function ServiceQuoteForm({ onClose }: ServiceQuoteFormProps) {
  const [step, setStep] = useState(1)
  const [isCalculating, setIsCalculating] = useState(false)
  const [quoteResult, setQuoteResult] = useState<QuoteOutput | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      contact: {
        name: '',
        email: '',
        phone: '',
        company: '',
        website: '',
      },
      project: {
        title: '',
        description: '',
        type: 'web',
        subType: {},
      },
      features: [
        {
          name: 'Responsive Design',
          description: 'Website works perfectly on all devices',
          complexity: 'simple',
        },
      ],
      design: {
        tier: 'standard',
        customDesignNeeds: '',
      },
      content: {
        pages: 5,
        blogPosts: 0,
        products: 0,
      },
      integrations: [],
      timeline: {
        startDate: '',
        deadline: '',
        urgency: 'standard',
        months: 3,
      },
      budget: {
        range: { min: 0, max: 0 },
        currency: 'USD',
        paymentTerms: 'milestone',
      },
      hosting: {
        tier: 'standard',
        needs: '',
      },
      maintenance: {
        tier: 'basic',
        months: 12,
      },
      notes: '',
    },
  })
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'features',
  })
  
  // Watch project type for dynamic form
  const projectType = watch('project.type')
  
  // Calculate quote when relevant fields change
  useEffect(() => {
    const subscription = watch((value) => {
      if (step === 7) { // Only calculate on quote preview step
        calculateQuotePreview()
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, step])
  
  const calculateQuotePreview = async () => {
    setIsCalculating(true)
    
    const formData = watch()
    
    try {
      const quoteInput: QuoteInput = {
        projectType: formData.project.type,
        features: formData.features,
        designTier: formData.design.tier,
        contentPages: formData.content.pages,
        blogPosts: formData.content.blogPosts,
        integrations: formData.integrations,
        hostingTier: formData.hosting.tier,
        maintenanceTier: formData.maintenance.tier,
        urgency: formData.timeline.urgency,
        timelineMonths: formData.timeline.months,
      }
      
      const result = calculateQuote(quoteInput)
      setQuoteResult(result)
      
      // Update budget range
      setValue('budget.range', {
        min: Math.round(result.total * 0.8),
        max: Math.round(result.total * 1.2),
      })
      
    } catch (error) {
      console.error('Quote calculation error:', error)
      toast.error('Failed to calculate quote')
    } finally {
      setIsCalculating(false)
    }
  }
  
  const handleNextStep = () => {
    if (step < 7) {
      setStep(step + 1)
      window.scrollTo(0, 0)
    }
  }
  
  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1)
      window.scrollTo(0, 0)
    }
  }
  
  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true)
    
    try {
      // Combine form data with calculated quote
      const submissionData = {
        ...data,
        quote: quoteResult,
        submittedAt: new Date().toISOString(),
      }
      
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      })
      
      if (response.ok) {
        const result = await response.json()
        
        toast.success('Quote request submitted successfully!')
        
        // Send email confirmation
        await fetch('/api/email/quote-confirmation', {
          method: 'POST',
          body: JSON.stringify({
            ...data.contact,
            quoteId: result.data.quoteId,
            projectTitle: data.project.title,
          }),
        })
        
        // Download quote PDF
        await downloadQuotePDF(result.data.quoteId)
        
        onClose()
      } else {
        throw new Error('Failed to submit quote')
      }
    } catch (error) {
      console.error('Submission error:', error)
      toast.error('Failed to submit quote request')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const downloadQuotePDF = async (quoteId: string) => {
    try {
      const response = await fetch(`/api/quotes/${quoteId}/pdf`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `quote-${quoteId}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('PDF download error:', error)
    }
  }
  
  const saveAsDraft = async () => {
    const formData = watch()
    
    try {
      const response = await fetch('/api/quotes/draft', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          status: 'draft',
        }),
      })
      
      if (response.ok) {
        toast.success('Quote saved as draft')
      }
    } catch (error) {
      toast.error('Failed to save draft')
    }
  }
  
  // Step progress
  const steps = [
    { number: 1, title: 'Contact Info' },
    { number: 2, title: 'Project Details' },
    { number: 3, title: 'Features' },
    { number: 4, title: 'Design & Content' },
    { number: 5, title: 'Integrations' },
    { number: 6, title: 'Timeline & Budget' },
    { number: 7, title: 'Quote Preview' },
  ]
  
  return (
    <div className="max-h-[80vh] overflow-y-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((s) => (
            <div
              key={s.number}
              className={`flex flex-col items-center ${
                s.number <= step ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  s.number <= step
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                {s.number < step ? <Check className="w-5 h-5" /> : s.number}
              </div>
              <span className="text-sm font-medium">{s.title}</span>
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300"
            style={{ width: `${((step - 1) / 6) * 100}%` }}
          />
        </div>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Step 1: Contact Information */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Contact Information</h3>
              <span className="text-sm text-gray-500">Step 1 of 7</span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  {...register('contact.name')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-2 focus:outline-blue-500 transition"
                  placeholder="John Doe"
                />
                {errors.contact?.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.contact.name.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  {...register('contact.email')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-2 focus:outline-blue-500 transition"
                  placeholder="john@example.com"
                />
                {errors.contact?.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.contact.email.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  {...register('contact.phone')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-2 focus:outline-blue-500 transition"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Company
                </label>
                <input
                  {...register('contact.company')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-2 focus:outline-blue-500 transition"
                  placeholder="Your Company Inc."
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Website URL
                </label>
                <input
                  {...register('contact.website')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-2 focus:outline-blue-500 transition"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Step 2: Project Details */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Project Details</h3>
              <span className="text-sm text-gray-500">Step 2 of 7</span>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Project Title *
              </label>
              <input
                {...register('project.title')}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-2 focus:outline-blue-500 transition"
                placeholder="E-commerce Website for Fashion Store"
              />
              {errors.project?.title && (
                <p className="text-red-500 text-sm mt-1">{errors.project.title.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Project Description *
              </label>
              <textarea
                {...register('project.description')}
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-2 focus:outline-blue-500 transition resize-none"
                placeholder="Describe your project in detail. What problems are you trying to solve? Who are your target users? What are your main goals?"
              />
              {errors.project?.description && (
                <p className="text-red-500 text-sm mt-1">{errors.project.description.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Project Type *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { value: 'web', label: '🌐 Web', icon: '🌐' },
                  { value: 'mobile', label: '📱 Mobile', icon: '📱' },
                  { value: 'ai', label: '🤖 AI', icon: '🤖' },
                  { value: 'consultation', label: '💼 Consultation', icon: '💼' },
                  { value: 'maintenance', label: '🔧 Maintenance', icon: '🔧' },
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setValue('project.type', type.value as any)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      projectType === type.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="font-medium">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>
            
            {projectType && PROJECT_SUBTYPES[projectType] && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Project Sub-Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {PROJECT_SUBTYPES[projectType].map((subtype) => (
                    <button
                      key={subtype}
                      type="button"
                      onClick={() => {
                        const current = watch(`project.subType.${projectType}`) || []
                        const newSubtypes = current.includes(subtype)
                          ? current.filter((s: string) => s !== subtype)
                          : [...current, subtype]
                        setValue(`project.subType.${projectType}`, newSubtypes)
                      }}
                      className={`px-4 py-2 rounded-full text-sm transition-colors ${
                        (watch(`project.subType.${projectType}`) || []).includes(subtype)
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {subtype}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Step 3: Features */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Project Features</h3>
              <span className="text-sm text-gray-500">Step 3 of 7</span>
            </div>
            
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="glass-effect p-4 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold">Feature {index + 1}</h4>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Feature Name *
                      </label>
                      <input
                        {...register(`features.${index}.name`)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-2 focus:outline-blue-500 transition"
                        placeholder="e.g., User Registration"
                      />
                      {errors.features?.[index]?.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.features[index].name.message}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Complexity Level *
                      </label>
                      <select
                        {...register(`features.${index}.complexity`)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-2 focus:outline-blue-500 transition"
                      >
                        <option value="simple">Simple (Basic feature)</option>
                        <option value="medium">Medium (Standard feature)</option>
                        <option value="complex">Complex (Advanced feature)</option>
                        <option value="very-complex">Very Complex (Custom solution)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Description *
                    </label>
                    <textarea
                      {...register(`features.${index}.description`)}
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-2 focus:outline-blue-500 transition resize-none"
                      placeholder="Describe what this feature should do and any specific requirements..."
                    />
                    {errors.features?.[index]?.description && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.features[index].description.message}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => append({ name: '', description: '', complexity: 'medium' })}
                className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors flex items-center justify-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Another Feature
              </button>
            </div>
          </div>
        )}
        
        {/* Step 4: Design & Content */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Design & Content</h3>
              <span className="text-sm text-gray-500">Step 4 of 7</span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Design Requirements */}
              <div className="space-y-4">
                <h4 className="font-bold text-lg">Design Requirements</h4>
                
                <div className="space-y-4">
                  {[
                    {
                      value: 'basic',
                      title: 'Basic Design',
                      description: 'Clean, functional layout with standard templates',
                      price: '$500+',
                    },
                    {
                      value: 'standard',
                      title: 'Standard Design',
                      description: 'Custom design with branding and responsive layout',
                      price: '$1,500+',
                    },
                    {
                      value: 'premium',
                      title: 'Premium Design',
                      description: 'High-end custom design with animations and interactions',
                      price: '$3,500+',
                    },
                    {
                      value: 'custom',
                      title: 'Custom Design',
                      description: 'Fully bespoke design with unique user experience',
                      price: '$5,000+',
                    },
                  ].map((tier) => (
                    <label
                      key={tier.value}
                      className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        watch('design.tier') === tier.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          value={tier.value}
                          {...register('design.tier')}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <div className="font-bold">{tier.title}</div>
                            <div className="text-blue-600 dark:text-blue-400 font-semibold">
                              {tier.price}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {tier.description}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Additional Design Needs
                  </label>
                  <textarea
                    {...register('design.customDesignNeeds')}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-2 focus:outline-blue-500 transition resize-none"
                    placeholder="Any specific design requirements, brand guidelines, or preferences?"
                  />
                </div>
              </div>
              
              {/* Content Requirements */}
              <div className="space-y-6">
                <h4 className="font-bold text-lg">Content Requirements</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Number of Website Pages
                    </label>
                    <div className="flex items-center space-x-4">
                      <button
                        type="button"
                        onClick={() => {
                          const current = watch('content.pages')
                          if (current > 0) setValue('content.pages', current - 1)
                        }}
                        className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        {...register('content.pages', { valueAsNumber: true })}
                        className="w-20 text-center px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const current = watch('content.pages')
                          setValue('content.pages', current + 1)
                        }}
                        className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        +
                      </button>
                      <span className="text-gray-600 dark:text-gray-400">
                        ≈ ${watch('content.pages') * 200} ($200/page)
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Number of Blog Posts Needed
                    </label>
                    <div className="flex items-center space-x-4">
                      <button
                        type="button"
                        onClick={() => {
                          const current = watch('content.blogPosts')
                          if (current > 0) setValue('content.blogPosts', current - 1)
                        }}
                        className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        {...register('content.blogPosts', { valueAsNumber: true })}
                        className="w-20 text-center px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const current = watch('content.blogPosts')
                          setValue('content.blogPosts', current + 1)
                        }}
                        className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        +
                      </button>
                      <span className="text-gray-600 dark:text-gray-400">
                        ≈ ${watch('content.blogPosts') * 300} ($300/post)
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Number of Products (if e-commerce)
                    </label>
                    <div className="flex items-center space-x-4">
                      <button
                        type="button"
                        onClick={() => {
                          const current = watch('content.products')
                          if (current > 0) setValue('content.products', current - 1)
                        }}
                        className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        {...register('content.products', { valueAsNumber: true })}
                        className="w-20 text-center px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const current = watch('content.products')
                          setValue('content.products', current + 1)
                        }}
                        className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        +
                      </button>
                      <span className="text-gray-600 dark:text-gray-400">
                        ≈ ${watch('content.products') * 50} ($50/product)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 5: Integrations */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Third-Party Integrations</h3>
              <span className="text-sm text-gray-500">Step 5 of 7</span>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Select all the integrations your project needs. Each integration adds to the development time and cost.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                {AVAILABLE_INTEGRATIONS.map((integration) => (
                  <label
                    key={integration.id}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      watch('integrations').includes(integration.id)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      value={integration.id}
                      {...register('integrations')}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">{integration.name}</div>
                      <div className="text-sm text-gray-500">
                        {integration.category} • $200-500
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Custom Integrations
                </label>
                <textarea
                  {...register('customIntegrations')}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-2 focus:outline-blue-500 transition resize-none"
                  placeholder="List any other APIs or services you need integrated..."
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Step 6: Timeline & Budget */}
        {step === 6 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Timeline & Budget</h3>
              <span className="text-sm text-gray-500">Step 6 of 7</span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Timeline */}
              <div className="space-y-6">
                <h4 className="font-bold text-lg">Project Timeline</h4>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Desired Timeline
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      min="1"
                      max="24"
                      {...register('timeline.months', { valueAsNumber: true })}
                      className="w-20 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
                    />
                    <span className="text-gray-600 dark:text-gray-400">months</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Longer timelines allow for better planning and may qualify for discounts.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Project Urgency
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'flexible', label: 'Flexible (10% discount)', color: 'text-green-600' },
                      { value: 'standard', label: 'Standard Timeline', color: 'text-blue-600' },
                      { value: 'urgent', label: 'Urgent (20% premium)', color: 'text-orange-600' },
                      { value: 'asap', label: 'ASAP (50% premium)', color: 'text-red-600' },
                    ].map((urgency) => (
                      <label
                        key={urgency.value}
                        className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <input
                          type="radio"
                          value={urgency.value}
                          {...register('timeline.urgency')}
                          className="mr-3"
                        />
                        <div>
                          <div className="font-medium">{urgency.label}</div>
                          <div className={`text-sm ${urgency.color}`}>
                            {urgency.value === 'flexible' && 'Best for cost savings'}
                            {urgency.value === 'standard' && 'Balanced timeline'}
                            {urgency.value === 'urgent' && 'Faster delivery'}
                            {urgency.value === 'asap' && 'Highest priority'}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Preferred Start Date
                    </label>
                    <input
                      type="date"
                      {...register('timeline.startDate')}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Deadline
                    </label>
                    <input
                      type="date"
                      {...register('timeline.deadline')}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
                    />
                  </div>
                </div>
              </div>
              
              {/* Budget */}
              <div className="space-y-6">
                <h4 className="font-bold text-lg">Budget & Payment</h4>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Estimated Budget Range
                  </label>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Minimum</span>
                      <div className="flex items-center">
                        <span className="mr-2">$</span>
                        <input
                          type="number"
                          {...register('budget.range.min', { valueAsNumber: true })}
                          className="w-32 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Maximum</span>
                      <div className="flex items-center">
                        <span className="mr-2">$</span>
                        <input
                          type="number"
                          {...register('budget.range.max', { valueAsNumber: true })}
                          className="w-32 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Preferred Payment Terms
                  </label>
                  <select
                    {...register('budget.paymentTerms')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-2 focus:outline-blue-500 transition"
                  >
                    <option value="milestone">Milestone-based (Recommended)</option>
                    <option value="upfront-50">50% upfront, 50% on completion</option>
                    <option value="monthly">Monthly payments</option>
                    <option value="project-completion">100% on project completion</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Currency
                  </label>
                  <select
                    {...register('budget.currency')}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
                  >
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="GBP">British Pound (GBP)</option>
                    <option value="CAD">Canadian Dollar (CAD)</option>
                    <option value="AUD">Australian Dollar (AUD)</option>
                    <option value="other">Other (Specify in notes)</option>
                  </select>
                </div>
                
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center text-blue-600 dark:text-blue-400 mb-2">
                    <DollarSign className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Budget Tip</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Be realistic with your budget. Higher budgets allow for more features,
                    better design, and faster delivery. We'll provide the best value within
                    your range.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Step 7: Quote Preview */}
        {step === 7 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Quote Preview</h3>
              <span className="text-sm text-gray-500">Step 7 of 7</span>
            </div>
            
            {isCalculating ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-gray-600 dark:text-gray-400">Calculating your quote...</p>
              </div>
            ) : quoteResult ? (
              <div className="space-y-6">
                {/* Quote Summary */}
                <div className="glass-effect p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="text-lg font-bold">Quote Summary</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Valid until {quoteResult.validUntil.toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={calculateQuotePreview}
                      className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <Calculator className="w-4 h-4 mr-2" />
                      Recalculate
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Features Breakdown */}
                    <div>
                      <h5 className="font-bold mb-2">Features</h5>
                      <div className="space-y-2">
                        {quoteResult.breakdown.features.map((feature, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{feature.name}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {feature.complexity} • {feature.hours} hours
                              </div>
                            </div>
                            <div className="font-semibold">
                              ${feature.subtotal.toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Other Costs */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-bold mb-2">Design</h5>
                        <div className="flex justify-between">
                          <span>{quoteResult.breakdown.design.tier} Design</span>
                          <span>${quoteResult.breakdown.design.price.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-bold mb-2">Content</h5>
                        <div className="flex justify-between">
                          <span>{quoteResult.breakdown.content.pages} pages</span>
                          <span>${quoteResult.breakdown.content.price.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-bold mb-2">Integrations</h5>
                        <div className="space-y-1">
                          {quoteResult.breakdown.integrations.map((integration, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{integration.name}</span>
                              <span>${integration.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-bold mb-2">Hosting & Maintenance</h5>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Hosting ({quoteResult.breakdown.hosting.tier})</span>
                            <span>${quoteResult.breakdown.hosting.monthly}/month</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Maintenance ({quoteResult.breakdown.maintenance.tier})</span>
                            <span>${quoteResult.breakdown.maintenance.monthly}/month</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Totals */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${quoteResult.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Urgency ({quoteResult.urgencyMultiplier}x)</span>
                        <span>
                          {quoteResult.urgencyMultiplier > 1 ? '+' : ''}
                          {Math.round((quoteResult.urgencyMultiplier - 1) * 100)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-green-600 dark:text-green-400">
                        <span>Discount ({Math.round(quoteResult.discount * 100)}%)</span>
                        <span>-${Math.round(quoteResult.subtotal * quoteResult.discount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax (10%)</span>
                        <span>${quoteResult.tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span>Total Estimated Cost</span>
                        <span className="text-blue-600 dark:text-blue-400">
                          ${quoteResult.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    {/* Project Summary */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h5 className="font-bold mb-2">Project Summary</h5>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <Clock className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                          <div className="font-semibold">{quoteResult.estimatedHours} hours</div>
                          <div className="text-gray-600 dark:text-gray-400">Estimated Work</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <Calendar className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                          <div className="font-semibold">{quoteResult.timeline}</div>
                          <div className="text-gray-600 dark:text-gray-400">Timeline</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <DollarSign className="w-5 h-5 mx-auto mb-1 text-green-600" />
                          <div className="font-semibold">${Math.round(quoteResult.total / quoteResult.timeline.split(' ')[0]).toLocaleString()}</div>
                          <div className="text-gray-600 dark:text-gray-400">Per month</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Final Notes */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    {...register('notes')}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:outline-2 focus:outline-blue-500 transition resize-none"
                    placeholder="Any additional information, questions, or special requirements..."
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Unable to calculate quote. Please check your inputs.
              </div>
            )}
          </div>
        )}
        
        {/* Form Actions */}
        <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                ← Previous
              </button>
            )}
          </div>
          
          <div className="flex space-x-4">
            {step < 7 && (
              <>
                <button
                  type="button"
                  onClick={saveAsDraft}
                  className="px-6 py-2 flex items-center border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </button>
                
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center"
                >
                  Next Step
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              </>
            )}
            
            {step === 7 && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (quoteResult) {
                      downloadQuotePDF(`quote-${Date.now()}`)
                    }
                  }}
                  className="px-6 py-2 flex items-center border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting || !quoteResult}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Quote Request
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}