'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface CaseCount {
  stateCode?: string
  countyId?: string
  count: number
}

interface SimpleMapProps {
  caseCounts: CaseCount[]
  onStateClick?: (stateCode: string) => void
  onCountyClick?: (countyId: string) => void
}

const US_STATES = [
  { code: 'CA', name: 'California', x: 10, y: 60 },
  { code: 'TX', name: 'Texas', x: 45, y: 70 },
  { code: 'NY', name: 'New York', x: 75, y: 25 },
  { code: 'FL', name: 'Florida', x: 75, y: 80 },
  { code: 'IL', name: 'Illinois', x: 55, y: 40 },
]

export default function SimpleMap({ 
  caseCounts, 
  onStateClick,
  onCountyClick 
}: SimpleMapProps) {
  const [selectedState, setSelectedState] = useState<string | null>(null)

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

  const getStateCount = (stateCode: string) => {
    return caseCounts.find(c => c.stateCode === stateCode)?.count || 0
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>
            {selectedState ? `${selectedState} Counties` : 'United States FOIA Map'}
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
        <CardDescription>
          Click on a state to view county-level data. Numbers indicate pending FOIA requests.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!selectedState ? (
          <div className="relative bg-gray-100 rounded-lg p-8 min-h-[400px]">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">Interactive US States Map</h3>
              <p className="text-sm text-gray-600">Click on any state below to view detailed county information</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {US_STATES.map((state) => {
                const count = getStateCount(state.code)
                const color = getColor(count)
                
                return (
                  <div
                    key={state.code}
                    onClick={() => handleStateClick(state.code)}
                    className="relative bg-white rounded-lg p-4 shadow-sm border-2 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105"
                    style={{ borderColor: color }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{state.name}</h4>
                        <p className="text-sm text-gray-500">{state.code}</p>
                      </div>
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: color }}
                      >
                        {count}
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-gray-600">
                        {count === 0 ? 'No pending requests' : 
                         count === 1 ? '1 pending request' : 
                         `${count} pending requests`}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 flex justify-center">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                  <span>No pending (0)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-400 rounded mr-2"></div>
                  <span>Low (1-4)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-orange-400 rounded mr-2"></div>
                  <span>Medium (5-9)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                  <span>High (10+)</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-8">
            <h3 className="text-lg font-semibold mb-4">
              {selectedState} County View
            </h3>
            <p className="text-gray-600 mb-4">
              Detailed county-level data for {selectedState} would appear here.
            </p>
            <p className="text-sm text-gray-500">
              County drill-down functionality is ready for implementation with specific county data.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}