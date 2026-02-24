'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { 
  Send, 
  CheckCircle, 
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Clock,
  DollarSign,
  Users,
  Globe,
  Smartphone,
  Cpu,
  ShoppingBag,
  Code,
  Building2,
  Sparkles,
  Loader2,
  Download,
  FileText,
  X
} from 'lucide-react'
import Link from 'next/link'

// Logger utility
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

// Step-by-Step Quote Schema
const quoteSchema = z.object({
  // Step 1: Basic Info
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  
  // Step 2: Project Type
  projectType: z.enum(['website', 'mobile-app', 'web-app', 'ai-solution', 'ecommerce', 'custom'], {
    required_error: 'Please select project type'
  }),
  
  // Step 3: Business Details
  businessSize: z.enum(['individual', 'startup', 'small', 'medium', 'enterprise']).default('individual'),
  companyName: z.string().optional(),
  industry: z.string().optional(),
  
  // Step 4: Features & Requirements
  features: z.array(z.string()).optional(),
  requirements: z.string().optional(),
  
  // Step 5: Budget & Timeline
  budget: z.enum(['<5k', '5k-10k', '10k-25k', '25k-50k', '50k+', 'not-sure']),
  timeline: z.enum(['urgent', '1-month', '3-months', '6-months', 'flexible']),
})

type QuoteFormData = z.infer<typeof quoteSchema>

// Project Types with Icons
const projectTypes = [
  { id: 'website', label: 'Website', icon: <Globe className="w-5 h-5" />, desc: 'Business website, portfolio, blog' },
  { id: 'mobile-app', label: 'Mobile App', icon: <Smartphone className="w-5 h-5" />, desc: 'iOS/Android app' },
  { id: 'web-app', label: 'Web App', icon: <Code className="w-5 h-5" />, desc: 'SaaS, dashboard, platform' },
  { id: 'ai-solution', label: 'AI Solution', icon: <Cpu className="w-5 h-5" />, desc: 'Chatbots, ML, automation' },
  { id: 'ecommerce', label: 'E-commerce', icon: <ShoppingBag className="w-5 h-5" />, desc: 'Online store, marketplace' },
  { id: 'custom', label: 'Custom', icon: <Sparkles className="w-5 h-5" />, desc: 'Something unique' },
]

// Business Sizes
const businessSizes = [
  { id: 'individual', label: 'Individual / Freelancer', icon: <Users className="w-4 h-4" />, multiplier: 0.7 },
  { id: 'startup', label: 'Startup', icon: <Building2 className="w-4 h-4" />, multiplier: 1 },
  { id: 'small', label: 'Small Business', icon: <Building2 className="w-4 h-4" />, multiplier: 1.2 },
  { id: 'medium', label: 'Medium Business', icon: <Building2 className="w-4 h-4" />, multiplier: 1.5 },
  { id: 'enterprise', label: 'Enterprise', icon: <Building2 className="w-4 h-4" />, multiplier: 2 },
]

// Features with pricing
const featureOptions = [
  { id: 'responsive', label: 'Responsive Design', price: 500 },
  { id: 'seo', label: 'SEO Optimization', price: 300 },
  { id: 'cms', label: 'CMS Integration', price: 800 },
  { id: 'payment', label: 'Payment Gateway', price: 1000 },
  { id: 'auth', label: 'User Authentication', price: 600 },
  { id: 'analytics', label: 'Analytics Dashboard', price: 700 },
  { id: 'api', label: 'API Integration', price: 500 },
  { id: 'multilingual', label: 'Multi-language', price: 800 },
]

// Timeline options
const timelineOptions = [
  { id: 'urgent', label: 'Urgent (1-2 weeks)', multiplier: 1.5 },
  { id: '1-month', label: '1 Month', multiplier: 1.2 },
  { id: '3-months', label: '3 Months', multiplier: 1 },
  { id: '6-months', label: '6 Months', multiplier: 0.9 },
  { id: 'flexible', label: 'Flexible', multiplier: 0.8 },
]

// Base prices by project type
const basePrices = {
  'website': 2000,
  'mobile-app': 5000,
  'web-app': 4000,
  'ai-solution': 6000,
  'ecommerce': 4500,
  'custom': 3000,
}

interface ServiceQuoteFormProps {
  onClose: () => void
}

export default function ServiceQuoteForm({ onClose }: ServiceQuoteFormProps) {
  const [step, setStep] = useState(1)
  const [instantEstimate, setInstantEstimate] = useState<number | null>(null)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedQuoteId, setSubmittedQuoteId] = useState<string | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      businessSize: 'individual',
      budget: 'not-sure',
      timeline: 'flexible',
    },
  })

  const projectType = watch('projectType')
  const businessSize = watch('businessSize')
  const timeline = watch('timeline')
  const budget = watch('budget')
  const name = watch('name')
  const email = watch('email')

  // Log form changes for debugging
  useEffect(() => {
    logger.info('Form data updated', { projectType, businessSize, timeline, budget })
  }, [projectType, businessSize, timeline, budget])

  // Calculate instant estimate
  const calculateEstimate = () => {
    if (!projectType) return null
    
    let estimate = basePrices[projectType as keyof typeof basePrices] || 3000
    
    // Add features cost
    selectedFeatures.forEach(featureId => {
      const feature = featureOptions.find(f => f.id === featureId)
      if (feature) estimate += feature.price
    })
    
    // Apply business size multiplier
    const sizeMultiplier = businessSizes.find(s => s.id === businessSize)?.multiplier || 1
    estimate *= sizeMultiplier
    
    // Apply timeline multiplier
    const timelineMultiplier = timelineOptions.find(t => t.id === timeline)?.multiplier || 1
    estimate *= timelineMultiplier
    
    return Math.round(estimate)
  }

  // Update estimate when selections change
  useEffect(() => {
    const estimate = calculateEstimate()
    setInstantEstimate(estimate)
    logger.info('Estimate updated', { estimate })
  }, [projectType, selectedFeatures, businessSize, timeline])

  const handleFeatureToggle = (featureId: string) => {
    setSelectedFeatures(prev => {
      const newFeatures = prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
      
      setValue('features', newFeatures)
      logger.info('Features toggled', { featureId, newFeatures })
      
      return newFeatures
    })
  }

  const downloadPDF = async (quoteId: string) => {
    setIsDownloading(true)
    try {
      logger.info('Downloading PDF for quote:', quoteId)
      
      const response = await fetch(`/api/quotes/${quoteId}/pdf`, {
        method: 'GET',
      })

      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `quote-${quoteId}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      toast.success('PDF downloaded successfully!')
      logger.success('PDF downloaded', { quoteId })
    } catch (error) {
      logger.error('PDF download failed', error)
      toast.error('Failed to download PDF. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  const fetchQuote = async (quoteId: string) => {
    try {
      logger.info('Fetching quote:', quoteId)
      
      const response = await fetch(`/api/quotes/${quoteId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch quote')
      }

      logger.success('Quote fetched successfully', data)
      return data.data
    } catch (error) {
      logger.error('Fetch quote failed', error)
      throw error
    }
  }

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true)
    logger.info('Submitting quote form', data)
    
    try {
      // Add estimate to data
      const finalData = {
        ...data,
        estimatedPrice: instantEstimate,
        features: selectedFeatures,
      }
      
      logger.info('Final data to submit', finalData)
      
      // Send to API
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      })
      
      const result = await response.json()
      logger.info('API response', result)
      
      if (response.ok) {
        setSubmittedQuoteId(result.data.id)
        
        // Show success toast with PDF download option
        toast.success(
          <div className="flex flex-col gap-2">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span className="font-bold">Quote Request Sent!</span>
            </div>
            <p className="text-sm">Quote ID: {result.data.id}</p>
            {result.data.estimatedPrice && (
              <p className="text-sm">Estimated Price: ${result.data.estimatedPrice.toLocaleString()}</p>
            )}
            <button
              onClick={() => downloadPDF(result.data.id)}
              className="mt-2 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Quote PDF
            </button>
          </div>,
          { 
            duration: 10000,
            icon: '✅',
          }
        )
        
        logger.success('Quote submitted successfully', { id: result.data.id })
        
        // Close modal after 3 seconds
        setTimeout(() => {
          onClose()
        }, 3000)
      } else {
        // Show error toast
        toast.error(
          <div>
            <p className="font-bold">Submission Failed</p>
            <p className="text-sm">{result.message || 'Please try again'}</p>
          </div>,
          { duration: 5000 }
        )
        logger.error('Quote submission failed', result)
      }
    } catch (error) {
      logger.error('Network error', error)
      toast.error(
        <div>
          <p className="font-bold">Network Error</p>
          <p className="text-sm">Please check your connection and try again.</p>
        </div>,
        { duration: 5000 }
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    // Validate current step before proceeding
    if (step === 1) {
      if (!name || !email) {
        toast.error('Please fill in your name and email')
        logger.error('Step 1 validation failed', { name, email })
        return
      }
    }
    if (step === 2 && !projectType) {
      toast.error('Please select a project type')
      logger.error('Step 2 validation failed', { projectType })
      return
    }
    if (step === 4 && selectedFeatures.length === 0) {
      toast((t) => (
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500" />
          <span>You haven't selected any features. Continue anyway?</span>
          <button
            onClick={() => {
              toast.dismiss(t.id)
              setStep(s => s + 1)
            }}
            className="ml-2 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 bg-gray-200 rounded-lg text-sm"
          >
            No
          </button>
        </div>
      ), { duration: 8000 })
      return
    }
    
    logger.info('Moving to next step', { from: step, to: step + 1 })
    setStep(s => Math.min(s + 1, 5))
  }

  const prevStep = () => {
    logger.info('Moving to previous step', { from: step, to: step - 1 })
    setStep(s => Math.max(s - 1, 1))
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Step {step} of 5
          </span>
          <span className="text-sm text-gray-500">
            {step === 1 && 'Basic Info'}
            {step === 2 && 'Project Type'}
            {step === 3 && 'Business Details'}
            {step === 4 && 'Features'}
            {step === 5 && 'Budget & Timeline'}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <motion.div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2.5 rounded-full"
            initial={{ width: `${(step - 1) * 25}%` }}
            animate={{ width: `${step * 20}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Instant Estimate Banner */}
      {instantEstimate && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl border border-green-200 dark:border-green-800"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Instant Estimate:</span>
              <span className="text-2xl font-bold gradient-text ml-2">${instantEstimate.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500">*Final price may vary after detailed discussion</p>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold mb-4">Tell us about yourself</h3>
              
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('name')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  {...register('phone')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="+92 300 1234567"
                />
              </div>
            </motion.div>
          )}

          {/* Step 2: Project Type */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="text-lg font-semibold mb-4">What would you like to build?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projectTypes.map((type) => (
                  <label
                    key={type.id}
                    className={`
                      relative p-4 rounded-xl border-2 cursor-pointer transition-all
                      ${projectType === type.id 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      {...register('projectType')}
                      value={type.id}
                      className="absolute opacity-0"
                    />
                    <div className="flex items-start">
                      <div className={`
                        w-10 h-10 rounded-lg flex items-center justify-center mr-3
                        ${projectType === type.id 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }
                      `}>
                        {type.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{type.label}</h4>
                        <p className="text-sm text-gray-500">{type.desc}</p>
                      </div>
                      {projectType === type.id && (
                        <CheckCircle className="w-5 h-5 text-blue-500 ml-2" />
                      )}
                    </div>
                  </label>
                ))}
              </div>
              {errors.projectType && (
                <p className="text-red-500 text-sm mt-2">{errors.projectType.message}</p>
              )}
            </motion.div>
          )}

          {/* Step 3: Business Details */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold mb-4">Tell us about your business</h3>
              
              {/* Business Size */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Business Size
                </label>
                <select
                  {...register('businessSize')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:ring-2 focus:ring-blue-500 transition"
                >
                  {businessSizes.map(size => (
                    <option key={size.id} value={size.id}>{size.label}</option>
                  ))}
                </select>
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Company Name <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  {...register('companyName')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Your Company Name"
                />
              </div>

              {/* Industry */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Industry <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  {...register('industry')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="e.g., Healthcare, Education, Retail"
                />
              </div>
            </motion.div>
          )}

          {/* Step 4: Features Selection */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="text-lg font-semibold mb-4">Select features you need</h3>
              <p className="text-sm text-gray-500 mb-4">Choose multiple features - each affects the final price</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {featureOptions.map((feature) => (
                  <label
                    key={feature.id}
                    className={`
                      flex items-center p-3 rounded-lg border cursor-pointer transition-all
                      ${selectedFeatures.includes(feature.id)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={selectedFeatures.includes(feature.id)}
                      onChange={() => handleFeatureToggle(feature.id)}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <span className="font-medium">{feature.label}</span>
                      <span className="text-sm text-gray-500 ml-2">+${feature.price}</span>
                    </div>
                  </label>
                ))}
              </div>

              {/* Detailed Requirements */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Additional Requirements <span className="text-gray-400">(Optional)</span>
                </label>
                <textarea
                  {...register('requirements')}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Tell us more about your project, specific features, or any special requirements..."
                />
              </div>
            </motion.div>
          )}

          {/* Step 5: Budget & Timeline */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-semibold mb-4">Budget & Timeline</h3>
              
              {/* Budget Range */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Budget Range <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['<5k', '5k-10k', '10k-25k', '25k-50k', '50k+', 'not-sure'].map((range) => (
                    <label
                      key={range}
                      className={`
                        flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all
                        ${budget === range
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        {...register('budget')}
                        value={range}
                        className="sr-only"
                      />
                      <span className="text-sm">{range === 'not-sure' ? 'Not Sure' : range}</span>
                    </label>
                  ))}
                </div>
                {errors.budget && (
                  <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>
                )}
              </div>

              {/* Timeline */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Timeline <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {timelineOptions.map((option) => (
                    <label
                      key={option.id}
                      className={`
                        flex items-center p-3 rounded-lg border cursor-pointer transition-all
                        ${timeline === option.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        {...register('timeline')}
                        value={option.id}
                        className="sr-only"
                      />
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
                {errors.timeline && (
                  <p className="text-red-500 text-sm mt-1">{errors.timeline.message}</p>
                )}
              </div>

              {/* Summary */}
              {instantEstimate && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <h4 className="font-semibold mb-3">Quote Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Base Price:</span>
                      <span>${basePrices[projectType as keyof typeof basePrices]?.toLocaleString() || 3000}</span>
                    </div>
                    {selectedFeatures.length > 0 && (
                      <div className="flex justify-between">
                        <span>Features (+{selectedFeatures.length}):</span>
                        <span>+${selectedFeatures.reduce((sum, id) => {
                          const f = featureOptions.find(f => f.id === id)
                          return sum + (f?.price || 0)
                        }, 0)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold pt-2 border-t">
                      <span>Estimated Total:</span>
                      <span className="gradient-text">${instantEstimate.toLocaleString()}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    *This is an estimate. Final quote will be provided after detailed discussion.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </button>
          )}
          
          {step < 5 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              Next Step
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Get Quote
                  <Send className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          )}
        </div>
      </form>

      {/* Success Modal with PDF Download */}
      {submittedQuoteId && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              
              <h3 className="text-2xl font-bold mb-2">Quote Submitted!</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Your quote request has been received. Quote ID: <span className="font-mono font-bold">{submittedQuoteId}</span>
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => downloadPDF(submittedQuoteId)}
                  disabled={isDownloading}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Download Quote PDF
                    </>
                  )}
                </button>
                
                <button
                  onClick={onClose}
                  className="w-full py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}