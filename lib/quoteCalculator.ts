// Price configurations
export const PRICE_CONFIG = {
  baseRates: {
    web: {
      hourly: 75,
      minProject: 2000,
    },
    mobile: {
      hourly: 85,
      minProject: 3000,
    },
    ai: {
      hourly: 100,
      minProject: 5000,
    },
    consultation: {
      hourly: 150,
      minProject: 1000,
    },
    maintenance: {
      hourly: 65,
      minProject: 500,
    },
  },
  
  featureComplexity: {
    simple: {
      multiplier: 1,
      hours: 8,
    },
    medium: {
      multiplier: 1.5,
      hours: 16,
    },
    complex: {
      multiplier: 2.5,
      hours: 40,
    },
    'very-complex': {
      multiplier: 4,
      hours: 80,
    },
  },
  
  designTiers: {
    basic: 500,
    standard: 1500,
    premium: 3500,
    custom: 5000,
  },
  
  contentCreation: {
    perPage: 200,
    perBlog: 300,
    perProduct: 50,
  },
  
  integrations: {
    payment: 500,
    auth: 300,
    analytics: 200,
    cms: 400,
    api: 250,
    social: 150,
  },
  
  hosting: {
    basic: 25,
    standard: 50,
    premium: 100,
    enterprise: 200,
  },
  
  maintenance: {
    basic: 100,
    standard: 300,
    premium: 500,
  },
};

export interface FeatureInput {
  name: string;
  description: string;
  complexity: 'simple' | 'medium' | 'complex' | 'very-complex';
}

export interface QuoteInput {
  projectType: 'web' | 'mobile' | 'ai' | 'consultation' | 'maintenance';
  features: FeatureInput[];
  designTier: 'basic' | 'standard' | 'premium' | 'custom';
  contentPages: number;
  blogPosts: number;
  integrations: string[];
  hostingTier: 'basic' | 'standard' | 'premium' | 'enterprise';
  maintenanceTier: 'basic' | 'standard' | 'premium';
  urgency: 'flexible' | 'standard' | 'urgent' | 'asap';
  timelineMonths: number;
}

export interface QuoteOutput {
  breakdown: {
    features: Array<{
      name: string;
      complexity: string;
      hours: number;
      rate: number;
      subtotal: number;
    }>;
    design: {
      tier: string;
      price: number;
    };
    content: {
      pages: number;
      posts: number;
      price: number;
    };
    integrations: Array<{
      name: string;
      price: number;
    }>;
    hosting: {
      tier: string;
      monthly: number;
      annual: number;
    };
    maintenance: {
      tier: string;
      monthly: number;
      annual: number;
    };
  };
  subtotal: number;
  urgencyMultiplier: number;
  discount: number;
  tax: number;
  total: number;
  estimatedHours: number;
  timeline: string;
  validUntil: Date;
}

export function calculateQuote(input: QuoteInput): QuoteOutput {
  const config = PRICE_CONFIG;
  const baseRate = config.baseRates[input.projectType];
  
  // Calculate feature costs
  const features = input.features.map(feature => {
    const complexity = config.featureComplexity[feature.complexity];
    const hours = complexity.hours;
    const rate = baseRate.hourly;
    const subtotal = hours * rate * complexity.multiplier;
    
    return {
      name: feature.name,
      complexity: feature.complexity,
      hours,
      rate,
      subtotal: Math.round(subtotal),
    };
  });
  
  // Calculate feature total
  const featuresTotal = features.reduce((sum, f) => sum + f.subtotal, 0);
  
  // Design cost
  const designPrice = config.designTiers[input.designTier];
  
  // Content cost
  const contentPrice = 
    (input.contentPages * config.contentCreation.perPage) +
    (input.blogPosts * config.contentCreation.perBlog);
  
  // Integration costs
  const integrations = input.integrations.map(integration => ({
    name: integration,
    price: config.integrations[integration as keyof typeof config.integrations] || 200,
  }));
  const integrationsTotal = integrations.reduce((sum, i) => sum + i.price, 0);
  
  // Hosting cost
  const hostingMonthly = config.hosting[input.hostingTier];
  const hostingAnnual = hostingMonthly * 12 * 0.9; // 10% discount for annual
  
  // Maintenance cost
  const maintenanceMonthly = config.maintenance[input.maintenanceTier];
  const maintenanceAnnual = maintenanceMonthly * 12 * 0.9;
  
  // Calculate subtotal
  let subtotal = featuresTotal + designPrice + contentPrice + integrationsTotal;
  
  // Apply minimum project fee
  if (subtotal < baseRate.minProject) {
    subtotal = baseRate.minProject;
  }
  
  // Apply urgency multiplier
  const urgencyMultipliers = {
    flexible: 0.9,
    standard: 1,
    urgent: 1.2,
    asap: 1.5,
  };
  subtotal *= urgencyMultipliers[input.urgency];
  
  // Calculate total hours
  const estimatedHours = features.reduce((sum, f) => sum + f.hours, 0);
  
  // Apply discount for longer projects
  let discount = 0;
  if (input.timelineMonths >= 3) discount = 0.05;
  if (input.timelineMonths >= 6) discount = 0.1;
  
  const discounted = subtotal * (1 - discount);
  
  // Add tax (simplified)
  const tax = discounted * 0.1; // 10% tax
  
  const total = Math.round(discounted + tax);
  
  // Generate timeline
  const timeline = `${input.timelineMonths} month${input.timelineMonths > 1 ? 's' : ''}`;
  
  // Valid until 30 days from now
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 30);
  
  return {
    breakdown: {
      features,
      design: {
        tier: input.designTier,
        price: designPrice,
      },
      content: {
        pages: input.contentPages,
        posts: input.blogPosts,
        price: contentPrice,
      },
      integrations,
      hosting: {
        tier: input.hostingTier,
        monthly: hostingMonthly,
        annual: hostingAnnual,
      },
      maintenance: {
        tier: input.maintenanceTier,
        monthly: maintenanceMonthly,
        annual: maintenanceAnnual,
      },
    },
    subtotal: Math.round(subtotal),
    urgencyMultiplier: urgencyMultipliers[input.urgency],
    discount,
    tax: Math.round(tax),
    total,
    estimatedHours,
    timeline,
    validUntil,
  };
}