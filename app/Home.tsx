'use client'

import { useEffect, useRef, useState } from 'react'
import ServiceCard from '../components/ServiceCard'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { 
  FaReact, 
  FaMobileAlt, 
  FaRobot, 
  FaBolt, 
  FaCheckCircle, 
  FaSyncAlt, 
  FaBullseye,
  FaArrowRight,
  FaMagic,
  FaRocket,
  FaUsers,
  FaAward,
  FaGlobe,
  FaCloud,
  FaChartLine
} from 'react-icons/fa'
import { 
  SiNextdotjs, 
  SiTypescript, 
  SiReact, 
  SiFlutter, 
  SiNodedotjs, 
  SiMongodb, 
  SiFirebase,
  SiPython,
  SiTailwindcss,
  SiDocker,
  SiKubernetes,
  SiTensorflow
} from 'react-icons/si'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

// Dynamically import ChatWidget to avoid SSR issues
const ChatWidget = dynamic(() => import('@/components/Shared/ChatWidget'), {
  ssr: false,
  loading: () => null
})

// Dynamically import Tilt with SSR disabled
const Tilt = dynamic(() => import('react-parallax-tilt'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl"></div>
})

const services = [
  {
    title: 'Web Development',
    description: 'Modern, responsive websites and web applications with cutting-edge technologies.',
    icon: <FaReact className="w-8 h-8" />,
    features: ['React/Next.js', 'TypeScript', 'Responsive Design', 'SEO Optimized'],
    icons: [<SiNextdotjs key="next" />, <SiTypescript key="ts" />, <FaReact key="react" />, <SiTailwindcss key="tailwind" />],
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
    icons: [<FaRobot key="ai" />, <SiPython key="python" />, <FaSyncAlt key="auto" />, <SiTensorflow key="tensor" />],
    gradient: 'from-orange-500 to-red-500',
  },
  {
    title: 'Cloud Solutions',
    description: 'Scalable cloud infrastructure and deployment solutions.',
    icon: <FaCloud className="w-8 h-8" />,
    features: ['AWS/Azure', 'Serverless', 'Microservices', 'DevOps'],
    icons: [<FaCloud key="aws" />, <SiDocker key="docker" />, <SiKubernetes key="k8s" />, <FaBolt key="devops" />],
    gradient: 'from-yellow-500 to-orange-500',
  },
]

const stats = [
  { value: '100+', label: 'Projects Completed', icon: <FaRocket />, color: 'from-blue-500 to-cyan-500' },
  { value: '50+', label: 'Happy Clients', icon: <FaUsers />, color: 'from-purple-500 to-pink-500' },
  { value: '5+', label: 'Years Experience', icon: <FaAward />, color: 'from-orange-500 to-red-500' },
  { value: '15+', label: 'Countries Served', icon: <FaGlobe />, color: 'from-green-500 to-teal-500' },
]

const technologies = [
  { icon: <SiNextdotjs className="text-4xl" />, name: 'Next.js', level: 95 },
  { icon: <SiTypescript className="text-4xl" />, name: 'TypeScript', level: 90 },
  { icon: <SiReact className="text-4xl" />, name: 'React', level: 95 },
  { icon: <SiNodedotjs className="text-4xl" />, name: 'Node.js', level: 90 },
  { icon: <SiPython className="text-4xl" />, name: 'Python', level: 85 },
  { icon: <SiDocker className="text-4xl" />, name: 'Docker', level: 80 },
]

export default function Home() {
  const { scrollYProgress } = useScroll()
  const heroRef = useRef(null)
  const statsRef = useRef(null)
  const isStatsInView = useInView(statsRef, { once: true, amount: 0.3 })
  const [mounted, setMounted] = useState(false)
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8])
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 50])
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  // Client-side only effect with window check
  useEffect(() => {
    setMounted(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Particles component - only render on client
  const Particles = () => {
    if (!mounted) return null
    
    return (
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.1),transparent_50%),radial-gradient(ellipse_at_bottom,rgba(147,51,234,0.1),transparent_50%)]" />
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-500/20 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            }}
            animate={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
              transition: {
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              },
            }}
            style={{
              filter: "blur(1px)",
            }}
          />
        ))}
      </div>
    )
  }

  // Loading state
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading amazing experience...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <Particles />

      {/* Hero Section with Parallax */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Animated Background */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{
            opacity: heroOpacity,
            scale: heroScale,
            y: heroY,
          }}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
              transform: mounted ? `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)` : 'none',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-blue-900/80 to-purple-900/90" />
          
          {/* Floating Geometric Shapes */}
          <motion.div
            className="absolute top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, 30, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, -40, 0],
              y: [0, 40, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Hero Content */}
        <motion.div 
          className="relative z-10 max-w-6xl mx-auto text-center px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <FaMagic className="w-4 h-4 text-blue-300" />
            </motion.div>
            <span className="text-white text-sm font-medium">Transforming Ideas into Digital Reality</span>
          </motion.div>

          {/* Main Heading with 3D Effect */}
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={mounted ? {
              transform: `perspective(1000px) rotateX(${mousePosition.y * 0.5}deg) rotateY(${mousePosition.x * 0.5}deg)`,
            } : {}}
          >
            <span className="text-white">Build Your</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 block mt-2">
              Digital Future
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p 
            className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Expert web development, mobile applications, and AI solutions tailored to grow your business 
            and bring your vision to life with cutting-edge technology.
          </motion.p>

          {/* CTA Buttons with 3D Hover */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} glareEnable={true} glareMaxOpacity={0.3}>
              <Link
                href="/contact"
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 inline-flex items-center justify-center text-lg"
              >
                Start Your Project
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <FaArrowRight className="ml-2 w-5 h-5" />
                </motion.div>
              </Link>
            </Tilt>
            
            <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5}>
              <Link
                href="/portfolio"
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 inline-flex items-center justify-center text-lg border border-white/20"
              >
                View Our Work
              </Link>
            </Tilt>
          </motion.div>

          {/* Stats with 3D Cards */}
          <motion.div 
            ref={statsRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            initial="hidden"
            animate={isStatsInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <Tilt
                  tiltMaxAngleX={10}
                  tiltMaxAngleY={10}
                  glareEnable={true}
                  glareMaxOpacity={0.2}
                  className="h-full"
                >
                  <motion.div 
                    className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div 
                      className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-white`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      {stat.icon}
                    </motion.div>
                    <motion.div 
                      className="text-3xl md:text-4xl font-bold text-white mb-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.8, type: "spring" }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-sm text-gray-300">{stat.label}</div>
                  </motion.div>
                </Tilt>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div 
              className="w-1 h-3 bg-white/50 rounded-full"
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Services Section with 3D Cards */}
      <section className="section-padding py-20 relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">
              What We Do
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              Our Core{' '}
              <span className="gradient-text">Services</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive tech solutions designed to solve your business challenges and drive growth
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Tilt
                  tiltMaxAngleX={15}
                  tiltMaxAngleY={15}
                  perspective={1000}
                  glareEnable={true}
                  glareMaxOpacity={0.3}
                  glareColor="#ffffff"
                  className="h-full"
                >
                  <ServiceCard {...service} />
                </Tilt>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack with 3D Progress Bars */}
      <section className="section-padding py-20 bg-gray-50 dark:bg-gray-800/50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.05),transparent_70%)]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">
              Our Expertise
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              Technology{' '}
              <span className="gradient-text">Stack</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We work with modern technologies to build robust and scalable solutions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {technologies.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} className="h-full">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center mb-4">
                      <motion.div 
                        className="text-4xl text-blue-600 dark:text-blue-400 mr-4"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        {tech.icon}
                      </motion.div>
                      <div>
                        <h3 className="text-lg font-bold">{tech.name}</h3>
                        <p className="text-sm text-gray-500">Proficiency</p>
                      </div>
                    </div>
                    
                    <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${tech.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                    
                    <motion.div 
                      className="mt-2 text-right text-sm font-semibold text-blue-600 dark:text-blue-400"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                    >
                      {tech.level}%
                    </motion.div>
                  </div>
                </Tilt>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with 3D Floating Cards */}
      <section className="section-padding py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">
              Why Choose Us
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              We Deliver{' '}
              <span className="gradient-text">Excellence</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Modern practices, dedicated support, and a commitment to quality
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <FaBolt />, title: 'Fast Delivery', desc: 'Quick turnaround without compromising quality', color: 'from-blue-500 to-cyan-500' },
              { icon: <FaCheckCircle />, title: 'Quality Code', desc: 'Clean, maintainable, and scalable solutions', color: 'from-purple-500 to-pink-500' },
              { icon: <FaSyncAlt />, title: 'Agile Process', desc: 'Flexible development with regular updates', color: 'from-orange-500 to-red-500' },
              { icon: <FaBullseye />, title: 'Client Focus', desc: 'Your success is our top priority', color: 'from-green-500 to-teal-500' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Tilt
                  tiltMaxAngleX={10}
                  tiltMaxAngleY={10}
                  glareEnable={true}
                  glareMaxOpacity={0.2}
                  className="h-full"
                >
                  <div className="group bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                    <motion.div 
                      className={`w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white`}
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="text-2xl">{feature.icon}</div>
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-3 text-center">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-center">{feature.desc}</p>
                    
                    {/* Animated Border */}
                    <motion.div 
                      className="absolute inset-0 rounded-xl border-2 border-transparent"
                      whileHover={{ borderColor: 'rgba(59, 130, 246, 0.3)' }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </Tilt>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with 3D Parallax */}
      <section className="section-padding py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600" />
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
            animate={{
              backgroundPosition: ['0px 0px', '50px 50px'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Let's discuss your project and build something amazing together. Get a free consultation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} glareEnable={true} glareMaxOpacity={0.3}>
                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300"
                >
                  Get Free Consultation
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <FaArrowRight className="ml-2 w-5 h-5" />
                  </motion.div>
                </Link>
              </Tilt>
              
              <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5}>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20"
                >
                  Explore Services
                </Link>
              </Tilt>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Chat Widget */}
      <div id="chat-widget">
        <ChatWidget />
      </div>
    </div>
  )
}