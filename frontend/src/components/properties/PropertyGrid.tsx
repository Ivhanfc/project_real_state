import React from 'react'
import type { Property } from '@/types/property'
import { PropertyCard } from './PropertyCard'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { Building2 } from 'lucide-react'

export interface PropertyGridProps {
  properties: Property[]
  isLoading?: boolean
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({ properties, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="h-84 rounded-2xl glass-card animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <ScrollReveal variant="scale">
        <div className="text-center py-16 px-4 glass-panel rounded-2xl border-dashed border-zinc-300">
          <Building2 className="w-12 h-12 text-zinc-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-zinc-800">No se encontraron propiedades</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Intenta ajustar los filtros de búsqueda o registra una nueva propiedad desde el menú superior.
          </p>
        </div>
      </ScrollReveal>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property, index) => (
        <ScrollReveal
          key={property.id}
          variant="up"
          delay={Math.min((index % 3) * 90 + Math.floor(index / 3) * 60, 420)}
          duration={700}
          className="h-full"
        >
          <PropertyCard property={property} />
        </ScrollReveal>
      ))}
    </div>
  )
}
