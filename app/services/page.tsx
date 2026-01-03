import ServiceCard from '@/components/ServiceCard'
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
  FaChartLine
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
  SiStripe
} from 'react-icons/si'

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
  }
]

const pricingPlans = [
  {
    name: 'Starter',
    price: '$2,999',
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
    gradient: 'from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900'
  },
  {
    name: 'Professional',
    price: '$7,999',
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
    gradient: 'from-blue-500 to-purple-500'
  },
  {
    name: 'Enterprise',
    price: '$15,999+',
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
    gradient: 'from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900'
  }
]

export default function ServicesPage() {
  return (
    <div className="section-padding py-20">
      {/* Hero */}
      <div className="max-w-4xl mx-auto text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Comprehensive
          <span className="gradient-text block">Tech Solutions</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          From concept to deployment, I provide end-to-end development services tailored to your business needs.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-20">
        {services.map((service, index) => (
          <div key={index} className="glass-effect p-8 rounded-2xl hover-lift">
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${service.gradient} flex items-center justify-center text-white mb-6`}>
              {service.icon}
            </div>
            
            <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{service.description}</p>
            
            <div className="mb-8">
              <h4 className="font-semibold text-lg mb-4 flex items-center">
                <FaCheckCircle className="w-5 h-5 text-green-500 mr-2" />
                Key Features
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <div className="text-blue-500">
                      {service.techIcons[idx]}
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4 flex items-center">
                <FaSyncAlt className="w-5 h-5 text-purple-500 mr-2" />
                Development Process
              </h4>
              <div className="flex flex-wrap gap-2">
                {service.process.map((step, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 text-sm rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center"
                  >
                    <span className="mr-2 text-blue-500">{idx + 1}.</span>
                    {step}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Transparent Pricing</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Clear, upfront pricing for web development projects. Custom quotes available for unique requirements.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 transition-transform duration-300 ${
                plan.popular 
                  ? 'border-2 border-blue-500 shadow-xl scale-105 hover:scale-110' 
                  : 'border border-gray-200 dark:border-gray-700 hover:scale-105'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="px-4 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-full flex items-center">
                    <FaBolt className="w-3 h-3 mr-1" />
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-lg ${plan.popular ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-200 dark:bg-gray-700'} flex items-center justify-center text-white mr-4`}>
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-bold">{plan.name}</h3>
              </div>
              
              <div className="flex items-baseline mb-4">
                <span className="text-4xl font-bold gradient-text">{plan.price}</span>
                {plan.name !== 'Enterprise' && <span className="text-gray-500 ml-2">one-time</span>}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{plan.description}</p>
              
              <div className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <FaCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
              
              <button className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center ${
                plan.popular
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90'
                  : 'glass-effect hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}>
                Get Started
                <FaArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Process */}
      <div className="glass-effect rounded-2xl p-8 md:p-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Process</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A structured approach ensures quality and timely delivery
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            { icon: <FaCog />, title: 'Discovery', desc: 'Understanding your goals and requirements' },
            { icon: <FaBolt />, title: 'Planning', desc: 'Creating detailed specifications and timeline' },
            { icon: <FaShieldAlt />, title: 'Development', desc: 'Building with clean code and best practices' },
            { icon: <FaSyncAlt />, title: 'Delivery', desc: 'Testing, deployment, and ongoing support' },
          ].map((step, index) => (
            <div key={index} className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                {step.icon}
              </div>
              <div className="text-2xl font-bold mb-2">{step.title}</div>
              <div className="text-gray-600 dark:text-gray-300">{step.desc}</div>
              <div className="mt-4 text-3xl font-bold text-gray-300 dark:text-gray-700 group-hover:text-blue-500 transition-colors">
                0{index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}