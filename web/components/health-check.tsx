import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cpu, ScanFace, FileCog } from 'lucide-react'
import { fetchHealthStatus, ServiceStatus } from "@/utils/health"

const getServiceIcon = (name: string) => {
  if (name.includes('BFF')) return <Cpu className="h-5 w-5" />
  if (name.includes('File')) return <FileCog className="h-5 w-5" />
  if (name.includes('Face')) return <ScanFace className="h-5 w-5" />
  return <Cpu className="h-5 w-5" />
}

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

export async function HealthCheck() {
  const services: ServiceStatus[] = await fetchHealthStatus()
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {services.map((service) => (
        <Card key={service.name} className="relative overflow-hidden pt-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  {getServiceIcon(service.name)}
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
