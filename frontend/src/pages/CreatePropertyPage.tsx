import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { propertyService } from '@/services/propertyService'
import type { PropertyType, CreatePropertyInput } from '@/types/property'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { Building2, ArrowLeft } from 'lucide-react'

export const CreatePropertyPage: React.FC = () => {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    zone: 'Miraflores',
    price: 150000,
    currency: 'USD',
    size_m2: 120,
    property_type: 'house' as PropertyType,
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    bedrooms: 3,
    bathrooms: 2,
    levels: 1,
    floor: 1,
    rooms: 2,
    quantity_of_parcels: 1,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const baseData = {
        agent_id: 101,
        name: formData.name,
        description: formData.description,
        address: formData.address,
        zone: formData.zone,
        price_cents: Math.round(formData.price * 100),
        currency: formData.currency,
        is_available: true,
        size_m2: Number(formData.size_m2),
        property_images: [
          {
            image_id: `img-${Date.now()}`,
            property_id: 0,
            url: formData.imageUrl,
            is_cover: true,
            display_order: 1,
          },
        ],
      }

      let payload: CreatePropertyInput

      if (formData.property_type === 'house') {
        payload = {
          ...baseData,
          property_type: 'house',
          levels: Number(formData.levels),
          bedrooms: Number(formData.bedrooms),
          bathrooms: Number(formData.bathrooms),
        }
      } else if (formData.property_type === 'apartment') {
        payload = {
          ...baseData,
          property_type: 'apartment',
          floor: Number(formData.floor),
          rooms: Number(formData.rooms),
        }
      } else {
        payload = {
          ...baseData,
          property_type: 'land',
          quantity_of_parcels: Number(formData.quantity_of_parcels),
        }
      }

      const newProperty = await propertyService.create(payload)
      navigate(`/propiedades/${newProperty.id}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <ScrollReveal variant="fade">
        <Link
          to="/propiedades"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-700 hover:text-zinc-950 px-3.5 py-2 rounded-xl bg-white/75 hover:bg-white border border-zinc-300/80 hover:border-zinc-400 backdrop-blur-md mb-6 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-xs hover:shadow-sm hover:-translate-y-[1px] active:scale-[0.97] group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
          Volver al catálogo
        </Link>
      </ScrollReveal>

      <ScrollReveal variant="up" delay={60}>
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-[#1d1d1f] flex items-center gap-2.5">
            <Building2 className="w-7 h-7 text-zinc-700" />
            Registrar Nueva Propiedad
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Completa los datos técnicos del inmueble para publicarlo en KairoState.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal variant="up" delay={120}>
        <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Título de la Propiedad"
              placeholder="Ej. Casa en La Molina con jardín"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <Select
              label="Tipo de Inmueble"
              value={formData.property_type}
              onChange={(e) => setFormData({ ...formData, property_type: e.target.value as PropertyType })}
            >
              <option value="house">Casa</option>
              <option value="apartment">Departamento</option>
              <option value="land">Terreno</option>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Dirección"
              placeholder="Ej. Av. Javier Prado Este 2500"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />

            <Input
              label="Zona / Distrito"
              placeholder="Ej. San Isidro, Surco, Miraflores..."
              required
              value={formData.zone}
              onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Precio (USD)"
              type="number"
              min={1}
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            />

            <Input
              label="Área (m²)"
              type="number"
              min={1}
              required
              value={formData.size_m2}
              onChange={(e) => setFormData({ ...formData, size_m2: Number(e.target.value) })}
            />

            <Input
              label="URL de Imagen de Portada"
              placeholder="https://..."
              required
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            />
          </div>

          {formData.property_type === 'house' && (
            <div key="house-fields" className="p-4 rounded-2xl glass-panel-muted grid grid-cols-3 gap-3 animate-panel-enter">
              <Input
                label="Habitaciones"
                type="number"
                min={1}
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
              />
              <Input
                label="Baños"
                type="number"
                min={1}
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
              />
              <Input
                label="Niveles / Pisos"
                type="number"
                min={1}
                value={formData.levels}
                onChange={(e) => setFormData({ ...formData, levels: Number(e.target.value) })}
              />
            </div>
          )}

          {formData.property_type === 'apartment' && (
            <div key="apartment-fields" className="p-4 rounded-2xl glass-panel-muted grid grid-cols-2 gap-3 animate-panel-enter">
              <Input
                label="Número de Piso"
                type="number"
                min={1}
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })}
              />
              <Input
                label="Ambientes / Cuartos"
                type="number"
                min={1}
                value={formData.rooms}
                onChange={(e) => setFormData({ ...formData, rooms: Number(e.target.value) })}
              />
            </div>
          )}

          {formData.property_type === 'land' && (
            <div key="land-fields" className="p-4 rounded-2xl glass-panel-muted animate-panel-enter">
              <Input
                label="Cantidad de Parcelas"
                type="number"
                min={1}
                value={formData.quantity_of_parcels}
                onChange={(e) => setFormData({ ...formData, quantity_of_parcels: Number(e.target.value) })}
              />
            </div>
          )}

          <div className="group">
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5 transition-colors duration-200 group-focus-within:text-zinc-950">
              Descripción
            </label>
            <textarea
              rows={4}
              className="w-full rounded-xl bg-white/80 px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 border border-zinc-300/80 backdrop-blur-md field-smooth hover:border-zinc-400/90 hover:bg-white/95 hover:shadow-[0_2px_10px_rgba(0,0,0,0.04)] focus:outline-none focus:border-zinc-900 focus:bg-white focus:ring-4 focus:ring-zinc-900/10 focus:shadow-[0_6px_20px_rgba(0,0,0,0.06)] focus:-translate-y-[1px]"
              placeholder="Detalles sobre comodidades, cochera, servicios, etc."
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-zinc-200/80">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/propiedades')}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Guardando...' : 'Publicar Inmueble'}
            </Button>
          </div>
        </form>
      </ScrollReveal>
    </div>
  )
}
