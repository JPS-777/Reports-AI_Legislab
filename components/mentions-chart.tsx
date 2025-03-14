"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import ClientOnly from "./client-only"

const data = [
  { month: "Mar", menciones: 10 },
  { month: "Abr", menciones: 12 },
  { month: "May", menciones: 15 },
  { month: "Jun", menciones: 18 },
  { month: "Jul", menciones: 16 },
  { month: "Ago", menciones: 19 },
  { month: "Sep", menciones: 20 },
  { month: "Oct", menciones: 22 },
  { month: "Nov", menciones: 23 },
  { month: "Dic", menciones: 25 },
]

export default function MentionsChart() {
  return (
    <ClientOnly>
      <ChartContainer
        config={{
          menciones: {
            label: "Menciones",
            color: "hsl(var(--chart-1))",
          },
        }}
        className="h-full"
      >
        <ResponsiveContainer width="100%" height={300} minHeight={200}>
          <BarChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            <Bar dataKey="menciones" fill="var(--color-menciones)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </ClientOnly>
  )
}

