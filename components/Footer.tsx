import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  Heart, 
  Instagram
} from 'lucide-react'
import Link from 'next/link'

const footerLinks = {
  Services: [
    { name: 'Web Development', href: '/services' },
    { name: 'Mobile Apps', href: '/services' },
    { name: 'AI Solutions', href: '/services' },
    { name: 'Maintenance', href: '/services' },
  ],
  Company: [
    { name: 'About', href: '/about' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ],
  Legal: [
    { name: 'Privacy Policy', href: '/Privacy' },
    { name: 'Terms of Service', href: '/Privacy' },
    { name: 'Cookie Policy', href: '/Privacy' },
  ]
}

const socialLinks = [
  { icon: <Github />, href: 'https://github.com/ahmedhassan142', label: 'GitHub' },
  { icon: <Instagram />, href: 'https://www.instagram.com/ahmed6154hassan/', label: 'Instagram' },
  { icon: <Linkedin />, href: 'https://www.linkedin.com/in/ahmed-hassan-7a3a90212/', label: 'LinkedIn' },
  { icon: <Mail />, href: 'mailto:ah770643@gmail.com', label: 'Email' },
]

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800">
      <div className="section-padding py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg" />
              <span className="text-2xl font-bold gradient-text">TechSolutions</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
              Building innovative digital solutions with modern technologies. 
              Specializing in web development, mobile applications, and AI integration.
            </p>
            
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full glass-effect flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-bold text-lg mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-600 dark:text-gray-300 text-sm">
              © {new Date().getFullYear()} TechSolutions. All rights reserved.
            </div>
            
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <span>Made with</span>
              <Heart className="w-4 h-4 mx-1 text-red-500 fill-current" />
              <span>using Next.js & TypeScript</span>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <span>ah770643@gmail.com</span>
              <span className="mx-2">•</span>
              <span>+923130804352</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}