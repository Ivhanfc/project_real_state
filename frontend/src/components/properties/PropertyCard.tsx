import React from 'react'
import { Link } from 'react-router-dom'
import type { Property } from '@/types/property'
import { formatPrice, formatArea, formatPropertyType } from '@/utils/formatters'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Bed, Bath, Maximize2, MapPin, Building, Home, Layers, ArrowUpRight } from 'lucide-react'

export interface PropertyCardProps {
  property: Property
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const coverImage =
    property.property_images.find((img) => img.is_cover)?.url ||
    property.property_images[0]?.url ||
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'

  const typeIcon = {
    house: <Home className="w-3.5 h-3.5" />,
    apartment: <Building className="w-3.5 h-3.5" />,
    land: <Layers className="w-3.5 h-3.5" />,
  }[property.property_type]

  return (
    <Card hover className="flex flex-col h-full group">
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-200">
        <img
          src={coverImage}
          alt={property.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/15 pointer-events-none" />

        <div className="absolute top-3 left-3 flex gap-1.5">
          <Badge variant="default" className="bg-zinc-900/75 text-white border-white/15 backdrop-blur-xl gap-1">
            {typeIcon}
            {formatPropertyType(property.property_type)}
          </Badge>
          {property.is_available ? (
            <Badge variant="success" className="bg-white/85 text-zinc-900 border-white backdrop-blur-xl">
              Disponible
            </Badge>
          ) : (
            <Badge variant="default" className="bg-zinc-700/80 text-zinc-200 border-white/10 backdrop-blur-xl">
              Reservado
            </Badge>
          )}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-2xl font-bold text-[#1d1d1f] tracking-tight mb-1">
            {formatPrice(property.price_cents, property.currency)}
          </div>
          <h3 className="font-semibold text-zinc-800 text-sm line-clamp-1 mb-1 group-hover:text-zinc-950 transition-colors" title={property.name}>
            {property.name}
          </h3>
          <p className="text-xs text-zinc-500 flex items-center gap-1.5 mb-4">
            <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="truncate">{property.address}, {property.zone}</span>
          </p>
        </div>

        <div>
          <div className="pt-3.5 border-t border-zinc-200/80 grid grid-cols-3 gap-2 text-xs text-zinc-600 mb-4">
            <div className="flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-zinc-400" />
              <span>{formatArea(property.size_m2)}</span>
            </div>

            {property.property_type === 'house' && (
              <>
                <div className="flex items-center gap-1.5">
                  <Bed className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{property.bedrooms ?? '-'} hab</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bath className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{property.bathrooms ?? '-'} bñ</span>
                </div>
              </>
            )}

            {property.property_type === 'apartment' && (
              <>
                <div className="flex items-center gap-1.5">
                  <Bed className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{property.rooms ?? '-'} hab</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Piso {property.floor ?? '-'}</span>
                </div>
              </>
            )}

            {property.property_type === 'land' && (
              <div className="flex items-center gap-1.5 col-span-2">
                <Layers className="w-3.5 h-3.5 text-zinc-400" />
                <span>{property.quantity_of_parcels ?? 1} Parcela(s)</span>
              </div>
            )}
          </div>

          <Link
            to={`/propiedades/${property.id}`}
            className="group/btn flex items-center justify-center gap-1.5 w-full py-2.5 px-3 text-xs font-semibold rounded-xl bg-zinc-200/80 hover:bg-zinc-900 text-zinc-800 hover:text-white transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98]"
          >
            Ver detalles
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </Card>
  )
}
