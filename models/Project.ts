import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  detailedDescription: String,
  category: {
    type: String,
    enum: ['web', 'app', 'ai', 'consultation', 'other'],
    required: true,
  },
  client: {
    name: String,
    company: String,
    website: String,
  },
  technologies: [String],
  features: [String],
  challenges: [String],
  solutions: [String],
  results: {
    type: Map,
    of: String,
  },
  images: [{
    url: String,
    alt: String,
    caption: String,
  }],
  liveUrl: String,
  githubUrl: String,
  demoUrl: String,
  featured: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published',
  },
  seo: {
    title: String,
    description: String,
    keywords: [String],
  },
  stats: {
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
  },
  metadata: {
    duration: String,
    teamSize: Number,
    budget: String,
    completionDate: Date,
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

projectSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  }
  this.updatedAt = new Date();
  //@ts-ignore
  next();
});

projectSchema.index({ category: 1, featured: 1, createdAt: -1 });
projectSchema.index({ slug: 1 });
projectSchema.index({ status: 1 });

export default mongoose.models.Project || mongoose.model('Project', projectSchema);