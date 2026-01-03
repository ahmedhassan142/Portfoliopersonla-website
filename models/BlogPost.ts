import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
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
  excerpt: {
    type: String,
    required: [true, 'Excerpt is required'],
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  author: {
    name: String,
    avatar: String,
    bio: String,
  },
  coverImage: {
    url: String,
    alt: String,
  },
  category: {
    type: String,
    enum: ['web', 'app', 'ai', 'business', 'tutorial', 'news'],
    required: true,
  },
  tags: [String],
  readingTime: Number,
  published: {
    type: Boolean,
    default: false,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
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
    comments: {
      type: Number,
      default: 0,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  publishedAt: Date,
});

blogPostSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    const words = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(words / 200);
  }
  
  if (this.isModified('published') && this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
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

export default mongoose.models.BlogPost || mongoose.model('BlogPost', blogPostSchema);