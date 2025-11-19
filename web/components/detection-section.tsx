"use client"

import { DetectionResults } from "@/components/detection-result";
import { ImageUpload } from "@/components/image-upload";
import { useState } from "react";

export function DetectionSection() {
  const [detectedFaces, setDetectedFaces] = useState<string[]>([]);
  const [fileType, setFileType] = useState<string>('');

  const handleDetectionComplete = (faces: string[], type?: string) => {
    setDetectedFaces(faces);
    setFileType(type || '');
  };

  return (
    <>
      {/* Section 2: Image Upload */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Upload Image</h2>
        </div>
        <ImageUpload onDetectionComplete={handleDetectionComplete} />
      </section>

      {/* Section 3: Detection Results */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Detection Results</h2>
        </div>
        {detectedFaces.length > 0 ? (
          <DetectionResults faces={detectedFaces} fileType={fileType} />
        ) : (
          <p className="text-muted-foreground">No faces detected yet.</p>
        )
        }
      </section>
    </>
  );
}
