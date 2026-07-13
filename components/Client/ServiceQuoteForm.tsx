'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
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
  X,
  RotateCcw,
  Copy,
  Check,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Zod schema
// ---------------------------------------------------------------------------
const quoteSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),

  projectType: z.enum(['website', 'mobile-app', 'web-app', 'ai-solution', 'ecommerce', 'custom'], {
    message: 'Please select a project type',
  }),

  businessSize: z.enum(['individual', 'startup', 'small', 'medium', 'enterprise']),
  companyName: z.string().optional(),
  industry: z.string().optional(),

  features: z.array(z.string()).optional(),
  requirements: z.string().optional(),

  budget: z.enum(['<5k', '5k-10k', '10k-25k', '25k-50k', '50k+', 'not-sure']),
  timeline: z.enum(['urgent', '1-month', '3-months', '6-months', 'flexible']),
})

type QuoteFormData = z.infer<typeof quoteSchema>

interface ServiceQuoteFormProps {
  onClose: () => void
}

// ---------------------------------------------------------------------------
// Static configuration
// ---------------------------------------------------------------------------
const projectTypes = [
  { id: 'website', label: 'Website', icon: <Globe className="w-5 h-5" />, desc: 'Business website, portfolio, blog' },
  { id: 'mobile-app', label: 'Mobile App', icon: <Smartphone className="w-5 h-5" />, desc: 'iOS / Android app' },
  { id: 'web-app', label: 'Web App', icon: <Code className="w-5 h-5" />, desc: 'SaaS, dashboard, platform' },
  { id: 'ai-solution', label: 'AI Solution', icon: <Cpu className="w-5 h-5" />, desc: 'Chatbots, ML, automation' },
  { id: 'ecommerce', label: 'E-commerce', icon: <ShoppingBag className="w-5 h-5" />, desc: 'Online store, marketplace' },
  { id: 'custom', label: 'Custom', icon: <Sparkles className="w-5 h-5" />, desc: 'Something unique' },
] as const

const businessSizes = [
  { id: 'individual', label: 'Individual / Freelancer', icon: <Users className="w-4 h-4" />, multiplier: 0.7 },
  { id: 'startup', label: 'Startup', icon: <Building2 className="w-4 h-4" />, multiplier: 1 },
  { id: 'small', label: 'Small Business', icon: <Building2 className="w-4 h-4" />, multiplier: 1.2 },
  { id: 'medium', label: 'Medium Business', icon: <Building2 className="w-4 h-4" />, multiplier: 1.5 },
  { id: 'enterprise', label: 'Enterprise', icon: <Building2 className="w-4 h-4" />, multiplier: 2 },
] as const

const featureOptions = [
  { id: 'responsive', label: 'Responsive Design', price: 500 },
  { id: 'seo', label: 'SEO Optimization', price: 300 },
  { id: 'cms', label: 'CMS Integration', price: 800 },
  { id: 'payment', label: 'Payment Gateway', price: 1000 },
  { id: 'auth', label: 'User Authentication', price: 600 },
  { id: 'analytics', label: 'Analytics Dashboard', price: 700 },
  { id: 'api', label: 'API Integration', price: 500 },
  { id: 'multilingual', label: 'Multi-language', price: 800 },
] as const

const timelineOptions = [
  { id: 'urgent', label: 'Urgent (1-2 weeks)', multiplier: 1.5 },
  { id: '1-month', label: '1 Month', multiplier: 1.2 },
  { id: '3-months', label: '3 Months', multiplier: 1 },
  { id: '6-months', label: '6 Months', multiplier: 0.9 },
  { id: 'flexible', label: 'Flexible', multiplier: 0.8 },
] as const

const basePrices: Record<string, number> = {
  website: 2000,
  'mobile-app': 5000,
  'web-app': 4000,
  'ai-solution': 6000,
  ecommerce: 4500,
  custom: 3000,
}

const TOTAL_STEPS = 5
const STEP_LABELS = ['Basic Info', 'Project Type', 'Business Details', 'Features', 'Budget & Timeline']

// Dev-only logger — never spam production console
const isDev = process.env.NODE_ENV === 'development'
const logger = {
  info: (m: string, d?: any) => isDev && console.log(`[QuoteForm] ${m}`, d ?? ''),
  error: (m: string, d?: any) => console.error(`[QuoteForm] ${m}`, d ?? ''),
  success: (m: string, d?: any) => isDev && console.log(`[QuoteForm] ${m}`, d ?? ''),
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function ServiceQuoteForm({ onClose }: ServiceQuoteFormProps) {
  const [step, setStep] = useState(1)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedQuote, setSubmittedQuote] = useState<{ id: string; quoteId: string; estimatedPrice?: number } | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [copied, setCopied] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    reset,
    formState: { errors },
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      businessSize: 'individual',
      budget: 'not-sure',
      timeline: 'flexible',
    },
    mode: 'onChange',
  })

  const projectType = watch('projectType')
  const businessSize = watch('businessSize')
  const timeline = watch('timeline')
  const budget = watch('budget')
  const name = watch('name')
  const email = watch('email')

  // ----- Escape key closes the modal ----------------------------------------
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isSubmitting, onClose])

  // ----- Reset everything when the form is closed ----------------------------
  // (parent unmounts this component, but this guards against reuse)
  useEffect(() => {
    if (!submittedQuote) return
    // Reset form state once user dismisses the success screen via onClose
  }, [submittedQuote])

  // ----- Estimate calculation ----------------------------------------------
  const calculateEstimate = useCallback((): number | null => {
    if (!projectType) return null
    let estimate = basePrices[projectType] ?? 3000

    selectedFeatures.forEach((featureId) => {
      const feature = featureOptions.find((f) => f.id === featureId)
      if (feature) estimate += feature.price
    })

    const sizeMultiplier = businessSizes.find((s) => s.id === businessSize)?.multiplier ?? 1
    estimate *= sizeMultiplier

    const timelineMultiplier = timelineOptions.find((t) => t.id === timeline)?.multiplier ?? 1
    estimate *= timelineMultiplier

    return Math.round(estimate)
  }, [projectType, selectedFeatures, businessSize, timeline])

  const instantEstimate = calculateEstimate()

  // ----- Feature toggle -----------------------------------------------------
  const handleFeatureToggle = (featureId: string) => {
    setSelectedFeatures((prev) => {
      const next = prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId]
      setValue('features', next)
      return next
    })
  }

  // ----- Step navigation ----------------------------------------------------
  const nextStep = async () => {
    // Validate the relevant fields for the current step before moving on
    let valid = true
    if (step === 1) {
      valid = await trigger(['name', 'email'])
      if (!valid) {
        toast.error('Please fill in your name and email to continue.')
        return
      }
    }
    if (step === 2 && !projectType) {
      toast.error('Please select a project type')
      return
    }
    if (step === 4 && selectedFeatures.length === 0) {
      const confirmed = await new Promise<boolean>((resolve) => {
        toast(
          (t) => (
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0" />
              <span className="text-sm">No features selected. Continue anyway?</span>
              <button
                onClick={() => {
                  toast.dismiss(t.id)
                  resolve(true)
                }}
                className="ml-2 px-3 py-1 bg-blue-600 text-white rounded-lg text-xs"
              >
                Yes
              </button>
              <button
                onClick={() => {
                  toast.dismiss(t.id)
                  resolve(false)
                }}
                className="px-3 py-1 bg-gray-200 rounded-lg text-xs"
              >
                No
              </button>
            </div>
          ),
          { duration: 10000 },
        )
      })
      if (!confirmed) return
    }

    setStep((s) => Math.min(s + 1, TOTAL_STEPS))
  }

  const prevStep = () => setStep((s) => Math.max(s - 1, 1))
  const goToStep = (target: number) => {
    // Only allow going back, or forward to already-completed steps
    if (target < step) setStep(target)
  }

  // ----- Download PDF -------------------------------------------------------
  const downloadPDF = async (quoteId: string) => {
    setIsDownloading(true)
    try {
      const response = await fetch(`/api/quotes/${quoteId}/pdf`, { method: 'GET' })
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
    } catch (error) {
      logger.error('PDF download failed', error)
      toast.error('Failed to download PDF. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  // ----- Copy quote ID ------------------------------------------------------
  const copyQuoteId = async () => {
    if (!submittedQuote?.quoteId) return
    try {
      await navigator.clipboard.writeText(submittedQuote.quoteId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy to clipboard')
    }
  }

  // ----- Form submission ----------------------------------------------------
  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true)
    try {
      const finalData = {
        ...data,
        estimatedPrice: instantEstimate,
        features: selectedFeatures,
      }

      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      })

      const result = await response.json()

      if (response.ok) {
        logger.success('Quote submitted', result)
        setSubmittedQuote({
          id: result.data.id,
          quoteId: result.data.quoteId || result.data.id,
          estimatedPrice: result.data.estimatedPrice,
        })
        // Do NOT auto-close — let the user download the PDF / copy the ID.
        // The success screen has its own Close button.
      } else {
        toast.error(
          <div>
            <p className="font-bold">Submission Failed</p>
            <p className="text-sm">{result.message || 'Please try again'}</p>
          </div>,
          { duration: 5000 },
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
        { duration: 5000 },
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // ----- Local submit handler: prevent Enter from prematurely submitting ----
  // (the form's onSubmit only fires from a submit button; Enter inside an
  // input would otherwise trigger it — we suppress that and require the
  // explicit "Get Quote" button on the last step)
  const handleFormSubmit = (e: React.FormEvent) => {
    if (step !== TOTAL_STEPS) {
      e.preventDefault()
      if (step < TOTAL_STEPS) nextStep()
      return
    }
    // On the last step, let react-hook-form's handleSubmit run
  }

  // ----- Reset for a new quote ---------------------------------------------
  const startNewQuote = () => {
    setSubmittedQuote(null)
    setSelectedFeatures([])
    setStep(1)
    reset({
      businessSize: 'individual',
      budget: 'not-sure',
      timeline: 'flexible',
    })
  }

  const handleClose = () => {
    if (submittedQuote) {
      // Clean state on the way out so reopening shows a fresh form
      startNewQuote()
    }
    onClose()
  }

  // ---------------------------------------------------------------------------
  // Success screen
  // ---------------------------------------------------------------------------
  if (submittedQuote) {
    return (
      <div className="w-full max-w-md mx-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30"
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>

          <h3 className="text-2xl font-bold mb-2 gradient-text">Quote Submitted!</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Your quote request has been received. We&apos;ll get back to you within 48 hours.
          </p>

          {/* Quote ID card */}
          <div className="mb-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Your Quote ID</p>
            <div className="flex items-center justify-center gap-2">
              <span className="font-mono font-bold text-lg">{submittedQuote.quoteId}</span>
              <button
                onClick={copyQuoteId}
                className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Copy quote ID"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-500" />
                )}
              </button>
            </div>
            {submittedQuote.estimatedPrice != null && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500">Estimated Price</p>
                <p className="text-2xl font-bold gradient-text">
                  ${submittedQuote.estimatedPrice.toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => downloadPDF(submittedQuote.quoteId)}
              disabled={isDownloading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center disabled:opacity-60"
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
              onClick={startNewQuote}
              className="w-full py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Submit Another Quote
            </button>

            <button
              onClick={handleClose}
              className="w-full py-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // ---------------------------------------------------------------------------
  // Multi-step form
  // ---------------------------------------------------------------------------
  const progressPercent = (step / TOTAL_STEPS) * 100
  const featuresTotal = selectedFeatures.reduce((sum, id) => {
    const f = featureOptions.find((f) => f.id === id)
    return sum + (f?.price ?? 0)
  }, 0)

  return (
    <div className="w-full max-w-3xl mx-auto" ref={containerRef}>
      {/* Header with close button (mobile-friendly) */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold gradient-text">Get Detailed Quote</h3>
          <p className="text-sm text-gray-500 mt-1">Step {step} of {TOTAL_STEPS} · {STEP_LABELS[step - 1]}</p>
        </div>
        <button
          onClick={handleClose}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Stepper (clickable to go back) */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <div className="flex gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
              const stepNum = i + 1
              const isCompleted = stepNum < step
              const isCurrent = stepNum === step
              return (
                <button
                  key={stepNum}
                  onClick={() => goToStep(stepNum)}
                  disabled={stepNum >= step}
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all
                    ${isCompleted
                      ? 'bg-green-500 text-white hover:bg-green-600 cursor-pointer'
                      : isCurrent
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    }
                  `}
                  aria-label={`Step ${stepNum}`}
                >
                  {isCompleted ? <CheckCircle className="w-4 h-4" /> : stepNum}
                </button>
              )
            })}
          </div>
          <span className="text-xs text-gray-500">{Math.round(progressPercent)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full"
            initial={false}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Live estimate banner — only show from step 2 once projectType is picked */}
      {step >= 2 && instantEstimate != null && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl border border-green-200 dark:border-green-800"
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Live Estimate:</span>
              <motion.span
                key={instantEstimate}
                initial={{ opacity: 0.5, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-2xl font-bold gradient-text ml-2"
              >
                ${instantEstimate.toLocaleString()}
              </motion.span>
            </div>
            <p className="text-xs text-gray-500">Final price confirmed after discussion</p>
          </div>
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <AnimatePresence mode="wait">
          {/* ---------- Step 1: Basic Info ---------- */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold mb-2">Tell us about yourself</h3>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('name')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="John Doe"
                  autoComplete="name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />{errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="john@example.com"
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />{errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone Number <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  {...register('phone')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="+92 300 1234567"
                  autoComplete="tel"
                />
              </div>
            </motion.div>
          )}

          {/* ---------- Step 2: Project Type ---------- */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h3 className="text-lg font-semibold mb-2">What would you like to build?</h3>
              <p className="text-sm text-gray-500 mb-4">Choose the option that best fits your project</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {projectTypes.map((type) => (
                  <label
                    key={type.id}
                    className={`
                      relative p-4 rounded-xl border-2 cursor-pointer transition-all
                      ${projectType === type.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
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
                        w-10 h-10 rounded-lg flex items-center justify-center mr-3 shrink-0
                        ${projectType === type.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }
                      `}>
                        {type.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold">{type.label}</h4>
                        <p className="text-sm text-gray-500">{type.desc}</p>
                      </div>
                      {projectType === type.id && (
                        <CheckCircle className="w-5 h-5 text-blue-500 ml-2 shrink-0" />
                      )}
                    </div>
                  </label>
                ))}
              </div>
              {errors.projectType && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />{errors.projectType.message}
                </p>
              )}
            </motion.div>
          )}

          {/* ---------- Step 3: Business Details ---------- */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold mb-2">Tell us about your business</h3>

              <div>
                <label className="block text-sm font-medium mb-2">Business Size</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {businessSizes.map((size) => (
                    <label
                      key={size.id}
                      className={`
                        flex items-center p-3 rounded-lg border cursor-pointer transition-all
                        ${businessSize === size.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        {...register('businessSize')}
                        value={size.id}
                        className="sr-only"
                      />
                      <span className={`
                        w-8 h-8 rounded-md flex items-center justify-center mr-3
                        ${businessSize === size.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                        }
                      `}>
                        {size.icon}
                      </span>
                      <span className="text-sm font-medium">{size.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Company Name <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  {...register('companyName')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Your Company Name"
                  autoComplete="organization"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Industry <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  {...register('industry')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="e.g., Healthcare, Education, Retail"
                />
              </div>
            </motion.div>
          )}

          {/* ---------- Step 4: Features ---------- */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div>
                  <h3 className="text-lg font-semibold">Select features you need</h3>
                  <p className="text-sm text-gray-500">Each feature adds to your estimate</p>
                </div>
                {selectedFeatures.length > 0 && (
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Features total</p>
                    <p className="font-bold gradient-text">+${featuresTotal.toLocaleString()}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {featureOptions.map((feature) => {
                  const isSelected = selectedFeatures.includes(feature.id)
                  return (
                    <label
                      key={feature.id}
                      className={`
                        flex items-center p-3 rounded-lg border cursor-pointer transition-all
                        ${isSelected
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                        }
                      `}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleFeatureToggle(feature.id)}
                        className="mr-3 w-4 h-4 accent-blue-600"
                      />
                      <div className="flex-1 flex justify-between items-center">
                        <span className="font-medium text-sm">{feature.label}</span>
                        <span className="text-sm text-gray-500 ml-2">+${feature.price}</span>
                      </div>
                    </label>
                  )
                })}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Additional Requirements <span className="text-gray-400">(Optional)</span>
                </label>
                <textarea
                  {...register('requirements')}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                  placeholder="Tell us more about your project, specific features, or any special requirements..."
                />
              </div>
            </motion.div>
          )}

          {/* ---------- Step 5: Budget & Timeline ---------- */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-semibold mb-2">Budget & Timeline</h3>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Budget Range <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: '<5k', label: 'Under $5K' },
                    { id: '5k-10k', label: '$5K – $10K' },
                    { id: '10k-25k', label: '$10K – $25K' },
                    { id: '25k-50k', label: '$25K – $50K' },
                    { id: '50k+', label: '$50K+' },
                    { id: 'not-sure', label: 'Not Sure' },
                  ].map((range) => (
                    <label
                      key={range.id}
                      className={`
                        flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all text-center
                        ${budget === range.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        {...register('budget')}
                        value={range.id}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">{range.label}</span>
                    </label>
                  ))}
                </div>
                {errors.budget && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />{errors.budget.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Timeline <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
                {errors.timeline && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />{errors.timeline.message}
                  </p>
                )}
              </div>

              {/* Final summary */}
              {instantEstimate != null && (
                <div className="mt-6 p-5 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
                    Quote Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Project Type:</span>
                      <span className="font-medium">
                        {projectTypes.find((t) => t.id === projectType)?.label || '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Business Size:</span>
                      <span className="font-medium">
                        {businessSizes.find((s) => s.id === businessSize)?.label || '-'}
                      </span>
                    </div>
                    {selectedFeatures.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Features ({selectedFeatures.length}):
                        </span>
                        <span className="font-medium">+${featuresTotal.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Timeline:</span>
                      <span className="font-medium">
                        {timelineOptions.find((t) => t.id === timeline)?.label || '-'}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold pt-3 mt-1 border-t border-gray-300 dark:border-gray-600 text-base">
                      <span>Estimated Total:</span>
                      <span className="gradient-text text-lg">${instantEstimate.toLocaleString()}</span>
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

        {/* Navigation */}
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

          {step < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all"
            >
              Next Step
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all disabled:opacity-60"
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
    </div>
  )
}
