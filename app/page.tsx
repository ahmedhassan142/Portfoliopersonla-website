import type { Metadata } from 'next';
import { pageSEO } from './seo.config';
import Home from './Home';  // Client component import

export const metadata: Metadata = {
  title: pageSEO.home.title,
  description: pageSEO.home.description,
  keywords: pageSEO.home.keywords,
  openGraph: {
    title: pageSEO.home.title,
    description: pageSEO.home.description,
    url: `https://techsolutions.dev${pageSEO.home.path}`,
  },
  alternates: {
    canonical: `https://techsolutions.dev${pageSEO.home.path}`,
  },
};

export default function HomePage() {
  return <Home />;
}