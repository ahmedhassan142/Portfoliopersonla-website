import ServiceCard from '@/components/ServiceCard'
import ChatWidget from '@/components/Shared/ChatWidget'
import type { Metadata } from 'next';
import { 
  FaDesktop, 
  FaMobileAlt, 
  FaRobot, 
  FaTools, 
  FaBolt, 
  FaCheckCircle, 
  FaShieldAlt, 
  FaSyncAlt,
  FaArrowRight,
  FaCog,
  FaChartLine,
  FaStar,
  FaRocket
} from 'react-icons/fa'
import { 
  SiNextdotjs, 
  SiTypescript, 
  SiReact, 
  SiFlutter, 
  SiFirebase, 
  SiPython,
  SiNodedotjs,
  SiMongodb,
  SiStripe,
  SiTailwindcss,
  SiDocker
} from 'react-icons/si'
import Link from 'next/link'

const services = [
  {
    title: 'Custom Web Development',
    description: 'Bespoke websites and web applications built with modern frameworks and best practices.',
    icon: <FaDesktop className="w-8 h-8" />,
    features: [
      'Responsive Design',
      'SEO Optimization',
      'Performance Tuning',
      'E-commerce Solutions',
      'CMS Integration',
      'API Development'
    ],
    techIcons: [<SiNextdotjs key="next" />, <SiTypescript key="ts" />, <SiReact key="react" />, <SiNodedotjs key="node" />, <SiMongodb key="mongo" />, <SiStripe key="stripe" />],
    gradient: 'from-blue-500 to-cyan-500',
    process: ['Discovery', 'Design', 'Development', 'Testing', 'Launch', 'Support']
  },
  {
    title: 'Mobile App Development',
    description: 'Native and cross-platform mobile applications for iOS and Android.',
    icon: <FaMobileAlt className="w-8 h-8" />,
    features: [
      'iOS & Android Apps',
      'React Native/Flutter',
      'App Store Deployment',
      'Push Notifications',
      'Offline Functionality',
      'API Integration'
    ],
    techIcons: [<SiReact key="react-native" />, <SiFlutter key="flutter" />, <FaMobileAlt key="ios" />, <FaMobileAlt key="android" />, <SiFirebase key="firebase" />, <SiNodedotjs key="node" />],
    gradient: 'from-purple-500 to-pink-500',
    process: ['Planning', 'UI/UX Design', 'Development', 'QA Testing', 'Store Submission', 'Updates']
  },
  {
    title: 'AI & Machine Learning',
    description: 'Intelligent solutions including chatbots, automation, and data analysis.',
    icon: <FaRobot className="w-8 h-8" />,
    features: [
      'ChatGPT Integration',
      'Custom ML Models',
      'Data Analysis',
      'Process Automation',
      'Predictive Analytics',
      'Computer Vision'
    ],
    techIcons: [<FaRobot key="chatgpt" />, <SiPython key="python" />, <FaChartLine key="analysis" />, <FaSyncAlt key="automation" />, <FaRobot key="predictive" />, <FaRobot key="vision" />],
    gradient: 'from-orange-500 to-red-500',
    process: ['Requirement Analysis', 'Data Preparation', 'Model Training', 'Integration', 'Testing', 'Deployment']
  },
  {
    title: 'Maintenance & Support',
    description: 'Ongoing support and maintenance to keep your applications running smoothly.',
    icon: <FaTools className="w-8 h-8" />,
    features: [
      'Regular Updates',
      'Security Patches',
      'Performance Monitoring',
      'Bug Fixes',
      'Backup Management',
      'Technical Support'
    ],
    techIcons: [<FaSyncAlt key="updates" />, <FaShieldAlt key="security" />, <FaChartLine key="monitoring" />, <FaTools key="bugs" />, <FaTools key="backup" />, <FaTools key="support" />],
    gradient: 'from-green-500 to-teal-500',
    process: ['Monitoring', 'Updates', 'Security', 'Backups', 'Reports', 'Support']
  },
  {
    title: 'Cloud Solutions',
    description: 'Scalable cloud infrastructure and deployment solutions for modern applications.',
    icon: <FaBolt className="w-8 h-8" />,
    features: [
      'AWS/Azure/GCP',
      'Serverless Architecture',
      'Microservices',
      'Load Balancing',
      'Auto Scaling',
      'Cloud Security'
    ],
    techIcons: [<FaBolt key="aws" />, <SiDocker key="docker" />, <FaSyncAlt key="serverless" />, <FaShieldAlt key="security" />, <FaChartLine key="monitoring" />, <FaCog key="config" />],
    gradient: 'from-yellow-500 to-orange-500',
    process: ['Assessment', 'Migration', 'Optimization', 'Security', 'Monitoring', 'Support']
  },
  {
    title: 'UI/UX Design',
    description: 'User-centered design solutions that enhance user experience and engagement.',
    icon: <FaStar className="w-8 h-8" />,
    features: [
      'User Research',
      'Wireframing',
      'Prototyping',
      'Visual Design',
      'Usability Testing',
      'Design Systems'
    ],
    techIcons: [<FaDesktop key="desktop" />, <FaMobileAlt key="mobile" />, <FaStar key="design" />, <SiTailwindcss key="tailwind" />, <FaTools key="prototype" />, <FaCheckCircle key="testing" />],
    gradient: 'from-pink-500 to-rose-500',
    process: ['Research', 'Ideation', 'Design', 'Prototype', 'Test', 'Iterate']
  }
]

const pricingPlans = [
  {
    name: 'Starter',
    price: '$700',
    description: 'Perfect for small projects and MVPs',
    features: [
      'Up to 5 pages',
      'Basic SEO',
      'Responsive Design',
      'Contact Form',
      '1 Month Support',
      'Basic Analytics'
    ],
    popular: false,
    icon: <FaCog className="w-6 h-6" />,
  },
  {
    name: 'Professional',
    price: '$2,000',
    description: 'Most popular for growing businesses',
    features: [
      'Up to 15 pages',
      'Advanced SEO',
      'Custom Design',
      'CMS Integration',
      '3 Months Support',
      'Advanced Analytics',
      'Performance Optimization',
      'API Integration'
    ],
    popular: true,
    icon: <FaBolt className="w-6 h-6" />,
  },
  {
    name: 'Enterprise',
    price: '$5,000',
    description: 'Custom solutions for large scale projects',
    features: [
      'Unlimited Pages',
      'Full SEO Package',
      'Premium Design',
      'Custom Features',
      '6 Months Support',
      'Priority Support',
      'Advanced Security',
      'Scalable Architecture',
      'Monthly Reports'
    ],
    popular: false,
    icon: <FaShieldAlt className="w-6 h-6" />,
  }
]

const processSteps = [
  {
    icon: <FaCog className="w-8 h-8" />,
    title: 'Discovery',
    description: 'Understanding your goals, requirements, and target audience'
  },
  {
    icon: <FaBolt className="w-8 h-8" />,
    title: 'Planning',
    description: 'Creating detailed specifications, timeline, and architecture'
  },
  {
    icon: <FaShieldAlt className="w-8 h-8" />,
    title: 'Development',
    description: 'Building with clean code, best practices, and regular updates'
  },
  {
    icon: <FaSyncAlt className="w-8 h-8" />,
    title: 'Testing',
    description: 'Comprehensive testing across all platforms and devices'
  },
  {
    icon: <FaRocket className="w-8 h-8" />,
    title: 'Deployment',
    description: 'Smooth launch with monitoring and optimization'
  },
  {
    icon: <FaTools className="w-8 h-8" />,
    title: 'Support',
    description: 'Ongoing maintenance, updates, and technical support'
  }
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative w-full h-[800px] min-h-[800px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-purple-900/80 to-blue-900/90" />
          {/* FIXED SVG LINE - Using template literal properly */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat'
            }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto text-center px-4">
          <div className="animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white text-sm font-medium">Premium Development Services</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-white">Comprehensive</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 block mt-2">
                Tech Solutions
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-10 leading-relaxed">
              From concept to deployment, I provide end-to-end development services 
              tailored to your business needs with cutting-edge technology.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center mb-16">
              <Link
                href="/Contact"
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 inline-flex items-center text-lg"
              >
                Start Your Project
                <FaArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#services"
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 inline-flex items-center text-lg border border-white/20"
              >
                Explore Services
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {[
                { value: '100+', label: 'Projects Completed' },
                { value: '50+', label: 'Happy Clients' },
                { value: '5+', label: 'Years Experience' },
                { value: '20+', label: 'Team Members' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-300 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section-padding py-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">
              What We Offer
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              Comprehensive{' '}
              <span className="gradient-text">Development Services</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              End-to-end solutions tailored to your specific requirements, 
              delivered with excellence and innovation.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${service.gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{service.description}</p>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="font-semibold text-lg mb-3 flex items-center">
                    <FaCheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    Key Features
                  </h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technologies */}
                <div className="mb-6">
                  <h4 className="font-semibold text-lg mb-3">Technologies</h4>
                  <div className="flex flex-wrap gap-3">
                    {service.techIcons.map((icon, idx) => (
                      <div key={idx} className="text-2xl text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors">
                        {icon}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Process */}
                <div>
                  <h4 className="font-semibold text-lg mb-3">Process</h4>
                  <div className="flex flex-wrap gap-2">
                    {service.process.map((step, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      >
                        {idx + 1}. {step}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">
              How We Work
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              Our Development{' '}
              <span className="gradient-text">Process</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A structured approach that ensures quality, transparency, and successful delivery
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className="relative bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Step Number */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white mb-6">
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">
              Pricing
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              Transparent{' '}
              <span className="gradient-text">Pricing Plans</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose the perfect plan for your project. Custom quotes available for unique requirements.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl transition-all duration-300 hover:-translate-y-2 ${
                  plan.popular ? 'border-2 border-purple-500 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white mb-6`}>
                  {plan.icon}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold gradient-text">{plan.price}</span>
                  {plan.name !== 'Enterprise' && <span className="text-gray-500 ml-2">/project</span>}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{plan.description}</p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm">
                      <FaCheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link
                  href="/Contact"
                  className={`block w-full py-3 text-center rounded-lg font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/30'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>

          {/* Custom Quote Note */}
          <div className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-300">
              Need a custom solution?{' '}
              <Link href="/Contact" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                Contact us for a personalized quote
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Let's discuss how we can bring your ideas to life with our expertise.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Get Free Consultation
            <FaArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
         <div id="chat-widget">
        <ChatWidget />
      </div>
      </section>
    </div>
  )
}