'use client'

import { useEffect, useState } from 'react'
import { MapPin, Phone, Navigation, Clock } from 'lucide-react'

interface LocationMapProps {
  position?: [number, number]
  zoom?: number
}

export default function LocationMap({ 
  position = [24.8607, 67.0011], // Garden East, Karachi coordinates
  zoom = 16 
}: LocationMapProps) {
  const [Map, setMap] = useState<any>(null)
  const [showFallback, setShowFallback] = useState(false)

  useEffect(() => {
    // Dynamically import Leaflet to avoid SSR issues
    const loadMap = async () => {
      try {
        const L = await import('leaflet')
        
        await import('leaflet/dist/leaflet.css')
        
        // Fix for default icons
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        })

        const { MapContainer, TileLayer, Marker, Popup } = await import('react-leaflet')
        
        // Custom office icon
        const officeIcon = L.divIcon({
          html: `<div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                  <span style="font-size: 24px;">🏢</span>
                </div>`,
          iconSize: [48, 48],
          iconAnchor: [24, 48],
          popupAnchor: [0, -48],
          className: 'office-marker'
        })

        setMap(
          <MapContainer
            center={position}
            zoom={zoom}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <Marker position={position} icon={officeIcon}>
              <Popup>
                <div className="p-4 min-w-[250px]">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-xl">🏢</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">Tech Solutions</h3>
                      <p className="text-xs text-blue-600">Head Office</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 text-gray-500 mt-1 mr-2 flex-shrink-0" />
                      <p className="text-gray-700 text-sm">Garden East, Karachi, Pakistan</p>
                    </div>
                    
                    <div className="flex items-start">
                      <Phone className="w-4 h-4 text-gray-500 mt-1 mr-2 flex-shrink-0" />
                      <p className="text-gray-700 text-sm">+92 300 1234567</p>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock className="w-4 h-4 text-gray-500 mt-1 mr-2 flex-shrink-0" />
                      <p className="text-gray-700 text-sm">Mon-Fri: 9:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=Garden+East+Karachi`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 px-4 rounded-lg hover:opacity-90 transition-colors text-sm flex items-center justify-center"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Get Directions
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        )
      } catch (error) {
        console.error('Failed to load map:', error)
        setShowFallback(true)
      }
    }

    loadMap()
  }, [position, zoom])

  if (showFallback) {
    return (
      <div className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="text-center p-6">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Tech Solutions</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Garden East, Karachi, Pakistan</p>
          <a 
            href="https://www.google.com/maps/search/?api=1&query=Garden+East+Karachi" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:underline"
          >
            <Navigation className="w-4 h-4 mr-1" />
            Open in Google Maps
          </a>
        </div>
      </div>
    )
  }

  return Map || <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
}