'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import CaseUpload from '@/components/case-upload'
import CaseList from '@/components/case-list'
import CountySelector from '@/components/county-selector'
import AppliedCasesView from '@/components/applied-cases-view'
import { Button } from '@/components/ui/button'
import { Plus, Map, List, FileText, CheckCircle, Filter } from 'lucide-react'
import { CRIME_TYPES } from '@/lib/crime-types'

// Import the full US map with all 50 states
import FullUSMap from '@/components/full-us-map'

interface State {
  id: string
  code: string
  name: string
  pendingCases: number
}

interface County {
  id: string
  name: string
  stateId: string
  pendingCases: number
}

interface Case {
  id: string
  caseNumber?: string
  crimeType: string
  description?: string
  dateOccurred?: string
  foiaStatus: string
  appliedDate?: string
  screenshotPath?: string
  county: {
    id: string
    name: string
    state: {
      name: string
      code: string
    }
  }
  createdAt: string
}

export default function Home() {
  const [view, setView] = useState<'map' | 'list' | 'upload' | 'applied'>('map')
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null)
  const [states, setStates] = useState<State[]>([])
  const [counties, setCounties] = useState<County[]>([])
  const [cases, setCases] = useState<Case[]>([])
  const [allPendingCases, setAllPendingCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(false)
  const [showCountySelector, setShowCountySelector] = useState(false)
  const [pendingCaseData, setPendingCaseData] = useState<any>(null)
  const [pendingCrimeFilter, setPendingCrimeFilter] = useState<string>('')

  useEffect(() => {
    fetchStates()
    fetchAllPendingCases()
  }, [])

  useEffect(() => {
    if (selectedState) {
      fetchCounties(selectedState)
    }
  }, [selectedState])

  useEffect(() => {
    if (selectedCounty) {
      fetchCases(selectedCounty)
    } else if (selectedState) {
      fetchCases(null, selectedState)
    } else {
      setCases([]) // Clear cases when no state/county selected
    }
  }, [selectedState, selectedCounty])

  const fetchStates = async () => {
    try {
      const response = await fetch('/api/states')
      const data = await response.json()
      setStates(data)
    } catch (error) {
      console.error('Error fetching states:', error)
    }
  }

  const fetchAllPendingCases = async () => {
    try {
      const response = await fetch('/api/cases?foiaStatus=PENDING')
      const data = await response.json()
      setAllPendingCases(data)
    } catch (error) {
      console.error('Error fetching all pending cases:', error)
    }
  }

  const fetchCounties = async (stateCode: string) => {
    try {
      const response = await fetch(`/api/counties?stateCode=${stateCode}`)
      const data = await response.json()
      setCounties(data)
    } catch (error) {
      console.error('Error fetching counties:', error)
    }
  }

  const fetchCases = async (countyId?: string | null, stateCode?: string) => {
    setLoading(true)
    try {
      let url = '/api/cases?foiaStatus=PENDING'
      if (countyId) {
        url += `&countyId=${countyId}`
      } else if (stateCode) {
        url += `&stateCode=${stateCode}`
      }

      const response = await fetch(url)
      const data = await response.json()
      setCases(data)
    } catch (error) {
      console.error('Error fetching cases:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUploadComplete = async (caseData: any) => {
    setPendingCaseData(caseData)
    setShowCountySelector(true)
  }

  const handleCountySelect = async (countyId: string) => {
    if (pendingCaseData) {
      try {
        console.log('Creating case with county ID:', countyId)
        const response = await fetch('/api/cases', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...pendingCaseData,
            countyId
          })
        })

        if (response.ok) {
          alert('Case added successfully!')
          setView('map')
          fetchStates() // Refresh data
          fetchAllPendingCases() // Refresh pending cases list
          setShowCountySelector(false)
          setPendingCaseData(null)
        } else {
          const errorData = await response.json()
          console.error('Error response:', errorData)
          alert('Error creating case. Please try again.')
        }
      } catch (error) {
        console.error('Error creating case:', error)
        alert('Error creating case. Please check the console for details.')
      }
    }
  }

  const handleCancelCountySelection = () => {
    setShowCountySelector(false)
    setPendingCaseData(null)
  }

  const handleStatusUpdate = () => {
    // Refresh data after status update
    fetchStates()
    fetchAllPendingCases() // Refresh the all pending cases list
    if (selectedCounty) {
      fetchCases(selectedCounty)
    } else if (selectedState) {
      fetchCases(null, selectedState)
    }
  }

  const handleStateClick = (stateCode: string) => {
    setSelectedState(stateCode)
    setSelectedCounty(null) // Clear county selection when selecting new state
  }

  const getMapCaseCounts = () => {
    if (selectedState) {
      return counties.map(county => ({
        countyId: county.id,
        count: county.pendingCases
      }))
    }

    return states.map(state => ({
      stateCode: state.code,
      count: state.pendingCases
    }))
  }

  const getFilteredPendingCases = () => {
    return allPendingCases.filter(case_ => {
      const crimeMatch = pendingCrimeFilter ? case_.crimeType === pendingCrimeFilter : true
      return crimeMatch
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-xl font-semibold">FOIA Request Tracker</h1>
            </div>
            <nav className="flex space-x-4">
              <Button
                variant={view === 'map' ? 'default' : 'ghost'}
                onClick={() => setView('map')}
              >
                <Map className="h-4 w-4 mr-2" />
                Map View
              </Button>
              <Button
                variant={view === 'list' ? 'default' : 'ghost'}
                onClick={() => setView('list')}
              >
                <List className="h-4 w-4 mr-2" />
                Pending Cases
              </Button>
              <Button
                variant={view === 'applied' ? 'default' : 'ghost'}
                onClick={() => setView('applied')}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Applied Database
              </Button>
              <Button
                variant={view === 'upload' ? 'default' : 'ghost'}
                onClick={() => setView('upload')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Case
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'map' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>FOIA Request Status Map</CardTitle>
                <CardDescription>
                  Click on a state to view county-level data. Numbers indicate pending FOIA requests.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <FullUSMap
                  caseCounts={getMapCaseCounts()}
                  onStateClick={handleStateClick}
                  onCountyClick={setSelectedCounty}
                />
              </CardContent>
            </Card>

            {selectedState && (
              <Card>
                <CardHeader>
                  <CardTitle>Pending Cases in {selectedState}</CardTitle>
                  <CardDescription>
                    {cases.length} cases pending FOIA requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">Loading cases...</div>
                  ) : (
                    <CaseList cases={cases} onStatusUpdate={handleStatusUpdate} />
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {view === 'list' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Pending FOIA Requests</CardTitle>
                    <CardDescription>
                      {getFilteredPendingCases().length} of {allPendingCases.length} cases pending FOIA requests across all states
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Filter className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Filter Cases</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Filter by Crime Type:</label>
                      <select
                        value={pendingCrimeFilter}
                        onChange={(e) => setPendingCrimeFilter(e.target.value)}
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
                        onClick={() => setPendingCrimeFilter('')}
                        className="w-full"
                      >
                        Clear Filter
                      </Button>
                    </div>
                  </div>
                </div>
                <CaseList cases={getFilteredPendingCases()} onStatusUpdate={handleStatusUpdate} />
              </CardContent>
            </Card>
          </div>
        )}

        {view === 'upload' && (
          <CaseUpload onUploadComplete={handleUploadComplete} />
        )}

        {view === 'applied' && (
          <AppliedCasesView />
        )}
      </main>

      {showCountySelector && (
        <CountySelector
          onSelect={handleCountySelect}
          onCancel={handleCancelCountySelection}
        />
      )}
    </div>
  )
}