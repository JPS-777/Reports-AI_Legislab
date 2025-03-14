"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import ClientOnly from "./client-only"

const data = [
  { name: "Iniciativas aprobadas", meses: 5.7 },
  { name: "Iniciativas archivadas", meses: 1.8 },
]

export default function ProcessingTimeChart() {
  return (
    <ClientOnly>
      <ChartContainer
        config={{
          meses: {
            label: "Meses",
            color: "hsl(var(--chart-1))",
          },
        }}
        className="h-full"
      >
        <div className="flex flex-col h-full">
          <h3 className="text-sm font-medium mb-2">Tiempo de tramitación</h3>
          <ResponsiveContainer width="100%" height={250} minHeight={180}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar dataKey="meses" fill="var(--color-meses)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>
    </ClientOnly>
  )
}

