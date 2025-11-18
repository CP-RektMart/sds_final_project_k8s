import { DetectionResults } from "@/components/detection-result";
import { HealthCheck } from "@/components/health-check";
import { ImageUpload } from "@/components/image-upload";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-6xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="container mx-auto px-4 py-8 space-y-12">
          {/* Header */}
          <header className="text-center space-y-4">
            <h1 className="text-5xl font-bold tracking-tight text-balance">
              K8S Face Detection System
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Final project for SDS 2025
            </p>
          </header>

          {/* Section 1: Health Check */}
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">System Health</h2>
            </div>
            <HealthCheck />
          </section>

          {/* Section 2: Image Upload */}
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Upload Image</h2>
            </div>
            <ImageUpload />
          </section>

          {/* Section 3: Detection Results */}
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Detection Results</h2>
            </div>
            <DetectionResults />
          </section>
        </div>
      </main>
    </div>
  );
}
