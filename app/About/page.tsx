import ChatWidget from '@/components/Shared/ChatWidget'
import { 
  Award, 
  Users, 
  Globe, 
  Rocket, 
  Target, 
  Zap, 
  Heart, 
  Coffee,
  ArrowRight,
  Briefcase,
  Code,
  Cloud,
  Smartphone,
  Cpu,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next';
import { pageSEO } from '../seo.config';

export const metadata: Metadata = {
  title: pageSEO.about.title,
  description: pageSEO.about.description,
  keywords: pageSEO.about.keywords,
  openGraph: {
    title: pageSEO.about.title,
    description: pageSEO.about.description,
    url: `https://techsolutions.dev${pageSEO.about.path}`,
  },
  alternates: {
    canonical: `https://techsolutions.dev${pageSEO.about.path}`,
  },
};


const stats = [
  { value: '100+', label: 'Projects Completed', icon: <Briefcase className="w-6 h-6" /> },
  { value: '50+', label: 'Happy Clients', icon: <Users className="w-6 h-6" /> },
  { value: '5+', label: 'Years Experience', icon: <Award className="w-6 h-6" /> },
  { value: '15+', label: 'Countries Served', icon: <Globe className="w-6 h-6" /> },
]

const values = [
  {
    icon: <Target className="w-8 h-8" />,
    title: 'Quality First',
    description: 'We never compromise on quality. Every line of code is crafted with precision and care.'
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: 'Innovation Driven',
    description: 'Staying ahead of technology trends to provide cutting-edge solutions.'
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: 'Client Centric',
    description: 'Your success is our success. We build lasting partnerships with our clients.'
  },
  {
    icon: <Coffee className="w-8 h-8" />,
    title: 'Passionate Team',
    description: 'A team of dedicated developers who love what they do and it shows in our work.'
  }
]

const expertise = [
  {
    category: 'Frontend Development',
    icon: <Code className="w-6 h-6" />,
    skills: ['Next.js/React', 'TypeScript', 'Vue.js', 'Tailwind CSS', 'Framer Motion'],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    category: 'Backend Development',
    icon: <Cloud className="w-6 h-6" />,
    skills: ['Node.js', 'Python', 'Java', 'PostgreSQL', 'MongoDB', 'Firebase'],
    color: 'from-purple-500 to-pink-500'
  },
  {
    category: 'Mobile Development',
    icon: <Smartphone className="w-6 h-6" />,
    skills: ['React Native', 'Flutter', 'iOS Swift', 'Android Kotlin'],
    color: 'from-orange-500 to-red-500'
  },
  {
    category: 'AI & Machine Learning',
    icon: <Cpu className="w-6 h-6" />,
    skills: ['TensorFlow', 'PyTorch', 'OpenAI API', 'LangChain', 'Computer Vision'],
    color: 'from-green-500 to-teal-500'
  }
]

const team = [
  {
    name: 'Alex Johnson',
    role: 'Founder & Lead Developer',
    bio: 'Full-stack developer with 8+ years experience in React, Node.js, and AI integration.',
    expertise: ['React', 'Node.js', 'Python', 'AWS'],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'Sarah Chen',
    role: 'Mobile Development Lead',
    bio: 'Specializes in React Native and Flutter with 6+ years of mobile development experience.',
    expertise: ['React Native', 'Flutter', 'iOS', 'Android'],
    color: 'from-purple-500 to-pink-500'
  },
  {
    name: 'Mike Rodriguez',
    role: 'AI/ML Engineer',
    bio: 'Machine learning expert focused on integrating AI into business applications.',
    expertise: ['TensorFlow', 'PyTorch', 'OpenAI', 'Python'],
    color: 'from-orange-500 to-red-500'
  },
  {
    name: 'Emma Wilson',
    role: 'UI/UX Designer',
    bio: 'Creative designer with a passion for creating beautiful and intuitive user experiences.',
    expertise: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
    color: 'from-green-500 to-teal-500'
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative w-full h-[850px] min-h-[850px] flex items-center justify-center overflow-hidden">
        {/* Background with Gradient */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-blue-900/80 to-purple-900/90" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
              backgroundSize: '50px 50px'
            }} />
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto text-center px-4">
          <div className="animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white text-sm font-medium">Trusted by Industry Leaders</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-white">Building Digital</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 block mt-2">
                Solutions That Drive Success
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto mb-12 leading-relaxed">
              We specialize in creating modern, scalable web applications, mobile apps, and AI solutions 
              that help businesses grow and thrive in the digital age. Our team of experts combines 
              technical excellence with business acumen to deliver exceptional results.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-300 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 inline-flex items-center text-lg"
              >
                Start a Project
                <Rocket className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/portfolio"
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 inline-flex items-center text-lg border border-white/20"
              >
                View Portfolio
              </Link>
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

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">
                Our Mission
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
                Transforming Ideas Into{' '}
                <span className="gradient-text">Digital Reality</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                With over 5 years of experience in the tech industry, we've evolved from a passionate 
                team of developers to a solutions architecture firm that understands both the technical 
                and business sides of digital projects.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Our approach combines cutting-edge technology with practical business sense, ensuring 
                that every project not only looks great but also delivers measurable results and ROI 
                for our clients.
              </p>

              {/* Key Points */}
              <div className="space-y-4">
                {[
                  '100% Client Satisfaction Rate',
                  'Agile Development Methodology',
                  '24/7 Support & Maintenance',
                  'Scalable & Future-Proof Solutions'
                ].map((point, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Quote Card */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
                <div className="text-6xl mb-4 opacity-50">"</div>
                <p className="text-2xl mb-6 leading-relaxed">
                  Technology is not just about writing code. It's about solving problems and creating value. 
                  Every project is an opportunity to make a difference in someone's business or life.
                </p>
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                    AJ
                  </div>
                  <div className="ml-4">
                    <div className="font-bold text-xl">Alex Johnson</div>
                    <div className="text-white/80">Founder & Lead Developer</div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 blur-2xl" />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">
              Core Values
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              What Drives{' '}
              <span className="gradient-text">Us Forward</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our principles guide every decision we make and every line of code we write
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">
              Technical Expertise
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              Our Tech{' '}
              <span className="gradient-text">Stack</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We use modern, cutting-edge technologies to build robust and scalable solutions
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {expertise.map((area, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${area.color} flex items-center justify-center text-white mr-4`}>
                    {area.icon}
                  </div>
                  <h3 className="text-xl font-bold">{area.category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {area.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">
              Meet The Team
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              The People Behind{' '}
              <span className="gradient-text">The Magic</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A team of passionate experts dedicated to bringing your ideas to life
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                {/* Avatar */}
                <div className={`w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r ${member.color} flex items-center justify-center text-white text-3xl font-bold`}>
                  {member.name.charAt(0)}
                </div>

                {/* Info */}
                <h3 className="text-xl font-bold text-center mb-1">{member.name}</h3>
                <p className="text-blue-600 dark:text-blue-400 text-center text-sm mb-3">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm text-center mb-4">
                  {member.bio}
                </p>

                {/* Expertise Tags */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {member.expertise.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs text-gray-600 dark:text-gray-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Idea Into Reality?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Let's discuss how we can help you achieve your business goals with technology.
          </p>
          <Link
            href="/contact"
            className="group inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Get in Touch
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
         <div id="chat-widget">
        <ChatWidget />
      </div>
      </section>
    </div>
  )
}