'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileImage, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import CrimeTypeSelector from '@/components/crime-type-selector'
import { createWorker } from 'tesseract.js'

interface CaseUploadProps {
  onUploadComplete: (data: any) => void
}

export default function CaseUpload({ onUploadComplete }: CaseUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [extractedText, setExtractedText] = useState<string>('')
  const [selectedCrimeType, setSelectedCrimeType] = useState<string>('')
  const [caseNumber, setCaseNumber] = useState<string>('')
  const [description, setDescription] = useState<string>('')

  const processImage = async (file: File) => {
    setIsProcessing(true)
    
    try {
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // OCR processing
      const worker = await createWorker('eng')
      const { data: { text } } = await worker.recognize(file)
      await worker.terminate()

      setExtractedText(text)

      // Parse the text to extract case information
      const caseData = parseExtractedText(text)
      
      // Auto-populate fields from OCR
      setCaseNumber(caseData.caseNumber || '')
      setDescription(caseData.description || '')
      setSelectedCrimeType(caseData.crimeType || '')
      
      // Upload the file
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const { path } = await response.json()
        // Store the path for later use
        setPreview(path)
      }
    } catch (error) {
      console.error('Error processing image:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const parseExtractedText = (text: string) => {
    // Basic parsing logic - can be enhanced based on actual case format
    const lines = text.split('\\n').map(line => line.trim()).filter(Boolean)
    
    const caseData: any = {
      caseNumber: null,
      crimeType: 'OTHER',
      description: text.substring(0, 500),
      dateOccurred: null,
    }

    // Look for case number patterns
    const caseNumberMatch = text.match(/Case\s*#?\s*:?\s*(\w+-?\d+)/i)
    if (caseNumberMatch) {
      caseData.caseNumber = caseNumberMatch[1]
    }

    // Look for crime type keywords
    const crimeTypes = {
      'theft': 'THEFT',
      'steal': 'THEFT',
      'robbery': 'THEFT',
      'chase': 'POLICE_CHASE',
      'pursuit': 'POLICE_CHASE',
      'eluding': 'POLICE_CHASE',
      'assault.*officer': 'ATTACKING_OFFICER',
      'attack.*officer': 'ATTACKING_OFFICER',
      'murder': 'MURDER',
      'homicide': 'MURDER',
    }

    for (const [pattern, type] of Object.entries(crimeTypes)) {
      if (new RegExp(pattern, 'i').test(text)) {
        caseData.crimeType = type
        break
      }
    }

    // Look for date patterns
    const dateMatch = text.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/);
    if (dateMatch) {
      caseData.dateOccurred = new Date(dateMatch[1])
    }

    return caseData
  }

  const handleSubmitCase = () => {
    const caseData = {
      caseNumber: caseNumber || null,
      crimeType: selectedCrimeType,
      description: description || null,
      screenshotPath: preview,
      extractedData: { rawText: extractedText }
    }
    onUploadComplete(caseData)
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      processImage(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp']
    },
    maxFiles: 1
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Case Screenshot</CardTitle>
        <CardDescription>
          Upload a screenshot of a case to automatically extract information and add it to the FOIA tracking system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-gray-400'}`}
        >
          <input {...getInputProps()} />
          {isProcessing ? (
            <div className="space-y-4">
              <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
              <p>Processing image...</p>
            </div>
          ) : preview ? (
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <FileImage className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">Uploaded Case Screenshot</span>
                </div>
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-full max-w-md h-48 mx-auto object-cover rounded-md border shadow-sm" 
                />
              </div>
              <p className="text-sm text-muted-foreground">Drop another image to replace</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="h-12 w-12 mx-auto text-gray-400" />
              {isDragActive ? (
                <p>Drop the image here...</p>
              ) : (
                <div>
                  <p className="font-medium">Drag & drop a case screenshot here</p>
                  <p className="text-sm text-muted-foreground">or click to select a file</p>
                </div>
              )}
            </div>
          )}
        </div>

        {extractedText && (
          <div className="space-y-6 mt-6">
            {/* Case Details Form */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Case Details</h3>
              <div className="space-y-4">
                {/* Case Number */}
                <div>
                  <label className="block text-sm font-medium mb-2">Case Number</label>
                  <input
                    type="text"
                    value={caseNumber}
                    onChange={(e) => setCaseNumber(e.target.value)}
                    placeholder="Enter case number (optional)"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Crime Type Selector */}
                <CrimeTypeSelector
                  value={selectedCrimeType}
                  onChange={setSelectedCrimeType}
                  required
                />

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the case details..."
                    rows={4}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleSubmitCase}
                  disabled={!selectedCrimeType}
                  className="w-full"
                >
                  Continue to County Selection
                </Button>
              </div>
            </div>

            {/* Extracted Text Preview */}
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Extracted Text Preview:</h4>
              <p className="text-sm whitespace-pre-wrap">{extractedText.substring(0, 300)}...</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}