'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Search } from 'lucide-react'

interface County {
  id: string
  name: string
  state: {
    name: string
    code: string
  }
}

interface CountySelectorProps {
  onSelect: (countyId: string) => void
  onCancel: () => void
}

export default function CountySelector({ onSelect, onCancel }: CountySelectorProps) {
  const [counties, setCounties] = useState<County[]>([])
  const [selectedState, setSelectedState] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [loading, setLoading] = useState(true)

  const states = [
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

  useEffect(() => {
    fetchAllCounties()
  }, [])

  const fetchAllCounties = async () => {
    try {
      const response = await fetch('/api/counties')
      const data = await response.json()
      setCounties(data)
    } catch (error) {
      console.error('Error fetching counties:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCounties = counties.filter(county => {
    const stateMatch = selectedState ? county.state.code === selectedState : true
    const searchMatch = searchTerm 
      ? county.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        county.state.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        county.state.code.toLowerCase().includes(searchTerm.toLowerCase())
      : true
    return stateMatch && searchMatch
  })

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <CardHeader>
          <CardTitle>Select County</CardTitle>
          <CardDescription>
            Choose the county where this case occurred
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading counties...</div>
          ) : (
            <div className="space-y-4">
              {/* Search Bar */}
              <div>
                <label className="block text-sm font-medium mb-2">Search Counties or States:</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by county name, state name, or state code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* State Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Filter by State:</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">All States</option>
                  {states.map(state => (
                    <option key={state.code} value={state.code}>
                      {state.name} ({state.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Results Count */}
              {(searchTerm || selectedState) && (
                <div className="text-sm text-gray-600">
                  Found {filteredCounties.length} counties
                  {searchTerm && ` matching "${searchTerm}"`}
                  {selectedState && ` in ${states.find(s => s.code === selectedState)?.name}`}
                </div>
              )}

              {/* County List */}
              <div className="max-h-60 overflow-y-auto border rounded-md">
                {filteredCounties.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    {searchTerm || selectedState ? 'No counties found matching your criteria' : 'No counties found'}
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredCounties.map(county => (
                      <div
                        key={county.id}
                        onClick={() => {
                          console.log('Selected county:', county.id)
                          onSelect(county.id)
                        }}
                        className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="font-medium">{county.name}</div>
                        <div className="text-sm text-gray-500">
                          {county.state.name}, {county.state.code}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}