import Link from 'next/link'
import { 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  Cookie, 
  Mail, 
  Globe, 
  FileText,
  AlertCircle,
  CheckCircle,
  ArrowLeft
} from 'lucide-react'
import type { Metadata } from 'next';
import { pageSEO } from '../seo.config';

export const metadata: Metadata = {
  title: pageSEO.privacy.title,
  description: pageSEO.privacy.description,
  keywords: pageSEO.privacy.keywords,
  openGraph: {
    title: pageSEO.privacy.title,
    description: pageSEO.privacy.description,
    url: `https://techsolutions.dev${pageSEO.privacy.path}`,
  },
  alternates: {
    canonical: `https://techsolutions.dev${pageSEO.privacy.path}`,
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "February 24, 2026"

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative w-full h-[400px] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1633265486064-086b219458ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-blue-900/80 to-purple-900/90" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6">
            <Shield className="w-4 h-4 text-blue-300" />
            <span className="text-white text-sm font-medium">Your Privacy Matters</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="text-white">Privacy</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 block">
              Policy
            </span>
          </h1>
          
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            How we collect, use, and protect your personal information
          </p>
          
          <p className="text-sm text-gray-300 mt-6">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding py-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Back Button */}
          <Link 
            href="/"
            className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          {/* Quick Summary Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: <Lock className="w-6 h-6" />,
                title: 'Data Security',
                desc: '256-bit encryption'
              },
              {
                icon: <Eye className="w-6 h-6" />,
                title: 'Your Control',
                desc: 'Full data access'
              },
              {
                icon: <Database className="w-6 h-6" />,
                title: 'Data Storage',
                desc: 'Secure servers'
              }
            ].map((item, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  {item.icon}
                </div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Introduction */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-blue-600" />
              Introduction
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              At Tech Solutions, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              By using our website and services, you consent to the data practices described in this policy. If you do not agree with any part of this privacy policy, please do not use our website or services.
            </p>
          </div>

          {/* Information We Collect */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Database className="w-6 h-6 mr-3 text-purple-600" />
              Information We Collect
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">We may collect the following personal information:</p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 ml-4">
                  <li>Name and contact information (email address, phone number)</li>
                  <li>Company name and business details</li>
                  <li>Project requirements and specifications</li>
                  <li>Billing and payment information</li>
                  <li>Communication preferences</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Usage Information</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">We automatically collect certain information about your device and usage:</p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 ml-4">
                  <li>IP address and browser type</li>
                  <li>Pages visited and time spent</li>
                  <li>Referring website addresses</li>
                  <li>Device information (operating system, screen resolution)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How We Use Your Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Eye className="w-6 h-6 mr-3 text-green-600" />
              How We Use Your Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'To provide and maintain our services',
                'To communicate with you about your projects',
                'To send you updates and marketing communications',
                'To improve our website and user experience',
                'To process payments and prevent fraud',
                'To comply with legal obligations'
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 dark:text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cookies and Tracking */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Cookie className="w-6 h-6 mr-3 text-orange-600" />
              Cookies and Tracking Technologies
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We use cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are files with small amount of data which may include an anonymous unique identifier.
            </p>
            
            <h3 className="text-lg font-semibold mb-2">Types of Cookies We Use:</h3>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1 ml-4 mb-4">
              <li><span className="font-medium">Essential cookies:</span> Required for website functionality</li>
              <li><span className="font-medium">Analytics cookies:</span> Help us understand how visitors interact with our website</li>
              <li><span className="font-medium">Preference cookies:</span> Remember your settings and preferences</li>
              <li><span className="font-medium">Marketing cookies:</span> Used to deliver relevant advertisements</li>
            </ul>
            
            <p className="text-gray-600 dark:text-gray-300">
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
            </p>
          </div>

          {/* Data Security */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Lock className="w-6 h-6 mr-3 text-red-600" />
              Data Security
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
              <h3 className="font-semibold mb-3">Security Measures Include:</h3>
              <ul className="space-y-2">
                {[
                  '256-bit SSL/TLS encryption for data transmission',
                  'Regular security audits and penetration testing',
                  'Access controls and authentication requirements',
                  'Secure data storage with encrypted databases',
                  'Regular backups and disaster recovery procedures'
                ].map((item, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <Shield className="w-4 h-4 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Third-Party Services */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Globe className="w-6 h-6 mr-3 text-blue-600" />
              Third-Party Services
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We may employ third-party companies and individuals to facilitate our services, provide service-related services, or assist us in analyzing how our services are used.
            </p>
            
            <p className="text-gray-600 dark:text-gray-300">
              These third parties have access to your personal information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
            </p>
          </div>

          {/* Your Rights */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
            <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
            
            <p className="mb-4">You have the right to:</p>
            <ul className="space-y-2">
              {[
                'Access your personal information',
                'Correct inaccurate or incomplete information',
                'Request deletion of your information',
                'Object to processing of your information',
                'Request restriction of processing',
                'Data portability',
                'Withdraw consent at any time'
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Mail className="w-6 h-6 mr-3 text-purple-600" />
              Contact Us
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-blue-600 mr-3" />
                <a href="mailto:privacy@techsolutions.dev" className="text-blue-600 dark:text-blue-400 hover:underline">
                  privacy@techsolutions.dev
                </a>
              </div>
              <div className="flex items-center">
                <Globe className="w-5 h-5 text-blue-600 mr-3" />
                <span className="text-gray-600 dark:text-gray-300">Garden East, Karachi, Pakistan</span>
              </div>
            </div>
          </div>

          {/* Updates to This Policy */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-8">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-1">Updates to This Policy</h3>
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this page.
                </p>
              </div>
            </div>
          </div>

          {/* Consent */}
          <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
            <p>By using our website and services, you consent to our Privacy Policy and agree to its terms.</p>
            <p className="mt-2">© {new Date().getFullYear()} Tech Solutions. All rights reserved.</p>
          </div>
        </div>
      </section>
    </div>
  )
}