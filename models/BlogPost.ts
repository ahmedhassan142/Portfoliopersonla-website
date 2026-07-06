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
  
  // ✅ OPTIONAL FIELDS (auto-generated if not provided)
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

// ✅ Pre-save hook - auto-generate optional fields (NO next() function)
// blogPostSchema.pre('save', function(doc) {
//   // Generate slug from title if not provided
//   if (!doc.slug && doc.title) {
//     doc.slug = doc.title
//       .toLowerCase()
//       .replace(/[^\w\s-]/g, '')
//       .replace(/\s+/g, '-')
//       .replace(/--+/g, '-')
//       .trim();
//   }
  
//   // Auto-generate excerpt from content if not provided
//   if (!doc.excerpt && doc.content) {
//     doc.excerpt = doc.content
//       .replace(/<[^>]*>/g, '') // Remove HTML tags
//       .substring(0, 200) + '...';
//   }
  
//   // Calculate reading time
//   if (doc.content) {
//     const words = doc.content.split(/\s+/).length;
//     doc.readingTime = Math.max(1, Math.ceil(words / 200));
//   }
  
//   // Set publishedAt if published and not set
//   if (doc.published && !doc.publishedAt) {
//     doc.publishedAt = new Date();
//   }
  
//   // Update timestamp
//   doc.updatedAt = new Date();
// });

// // ✅ Auto-update updatedAt on findOneAndUpdate (NO next() function)
// blogPostSchema.pre('findOneAndUpdate', function(doc) {
//   doc.set({ updatedAt: new Date() });
// });

export default mongoose.models.BlogPost || mongoose.model('BlogPost', blogPostSchema);