import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import "./globals.css"

// Properly define the font with sorted weights
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-montserrat",
})

export const metadata: Metadata = {
  title: "Informe de Análisis Legislativo sobre Nuclear",
  description:
    "Análisis exhaustivo de las tendencias legislativas relacionadas con el término 'nuclear' en el contexto parlamentario español",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${montserrat.className} ${montserrat.variable}`}>{children}</body>
    </html>
  )
}

