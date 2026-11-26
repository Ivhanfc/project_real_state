import React from 'react'
import type { PropertyFilterParams, PropertyType } from '@/types/property'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export interface PropertyFiltersProps {
  filters: PropertyFilterParams
  zones: string[]
  onChange: (newFilters: PropertyFilterParams) => void
  onReset: () => void
}

export const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  filters,
  zones,
  onChange,
  onReset,
}) => {
  return (
    <div className="glass-panel-muted rounded-2xl p-4 sm:p-5 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 items-end">
        <div className="group">
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5 transition-colors duration-200 group-focus-within:text-zinc-950">
            Buscar
          </label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400 transition-colors duration-200 group-focus-within:text-zinc-800 pointer-events-none" />
            <input
              type="text"
              placeholder="Nombre, dirección..."
              value={filters.search || ''}
              onChange={(e) => onChange({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl bg-white/85 text-zinc-900 placeholder-zinc-400 border border-zinc-300/80 backdrop-blur-md field-smooth hover:border-zinc-400/90 hover:bg-white/95 hover:shadow-[0_2px_10px_rgba(0,0,0,0.04)] focus:outline-none focus:border-zinc-900 focus:bg-white focus:ring-4 focus:ring-zinc-900/10 focus:shadow-[0_6px_20px_rgba(0,0,0,0.06)] focus:-translate-y-[1px]"
            />
          </div>
        </div>

        <div className="group">
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5 transition-colors duration-200 group-focus-within:text-zinc-950">
            Zona / Distrito
          </label>
          <select
            value={filters.zone || 'all'}
            onChange={(e) => onChange({ ...filters, zone: e.target.value })}
            className="w-full py-2.5 px-3.5 text-sm rounded-xl bg-white/85 text-zinc-900 border border-zinc-300/80 backdrop-blur-md cursor-pointer field-smooth hover:border-zinc-400/90 hover:bg-white/95 hover:shadow-[0_2px_10px_rgba(0,0,0,0.04)] focus:outline-none focus:border-zinc-900 focus:bg-white focus:ring-4 focus:ring-zinc-900/10 focus:shadow-[0_6px_20px_rgba(0,0,0,0.06)] focus:-translate-y-[1px]"
          >
            <option value="all">Todas las zonas</option>
            {zones.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        </div>

        <div className="group">
          <label className="block text-xs font-semibold text-zinc-700 mb-1.5 transition-colors duration-200 group-focus-within:text-zinc-950">
            Tipo de inmueble
          </label>
          <select
            value={filters.property_type || 'all'}
            onChange={(e) =>
              onChange({ ...filters, property_type: e.target.value as PropertyType | 'all' })
            }
            className="w-full py-2.5 px-3.5 text-sm rounded-xl bg-white/85 text-zinc-900 border border-zinc-300/80 backdrop-blur-md cursor-pointer field-smooth hover:border-zinc-400/90 hover:bg-white/95 hover:shadow-[0_2px_10px_rgba(0,0,0,0.04)] focus:outline-none focus:border-zinc-900 focus:bg-white focus:ring-4 focus:ring-zinc-900/10 focus:shadow-[0_6px_20px_rgba(0,0,0,0.06)] focus:-translate-y-[1px]"
          >
            <option value="all">Todos los tipos</option>
            <option value="house">Casas</option>
            <option value="apartment">Departamentos</option>
            <option value="land">Terrenos</option>
          </select>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="w-full text-xs py-2.5"
            onClick={onReset}
          >
            Limpiar filtros
          </Button>
        </div>
      </div>
    </div>
  )
}
