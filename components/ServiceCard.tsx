import { FaCheck,FaArrowRight } from 'react-icons/fa'

interface ServiceCardProps {
  title: string
  description: string
  icon: React.ReactNode
  features: string[]
  icons?: React.ReactNode[]
  gradient: string
}

export default function ServiceCard({ title, description, icon, features, icons, gradient }: ServiceCardProps) {
  return (
    <div className="glass-effect p-6 rounded-xl hover-lift h-full">
      <div className={`w-14 h-14 rounded-lg bg-gradient-to-r ${gradient} flex items-center justify-center text-white mb-6`}>
        {icon}
      </div>
      
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>
      
      <div className="space-y-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
              <FaCheck className="w-3 h-3 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex items-center space-x-2">
              {icons && icons[index] && (
                <span className="text-blue-500">
                  {icons[index]}
                </span>
              )}
              <span className="text-gray-700 dark:text-gray-300">{feature}</span>
            </div>
          </div>
        ))}
      </div>
      
      <button className="mt-8 text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center">
        Learn more
        <FaArrowRight className="ml-2 w-4 h-4" />
      </button>
    </div>
  )
}