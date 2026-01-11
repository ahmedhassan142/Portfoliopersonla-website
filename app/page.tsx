import ServiceCard from '../components/ServiceCard'
import Link from 'next/link'
import { 
  FaReact, 
  FaMobileAlt, 
  FaRobot, 
  FaBolt, 
  FaCheckCircle, 
  FaSyncAlt, 
  FaBullseye,
  FaArrowRight,
  FaMagic
} from 'react-icons/fa'
import { 
  SiNextdotjs, 
  SiTypescript, 
  SiReact, 
  SiFlutter, 
  SiNodedotjs, 
  SiMongodb, 
  SiFirebase,
  SiPython
} from 'react-icons/si'

const services = [
  {
    title: 'Web Development',
    description: 'Modern, responsive websites and web applications with cutting-edge technologies.',
    icon: <FaReact className="w-8 h-8" />,
    features: ['React/Next.js', 'TypeScript', 'Responsive Design', 'SEO Optimized'],
    icons: [<SiNextdotjs key="next" />, <SiTypescript key="ts" />, <FaReact key="react" />, <SiReact key="react2" />],
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'App Development',
    description: 'Cross-platform mobile applications for iOS and Android.',
    icon: <FaMobileAlt className="w-8 h-8" />,
    features: ['React Native', 'Flutter', 'Native Apps', 'App Store Ready'],
    icons: [<SiReact key="react-native" />, <SiFlutter key="flutter" />, <FaMobileAlt key="mobile" />, <FaMobileAlt key="store" />],
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    title: 'AI Integration',
    description: 'Intelligent solutions with machine learning and automation.',
    icon: <FaRobot className="w-8 h-8" />,
    features: ['ChatGPT API', 'ML Models', 'Automation', 'Data Analysis'],
    icons: [<FaRobot key="ai" />, <FaRobot key="ml" />, <FaSyncAlt key="auto" />, <FaRobot key="data" />],
    gradient: 'from-orange-500 to-red-500',
  },
]

const featuredProjects = [
  {
    title: 'E-commerce Platform',
    description: 'Full-stack online store with AI recommendations',
    tech: ['Next.js', 'Node.js', 'MongoDB', 'Stripe'],
    icons: [<SiNextdotjs key="next" />, <SiNodedotjs key="node" />, <SiMongodb key="mongo" />, <SiNodedotjs key="stripe" />],
    imageColor: 'bg-gradient-to-br from-blue-400 to-purple-500',
  },
  {
    title: 'Health & Fitness App',
    description: 'Mobile app with workout tracking and AI coaching',
    tech: ['React Native', 'Firebase', 'TensorFlow.js'],
    icons: [<SiReact key="react" />, <SiFirebase key="firebase" />, <FaRobot key="tensor" />],
    imageColor: 'bg-gradient-to-br from-green-400 to-teal-500',
  },
  {
    title: 'Business Analytics Dashboard',
    description: 'Real-time data visualization and insights',
    tech: ['React', 'D3.js', 'Python', 'FastAPI'],
    icons: [<SiReact key="react" />, <SiReact key="d3" />, <SiPython key="python" />, <SiPython key="fastapi" />],
    imageColor: 'bg-gradient-to-br from-orange-400 to-red-500',
  },
]

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="section-padding py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-6">
            <FaMagic className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Transforming Ideas into Digital Reality
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            <span className="block">Build Your</span>
            <span className="gradient-text">Digital Future</span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            Expert web development, mobile applications, and AI solutions tailored to grow your business.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 transition-all hover-lift inline-flex items-center justify-center"
            >
              Start Your Project <FaArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/portfolio"
              className="px-8 py-3 glass-effect rounded-lg font-semibold hover-lift"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Services</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Comprehensive tech solutions designed to solve your business challenges
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We deliver excellence through modern practices and dedicated support
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <FaBolt />, title: 'Fast Delivery', desc: 'Quick turnaround without compromising quality' },
              { icon: <FaCheckCircle />, title: 'Quality Code', desc: 'Clean, maintainable, and scalable solutions' },
              { icon: <FaSyncAlt />, title: 'Agile Process', desc: 'Flexible development with regular updates' },
              { icon: <FaBullseye />, title: 'Client Focus', desc: 'Your success is our top priority' },
            ].map((feature, index) => (
              <div
                key={index}
                className="glass-effect p-6 rounded-xl hover-lift"
              >
                <div className="text-3xl mb-4 text-blue-600 dark:text-blue-400">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding py-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Let's discuss your project and build something amazing together.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Free Consultation <FaArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  )
}