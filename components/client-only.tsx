"use client"

import type React from "react"

import { useEffect, useState } from "react"

export default function ClientOnly({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="h-[300px] w-full bg-gray-100 animate-pulse rounded-md flex items-center justify-center">
        <p className="text-gray-500">Cargando visualización...</p>
      </div>
    )
  }

  return <>{children}</>
}