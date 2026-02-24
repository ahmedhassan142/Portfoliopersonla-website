import { MetadataRoute } from 'next';

// Define blog posts data directly in sitemap file to avoid import issues
const blogPosts = [
  {
    slug: 'the-future-of-web-development-nextjs-14-features',
    date: '2024-01-15',
  },
  {
    slug: 'building-scalable-mobile-apps-with-react-native',
    date: '2024-01-10',
  },
  {
    slug: 'ai-integration-in-modern-applications',
    date: '2024-01-05',
  },
  {
    slug: 'ai-agents-the-future-of-autonomous-systems',
    date: '2024-02-10',
  },
  {
    slug: 'the-ai-revolution-how-generative-ai-is-reshaping-industries',
    date: '2024-02-05',
  },
  {
    slug: 'langchain-building-powerful-ai-workflows',
    date: '2024-02-01',
  },
  // Add more blog posts as needed
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://techsolutions.dev';
  
  // Static pages
  const staticPages = [
    '',
    '/about',
    '/services',
    '/portfolio',
    '/contact',
    '/blog',
    '/privacy',
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }));
  
  // Blog posts - check if blogPosts exists and is array
  const blogUrls = Array.isArray(blogPosts) 
    ? blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))
    : [];
  
  return [...staticPages, ...blogUrls];
}