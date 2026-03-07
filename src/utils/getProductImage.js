import { IMAGE_MAP } from './imageMap.js'

const BRAND_FOLDERS = {
  "RONAS": "Ronas",
  "MERIKIT": "Merikit",
  "OR'JADE": "Or'jade",
  "B'ETHIQUE": "B'ethique",
}

// Returns the public path to a product's image using the pre-built image map.
// Falls back to placeholder if the slug has no mapping.
export function getProductImagePath(brand, productName, slug) {
  const folder = BRAND_FOLDERS[brand]
  const base = import.meta.env.BASE_URL
  if (!folder) return `${base}images/placeholder.jpg`

  const filename = IMAGE_MAP[slug]
  if (filename) return `${base}images/${folder}/${filename}`

  return `${base}images/placeholder.jpg`
}

// Returns the brand folder name for use in paths
export function getBrandFolder(brand) {
  return BRAND_FOLDERS[brand] ?? brand
}

// Returns URL-safe brand slug for routing
export function getBrandSlug(brand) {
  const slugMap = {
    "RONAS": "ronas",
    "MERIKIT": "merikit",
    "OR'JADE": "orjade",
    "B'ETHIQUE": "bethique",
  }
  return slugMap[brand] ?? brand.toLowerCase().replace(/[^a-z0-9]/g, '')
}

// Reverse: from URL slug back to brand name
export function getBrandFromSlug(slug) {
  const reverseMap = {
    "ronas": "RONAS",
    "merikit": "MERIKIT",
    "orjade": "OR'JADE",
    "bethique": "B'ETHIQUE",
  }
  return reverseMap[slug.toLowerCase()] ?? slug.toUpperCase()
}

// Simple fallback — image map has exact filenames so errors just show placeholder
export function makeImageFallback() {
  return function handleError(e) {
    e.target.src = `${import.meta.env.BASE_URL}images/placeholder.jpg`
    e.target.onerror = null
  }
}
