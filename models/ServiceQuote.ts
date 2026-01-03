import mongoose from 'mongoose';

const serviceQuoteSchema = new mongoose.Schema({
  quoteId: {
    type: String,
    unique: true,
    required: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
  },
  contactInfo: {
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
    phone: String,
    company: String,
    website: String,
  },
  projectDetails: {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
    },
    type: {
      type: String,
      enum: ['web', 'mobile', 'ai', 'consultation', 'maintenance', 'other'],
      required: true,
    },
    subType: {
      web: [String], // ['e-commerce', 'landing-page', 'dashboard', 'cms', 'saas']
      mobile: [String], // ['ios', 'android', 'cross-platform', 'hybrid']
      ai: [String], // ['chatbot', 'automation', 'data-analysis', 'ml-model']
      other: [String],
    },
    features: [{
      name: String,
      description: String,
      complexity: {
        type: String,
        enum: ['simple', 'medium', 'complex', 'very-complex'],
        default: 'medium',
      },
      estimatedHours: Number,
    }],
    technologies: [String],
    designRequirements: {
      type: String,
      enum: ['basic', 'standard', 'premium', 'custom', 'not-sure'],
      default: 'standard',
    },
    contentCreation: {
      required: Boolean,
      description: String,
    },
    thirdPartyIntegrations: [String],
  },
  timeline: {
    startDate: Date,
    deadline: Date,
    urgency: {
      type: String,
      enum: ['flexible', 'standard', 'urgent', 'asap'],
      default: 'standard',
    },
    milestones: [{
      name: String,
      description: String,
      dueDate: Date,
      deliverable: String,
    }],
  },
  budget: {
    range: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'USD',
      },
    },
    paymentTerms: {
      type: String,
      enum: ['upfront-50', 'milestone', 'monthly', 'project-completion'],
      default: 'milestone',
    },
    hostingBudget: Number,
    maintenanceBudget: Number,
  },
  quoteDetails: {
    basePrice: Number,
    featurePrices: [{
      name: String,
      price: Number,
      hours: Number,
    }],
    designPrice: Number,
    contentPrice: Number,
    integrationPrices: [{
      name: String,
      price: Number,
    }],
    hostingPrice: {
      monthly: Number,
      annual: Number,
    },
    maintenancePrice: {
      monthly: Number,
      annual: Number,
    },
    subtotal: Number,
    discount: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    total: Number,
    validUntil: Date,
    terms: String,
    notes: String,
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'viewed', 'accepted', 'negotiating', 'rejected', 'expired'],
    default: 'draft',
  },
  communications: [{
    type: {
      type: String,
      enum: ['email', 'chat', 'call', 'meeting', 'comment'],
    },
    content: String,
    date: Date,
    sender: String,
    attachments: [{
      name: String,
      url: String,
      type: String,
    }],
  }],
  attachments: [{
    name: String,
    url: String,
    type: String,
    size: Number,
  }],
  version: {
    type: Number,
    default: 1,
  },
  previousVersions: [{
    version: Number,
    data: mongoose.Schema.Types.Mixed,
    createdAt: Date,
  }],
  viewedAt: [Date],
  sentAt: Date,
  acceptedAt: Date,
  rejectedAt: Date,
  followUpDate: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Generate quote ID
serviceQuoteSchema.pre('save', async function(next) {
  if (this.isNew) {
    const year = new Date().getFullYear();
    const count = await mongoose.models.ServiceQuote?.countDocuments({}) || 0;
    this.quoteId = `QT-${year}-${(count + 1).toString().padStart(4, '0')}`;
  }
  this.updatedAt = new Date();
  //@ts-ignore
  next();
});

// Indexes
serviceQuoteSchema.index({ quoteId: 1 }, { unique: true });
serviceQuoteSchema.index({ 'contactInfo.email': 1 });
serviceQuoteSchema.index({ status: 1, createdAt: -1 });
serviceQuoteSchema.index({ 'projectDetails.type': 1 });

export default mongoose.models.ServiceQuote || mongoose.model('ServiceQuote', serviceQuoteSchema);