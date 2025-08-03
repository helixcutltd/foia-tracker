'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

// Dynamic import for Leaflet to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const GeoJSON = dynamic(
  () => import('react-leaflet').then((mod) => mod.GeoJSON),
  { ssr: false }
)

interface CaseCount {
  stateCode?: string
  countyId?: string
  count: number
}

interface InteractiveMapProps {
  caseCounts: CaseCount[]
  onStateClick?: (stateCode: string) => void
  onCountyClick?: (countyId: string) => void
}

export default function InteractiveMap({ 
  caseCounts, 
  onStateClick,
  onCountyClick 
}: InteractiveMapProps) {
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [mapData, setMapData] = useState<any>(null)
  const [L, setL] = useState<any>(null)

  useEffect(() => {
    // Load Leaflet
    import('leaflet').then((leaflet) => {
      setL(leaflet.default)
    })
  }, [])

  const handleStateClick = (stateCode: string) => {
    setSelectedState(stateCode)
    if (onStateClick) onStateClick(stateCode)
  }

  const handleBackToUS = () => {
    setSelectedState(null)
  }

  const getColor = (count: number) => {
    if (count === 0) return '#10b981' // green
    if (count < 5) return '#fbbf24' // yellow
    if (count < 10) return '#f59e0b' // orange
    return '#ef4444' // red
  }

  const style = (feature: any) => {
    const count = caseCounts.find(
      c => c.stateCode === feature.properties.stateCode
    )?.count || 0

    return {
      fillColor: getColor(count),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    }
  }

  const onEachFeature = (feature: any, layer: any) => {
    if (!L) return

    const count = caseCounts.find(
      c => c.stateCode === feature.properties.stateCode
    )?.count || 0

    layer.bindPopup(`
      <div class="text-center">
        <strong>${feature.properties.name}</strong><br/>
        <span class="text-lg font-bold">${count}</span> pending FOIA requests
      </div>
    `)

    layer.on({
      mouseover: (e: any) => {
        e.target.setStyle({
          weight: 3,
          color: '#666',
          fillOpacity: 0.9
        })
      },
      mouseout: (e: any) => {
        e.target.setStyle({
          weight: 2,
          color: 'white',
          fillOpacity: 0.7
        })
      },
      click: () => {
        handleStateClick(feature.properties.stateCode)
      }
    })
  }

  if (!L) return <div>Loading map...</div>

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>
            {selectedState ? `${selectedState} Counties` : 'United States'}
          </CardTitle>
          {selectedState && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToUS}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to US Map
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0 h-[600px]">
        <MapContainer
          center={[39.8283, -98.5795]}
          zoom={4}
          style={{ height: '100%', width: '100%' }}
          className="rounded-b-lg"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {mapData && (
            <GeoJSON
              data={mapData}
              style={style}
              onEachFeature={onEachFeature}
            />
          )}
        </MapContainer>
      </CardContent>
    </Card>
  )
}