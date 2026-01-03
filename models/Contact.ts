import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
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
  },
  company: {
    type: String,
    trim: true,
  },
  service: {
    type: String,
    enum: ['web', 'app', 'ai', 'consultation', 'other'],
    required: true,
  },
  budget: {
    type: String,
    enum: ['<5k', '5k-10k', '10k-25k', '25k-50k', '50k+', 'undecided'],
    default: 'undecided',
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'in_progress', 'converted', 'archived'],
    default: 'new',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  notes: [{
    content: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: String,
  }],
  source: {
    type: String,
    default: 'website',
  },
  ipAddress: String,
  userAgent: String,
  responded: {
    type: Boolean,
    default: false,
  },
  followUpDate: Date,
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
contactSchema.pre('save', function(next:any) {
  this.updatedAt = new Date();
  next();
});

// Indexes for faster queries
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ email: 1 });
contactSchema.index({ service: 1 });
contactSchema.index({ priority: 1 });

export default mongoose.models.Contact || mongoose.model('Contact', contactSchema);