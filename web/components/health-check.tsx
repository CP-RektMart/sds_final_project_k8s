"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cpu, ScanFace, FileCog } from 'lucide-react'
import { useEffect, useState } from "react"

interface ServiceStatus {
  name: string
  status: "Healthy" | "Loading" | "Failed"
  icon: React.ReactNode
}

export function HealthCheck() {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: "BFF Service",
      status: "Healthy",
      icon: <Cpu className="h-5 w-5" />,
    },
    {
      name: "File Convertor Service",
      status: "Healthy",
      icon: <FileCog className="h-5 w-5" />,
    },
    {
      name: "Face Recognition Service",
      status: "Healthy",
      icon: <ScanFace className="h-5 w-5" />,
    },
  ])

  useEffect(() => {
    // Simulate real-time health check updates
    const interval = setInterval(() => {
      setServices((prev) =>
        prev.map((service) => ({
          ...service,
          responseTime: Math.floor(Math.random() * 100) + 20,
        }))
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: ServiceStatus["status"]) => {
    switch (status) {
      case "Healthy":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      case "Loading":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "Failed":
        return "bg-red-500/10 text-red-500 border-red-500/20"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {services.map((service) => (
        <Card key={service.name} className="relative overflow-hidden pt-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  {service.icon}
                </div>
                <CardTitle className="text-base font-medium">
                  {service.name}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
            <Badge
                variant="outline"
                className={getStatusColor(service.status)}
              >
                {service.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
