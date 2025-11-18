"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Database, Cpu } from 'lucide-react'
import { useEffect, useState } from "react"

interface ServiceStatus {
  name: string
  status: "operational" | "degraded" | "down"
  responseTime: number
  icon: React.ReactNode
}

export function HealthCheck() {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: "Detection API",
      status: "operational",
      responseTime: 45,
      icon: <Cpu className="h-5 w-5" />,
    },
    {
      name: "Storage Service",
      status: "operational",
      responseTime: 32,
      icon: <Database className="h-5 w-5" />,
    },
    {
      name: "Processing Engine",
      status: "operational",
      responseTime: 78,
      icon: <Activity className="h-5 w-5" />,
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
      case "operational":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      case "degraded":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "down":
        return "bg-red-500/10 text-red-500 border-red-500/20"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {services.map((service) => (
        <Card key={service.name} className="relative overflow-hidden">
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
              <Badge
                variant="outline"
                className={getStatusColor(service.status)}
              >
                {service.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Response Time</span>
                <span className="font-mono font-semibold">
                  {service.responseTime}ms
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-1.5">
                <div
                  className="bg-primary h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(service.responseTime, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
