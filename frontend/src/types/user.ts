export interface User {
  id: string
  first_name: string
  last_name: string
  phone: string
  email: string
  created_at: string
  is_active: boolean
}

export interface Agent extends User {
  type: string
  license_number: string
}

export interface Lead extends User {
  source_lead: string
  interest_level: number
}
