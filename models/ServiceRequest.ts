import mongoose from 'mongoose';

const serviceRequestSchema = new mongoose.Schema({
  contactId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
  },
  serviceType: {
    type: String,
    enum: ['web', 'app', 'ai', 'consultation', 'maintenance', 'other'],
    required: true,
  },
  requirements: {
    type: String,
    required: true,
  },
  features: [String],
  timeline: {
    type: String,
    enum: ['urgent', '1-2_weeks', '1_month', '2-3_months', 'flexible'],
    default: 'flexible',
  },
  budgetRange: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD',
    },
  },
  attachments: [{
    filename: String,
    url: String,
    size: Number,
    type: String,
  }],
  quote: {
    amount: Number,
    currency: {
      type: String,
      default: 'USD',
    },
    breakdown: [{
      item: String,
      description: String,
      price: Number,
    }],
    validUntil: Date,
    status: {
      type: String,
      enum: ['draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired'],
      default: 'draft',
    },
    sentAt: Date,
    viewedAt: Date,
  },
  status: {
    type: String,
    enum: ['new', 'quote_sent', 'negotiation', 'accepted', 'rejected', 'cancelled'],
    default: 'new',
  },
  communications: [{
    type: {
      type: String,
      enum: ['email', 'call', 'meeting', 'note'],
    },
    content: String,
    date: Date,
    sender: String,
  }],
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.ServiceRequest || mongoose.model('ServiceRequest', serviceRequestSchema);