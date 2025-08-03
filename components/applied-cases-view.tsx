'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Check, FileText, Calendar, MapPin, Filter, Download } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getCrimeTypeInfo, CRIME_TYPES } from '@/lib/crime-types'

interface AppliedCase {
  id: string
  caseNumber?: string
  crimeType: string
  description?: string
  dateOccurred?: string
  foiaStatus: string
  appliedDate: string
  screenshotPath?: string
  county: {
    name: string
    state: {
      name: string
      code: string
    }
  }
  createdAt: string
}

export default function AppliedCasesView() {
  const [appliedCases, setAppliedCases] = useState<AppliedCase[]>([])
  const [loading, setLoading] = useState(true)
  const [filterState, setFilterState] = useState<string>('')
  const [filterCrimeType, setFilterCrimeType] = useState<string>('')

  useEffect(() => {
    fetchAppliedCases()
  }, [])

  const fetchAppliedCases = async () => {
    try {
      const response = await fetch('/api/cases?foiaStatus=APPLIED')
      const data = await response.json()
      setAppliedCases(data)
    } catch (error) {
      console.error('Error fetching applied cases:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCrimeTypeLabel = (type: string) => {
    return getCrimeTypeInfo(type).label
  }

  const getCrimeTypeColor = (type: string) => {
    return getCrimeTypeInfo(type).color
  }

  const filteredCases = appliedCases.filter(case_ => {
    const stateMatch = filterState ? case_.county.state.code === filterState : true
    const crimeMatch = filterCrimeType ? case_.crimeType === filterCrimeType : true
    return stateMatch && crimeMatch
  })

  const uniqueStates = [...new Set(appliedCases.map(c => c.county.state.code))].sort()
  const uniqueCrimeTypes = [...new Set(appliedCases.map(c => c.crimeType))].sort()

  const exportData = () => {
    const csvContent = [
      'Case Number,Crime Type,County,State,Date Occurred,Applied Date,Description',
      ...filteredCases.map(case_ => [
        case_.caseNumber || case_.id.slice(0, 8),
        getCrimeTypeLabel(case_.crimeType),
        case_.county.name,
        case_.county.state.name,
        case_.dateOccurred ? format(new Date(case_.dateOccurred), 'yyyy-MM-dd') : '',
        format(new Date(case_.appliedDate), 'yyyy-MM-dd'),
        `"${case_.description?.replace(/"/g, '""') || ''}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `applied-foia-cases-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          Loading applied cases...
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Applied FOIA Requests Database
              </CardTitle>
              <CardDescription>
                Organized database of all successfully applied FOIA requests
              </CardDescription>
            </div>
            <Button onClick={exportData} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{filteredCases.length}</div>
              <div className="text-sm text-green-600">Total Applied</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{uniqueStates.length}</div>
              <div className="text-sm text-blue-600">States Covered</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{uniqueCrimeTypes.length}</div>
              <div className="text-sm text-purple-600">Crime Types</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {appliedCases.filter(c => {
                  const appliedDate = new Date(c.appliedDate)
                  const thirtyDaysAgo = new Date()
                  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
                  return appliedDate >= thirtyDaysAgo
                }).length}
              </div>
              <div className="text-sm text-orange-600">Last 30 Days</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Filter by State:</label>
              <select
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">All States</option>
                {uniqueStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Filter by Crime Type:</label>
              <select
                value={filterCrimeType}
                onChange={(e) => setFilterCrimeType(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">All Crime Types</option>
                {CRIME_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setFilterState('')
                  setFilterCrimeType('')
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cases List */}
      <div className="space-y-4">
        {filteredCases.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              {appliedCases.length === 0 ? 'No applied cases yet' : 'No cases match your filters'}
            </CardContent>
          </Card>
        ) : (
          filteredCases.map((case_) => (
            <Card key={case_.id} className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      {case_.caseNumber || `Case ${case_.id.slice(0, 8)}`}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      {case_.county.name}, {case_.county.state.name}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCrimeTypeColor(case_.crimeType)}`}>
                      {getCrimeTypeLabel(case_.crimeType)}
                    </span>
                    <span className="flex items-center gap-1 text-green-600">
                      <Check className="h-4 w-4" />
                      <span className="text-sm font-medium">Applied</span>
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {case_.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {case_.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {case_.dateOccurred && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Occurred: {format(new Date(case_.dateOccurred), 'MMM d, yyyy')}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        Applied: {format(new Date(case_.appliedDate), 'MMM d, yyyy')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Moved to inline display below */}
                    </div>
                  </div>

                  {/* Inline Screenshot Display */}
                  {case_.screenshotPath && (
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200 mt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700">Applied Case Evidence</span>
                      </div>
                      <div className="relative group cursor-pointer" onClick={() => window.open(case_.screenshotPath, '_blank')}>
                        <img
                          src={case_.screenshotPath}
                          alt="Applied Case Screenshot"
                          className="w-full max-w-full h-auto max-h-64 object-contain rounded-md border shadow-sm hover:shadow-md transition-all duration-200"
                          title="Click to view full size"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-md transition-all duration-200 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 bg-green-600 text-white text-sm px-3 py-2 rounded-lg font-medium shadow-lg transition-opacity duration-200">
                            🔍 Click to enlarge
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}