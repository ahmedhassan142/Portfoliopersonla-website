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
     // Remove this line if you have schema.index() for slug
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
  // ... rest of your schema
});

// Remove duplicate index definitions - keep only one
// EITHER use unique: true in schema OR schema.index(), not both
blogPostSchema.index({ slug: 1 }, { unique: true }); // Keep this OR remove it
blogPostSchema.index({ category: 1, featured: 1, createdAt: -1 });
blogPostSchema.index({ status: 1 });

// Remove the duplicate from pre-save hook
blogPostSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    const words = this.content.split(/\s+/).length;
    //@ts-ignore
    this.readingTime = Math.ceil(words / 200);
  }
  //@ts-ignore
  if (this.isModified('published') && this.published && !this.publishedAt) {
    //@ts-ignore
    this.publishedAt = new Date();
  }
  
  // Only create slug if it doesn't exist
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  }
  //@ts-ignore
  this.updatedAt = new Date();
  //@ts-ignore
  next();
});

export default mongoose.models.BlogPost || mongoose.model('BlogPost', blogPostSchema);