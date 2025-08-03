'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Check, Clock, FileText, Calendar, MapPin } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getCrimeTypeInfo } from '@/lib/crime-types'

interface Case {
  id: string
  caseNumber?: string
  crimeType: string
  description?: string
  dateOccurred?: string
  foiaStatus: 'PENDING' | 'APPLIED'
  appliedDate?: string
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

interface CaseListProps {
  cases: Case[]
  onStatusUpdate: (caseId: string, status: 'APPLIED') => void
}

export default function CaseList({ cases, onStatusUpdate }: CaseListProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleMarkAsApplied = async (caseId: string) => {
    setUpdatingId(caseId)
    try {
      const response = await fetch(`/api/cases/${caseId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          foiaStatus: 'APPLIED',
          appliedDate: new Date().toISOString()
        })
      })

      if (response.ok) {
        onStatusUpdate(caseId, 'APPLIED')
      }
    } catch (error) {
      console.error('Error updating case:', error)
    } finally {
      setUpdatingId(null)
    }
  }

  const getCrimeTypeLabel = (type: string) => {
    return getCrimeTypeInfo(type).label
  }

  const getCrimeTypeColor = (type: string) => {
    return getCrimeTypeInfo(type).color
  }

  if (cases.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No cases found
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {cases.map((case_) => (
        <Card key={case_.id} className={case_.foiaStatus === 'APPLIED' ? 'opacity-75' : ''}>
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
                {case_.foiaStatus === 'PENDING' ? (
                  <span className="flex items-center gap-1 text-yellow-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">Pending</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-green-600">
                    <Check className="h-4 w-4" />
                    <span className="text-sm font-medium">Applied</span>
                  </span>
                )}
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
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {case_.dateOccurred && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(case_.dateOccurred), 'MMM d, yyyy')}
                      </span>
                    )}
                    <span>
                      Added {format(new Date(case_.createdAt), 'MMM d, yyyy')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {case_.foiaStatus === 'PENDING' && (
                      <Button
                        size="sm"
                        onClick={() => handleMarkAsApplied(case_.id)}
                        disabled={updatingId === case_.id}
                      >
                        {updatingId === case_.id ? (
                          'Updating...'
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Mark as Applied
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Inline Screenshot Display */}
                {case_.screenshotPath && (
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Case Evidence</span>
                    </div>
                    <div className="relative group cursor-pointer" onClick={() => window.open(case_.screenshotPath, '_blank')}>
                      <img
                        src={case_.screenshotPath}
                        alt="Case Screenshot"
                        className="w-full max-w-full h-auto max-h-64 object-contain rounded-md border shadow-sm hover:shadow-md transition-all duration-200"
                        title="Click to view full size"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-md transition-all duration-200 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 bg-blue-600 text-white text-sm px-3 py-2 rounded-lg font-medium shadow-lg transition-opacity duration-200">
                          🔍 Click to enlarge
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {case_.appliedDate && (
                <p className="text-sm text-green-600">
                  FOIA applied on {format(new Date(case_.appliedDate), 'MMM d, yyyy')}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}