import mongoose from 'mongoose';

const QuoteSchema = new mongoose.Schema({
  // Basic Info
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
    default: '',
  },

  // Project Details
  projectType: {
    type: String,
    enum: ['website', 'mobile-app', 'web-app', 'ai-solution', 'ecommerce', 'custom'],
    required: [true, 'Project type is required'],
  },

  // Business Details
  businessSize: {
    type: String,
    enum: ['individual', 'startup', 'small', 'medium', 'enterprise'],
    default: 'individual',
  },
  companyName: {
    type: String,
    trim: true,
    default: '',
  },
  industry: {
    type: String,
    trim: true,
    default: '',
  },

  // Features & Requirements
  features: [{
    type: String,
    enum: ['responsive', 'seo', 'cms', 'payment', 'auth', 'analytics', 'api', 'multilingual'],
  }],
  requirements: {
    type: String,
    trim: true,
    default: '',
  },

  // Budget & Timeline
  budget: {
    type: String,
    enum: ['<5k', '5k-10k', '10k-25k', '25k-50k', '50k+', 'not-sure'],
    required: [true, 'Budget range is required'],
  },
  timeline: {
    type: String,
    enum: ['urgent', '1-month', '3-months', '6-months', 'flexible'],
    required: [true, 'Timeline is required'],
  },

  // Calculated Fields
  estimatedPrice: {
    type: Number,
    min: 0,
    default: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'quoted', 'accepted', 'rejected', 'completed'],
    default: 'pending',
  },

  // Admin Fields
  assignedTo: {
    type: String,
    default: null,
  },
  adminNotes: {
    type: String,
    default: '',
  },
  quotedPrice: {
    type: Number,
    min: 0,
  },
  quoteSentAt: {
    type: Date,
  },

  // Metadata
  ipAddress: {
    type: String,
    default: '',
  },
  userAgent: {
    type: String,
    default: '',
  },
  source: {
    type: String,
    enum: ['direct', 'google', 'social', 'referral'],
    default: 'direct',
  },
}, {
  // Sirf basic timestamps
  timestamps: { 
    createdAt: 'createdAt', 
    updatedAt: 'updatedAt' 
  },
});

// Sirf basic indexes - performance ke liye
QuoteSchema.index({ email: 1 });
QuoteSchema.index({ status: 1 });
QuoteSchema.index({ createdAt: -1 });

// Simple model export - koi virtuals, koi middleware nahi
const Quote = mongoose.models.Quote || mongoose.model('Quote', QuoteSchema);

export default Quote;