import type { Metadata } from "next"
import LegislativeReport from "@/components/legislative-report"

export const metadata: Metadata = {
  title: "Informe de Análisis Legislativo sobre Nuclear",
  description:
    "Análisis exhaustivo de las tendencias legislativas relacionadas con el término 'nuclear' en el contexto parlamentario español",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <LegislativeReport />
    </main>
  )
}

