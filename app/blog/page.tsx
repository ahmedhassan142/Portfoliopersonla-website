import { Metadata } from 'next';
import { pageSEO } from '../seo.config';
import BlogPage from './BlogClient';

export const metadata: Metadata = {
  title: pageSEO.blog.title,
  description: pageSEO.blog.description,
  keywords: pageSEO.blog.keywords,
  openGraph: {
    title: pageSEO.blog.title,
    description: pageSEO.blog.description,
    url: `https://techsolutions.dev${pageSEO.blog.path}`,
  },
  alternates: {
    canonical: `https://techsolutions.dev${pageSEO.blog.path}`,
  },
};
export default function HomePage() {
  return <BlogPage />;
}