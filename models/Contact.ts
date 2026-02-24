import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
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
  service: {
    type: String,
    enum: ['web', 'app', 'ai', 'consultation', 'other'],
    required: true,
  },
  budget: {
    type: String,
    enum: ['<5k', '5k-10k', '10k-25k', '25k-50k', '50k+', 'undecided'],
    required: true,
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'archived'],
    default: 'new',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema);