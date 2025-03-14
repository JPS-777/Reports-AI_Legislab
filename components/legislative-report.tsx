"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, FileText, Mail, Phone, Printer } from "lucide-react"
import LLYCLogo from "./llyc-logo"
import DashboardPreview from "./dashboard-preview"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { useEffect } from "react"


export default function LegislativeReport() {
  const [isPrinting, setIsPrinting] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [activeTab, setActiveTab] = useState("resumen")
  const reportRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    setIsPrinting(true)
    setTimeout(() => {
      window.print()
      setIsPrinting(false)
    }, 100)
  }

  const generatePDF = async () => {
    // Dynamically import the jsPDF module
    const { default: jsPDF } = await import("jspdf");
  
    // Create a new jsPDF instance
    const pdf = new jsPDF();
  
    // Add text to the PDF
    pdf.text("Hello, world!", 10, 10);
  
    // Save the PDF
    pdf.save("report.pdf");
  };
  

  // Función mejorada para descargar PDF que preserva el estado de la UI
  const handleDownloadPDF = async () => {
    if (!reportRef.current) return

    try {
      setIsGeneratingPDF(true)

      // Guardar el estado original de las pestañas
      const currentActiveTab = activeTab

      // Crear un nuevo documento PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      })

      // Obtener todas las secciones que necesitan incluirse en el PDF
      const sections = reportRef.current.querySelectorAll(".pdf-section")

      // Guardar el estado original de visualización de cada sección
      const originalDisplayStates = Array.from(sections).map((section) => {
        return {
          element: section as HTMLElement,
          display: (section as HTMLElement).style.display,
        }
      })

      try {
        // Capturar la sección de encabezado primero
        const headerSection = document.getElementById("header-section")
        if (headerSection) {
          const headerCanvas = await html2canvas(headerSection, {
            scale: 1.5,
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#FFFFFF",
            logging: false,
          })

          const headerImgData = headerCanvas.toDataURL("image/jpeg", 0.95)
          const headerImgWidth = 210 // A4 width in mm
          const headerImgHeight = (headerCanvas.height * headerImgWidth) / headerCanvas.width

          pdf.addImage(headerImgData, "JPEG", 0, 0, headerImgWidth, headerImgHeight)

          let currentHeight = headerImgHeight + 10 // Añadir un poco de espacio

          // Ahora capturar el contenido de la pestaña activa
          const activeTabContent = document.getElementById(`${currentActiveTab}-section`)
          if (activeTabContent) {
            const contentCanvas = await html2canvas(activeTabContent, {
              scale: 1.5,
              useCORS: true,
              allowTaint: true,
              backgroundColor: "#FFFFFF",
              logging: false,
            })

            const contentImgData = contentCanvas.toDataURL("image/jpeg", 0.95)
            const contentImgWidth = 210
            const contentImgHeight = (contentCanvas.height * contentImgWidth) / contentCanvas.width

            // Si el contenido no cabe en la primera página, añadir una nueva página
            if (currentHeight + contentImgHeight > 297) {
              // 297mm es la altura de A4
              pdf.addPage()
              currentHeight = 0
            }

            pdf.addImage(contentImgData, "JPEG", 0, currentHeight, contentImgWidth, contentImgHeight)
          }
        }

        // Guardar el PDF
        pdf.save("informe-legislativo-nuclear.pdf")
      } catch (err) {
        console.error("Error al capturar contenido:", err)
        alert("Hubo un problema al generar el PDF. Por favor, inténtelo de nuevo.")
      }
    } catch (error) {
      console.error("Error al generar PDF:", error)
      alert("Hubo un error al generar el PDF. Por favor, inténtelo de nuevo.")
    } finally {
      // Asegurarse de que la interfaz vuelva a su estado normal
      setIsGeneratingPDF(false)
    }
  }

  // Método alternativo más simple y confiable para generar PDF
  const handleSimplePDF = async () => {
    if (!reportRef.current) return

    try {
      setIsGeneratingPDF(true)

      // Crear un nuevo documento PDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      // Capturar solo el encabezado y la pestaña activa
      const headerSection = document.getElementById("header-section")
      const activeTabContent = document.getElementById(`${activeTab}-section`)

      if (headerSection && activeTabContent) {
        // Capturar el encabezado
        const headerCanvas = await html2canvas(headerSection, {
          scale: 1.5,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#FFFFFF",
          logging: false,
        })

        const headerImgData = headerCanvas.toDataURL("image/jpeg", 0.95)
        const headerImgWidth = 210 // A4 width in mm
        const headerImgHeight = (headerCanvas.height * headerImgWidth) / headerCanvas.width

        pdf.addImage(headerImgData, "JPEG", 0, 0, headerImgWidth, headerImgHeight)

        // Capturar el contenido de la pestaña activa
        const contentCanvas = await html2canvas(activeTabContent, {
          scale: 1.5,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#FFFFFF",
          logging: false,
        })

        const contentImgData = contentCanvas.toDataURL("image/jpeg", 0.95)
        const contentImgWidth = 210
        const contentImgHeight = (contentCanvas.height * contentImgWidth) / contentCanvas.width

        // Si el contenido no cabe en la primera página, añadir una nueva página
        if (headerImgHeight + contentImgHeight > 297) {
          // 297mm es la altura de A4
          pdf.addPage()
          pdf.addImage(contentImgData, "JPEG", 0, 0, contentImgWidth, contentImgHeight)
        } else {
          pdf.addImage(contentImgData, "JPEG", 0, headerImgHeight + 5, contentImgWidth, contentImgHeight)
        }
      }

      // Guardar el PDF
      pdf.save("informe-legislativo-nuclear.pdf")
    } catch (error) {
      console.error("Error al generar PDF simplificado:", error)
      alert("Hubo un error al generar el PDF. Por favor, inténtelo de nuevo.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl print:max-w-full print:px-0">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h1 className="text-3xl font-bold text-gray-900 font-montserrat">Vista previa del informe</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint} className="font-montserrat" disabled={isGeneratingPDF}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button className="font-montserrat" onClick={handleSimplePDF} disabled={isGeneratingPDF}>
            <Download className="mr-2 h-4 w-4" />
            {isGeneratingPDF ? "Generando..." : "Descargar PDF"}
          </Button>
        </div>
      </div>

      <div
        ref={reportRef}
        className={`bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none ${isPrinting ? "print:block" : ""}`}
      >
        {/* Header */}
        <div id="header-section" className="bg-gradient-to-r from-[#36A7B7] to-[#36A7B7] text-white p-8 print:p-6 pdf-section">
  <div className="mb-6">
    <LLYCLogo color="white" />
  </div>
  <div className="flex justify-between items-start">
    <div>
      <h1 className="text-3xl font-bold mb-2 print:text-2xl font-montserrat">
        INFORME DE ANÁLISIS LEGISLATIVO SOBRE "NUCLEAR"
      </h1>
      
      {/* Texto con "Fecha" en negrita */}
      <p className="text-white font-montserrat mr-2">
        <span className="font-bold">Fecha:</span> 06 de marzo de 2025
      </p>
      
      {/* Contenedor flex para "Elaborado por" */}
      <div className="flex flex-wrap items-center gap-2">
  <p className="text-white font-montserrat">
    <span className="font-bold">Elaborado por:</span> Juan Pablo Santangelo - Data Policy Officer & Consultor Senior de Asuntos Públicos - LLYC
  </p>
  <a 
    href="https://www.linkedin.com/in/juan-pablo-santangelo/" 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex items-center"
  >
    <FontAwesomeIcon icon={faLinkedin} className="text-white w-6 h-6" />
  </a>
</div>
    </div>
    <div className="hidden md:block">
      <FileText size={64} />
    </div>
  </div>
</div>

        {/* Content */}
        <div className="p-8 print:p-6">
          <Tabs defaultValue="resumen" className="print:block" onValueChange={(value) => setActiveTab(value)}>
            <TabsList className="grid grid-cols-5 mb-8 print:hidden font-montserrat">
              <TabsTrigger value="resumen">Resumen</TabsTrigger>
              <TabsTrigger value="introduccion">Introducción</TabsTrigger>
              <TabsTrigger value="analisis">Análisis</TabsTrigger>
              <TabsTrigger value="conclusiones">Conclusiones</TabsTrigger>
              <TabsTrigger value="contacto">Contacto</TabsTrigger>
            </TabsList>

            {/* Print version shows all content */}
            <div className="hidden print:block mb-8 border-b pb-4">
              <DashboardPreview />
              <h2 className="text-2xl font-bold text-[#36A7B7] mb-4 font-montserrat">RESUMEN EJECUTIVO</h2>
              <p className="text-gray-700 mb-4 font-montserrat">
                Este documento presenta un análisis exhaustivo de las tendencias legislativas relacionadas con el
                término "nuclear" en el contexto parlamentario español durante el periodo marzo-diciembre 2024. El
                estudio revela un creciente interés en este ámbito, con un aumento significativo en las menciones y una
                tasa de aprobación de iniciativas del 88,6%. Se identifican actores clave, principalmente del Partido
                Popular, cuyas contribuciones han sido determinantes en la configuración del debate legislativo, y se
                ofrecen recomendaciones estratégicas para optimizar la participación política en este sector.
              </p>
            </div>

            <TabsContent value="resumen" className="print:mt-0 pdf-section" id="resumen-section">
              <DashboardPreview />
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-[#36A7B7] mb-4 font-montserrat">RESUMEN EJECUTIVO</h2>
                  <p className="text-gray-700 mb-4 font-montserrat leading-relaxed">
                    Este documento presenta un análisis exhaustivo de las tendencias legislativas relacionadas con el
                    término "nuclear" en el contexto parlamentario español durante el periodo marzo-diciembre 2024. El
                    estudio revela un creciente interés en este ámbito, con un aumento significativo en las menciones y
                    una tasa de aprobación de iniciativas del 88,6%. Se identifican actores clave, principalmente del
                    Partido Popular, cuyas contribuciones han sido determinantes en la configuración del debate
                    legislativo, y se ofrecen recomendaciones estratégicas para optimizar la participación política en
                    este sector.
                  </p>

                  <div className="bg-[#36A7B7]/5 p-6 rounded-lg mt-8">
                    <h3 className="text-lg font-semibold text-[#36A7B7] mb-3 font-montserrat">Datos</h3>
                    <ul className="space-y-3 font-montserrat">
                      <li className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-[#36A7B7] mr-2"></div>
                        <span>Período analizado: Marzo - Diciembre 2024</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-[#36A7B7] mr-2"></div>
                        <span>Tasa de aprobación: 88,6%</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-[#36A7B7] mr-2"></div>
                        <span>Tiempo medio de tramitación: 5,7 meses</span>
                      </li>
                      <li className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-[#36A7B7] mr-2"></div>
                        <span>Pico de menciones: 12 (Marzo 2024)</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="introduccion" className="space-y-6 print:mt-8 pdf-section" id="introduccion-section">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-[#36A7B7] mb-4 font-montserrat">1. INTRODUCCIÓN</h2>
                  <p className="text-gray-700 mb-4 font-montserrat leading-relaxed">
                    Este informe ofrece un análisis minucioso de las tendencias legislativas en torno al
                    término "nuclear", con especial énfasis en el contexto parlamentario español. Se han examinado las
                    contribuciones de los grupos y legisladores más activos en este ámbito, evaluando tanto la evolución
                    del debate como las implicaciones estratégicas para la formulación de políticas. La información
                    analizada corresponde a iniciativas y debates registrados en la plataforma de seguimiento
                    legislativo, enfocándose en el periodo reciente de actividad parlamentaria.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-[#36A7B7] mb-4 font-montserrat">2. METODOLOGÍA</h2>
                  <p className="text-gray-700 mb-4 font-montserrat">
                    <strong>Fuente de datos:</strong> Plataforma de análisis legislativo que registra contribuciones y
                    debates en el Congreso.
                  </p>
                  <p className="text-gray-700 mb-4 font-montserrat">
                    <strong>Parámetro de búsqueda:</strong> "Nuclear", abarcando temas de energía, seguridad y medio
                    ambiente.
                  </p>
                  <p className="text-gray-700 mb-4 font-montserrat">
                    <strong>Periodo de estudio:</strong> Marzo de 2024 a diciembre de 2024.
                  </p>
                  <p className="text-gray-700 mb-4 font-montserrat">
                    <strong>Indicadores analizados:</strong>
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2 font-montserrat">
                    <li>Volumen y evolución de las menciones</li>
                    <li>Tiempo promedio de tramitación de iniciativas</li>
                    <li>Tasa de aprobación de las iniciativas</li>
                    <li>Identificación de interlocutores clave y su relevancia</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analisis" className="space-y-6 print:mt-8 pdf-section" id="analisis-section">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-[#36A7B7] mb-4 font-montserrat">3. ANÁLISIS DE RESULTADOS</h2>

                  <h3 className="text-xl font-semibold text-[#36A7B7] mt-6 mb-3 font-montserrat">
                    3.1 Evolución del debate legislativo
                  </h3>
                  <p className="text-gray-700 mb-4 font-montserrat leading-relaxed">
                    Se observa una fluctuación en el número de menciones relacionadas con "nuclear". Las cifras muestran
                    un pico de 12 menciones en marzo de 2024, con variaciones a lo largo del año. Esta tendencia refleja
                    un interés continuo y dinámico en el tema dentro de la actividad parlamentaria.
                  </p>

                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-[#36A7B7] mb-6">
                    <p className="text-gray-700 italic font-montserrat">
                      "La evolución de las menciones muestra una tendencia fluctuante, con un pico inicial en marzo de
                      2024, lo que sugiere un interés sostenido en el tema nuclear a lo largo del período analizado."
                    </p>
                  </div>

                  <p className="text-gray-700 mb-4 font-montserrat">
                    <strong>Contexto político:</strong>
                  </p>
                  <p className="text-gray-700 mb-6 font-montserrat leading-relaxed">
                    La intensificación del debate se puede atribuir a la necesidad de revisar la política energética,
                    evaluar la seguridad de las infraestructuras nucleares y abordar los retos medioambientales en el
                    marco de la transición ecológica.
                  </p>

                  <h3 className="text-xl font-semibold text-[#36A7B7] mt-6 mb-3 font-montserrat">
                    3.2 Tiempo de tramitación y tasa de aprobación
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-[#36A7B7]/5 p-5 rounded-lg">
                      <h4 className="font-bold text-[#36A7B7] mb-2 font-montserrat">Tiempo de tramitación</h4>
                      <p className="font-montserrat mb-2">
                        <strong>Iniciativas aprobadas:</strong> 5,7 meses
                      </p>
                      <p className="font-montserrat">
                        <strong>Iniciativas archivadas:</strong> 1,8 meses
                      </p>
                    </div>
                    <div className="bg-[#36A7B7]/5 p-5 rounded-lg">
                      <h4 className="font-bold text-[#36A7B7] mb-2 font-montserrat">Tasa de aprobación</h4>
                      <p className="font-montserrat mb-2">
                        <strong>Iniciativas aprobadas:</strong> 88,6%
                      </p>
                      <p className="font-montserrat">
                        <strong>Iniciativas rechazadas:</strong> 11,4%
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-2 font-montserrat">
                    <strong>Tiempo promedio para iniciativas aprobadas:</strong>
                  </p>
                  <p className="text-gray-700 mb-4 font-montserrat leading-relaxed">
                    Aproximadamente 5,7 meses, lo que indica una agilidad relativamente favorable para propuestas que
                    finalmente reciben luz verde, considerando la complejidad técnica y la diversidad de intereses
                    involucrados en la materia nuclear.
                  </p>

                  <p className="text-gray-700 mb-2 font-montserrat">
                    <strong>Tiempo promedio para iniciativas archivadas:</strong>
                  </p>
                  <p className="text-gray-700 mb-4 font-montserrat leading-relaxed">
                    Unos 1,8 meses, lo que sugiere que las iniciativas con menor viabilidad o consenso son identificadas
                    y descartadas en un plazo relativamente corto, optimizando los recursos legislativos.
                  </p>

                  <p className="text-gray-700 mb-2 font-montserrat">
                    <strong>Tasa de aprobación:</strong>
                  </p>
                  <p className="text-gray-700 mb-6 font-montserrat leading-relaxed">
                    Con un 88,6% de iniciativas aprobadas, el entorno legislativo muestra una receptividad muy
                    favorable, siempre que las propuestas sean técnicamente sólidas y cuenten con el respaldo político
                    necesario.
                  </p>

                  <h3 className="text-xl font-semibold text-[#36A7B7] mt-6 mb-3 font-montserrat">
                    3.3 Interlocutores clave
                  </h3>

                  <p className="text-gray-700 mb-4 font-montserrat leading-relaxed">
                    El análisis destaca la participación activa de ciertos legisladores, cuyas contribuciones han
                    marcado pautas en el debate sobre "nuclear":
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="bg-[#36A7B7]/5">
                      <CardContent className="p-4">
                        <h4 className="font-bold text-[#36A7B7] font-montserrat">Esperanza Reynal Reillo</h4>
                        <ul className="mt-2 space-y-1 font-montserrat">
                          <li>
                            <strong>Contribuciones:</strong> 14
                          </li>
                          <li>
                            <strong>Grupo:</strong> Partido Popular (PP)
                          </li>
                          <li>
                            <strong>Procedencia:</strong> Valencia
                          </li>
                        </ul>
                        <p className="mt-2 text-sm font-montserrat">
                          Su elevada participación evidencia un enfoque proactivo en la discusión y en la formulación de
                          propuestas relacionadas con la seguridad y el futuro energético del país.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#36A7B7]/5">
                      <CardContent className="p-4">
                        <h4 className="font-bold text-[#36A7B7] font-montserrat">Juan Diego Requena Ruiz</h4>
                        <ul className="mt-2 space-y-1 font-montserrat">
                          <li>
                            <strong>Contribuciones:</strong> 9
                          </li>
                          <li>
                            <strong>Grupo:</strong> Partido Popular (PP)
                          </li>
                          <li>
                            <strong>Procedencia:</strong> Jaén
                          </li>
                        </ul>
                        <p className="mt-2 text-sm font-montserrat">
                          Su implicación en iniciativas legislativas refuerza la postura del PP en temas de política
                          nuclear, destacándose en debates técnicos y estratégicos.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#36A7B7]/5">
                      <CardContent className="p-4">
                        <h4 className="font-bold text-[#36A7B7] font-montserrat">Maribel Sánchez Torregrosa</h4>
                        <ul className="mt-2 space-y-1 font-montserrat">
                          <li>
                            <strong>Contribuciones:</strong> 9
                          </li>
                          <li>
                            <strong>Grupo:</strong> Partido Popular (PP)
                          </li>
                          <li>
                            <strong>Procedencia:</strong> Almería
                          </li>
                        </ul>
                        <p className="mt-2 text-sm font-montserrat">
                          Su actividad parlamentaria ha contribuido a dinamizar el debate en torno a la energía nuclear,
                          posicionándose como referente dentro de su grupo.
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <h3 className="text-xl font-semibold text-[#36A7B7] mt-6 mb-3 font-montserrat">
                    3.4 Consideraciones estratégicas y recomendaciones
                  </h3>

                  <div className="bg-[#36A7B7]/5 p-6 rounded-lg mb-6">
                    <h4 className="font-bold text-[#36A7B7] mb-2 font-montserrat">Posicionamiento transversal</h4>
                    <p className="text-gray-700 mb-4 font-montserrat leading-relaxed">
                      El debate sobre "nuclear" involucra aspectos de seguridad, medio ambiente y transición energética.
                      Es fundamental adoptar una postura integradora, que aborde tanto las oportunidades de
                      modernización tecnológica como los desafíos en materia de sostenibilidad.
                    </p>

                    <h4 className="font-bold text-[#36A7B7] mb-2 font-montserrat">
                      Fortalecimiento del argumentario técnico
                    </h4>
                    <p className="text-gray-700 mb-4 font-montserrat leading-relaxed">
                      Se recomienda consolidar una base argumentativa robusta que haga hincapié en la seguridad
                      operativa, el control de riesgos y la viabilidad económica de las inversiones en tecnología
                      nuclear. Esto es clave para generar consenso y contar con el respaldo de la comunidad técnica y
                      científica.
                    </p>

                    <h4 className="font-bold text-[#36A7B7] mb-2 font-montserrat">Alianzas estratégicas</h4>
                    <p className="text-gray-700 mb-4 font-montserrat leading-relaxed">
                      Dada la tasa de aprobación relativamente alta, es esencial fomentar alianzas interparlamentarias.
                      La colaboración con legisladores que han demostrado un alto grado de compromiso facilitará la
                      tramitación y el éxito de las iniciativas.
                    </p>

                    <h4 className="font-bold text-[#36A7B7] mb-2 font-montserrat">
                      Participación en comisiones especializadas
                    </h4>
                    <p className="text-gray-700 font-montserrat leading-relaxed">
                      A pesar de que el tiempo de tramitación de 5,7 meses para iniciativas aprobadas es relativamente
                      ágil para este tipo de temática, sigue siendo necesario participar activamente en las comisiones y
                      foros especializados. Esto permitirá anticipar posibles obstáculos y ajustar las propuestas en
                      función de las dinámicas internas del Congreso.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="conclusiones" className="space-y-6 print:mt-8 pdf-section" id="conclusiones-section">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-[#36A7B7] mb-4 font-montserrat">4. CONCLUSIONES AMPLIADAS</h2>
                  <p className="text-gray-700 mb-6 font-montserrat leading-relaxed">
                    El análisis del debate parlamentario en torno al término "nuclear" evidencia no solo un incremento
                    sostenido en el volumen de menciones, sino también la consolidación de un discurso que combina
                    aspectos de seguridad, transición energética y sostenibilidad ambiental. La participación de
                    legisladores clave – en particular Esperanza Reynal Reillo, Juan Diego Requena Ruiz y Maribel
                    Sánchez Torregrosa – subraya la importancia estratégica que el Partido Popular está otorgando a esta
                    temática, lo cual se traduce en un liderazgo sectorial que puede influir decisivamente en la agenda
                    legislativa.
                  </p>

                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-[#36A7B7] mb-6">
                    <p className="text-gray-700 italic font-montserrat">
                      "La consolidación del debate nuclear en la agenda parlamentaria representa una oportunidad
                      estratégica para el posicionamiento político en materia energética y medioambiental."
                    </p>
                  </div>

                  <h3 className="text-xl font-semibold text-[#36A7B7] mt-6 mb-3 font-montserrat">
                    4.1 Implicaciones Políticas y Estratégicas
                  </h3>

                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h4 className="font-bold text-[#36A7B7] mb-2 font-montserrat">Contexto transversal</h4>
                    <p className="text-gray-700 mb-4 font-montserrat leading-relaxed">
                      El debate sobre "nuclear" se sitúa en la intersección de múltiples áreas estratégicas: la
                      seguridad energética, la modernización tecnológica y la sostenibilidad ambiental. Este cruce de
                      intereses ofrece una oportunidad única para articular una política integradora, que combine
                      inversiones en tecnología, garantías en materia de seguridad operativa y compromisos con la
                      transición ecológica.
                    </p>

                    <h4 className="font-bold text-[#36A7B7] mb-2 font-montserrat">
                      Ventaja competitiva en el discurso
                    </h4>
                    <p className="text-gray-700 mb-4 font-montserrat leading-relaxed">
                      La elevada tasa de aprobación (88,6%) de las iniciativas y el tiempo relativamente ágil de
                      tramitación (5,7 meses) demuestran una apertura legislativa hacia propuestas bien fundamentadas y
                      respaldadas por argumentos técnicos sólidos. Aprovechar esta coyuntura permitirá posicionarse como
                      referente en la modernización del marco regulatorio y en la promoción de políticas de innovación
                      energética.
                    </p>

                    <h4 className="font-bold text-[#36A7B7] mb-2 font-montserrat">Liderazgo de interlocutores clave</h4>
                    <p className="text-gray-700 font-montserrat leading-relaxed">
                      El desempeño destacado de los legisladores identificados sugiere que contar con alianzas
                      estratégicas con estos actores no solo facilitará la tramitación de iniciativas, sino que también
                      reforzará la imagen de seriedad y compromiso en la materia. Su experiencia y su historial de
                      contribuciones relevantes deben ser capitalizados en la definición de futuras estrategias
                      legislativas.
                    </p>
                  </div>

                  <h3 className="text-xl font-semibold text-[#36A7B7] mt-6 mb-3 font-montserrat">
                    4.2 Recomendaciones de acción
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="bg-[#36A7B7]/5">
                      <CardContent className="p-4">
                        <h4 className="font-bold text-[#36A7B7] font-montserrat">Fortalecimiento del argumentario</h4>
                        <p className="mt-2 text-sm font-montserrat leading-relaxed">
                          Se recomienda la elaboración de un dossier técnico que respalde las propuestas legislativas,
                          integrando datos actualizados, estudios de viabilidad y análisis de riesgos.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#36A7B7]/5">
                      <CardContent className="p-4">
                        <h4 className="font-bold text-[#36A7B7] font-montserrat">Desarrollo de alianzas</h4>
                        <p className="mt-2 text-sm font-montserrat leading-relaxed">
                          Es imprescindible impulsar la creación de coaliciones interparlamentarias que incluyan no solo
                          a los actores del Partido Popular, sino también a aquellos de otras formaciones.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#36A7B7]/5">
                      <CardContent className="p-4">
                        <h4 className="font-bold text-[#36A7B7] font-montserrat">Participación en comisiones</h4>
                        <p className="mt-2 text-sm font-montserrat leading-relaxed">
                          El tiempo razonable de tramitación observado en las iniciativas aprobadas (5,7 meses) puede
                          optimizarse aún más intensificando la presencia en las comisiones de trabajo especializadas.
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <h3 className="text-xl font-semibold text-[#36A7B7] mt-6 mb-3 font-montserrat">
                    4.3 Riesgos y mitigación
                  </h3>

                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h4 className="font-bold text-[#36A7B7] mb-2 font-montserrat">Riesgos políticos y tácticos</h4>
                    <p className="text-gray-700 mb-2 font-montserrat leading-relaxed">
                      La complejidad inherente a la materia nuclear implica enfrentar debates intensos y, en ocasiones,
                      polarizados. Un riesgo potencial es la fragmentación del consenso, especialmente en un entorno
                      donde convergen intereses diversos.
                    </p>

                    <h4 className="font-bold text-[#36A7B7] mb-2 font-montserrat">Medidas de mitigación</h4>
                    <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4 font-montserrat">
                      <li>Establecer mesas de diálogo técnico con expertos en energía nuclear y medio ambiente.</li>
                      <li>Realizar estudios comparativos que destaquen experiencias internacionales exitosas.</li>
                      <li>
                        Aprovechar el tiempo relativamente corto de identificación de iniciativas inviables (1,8 meses)
                        para refinar propuestas antes de su presentación formal.
                      </li>
                    </ul>

                    <h4 className="font-bold text-[#36A7B7] mb-2 font-montserrat">Riesgos en la percepción pública</h4>
                    <p className="text-gray-700 font-montserrat leading-relaxed">
                      El debate sobre energía nuclear a menudo genera inquietud en la ciudadanía. Es esencial
                      desarrollar una estrategia de comunicación que esclarezca los beneficios y los controles de
                      seguridad implementados, reduciendo así la posibilidad de interpretaciones negativas o alarmistas.
                    </p>
                  </div>

                  <h3 className="text-xl font-semibold text-[#36A7B7] mt-6 mb-3 font-montserrat">
                    4.4 Visión a futuro
                  </h3>

                  <div className="bg-[#36A7B7]/5 p-6 rounded-lg">
                    <p className="text-gray-700 mb-4 font-montserrat leading-relaxed">
                      El escenario legislativo en torno al "nuclear" se perfila como un campo de acción prioritario en
                      la agenda política española. Con una base sólida de apoyo, una tendencia creciente en las
                      menciones parlamentarias y tiempos de tramitación relativamente eficientes, se presenta una
                      oportunidad para liderar la transformación del sector energético, adoptando medidas innovadoras
                      que impulsen la competitividad y la seguridad nacional.
                    </p>
                    <p className="text-gray-700 font-montserrat leading-relaxed">
                      La proactividad y la articulación estratégica en este ámbito no solo permitirán mantener o mejorar
                      la actual tasa de aprobación de iniciativas y sus tiempos de tramitación, sino también consolidar
                      una imagen de liderazgo responsable y visionario ante los retos de la transición energética.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contacto" className="print:mt-8 pdf-section" id="contacto-section">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-[#36A7B7] mb-4 font-montserrat">5. CONTACTO</h2>
                  <p className="text-gray-700 mb-6 font-montserrat">
                    Para ampliar información o discutir estrategias específicas, por favor, contacte con:
                  </p>

                  <div className="bg-[#36A7B7]/5 p-6 rounded-lg">
                    <div className="flex items-start">
                      <div className="mr-4">
                        <div className="w-12 h-12 bg-[#36A7B7] rounded-full flex items-center justify-center text-white">
                          <Mail size={24} />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-[#36A7B7] font-montserrat">
                          Data Policy Officer & Consultor Senior de Asuntos Públicos
                        </h3>
                      
                        <div className="mt-2 space-y-1 font-montserrat">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-[#36A7B7]" />
                            <span>juanpablo.santangelo@llyc.global</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-[#36A7B7]" />
                            <span>+34 91 XXX XX XX</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mt-8 italic font-montserrat">
                    Este informe se presenta con fines de asesoramiento estratégico y está sujeto a la verificación
                    continua de datos en función del desarrollo del entorno legislativo.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}