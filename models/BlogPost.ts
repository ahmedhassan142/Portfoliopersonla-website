// ahtech.fun/models/BlogPost.ts
import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
  // ✅ REQUIRED FIELDS
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  
  // ✅ OPTIONAL FIELDS
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  excerpt: {
    type: String,
    trim: true,
    maxlength: [300, 'Excerpt cannot exceed 300 characters'],
  },
  category: {
    type: String,
    default: 'Uncategorized',
    trim: true,
    index: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  published: {
    type: Boolean,
    default: true,
  },
  publishedAt: {
    type: Date,
    default: Date.now,
  },
  readingTime: {
    type: Number,
    default: 1,
  },
  
  // ✅ METADATA FIELDS
  author: {
    type: String,
    default: 'AI Content Generator',
  },
  source: {
    type: String,
    default: 'webhook',
  },
  // Optional dedup key for webhook deliveries — format: "<userId>:<externalContentId>".
  // Two webhook deliveries with the same sourceRef return the existing post
  // instead of creating a duplicate.
  sourceRef: {
    type: String,
    default: null,
    sparse: true,
    index: true,
  },
  
  // ✅ NEW: Featured Image field
  featuredImage: {
    type: String,
    default: '',
  },
  
  stats: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
  },
  seo: {
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: { type: [String] },
  },
  
  // ✅ TIMESTAMPS
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Indexes for performance
blogPostSchema.index({ slug: 1 }, { unique: true });
blogPostSchema.index({ category: 1, publishedAt: -1 });
blogPostSchema.index({ published: 1, publishedAt: -1 });
blogPostSchema.index({ tags: 1 });

// ✅ Pre-save hook
// blogPostSchema.pre('save', function(doc) {
//   if (!doc.slug && doc.title) {
//     doc.slug = doc.title
//       .toLowerCase()
//       .replace(/[^\w\s-]/g, '')
//       .replace(/\s+/g, '-')
//       .replace(/--+/g, '-')
//       .trim();
//   }
  
//   if (!doc.excerpt && doc.content) {
//     doc.excerpt = doc.content
//       .replace(/<[^>]*>/g, '')
//       .substring(0, 200) + '...';
//   }
  
//   if (doc.content) {
//     const words = doc.content.split(/\s+/).length;
//     doc.readingTime = Math.max(1, Math.ceil(words / 200));
//   }
  
//   if (doc.published && !doc.publishedAt) {
//     doc.publishedAt = new Date();
//   }
  
//   doc.updatedAt = new Date();
// });

// blogPostSchema.pre('findOneAndUpdate', function(doc) {
//   doc.set({ updatedAt: new Date() });
// });

export default mongoose.models.BlogPost || mongoose.model('BlogPost', blogPostSchema);