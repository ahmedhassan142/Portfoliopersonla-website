import { Award, Users, Globe, Rocket } from 'lucide-react'
import Image from 'next/image'

export default function AboutPage() {
  const stats = [
    { value: '50+', label: 'Projects Completed', icon: <Rocket /> },
    { value: '30+', label: 'Happy Clients', icon: <Users /> },
    { value: '5+', label: 'Years Experience', icon: <Award /> },
    { value: '15+', label: 'Countries Served', icon: <Globe /> },
  ]

  const skills = [
    { category: 'Frontend', tech: ['Next.js/React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
    { category: 'Backend', tech: ['Node.js', 'Python', 'PostgreSQL', 'Firebase'] },
    { category: 'Mobile', tech: ['React Native', 'Flutter', 'iOS/Android'] },
    { category: 'AI/ML', tech: ['TensorFlow', 'OpenAI API', 'LangChain', 'ML Models'] },
  ]

  return (
    <div className="section-padding py-20">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Building Digital Solutions That
          <span className="gradient-text block">Drive Success</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          I specialize in creating modern, scalable web applications, mobile apps, and AI solutions that help businesses grow and thrive in the digital age.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="glass-effect p-6 rounded-xl text-center hover-lift"
          >
            <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white">
              {stat.icon}
            </div>
            <div className="text-3xl font-bold gradient-text mb-2">{stat.value}</div>
            <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-12 mb-20">
        {/* My Story */}
        <div>
          <h2 className="text-3xl font-bold mb-6">My Journey</h2>
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              With over 5 years of experience in the tech industry, I've evolved from a passionate developer to a solutions architect who understands both the technical and business sides of digital projects.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              I started as a freelance web developer while studying computer science, gradually expanding my skills to include mobile development and artificial intelligence. This diverse experience allows me to provide comprehensive solutions that address all aspects of modern digital needs.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              My approach combines cutting-edge technology with practical business sense, ensuring that every project not only looks great but also delivers measurable results.
            </p>
          </div>
        </div>

        {/* Philosophy */}
        <div>
          <h2 className="text-3xl font-bold mb-6">My Philosophy</h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Quality Over Quantity</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  I believe in delivering exceptional work that stands the test of time, not just meeting deadlines.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 dark:text-purple-400 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Continuous Learning</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  The tech landscape evolves rapidly, and I'm committed to staying ahead of the curve.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 dark:text-green-400 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Client Partnership</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  I work closely with clients, ensuring transparency and collaboration throughout the process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Technical Expertise</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="glass-effect p-6 rounded-xl hover-lift"
            >
              <h3 className="text-xl font-bold mb-4 gradient-text">{skill.category}</h3>
              <ul className="space-y-3">
                {skill.tech.map((tech, techIndex) => (
                  <li key={techIndex} className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-gray-700 dark:text-gray-300">{tech}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-6">Let's Build Something Amazing</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Ready to transform your ideas into reality? I'm here to help you succeed.
        </p>
        <a
          href="/contact"
          className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Start a Project
        </a>
      </div>
    </div>
  )
}