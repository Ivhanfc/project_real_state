export type PropertyType = 'house' | 'apartment' | 'land'

export interface PropertyImage {
  image_id: string
  property_id: number
  url: string
  is_cover: boolean
  display_order: number
}

export interface PropertyBase {
  id: number
  agent_id: number
  name: string
  description: string
  property_images: PropertyImage[]
  address: string
  zone: string
  price_cents: number
  currency: string
  is_available: boolean
  size_m2: number
  property_type: PropertyType
}

export interface HouseProperty extends PropertyBase {
  property_type: 'house'
  levels?: number
  bedrooms?: number
  bathrooms?: number
}

export interface ApartmentProperty extends PropertyBase {
  property_type: 'apartment'
  floor?: number
  rooms?: number
}

export interface LandProperty extends PropertyBase {
  property_type: 'land'
  quantity_of_parcels?: number
}

export type Property = HouseProperty | ApartmentProperty | LandProperty

export type CreatePropertyInput =
  | Omit<HouseProperty, 'id'>
  | Omit<ApartmentProperty, 'id'>
  | Omit<LandProperty, 'id'>

export interface PropertyFilterParams {
  search?: string
  zone?: string
  property_type?: PropertyType | 'all'
  min_price?: number
  max_price?: number
  is_available?: boolean
}
