"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import ClientOnly from "./client-only"

const data = [
  { name: "Esperanza Reynal", contribuciones: 14, partido: "PP" },
  { name: "Juan Diego Requena", contribuciones: 9, partido: "PP" },
  { name: "Maribel Sánchez", contribuciones: 9, partido: "PP" },
  { name: "Otros legisladores", contribuciones: 12, partido: "Varios" },
]

export default function KeySpeakersChart() {
  return (
    <ClientOnly>
      <ChartContainer
        config={{
          contribuciones: {
            label: "Contribuciones",
            color: "hsl(var(--chart-1))",
          },
        }}
        className="h-full"
      >
        <ResponsiveContainer width="100%" height={300} minHeight={200}>
          <BarChart data={data} layout="vertical">
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={120} />
            <Tooltip content={<ChartTooltipContent />} />
            <Bar dataKey="contribuciones" fill="var(--color-contribuciones)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </ClientOnly>
  )
}

