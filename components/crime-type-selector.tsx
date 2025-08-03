'use client'

import { useState } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { CRIME_TYPES, getCrimeTypesByCategory, getCrimeTypeInfo } from '@/lib/crime-types'

interface CrimeTypeSelectorProps {
  value: string
  onChange: (value: string) => void
  label?: string
  required?: boolean
}

export default function CrimeTypeSelector({ 
  value, 
  onChange, 
  label = "Crime Type",
  required = false 
}: CrimeTypeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const crimeTypesByCategory = getCrimeTypesByCategory()
  const selectedCrime = getCrimeTypeInfo(value)

  const filteredCategories = Object.entries(crimeTypesByCategory).reduce((acc, [category, types]) => {
    const filteredTypes = types.filter(type => 
      type.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      type.value.toLowerCase().includes(searchTerm.toLowerCase())
    )
    if (filteredTypes.length > 0) {
      acc[category] = filteredTypes
    }
    return acc
  }, {} as Record<string, typeof CRIME_TYPES>)

  const handleSelect = (crimeValue: string) => {
    onChange(crimeValue)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {/* Selected Value Display */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 border rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          {value && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedCrime.color}`}>
              {selectedCrime.label}
            </span>
          )}
          {!value && (
            <span className="text-gray-500">Select a crime type...</span>
          )}
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-80 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search crime types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
          </div>

          {/* Categories and Types */}
          <div className="max-h-64 overflow-y-auto">
            {Object.entries(filteredCategories).map(([category, types]) => (
              <div key={category} className="border-b last:border-b-0">
                <div className="px-3 py-2 bg-gray-50 text-sm font-medium text-gray-700">
                  {category} ({types.length})
                </div>
                <div className="divide-y">
                  {types.map((crimeType) => (
                    <div
                      key={crimeType.value}
                      onClick={() => handleSelect(crimeType.value)}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{crimeType.label}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${crimeType.color}`}>
                          {category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {Object.keys(filteredCategories).length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No crime types found matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}