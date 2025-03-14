import type { Metadata } from "next"
import dynamic from "next/dynamic"

// Importar el componente principal con carga dinámica para evitar errores de window
const LegislativeReport = dynamic(
  () => import("@/components/legislative-report"),
  { ssr: false }, // Esto evita que el componente se renderice en el servidor
)

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

