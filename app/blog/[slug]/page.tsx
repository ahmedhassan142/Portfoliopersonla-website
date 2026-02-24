import { notFound } from 'next/navigation';
import BlogDetailClient from './BlogDetailClient';
import { generateBlogPostSEO } from '../../seo.config';

// Helper function to create URL-friendly slugs
const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '-');
};



// Blog posts data (same as before)
const blogPosts = [
  {
    slug: createSlug('The Future of Web Development: Next.js 14 Features'),
    title: 'The Future of Web Development: Next.js 14 Features',
    excerpt: 'Explore the latest features in Next.js 14 including server actions, partial prerendering, and improved metadata handling.',
    content: `
      <h2>Introduction to Next.js 14</h2>
      <p>Next.js 14 introduces groundbreaking features that change how we build web applications. Server Actions allow for seamless server-side mutations, while Partial Prerendering combines static and dynamic content effortlessly.</p>
      
      <h2>Key Features</h2>
      
      <h3>1. Server Actions</h3>
      <p>Server Actions enable you to run server-side code directly from your components. This eliminates the need for separate API routes and simplifies data mutations. Here's a simple example:</p>
      
      <pre><code>// app/components/Form.tsx
export default function Form() {
  async function create(formData: FormData) {
    'use server'
    // This runs on the server
    await saveToDatabase(formData)
  }
  
  return <form action={create}>...</form>
}</code></pre>
      
      <h3>2. Partial Prerendering</h3>
      <p>This innovative approach combines static and dynamic rendering in the same route, providing the best of both worlds - fast static content with dynamic capabilities.</p>
      
      <h2>Conclusion</h2>
      <p>Next.js 14 focuses on developer experience and application performance, making it easier than ever to build fast, scalable web applications.</p>
    `,
    category: 'Web Development',
    author: {
      name: 'Alex Johnson',
      role: 'Senior Developer',
      bio: 'Senior Web Developer with 8+ years of experience in React and Next.js.',
      avatar: 'AJ',
      twitter: '@alexjohnson',
      github: 'alexjohnson'
    },
    date: 'Jan 15, 2024',
    readTime: '5 min read',
    tags: ['Next.js', 'React', 'TypeScript'],
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    views: 1234,
    likes: 89,
  },
  {
    slug: createSlug('Building Scalable Mobile Apps with React Native'),
    title: 'Building Scalable Mobile Apps with React Native',
    excerpt: 'Best practices and architecture patterns for building enterprise-grade mobile applications.',
    content: `
      <h2>Introduction</h2>
      <p>React Native continues to evolve as a powerful framework for cross-platform mobile development. This guide covers essential patterns for building scalable applications that can grow with your business.</p>
      
      <h2>Architecture Patterns</h2>
      
      <h3>State Management</h3>
      <p>Using Redux Toolkit with proper slice architecture ensures maintainable state management as your app grows.</p>
      
      <h3>Navigation Structure</h3>
      <p>Implementing React Navigation with nested navigators and proper type safety improves user experience.</p>
      
      <h2>Best Practices</h2>
      <ul>
        <li>Use TypeScript for type safety</li>
        <li>Implement proper error boundaries</li>
        <li>Optimize images and assets</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Following these patterns and best practices ensures your React Native application remains scalable and maintainable.</p>
    `,
    category: 'Mobile Development',
    author: {
      name: 'Sarah Chen',
      role: 'Mobile Lead',
      bio: 'Mobile Development Lead with expertise in React Native and Flutter.',
      avatar: 'SC',
      twitter: '@sarahchen',
      github: 'sarahchen'
    },
    date: 'Jan 10, 2024',
    readTime: '8 min read',
    tags: ['React Native', 'Mobile', 'Performance'],
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80',
    views: 987,
    likes: 67,
  },
  {
    slug: createSlug('AI Integration in Modern Applications'),
    title: 'AI Integration in Modern Applications',
    excerpt: 'How to effectively integrate AI capabilities into your existing applications.',
    content: `
      <h2>Introduction to AI Integration</h2>
      <p>Artificial Intelligence is no longer optional—it's a necessity for modern applications. This comprehensive guide shows you how to integrate AI features effectively.</p>
      
      <h2>Key AI Features</h2>
      
      <h3>Chatbots and Virtual Assistants</h3>
      <p>Implement intelligent chatbots using OpenAI's GPT models for customer support and user assistance.</p>
      
      <h3>Content Generation</h3>
      <p>Use AI to generate product descriptions, blog posts, and personalized content at scale.</p>
      
      <h2>Implementation Strategies</h2>
      <ul>
        <li>Start with OpenAI APIs for quick integration</li>
        <li>Build RAG systems with vector databases</li>
        <li>Optimize prompts for better results</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>AI integration can transform your application's capabilities and provide significant value to users.</p>
    `,
    category: 'AI & Machine Learning',
    author: {
      name: 'Mike Rodriguez',
      role: 'AI Engineer',
      bio: 'AI/ML Engineer specializing in practical AI applications.',
      avatar: 'MR',
      twitter: '@mikerodriguez',
      github: 'mikerodriguez'
    },
    date: 'Jan 5, 2024',
    readTime: '6 min read',
    tags: ['AI', 'ChatGPT', 'Machine Learning'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    views: 756,
    likes: 45,
  },
  {
    slug: createSlug('AI Agents: The Future of Autonomous Systems'),
    title: 'AI Agents: The Future of Autonomous Systems',
    excerpt: 'Discover how AI agents are transforming business automation. Learn about autonomous agents, multi-agent systems, and how they can handle complex tasks without human intervention.',
    content: `
      <h2>What are AI Agents?</h2>
      <p>AI agents are autonomous systems that can perceive their environment, make decisions, and take actions to achieve specific goals. Unlike traditional AI models that simply generate responses, agents can execute tasks, use tools, and learn from interactions.</p>
      
      <h2>Types of AI Agents</h2>
      
      <h3>1. Simple Reflex Agents</h3>
      <p>These agents act based on current percepts, ignoring the rest of history. They're suitable for simple, predictable environments.</p>
      
      <h3>2. Model-Based Agents</h3>
      <p>These agents maintain internal state to track aspects of the world not evident in current percepts. They can handle partially observable environments.</p>
      
      <h3>3. Goal-Based Agents</h3>
      <p>These agents act to achieve specific goals. They combine model-based reasoning with goal information to choose actions.</p>
      
      <h2>Building AI Agents with LangChain</h2>
      <pre><code>import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { Calculator } from "langchain/tools/calculator";
import { SerpAPI } from "langchain/tools";

const model = new ChatOpenAI({ modelName: "gpt-4" });
const tools = [new Calculator(), new SerpAPI()];

const executor = await initializeAgentExecutorWithOptions(tools, model, {
  agentType: "chat-conversational-react-description",
});

const result = await executor.call({ input: "What is the weather in Paris?" });</code></pre>
      
      <h2>Real-World Applications</h2>
      <ul>
        <li><strong>Customer Service:</strong> Agents that handle support tickets, answer questions, and escalate issues</li>
        <li><strong>Data Analysis:</strong> Agents that query databases, generate reports, and find insights</li>
        <li><strong>Code Generation:</strong> Agents that write, test, and debug code</li>
        <li><strong>Research:</strong> Agents that search, summarize, and synthesize information</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>AI agents represent a significant leap forward in automation. As the technology matures, we'll see agents handling increasingly complex tasks across industries.</p>
    `,
    category: 'AI & Machine Learning',
    author: {
      name: 'Mike Rodriguez',
      role: 'AI Engineer',
      bio: 'AI/ML Engineer specializing in practical AI applications and agent-based systems.',
      avatar: 'MR',
      twitter: '@mikerodriguez',
      github: 'mikerodriguez'
    },
    date: 'Feb 10, 2024',
    readTime: '9 min read',
    tags: ['AI Agents', 'Autonomous Systems', 'Machine Learning', 'LangChain'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    views: 2345,
    likes: 178,
  },
  {
    slug: createSlug('The AI Revolution: How Generative AI is Reshaping Industries'),
    title: 'The AI Revolution: How Generative AI is Reshaping Industries',
    excerpt: 'From GPT-4 to DALL-E 3 and beyond, explore how generative AI is revolutionizing content creation, software development, design, and business operations.',
    content: `
      <h2>The Generative AI Explosion</h2>
      <p>We're living through a pivotal moment in technology history. Generative AI has captured the world's imagination and is transforming how we work, create, and think.</p>
      
      <h2>Key Technologies Driving the Revolution</h2>
      
      <h3>Large Language Models (LLMs)</h3>
      <p>Models like GPT-4, Claude, and Llama 3 can understand and generate human-like text, code, and more. They're powering chatbots, writing assistants, and code generators.</p>
      
      <h3>Text-to-Image Models</h3>
      <p>DALL-E 3, Midjourney, and Stable Diffusion can create stunning images from text descriptions, revolutionizing design and creative work.</p>
      
      <h3>Text-to-Video Models</h3>
      <p>Emerging models like Sora and Runway can generate short video clips from text, opening new possibilities for content creation.</p>
      
      <h2>Industry Transformations</h2>
      
      <h3>Software Development</h3>
      <p>Tools like GitHub Copilot and Cursor are making developers more productive, handling routine coding tasks and suggesting improvements.</p>
      
      <h3>Content Creation</h3>
      <p>Writers, marketers, and designers are using AI to generate ideas, draft content, and create visuals at unprecedented speed.</p>
      
      <h3>Customer Service</h3>
      <p>AI-powered chatbots and agents are handling customer inquiries 24/7, reducing response times and improving satisfaction.</p>
      
      <h2>Conclusion</h2>
      <p>The AI revolution is just beginning. Organizations and individuals who embrace these technologies will thrive in the new era.</p>
    `,
    category: 'AI & Machine Learning',
    author: {
      name: 'Sarah Chen',
      role: 'AI Research Lead',
      bio: 'AI researcher focused on practical applications of generative models.',
      avatar: 'SC',
      twitter: '@sarahchen',
      github: 'sarahchen'
    },
    date: 'Feb 5, 2024',
    readTime: '12 min read',
    tags: ['Generative AI', 'GPT-4', 'DALL-E', 'AI Revolution'],
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=1965&q=80',
    views: 3456,
    likes: 267,
  },
  {
    slug: createSlug('LangChain: Building Powerful AI Workflows'),
    title: 'LangChain: Building Powerful AI Workflows',
    excerpt: 'Master LangChain for building sophisticated AI applications. Learn about chains, agents, memory, tools, and how to orchestrate multiple AI components.',
    content: `
      <h2>What is LangChain?</h2>
      <p>LangChain is a framework for developing applications powered by language models. It enables you to build sophisticated workflows by chaining together different components.</p>
      
      <h2>Key Concepts</h2>
      
      <h3>Chains</h3>
      <p>Chains allow you to combine multiple components together. For example, you can create a chain that retrieves information from a database, passes it to an LLM, and then formats the response.</p>
      
      <pre><code>import { LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";

const model = new OpenAI({ temperature: 0.9 });
const template = "What is a good name for a company that makes {product}?";
const prompt = new PromptTemplate({ template, inputVariables: ["product"] });
const chain = new LLMChain({ llm: model, prompt });</code></pre>
      
      <h3>Agents</h3>
      <p>Agents use an LLM to determine which actions to take and in what order. They can use tools to interact with the outside world.</p>
      
      <h3>Memory</h3>
      <p>Memory allows chains and agents to remember past interactions, enabling conversational AI experiences.</p>
      
      <h2>Building a RAG System</h2>
      <p>Retrieval-Augmented Generation (RAG) combines retrieval of external knowledge with LLM generation.</p>
      
      <h2>Conclusion</h2>
      <p>LangChain provides the building blocks for creating sophisticated AI applications. Start with simple chains and gradually add complexity as needed.</p>
    `,
    category: 'AI & Machine Learning',
    author: {
      name: 'Alex Johnson',
      role: 'Senior Developer',
      bio: 'Developer specializing in AI-powered applications and integrations.',
      avatar: 'AJ',
      twitter: '@alexjohnson',
      github: 'alexjohnson'
    },
    date: 'Feb 1, 2024',
    readTime: '15 min read',
    tags: ['LangChain', 'AI Workflows', 'Agents', 'LLM'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    views: 1876,
    likes: 143,
  }
];

// Helper function to get post by slug
const getPostBySlug = (slug: string) => {
  return blogPosts.find(post => post.slug === slug);
};

// Generate static paths for all blog posts
export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for each page - FIXED with await

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  // Await the params promise
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post) {
    notFound();
  }

  // Get related posts
  const relatedPosts = blogPosts
    .filter(p => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  // Pass data to client component
  return <BlogDetailClient post={post} relatedPosts={relatedPosts} />;
}
//@ts-ignore
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find(p => p.slug === slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const seo = generateBlogPostSEO(post);
  
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      type: 'article',
      title: seo.title,
      description: seo.description,
      url: `https://techsolutions.dev/blog/${post.slug}`,
      images: [{
        url: post.image,
        width: 1200,
        height: 630,
        alt: post.title,
      }],
      publishedTime: post.date,
      authors: [post.author.name],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: [post.image],
    },
    alternates: {
      canonical: `https://techsolutions.dev/blog/${post.slug}`,
    },
  };
}