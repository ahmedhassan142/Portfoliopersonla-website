'use client'

import { motion } from 'framer-motion'
import Tilt from 'react-parallax-tilt'

interface ServiceCardProps {
  title: string
  description: string
  icon: React.ReactNode
  features: string[]
  icons: React.ReactNode[]
  gradient: string
}

export default function ServiceCard({ title, description, icon, features, icons, gradient }: ServiceCardProps) {
  return (
    <Tilt
      tiltMaxAngleX={15}
      tiltMaxAngleY={15}
      perspective={1000}
      glareEnable={true}
      glareMaxOpacity={0.3}
      glareColor="#ffffff"
      className="h-full"
    >
      <motion.div 
        className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full"
        whileHover={{ y: -10 }}
      >
        {/* Icon with 3D rotation */}
        <motion.div 
          className={`w-16 h-16 rounded-xl bg-gradient-to-r ${gradient} flex items-center justify-center text-white mb-6`}
          whileHover={{ rotateY: 180 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            whileHover={{ rotateY: -180 }}
            transition={{ duration: 0.5 }}
          >
            {icon}
          </motion.div>
        </motion.div>

        {/* Content */}
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>

        {/* Features */}
        <div className="mb-6">
          <h4 className="font-semibold text-lg mb-3">Key Features</h4>
          <ul className="space-y-2">
            {features.map((feature, idx) => (
              <motion.li 
                key={idx} 
                className="flex items-center text-sm text-gray-600 dark:text-gray-300"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                {feature}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Tech Icons */}
        <div className="flex flex-wrap gap-3">
          {icons.map((icon, idx) => (
            <motion.div 
              key={idx} 
              className="text-2xl text-gray-600 dark:text-gray-300"
              whileHover={{ scale: 1.2, rotate: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {icon}
            </motion.div>
          ))}
        </div>

        {/* Hover Effect Border */}
        <motion.div 
          className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10`}
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      </motion.div>
    </Tilt>
  )
}