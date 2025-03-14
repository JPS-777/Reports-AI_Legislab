"use client"

import Image from "next/image"
import { useState } from "react"
import ClientOnly from "./client-only"

export default function DashboardPreview() {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)

  // Fallback image URL in case the original fails to load
  const fallbackImageUrl = "/placeholder.svg?height=800&width=1200"

  // Original image URL
  const imageUrl =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20pantalla%202025-03-06%20145419-9nvMP1vTMzI4PywDNgAlGxxf9IajSM.png"

  return (
    <ClientOnly>
      <div className="w-full rounded-lg overflow-hidden shadow-lg mb-8">
        <div className="bg-[#1B1F2B] p-4">
          <h3 className="text-white font-montserrat text-sm mb-2">Fuente: AI Legislab - Powered by LLYC</h3>
        </div>
        <div className="relative w-full" style={{ minHeight: "300px" }}>
          <Image
            src={imageFailed ? fallbackImageUrl : imageUrl}
            alt="Dashboard de AI Legislab mostrando análisis parlamentario sobre menciones nucleares"
            width={1200}
            height={800}
            className="w-full"
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              console.log("Image failed to load, using fallback")
              setImageFailed(true)
            }}
            priority={true}
            unoptimized={true}
          />

          {!imageLoaded && !imageFailed && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <p className="text-gray-500">Cargando imagen...</p>
            </div>
          )}
        </div>
      </div>
    </ClientOnly>
  )
}

