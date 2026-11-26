import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Property } from '@/types/property'
import { propertyService } from '@/services/propertyService'
import { PropertyGrid } from '@/components/properties/PropertyGrid'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { ArrowRight, Search } from 'lucide-react'

export const HomePage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    propertyService.getAll().then((data) => {
      setProperties(data.slice(0, 3))
      setLoading(false)
    })
  }, [])

  return (
    <div className="space-y-14 py-8">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="scale" duration={800}>
          <div className="relative rounded-3xl glass-panel-dark p-10 sm:p-16 text-center overflow-hidden">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-5">
              Gestión Inteligente de Propiedades
            </h1>

            <p className="text-zinc-300 text-base sm:text-lg max-w-2xl mx-auto mb-9 font-normal leading-relaxed">
              Publica y vende tu inmueble con facilidad en KairoState.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                to="/propiedades"
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 font-semibold text-sm transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-sm hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.97] active:translate-y-0 flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                Explorar Catálogo
              </Link>
              <Link
                to="/nueva-propiedad"
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-white/12 hover:bg-white/22 text-white font-semibold text-sm transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] border border-white/20 hover:border-white/35 backdrop-blur-md hover:-translate-y-0.5 active:scale-[0.97] active:translate-y-0 flex items-center justify-center gap-2"
              >
                Publicar Inmueble
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <ScrollReveal variant="up" delay={80}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1d1d1f] tracking-tight">Propiedades Destacadas</h2>
              <p className="text-sm text-zinc-500 mt-1">Últimos inmuebles disponibles en el mercado</p>
            </div>
            <Link
              to="/propiedades"
              className="text-sm font-semibold text-zinc-700 hover:text-zinc-950 flex items-center gap-1.5 transition-colors duration-200 group"
            >
              Ver todas
              <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>

        <PropertyGrid properties={properties} isLoading={loading} />
      </section>
    </div>
  )
}
