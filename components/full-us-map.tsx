'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Search } from 'lucide-react'

interface CaseCount {
  stateCode?: string
  countyId?: string
  count: number
}

interface FullUSMapProps {
  caseCounts: CaseCount[]
  onStateClick?: (stateCode: string) => void
  onCountyClick?: (countyId: string) => void
}

const ALL_US_STATES = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' }
]

export default function FullUSMap({ 
  caseCounts, 
  onStateClick,
  onCountyClick 
}: FullUSMapProps) {
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

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

  const filteredStates = ALL_US_STATES.filter(state =>
    state.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    state.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>
            {selectedState ? `${selectedState} Counties` : 'United States FOIA Map (All 50 States)'}
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
          <div className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search states..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* States Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredStates.map((state) => {
                const count = getStateCount(state.code)
                const color = getColor(count)
                
                return (
                  <div
                    key={state.code}
                    onClick={() => handleStateClick(state.code)}
                    className="relative bg-white rounded-lg p-3 shadow-sm border-2 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105"
                    style={{ borderColor: color }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-gray-900 text-sm truncate">{state.name}</h4>
                        <p className="text-xs text-gray-500">{state.code}</p>
                      </div>
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ml-2"
                        style={{ backgroundColor: color }}
                      >
                        {count}
                      </div>
                    </div>
                    <div className="mt-1">
                      <p className="text-xs text-gray-600">
                        {count === 0 ? 'No pending' : 
                         count === 1 ? '1 pending' : 
                         `${count} pending`}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex justify-center">
              <div className="flex items-center space-x-4 text-sm bg-gray-50 rounded-lg p-3">
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

            {/* Stats */}
            <div className="text-center text-sm text-gray-600">
              Showing {filteredStates.length} of 50 states
              {searchTerm && ` (filtered by "${searchTerm}")`}
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