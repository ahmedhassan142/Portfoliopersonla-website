import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true,
  },
  clientCompany: {
    type: String,
    trim: true,
  },
  clientPosition: String,
  clientAvatar: String,
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  projectType: {
    type: String,
    enum: ['web', 'app', 'ai', 'consultation', 'other'],
    required: true,
  },
  testimonial: {
    type: String,
    required: [true, 'Testimonial text is required'],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  projectLink: String,
  socialProof: {
    linkedin: String,
    twitter: String,
    website: String,
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

export default mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);