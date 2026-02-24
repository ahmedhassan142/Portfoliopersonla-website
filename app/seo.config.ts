// app/seo.config.ts
export const defaultSEO = {
  // Default metadata for all pages
  title: 'Tech Solutions | Web Development, Mobile Apps & AI Integration',
  description: 'Professional web development, mobile app development, and AI integration services. We build cutting-edge digital solutions for businesses in Pakistan and worldwide.',
  keywords: 'web development, mobile app development, AI integration, Next.js development, React Native, tech solutions, software house Pakistan, digital agency',
  
  // Open Graph (for Facebook, LinkedIn, etc.)
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://techsolutions.dev',
    siteName: 'Tech Solutions',
    images: [
      {
        url: 'https://techsolutions.dev/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tech Solutions - Digital Innovation',
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    site: '@techsolutions',
    creator: '@techsolutions',
    images: 'https://techsolutions.dev/twitter-image.jpg',
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Icons
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  
  // Verification (Google Search Console, etc.)
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    bing: 'your-bing-verification-code',
  },
  
  // Alternate languages
  alternates: {
    canonical: 'https://techsolutions.dev',
    languages: {
      'en-US': 'https://techsolutions.dev',
      'ur-PK': 'https://techsolutions.dev/ur',
    },
  },
};

// Per-page SEO configurations
export const pageSEO = {
  home: {
    title: 'Tech Solutions | Build Your Digital Future',
    description: 'Expert web development, mobile applications, and AI solutions tailored to grow your business. Transform your ideas into reality with cutting-edge technology.',
    keywords: 'web development company, mobile app development, AI solutions Pakistan',
    path: '/',
  },
  
  about: {
    title: 'About Us | Tech Solutions - Our Story & Team',
    description: 'Learn about Tech Solutions - our journey, mission, and the expert team behind your digital success. 5+ years of experience in delivering innovative tech solutions.',
    keywords: 'about tech solutions, software development team, our story',
    path: '/about',
  },
  
  services: {
    title: 'Our Services | Web, Mobile & AI Development',
    description: 'Comprehensive development services including custom web development, mobile apps, AI integration, cloud solutions, and UI/UX design. End-to-end digital solutions.',
    keywords: 'web development services, mobile app development services, AI integration services',
    path: '/services',
  },
  
  portfolio: {
    title: 'Our Portfolio | Tech Solutions Projects',
    description: 'Explore our successful projects across various industries. See how we\'ve helped businesses transform through innovative web, mobile, and AI solutions.',
    keywords: 'portfolio, web development projects, mobile app examples, case studies',
    path: '/portfolio',
  },
  
  contact: {
    title: 'Contact Us | Tech Solutions - Get in Touch',
    description: 'Ready to start your project? Contact Tech Solutions for a free consultation. We\'re based in Garden East, Karachi and serve clients worldwide.',
    keywords: 'contact tech solutions, get quote, project consultation, Karachi Pakistan',
    path: '/contact',
  },
  
  blog: {
    title: 'Tech Blog | Insights & Tutorials',
    description: 'Stay updated with the latest in web development, mobile apps, AI, and technology trends. Expert insights and practical tutorials from Tech Solutions.',
    keywords: 'tech blog, web development tutorials, AI insights, programming tips',
    path: '/blog',
  },
  
  privacy: {
    title: 'Privacy Policy | Tech Solutions',
    description: 'Read our privacy policy to understand how we collect, use, and protect your personal information when you use our website and services.',
    keywords: 'privacy policy, data protection, GDPR',
    path: '/privacy',
  },
};

// Blog post SEO helper
export const generateBlogPostSEO = (post: any) => ({
  title: `${post.title} | Tech Solutions Blog`,
  description: post.excerpt,
  keywords: post.tags?.join(', ') || 'technology, web development, programming',
  openGraph: {
    type: 'article',
    article: {
      publishedTime: post.date,
      authors: [post.author?.name || 'Tech Solutions'],
      tags: post.tags,
    },
  },
  path: `/blog/${post.slug}`,
});