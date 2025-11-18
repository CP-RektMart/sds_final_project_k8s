"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Download, User } from 'lucide-react'
import { useState } from "react"
import Image from "next/image"

interface DetectedFace {
  id: string
  confidence: number
  boundingBox: { x: number; y: number; width: number; height: number }
}

export function DetectionResults() {
  const [format, setFormat] = useState<string>("jpg")
  const [detectedFaces] = useState<DetectedFace[]>([
    {
      id: "1",
      confidence: 98.5,
      boundingBox: { x: 120, y: 80, width: 150, height: 180 },
    },
    {
      id: "2",
      confidence: 95.2,
      boundingBox: { x: 320, y: 100, width: 140, height: 170 },
    },
    {
      id: "3",
      confidence: 92.8,
      boundingBox: { x: 500, y: 90, width: 145, height: 175 },
    },
  ])

  const handleDownload = () => {
    console.log(`Downloading in ${format} format`)
    // Implement download logic here
  }

  return (
    <div className="space-y-6">
      {/* Results Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-base px-3 py-1">
                  {detectedFaces.length} Faces Detected
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jpg">JPG</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="svg">SVG</SelectItem>
                  <SelectItem value="webp">WEBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detected Faces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {detectedFaces.map((face, index) => (
          <Card key={face.id} className="overflow-hidden">
            <div className="aspect-square bg-muted relative">
              <Image
                src={`/image.png`}
                alt={`Detected face ${index + 1}`}
                fill
                className="object-cover"
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
                  <Badge
                    variant="outline"
                    className="bg-primary/10 text-primary border-primary/20"
                  >
                    {face.confidence}%
                  </Badge>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Position:</span>
                    <span className="font-mono">
                      ({face.boundingBox.x}, {face.boundingBox.y})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span className="font-mono">
                      {face.boundingBox.width} × {face.boundingBox.height}
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
