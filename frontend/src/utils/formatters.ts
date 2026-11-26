export function formatPrice(priceCents: number, currency: string = 'USD'): string {
  const amount = priceCents / 100
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatArea(sizeM2: number): string {
  return `${sizeM2.toLocaleString('es-PE')} m²`
}

export function formatPropertyType(type: 'house' | 'apartment' | 'land'): string {
  switch (type) {
    case 'house':
      return 'Casa'
    case 'apartment':
      return 'Departamento'
    case 'land':
      return 'Terreno'
    default:
      return 'Propiedad'
  }
}
