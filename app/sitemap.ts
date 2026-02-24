import { MetadataRoute } from 'next';
import  blogPosts  from './blog/page'; // Adjust import path

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
  
  // Blog posts
  //@ts-ignore
  const blogUrls = blogPosts.map((post:any) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
  
  return [...staticPages, ...blogUrls];
}