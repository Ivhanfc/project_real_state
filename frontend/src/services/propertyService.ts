import type { Property, PropertyFilterParams, CreatePropertyInput } from '@/types/property'

const INITIAL_PROPERTIES: Property[] = [
  {
    id: 1,
    agent_id: 101,
    name: 'Casa Moderna con Piscina y Jardín',
    description: 'Hermosa residencia de dos niveles ubicada en zona residencial exclusiva. Cuenta con acabados de lujo, amplia terraza y piscina privada.',
    address: 'Av. Las Casuarinas 450',
    zone: 'Santiago de Surco',
    price_cents: 35000000,
    currency: 'USD',
    is_available: true,
    size_m2: 280,
    property_type: 'house',
    levels: 2,
    bedrooms: 4,
    bathrooms: 4,
    property_images: [
      {
        image_id: 'img-1',
        property_id: 1,
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        is_cover: true,
        display_order: 1,
      },
    ],
  },
  {
    id: 2,
    agent_id: 102,
    name: 'Penthouse de Lujo con Vista Panorámica',
    description: 'Exclusivo departamento en piso 14 con vista al mar y la ciudad. Incluye ascensor directo, 3 cocheras techadas y depósito.',
    address: 'Malecón de la Reserva 780',
    zone: 'Miraflores',
    price_cents: 29000000,
    currency: 'USD',
    is_available: true,
    size_m2: 195,
    property_type: 'apartment',
    floor: 14,
    rooms: 3,
    property_images: [
      {
        image_id: 'img-2',
        property_id: 2,
        url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        is_cover: true,
        display_order: 1,
      },
    ],
  },
  {
    id: 3,
    agent_id: 101,
    name: 'Lote Residencial en Condominio Campestre',
    description: 'Terreno completamente plano con todos los servicios habilitados (luz, agua, desagüe). Ideal para casa de campo o inversión.',
    address: 'Fundo El Silencio Km 42',
    zone: 'Lurín',
    price_cents: 8500000,
    currency: 'USD',
    is_available: true,
    size_m2: 500,
    property_type: 'land',
    quantity_of_parcels: 1,
    property_images: [
      {
        image_id: 'img-3',
        property_id: 3,
        url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
        is_cover: true,
        display_order: 1,
      },
    ],
  },
  {
    id: 4,
    agent_id: 103,
    name: 'Departamento Minimalista de Estreno',
    description: 'Acogedor departamento en zona céntrica, a pasos de centros comerciales y universidades. Excelente distribución e iluminación.',
    address: 'Calle San Martín 320',
    zone: 'San Isidro',
    price_cents: 18000000,
    currency: 'USD',
    is_available: true,
    size_m2: 85,
    property_type: 'apartment',
    floor: 6,
    rooms: 2,
    property_images: [
      {
        image_id: 'img-4',
        property_id: 4,
        url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
        is_cover: true,
        display_order: 1,
      },
    ],
  },
]

const STORAGE_KEY = 'kairostate_properties'
const LEGACY_STORAGE_KEY = 'real_state_properties'

function getStoredProperties(): Property[] {
  let data = localStorage.getItem(STORAGE_KEY)
  if (!data) {
    const legacyData = localStorage.getItem(LEGACY_STORAGE_KEY)
    if (legacyData) {
      localStorage.setItem(STORAGE_KEY, legacyData)
      localStorage.removeItem(LEGACY_STORAGE_KEY)
      data = legacyData
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROPERTIES))
      return INITIAL_PROPERTIES
    }
  }
  try {
    return JSON.parse(data)
  } catch {
    return INITIAL_PROPERTIES
  }
}

function saveProperties(properties: Property[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(properties))
}

export const propertyService = {
  async getAll(filters?: PropertyFilterParams): Promise<Property[]> {
    // Simulo la latencia de red para emular la consulta al backend
    await new Promise((resolve) => setTimeout(resolve, 150))
    let list = getStoredProperties()

    if (filters?.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.zone.toLowerCase().includes(q)
      )
    }

    if (filters?.zone && filters.zone !== 'all') {
      list = list.filter((p) => p.zone.toLowerCase() === filters.zone?.toLowerCase())
    }

    if (filters?.property_type && filters.property_type !== 'all') {
      list = list.filter((p) => p.property_type === filters.property_type)
    }

    if (filters?.max_price) {
      list = list.filter((p) => p.price_cents <= (filters.max_price! * 100))
    }

    return list
  },

  async getById(id: number): Promise<Property | null> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    const list = getStoredProperties()
    return list.find((p) => p.id === id) || null
  },

  async create(propertyData: CreatePropertyInput): Promise<Property> {
    await new Promise((resolve) => setTimeout(resolve, 150))
    const list = getStoredProperties()
    const newProperty: Property = {
      ...propertyData,
      id: Date.now(),
    } as Property
    list.unshift(newProperty)
    saveProperties(list)
    return newProperty
  },

  async update(id: number, propertyData: CreatePropertyInput): Promise<Property> {
    await new Promise((resolve) => setTimeout(resolve, 150))
    const list = getStoredProperties()
    const index = list.findIndex((p) => p.id === id)
    if (index === -1) {
      throw new Error(`Inmueble con id ${id} no encontrado`)
    }

    const updatedProperty: Property = {
      ...propertyData,
      id,
    } as Property

    list[index] = updatedProperty
    saveProperties(list)
    return updatedProperty
  },

  async delete(id: number): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 150))
    const list = getStoredProperties()
    const filtered = list.filter((p) => p.id !== id)
    if (filtered.length === list.length) {
      return false
    }
    saveProperties(filtered)
    return true
  },

  async getAvailableZones(): Promise<string[]> {
    const list = getStoredProperties()
    return Array.from(new Set(list.map((p) => p.zone)))
  },
}
