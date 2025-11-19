"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User } from 'lucide-react'

interface DetectionResultsProps {
  faces: string[]; // array of base64 encoded face images
  fileType?: string; // file type (jpeg, png, webp)
}

export function DetectionResults({ faces, fileType = 'jpeg' }: DetectionResultsProps) {
  if (!faces || faces.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Results Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <Badge variant="secondary" className="text-base px-3 py-1">
              {faces.length} Face{faces.length !== 1 ? 's' : ''} Detected
            </Badge>
            <Badge variant="outline" className="text-sm px-2 py-1">
                  Format: {fileType.toUpperCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Detected Faces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {faces.map((faceBase64, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="aspect-square bg-muted relative">
              <img
                src={`data:image/${fileType};base64,${faceBase64}`}
                alt={`Detected face ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">
                      Face {index + 1}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
