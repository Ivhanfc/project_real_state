import React, { useEffect, useState } from 'react'
import type { Property, PropertyFilterParams } from '@/types/property'
import { propertyService } from '@/services/propertyService'
import { PropertyGrid } from '@/components/properties/PropertyGrid'
import { PropertyFilters } from '@/components/properties/PropertyFilters'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export const PropertiesPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [zones, setZones] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<PropertyFilterParams>({
    search: '',
    zone: 'all',
    property_type: 'all',
  })

  useEffect(() => {
    propertyService.getAvailableZones().then(setZones)
  }, [])

  useEffect(() => {
    setIsLoading(true)
    propertyService.getAll(filters).then((data) => {
      setProperties(data)
      setIsLoading(false)
    })
  }, [filters])

  const handleReset = () => {
    setFilters({ search: '', zone: 'all', property_type: 'all' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ScrollReveal variant="up">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-[#1d1d1f]">Catálogo de Inmuebles</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Encuentra la casa, departamento o terreno que mejor se ajuste a tus necesidades.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal variant="up" delay={80}>
        <PropertyFilters
          filters={filters}
          zones={zones}
          onChange={setFilters}
          onReset={handleReset}
        />
      </ScrollReveal>

      <ScrollReveal variant="fade" delay={140}>
        <div className="mb-5 text-xs font-semibold text-zinc-500 tracking-wide uppercase">
          {properties.length} {properties.length === 1 ? 'inmueble encontrado' : 'inmuebles encontrados'}
        </div>
      </ScrollReveal>

      <PropertyGrid properties={properties} isLoading={isLoading} />
    </div>
  )
}
