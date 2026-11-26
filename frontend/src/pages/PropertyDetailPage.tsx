import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import type { Property } from '@/types/property'
import { propertyService } from '@/services/propertyService'
import { formatPrice, formatArea, formatPropertyType } from '@/utils/formatters'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Building,
  Home,
  Layers,
  Phone,
  Mail,
  CheckCircle2,
  Pencil,
  Trash2,
} from 'lucide-react'

export const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [contacted, setContacted] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (id) {
      propertyService.getById(Number(id)).then((data) => {
        setProperty(data)
        setLoading(false)
      })
    }
  }, [id])

  const handleDelete = async () => {
    if (!property) return
    const confirmed = window.confirm(`¿Seguro que deseas eliminar "${property.name}"?`)
    if (!confirmed) return

    setDeleting(true)
    try {
      await propertyService.delete(property.id)
      navigate('/propiedades')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-9 h-9 border-4 border-zinc-900 border-t-transparent rounded-full mx-auto" />
        <p className="text-xs text-zinc-500 mt-3">Cargando detalles del inmueble...</p>
      </div>
    )
  }

  if (!property) {
    return (
      <ScrollReveal variant="scale">
        <div className="max-w-md mx-auto px-4 py-20 text-center glass-panel rounded-3xl mt-8">
          <h2 className="text-lg font-bold text-[#1d1d1f]">Propiedad no encontrada</h2>
          <p className="text-xs text-zinc-500 mt-1 mb-5">
            El inmueble no existe o fue eliminado del catálogo.
          </p>
          <Link to="/propiedades">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Volver al catálogo
            </Button>
          </Link>
        </div>
      </ScrollReveal>
    )
  }

  const coverImage =
    property.property_images[0]?.url ||
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ScrollReveal variant="fade">
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/propiedades"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-700 hover:text-zinc-950 px-3.5 py-2 rounded-xl bg-white/75 hover:bg-white border border-zinc-300/80 hover:border-zinc-400 backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-xs hover:shadow-sm hover:-translate-y-[1px] active:scale-[0.97] group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
            Volver al catálogo
          </Link>

          <div className="flex items-center gap-2">
            <Link to={`/propiedades/${property.id}/editar`}>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Pencil className="w-3.5 h-3.5 text-zinc-600" />
                Editar
              </Button>
            </Link>
            <Button
              variant="danger"
              size="sm"
              className="gap-1.5"
              onClick={handleDelete}
              disabled={deleting}
            >
              <Trash2 className="w-3.5 h-3.5" />
              {deleting ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </div>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ScrollReveal variant="scale" duration={750}>
            <div className="rounded-3xl overflow-hidden glass-card aspect-video relative group">
              <img
                src={coverImage}
                alt={property.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
              />
            </div>
          </ScrollReveal>

          <ScrollReveal variant="up" delay={80}>
            <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-zinc-900 text-white border-zinc-800">
                  {formatPropertyType(property.property_type)}
                </Badge>
                <Badge variant={property.is_available ? 'success' : 'default'}>
                  {property.is_available ? 'Disponible' : 'Reservado'}
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold text-[#1d1d1f] tracking-tight">{property.name}</h1>
              <p className="text-sm text-zinc-500 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-zinc-400 shrink-0" />
                {property.address}, {property.zone}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="up" delay={140}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl glass-panel-muted hover:-translate-y-0.5 hover:shadow-md">
                <span className="text-[10px] text-zinc-500 block font-semibold uppercase tracking-wider">ÁREA TOTAL</span>
                <div className="flex items-center gap-1.5 mt-1.5 font-bold text-[#1d1d1f] text-base">
                  <Maximize2 className="w-4 h-4 text-zinc-500" />
                  {formatArea(property.size_m2)}
                </div>
              </div>

              {property.property_type === 'house' && (
                <>
                  <div className="p-4 rounded-2xl glass-panel-muted hover:-translate-y-0.5 hover:shadow-md">
                    <span className="text-[10px] text-zinc-500 block font-semibold uppercase tracking-wider">HABITACIONES</span>
                    <div className="flex items-center gap-1.5 mt-1.5 font-bold text-[#1d1d1f] text-base">
                      <Bed className="w-4 h-4 text-zinc-500" />
                      {property.bedrooms ?? 0}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl glass-panel-muted hover:-translate-y-0.5 hover:shadow-md">
                    <span className="text-[10px] text-zinc-500 block font-semibold uppercase tracking-wider">BAÑOS</span>
                    <div className="flex items-center gap-1.5 mt-1.5 font-bold text-[#1d1d1f] text-base">
                      <Bath className="w-4 h-4 text-zinc-500" />
                      {property.bathrooms ?? 0}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl glass-panel-muted hover:-translate-y-0.5 hover:shadow-md">
                    <span className="text-[10px] text-zinc-500 block font-semibold uppercase tracking-wider">NIVELES</span>
                    <div className="flex items-center gap-1.5 mt-1.5 font-bold text-[#1d1d1f] text-base">
                      <Home className="w-4 h-4 text-zinc-500" />
                      {property.levels ?? 1}
                    </div>
                  </div>
                </>
              )}

              {property.property_type === 'apartment' && (
                <>
                  <div className="p-4 rounded-2xl glass-panel-muted hover:-translate-y-0.5 hover:shadow-md">
                    <span className="text-[10px] text-zinc-500 block font-semibold uppercase tracking-wider">HABITACIONES</span>
                    <div className="flex items-center gap-1.5 mt-1.5 font-bold text-[#1d1d1f] text-base">
                      <Bed className="w-4 h-4 text-zinc-500" />
                      {property.rooms ?? 0}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl glass-panel-muted hover:-translate-y-0.5 hover:shadow-md">
                    <span className="text-[10px] text-zinc-500 block font-semibold uppercase tracking-wider">PISO</span>
                    <div className="flex items-center gap-1.5 mt-1.5 font-bold text-[#1d1d1f] text-base">
                      <Building className="w-4 h-4 text-zinc-500" />
                      Piso {property.floor ?? 1}
                    </div>
                  </div>
                </>
              )}

              {property.property_type === 'land' && (
                <div className="p-4 rounded-2xl glass-panel-muted hover:-translate-y-0.5 hover:shadow-md col-span-2">
                  <span className="text-[10px] text-zinc-500 block font-semibold uppercase tracking-wider">PARCELAS</span>
                  <div className="flex items-center gap-1.5 mt-1.5 font-bold text-[#1d1d1f] text-base">
                    <Layers className="w-4 h-4 text-zinc-500" />
                    {property.quantity_of_parcels ?? 1} Parcela(s) habilitadas
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>

          <ScrollReveal variant="up" delay={180}>
            <div className="glass-panel rounded-3xl p-6 sm:p-8">
              <h3 className="text-base font-bold text-[#1d1d1f] mb-3">Descripción de la Propiedad</h3>
              <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-line font-normal">
                {property.description}
              </p>
            </div>
          </ScrollReveal>
        </div>

        <div>
          <ScrollReveal variant="up" delay={120}>
            <div className="glass-panel-dark rounded-3xl p-6 sticky top-24 text-white space-y-6">
              <div>
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                  Precio de venta
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                  {formatPrice(property.price_cents, property.currency)}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.08] border border-white/10 backdrop-blur-md transition-colors duration-300 hover:bg-white/[0.11]">
                <span className="text-xs font-semibold text-zinc-300 block mb-3">Agente KairoState</span>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-white text-zinc-900 font-bold flex items-center justify-center text-sm shadow-sm">
                    KS
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Agente #{property.agent_id}</h4>
                    <p className="text-xs text-zinc-400">Licencia: KS-{property.agent_id}409</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10 text-xs text-zinc-300 space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-zinc-400" />
                    <span>+51 987 654 321</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-zinc-400" />
                    <span>contacto.agente@kairostate.com</span>
                  </div>
                </div>
              </div>

              {contacted ? (
                <div className="p-3.5 bg-white/15 border border-white/20 rounded-xl text-white text-xs flex items-center gap-2.5 backdrop-blur-md animate-panel-enter">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>¡Mensaje enviado con éxito! El agente te responderá pronto.</span>
                </div>
              ) : (
                <button
                  type="button"
                  className="w-full py-3 px-4 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 font-semibold text-sm cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-sm hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.97] active:translate-y-0"
                  onClick={() => setContacted(true)}
                >
                  Contactar Agente / Solicitar Visita
                </button>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  )
}
