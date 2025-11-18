"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, ImageIcon, X, Activity } from 'lucide-react'
import { useState } from "react"
import { useDropzone } from 'react-dropzone'

export function ImageUpload() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  
  const [isProcessing, setIsProcessing] = useState(false)
  // we use react-dropzone's `open()` to trigger file dialog

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

    try {
      // Extract MIME and base64 payload from data URL
      const match = selectedImage.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.*)$/)
      const mime = match ? match[1] : 'application/octet-stream'
      const base64 = match ? match[2] : selectedImage.split(',')[1] || ''

      // Send to backend as JSON (adjust endpoint as needed)
      const res = await fetch('/api/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, mime }),
      })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(errText || res.statusText)
      }

      const data = await res.json()
      console.log('detection response', data)
    } catch (err) {
      console.error('detection error', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const clearImage = () => {
    setSelectedImage(null)
    // no file input ref when using dropzone; clearing state is sufficient
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
            <div className="flex gap-3">
              <Button
                onClick={handleDetect}
                disabled={isProcessing}
                className="flex-1"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <span className="animate-spin mr-2">⚡</span>
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
        )}
      </CardContent>
    </Card>
  )
}
