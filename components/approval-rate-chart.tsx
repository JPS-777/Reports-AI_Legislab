"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { name: "Aprobadas", value: 66.7 },
  { name: "Rechazadas", value: 33.3 },
]

const COLORS = ["var(--color-aprobadas)", "hsl(var(--muted))"]

export default function ApprovalRateChart() {
  return (
    <ChartContainer
      config={{
        aprobadas: {
          label: "Aprobadas",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-full"
    >
      <div className="flex flex-col items-center justify-center h-full">
        <h3 className="text-sm font-medium mb-2">Tasa de aprobación</h3>
        <ResponsiveContainer width="100%" height="80%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltipContent />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  )
}

