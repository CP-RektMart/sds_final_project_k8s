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
import { Upload, ImageIcon, X, Activity } from 'lucide-react'
import { useState } from "react"
import { useDropzone } from 'react-dropzone'

interface ImageUploadProps {
  onDetectionComplete?: (faces: string[], fileType?: string) => void;
}

export function ImageUpload({ onDetectionComplete }: ImageUploadProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [targetFormat, setTargetFormat] = useState<string>("jpeg")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // react-dropzone setup
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles?.[0]
    if (file) handleFile(file)
  }

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    accept: { 'image/*': [] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const handleFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDetect = async () => {
    if (!selectedImage) return
    setIsProcessing(true)
    setError(null) 

    try {
      // Extract base64 payload from data URL
      const match = selectedImage.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/)
      const base64 = match ? match[2] : selectedImage.split(',')[1] || ''

      // Send to backend as JSON with lowercase format
      const res = await fetch('/api/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64,
          target_format: targetFormat.toLowerCase()
        }),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: res.statusText }))
        throw new Error(errData.error || res.statusText)
      }

      const data = await res.json()
      if (data.success && onDetectionComplete) {
        onDetectionComplete(data.faces, data.fileType)
      }
      
    } catch (err) {
      console.error('detection error', err)
      setError(err instanceof Error ? err.message : 'Detection failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const clearImage = () => {
    setSelectedImage(null)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        {!selectedImage ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-border bg-muted/30"
            }`}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-primary/10">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  Drop your image here, or browse
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports: JPG, PNG, WEBP (Max 10MB)
                </p>
              </div>
              <Button
                onClick={() => open()}
                size="lg"
                className="mt-2"
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Select Image
              </Button>
              {/* dropzone's hidden input */}
              <input {...getInputProps()} className="hidden" />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                {error}
              </div>
            )}
            <div className="relative rounded-lg overflow-hidden bg-muted">
              {/* use a standard <img> for data URL preview to avoid Next/Image restrictions */}
              <img
                src={selectedImage || "/placeholder.svg"}
                alt="Uploaded image"
                className="w-full h-auto max-h-96 object-contain"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-4 right-4"
                onClick={clearImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium whitespace-nowrap">Convert to:</label>
                <Select value={targetFormat} onValueChange={setTargetFormat}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="webp">WEBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleDetect}
                  disabled={isProcessing}
                  className="flex-1"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Activity className="mr-2 h-4 w-4" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Activity className="mr-2 h-4 w-4" />
                      Detect Faces
                    </>
                  )}
                </Button>
                <Button variant="outline" size="lg" onClick={clearImage}>
                  Clear
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
