import productsData from '../product-descriptions.json'

// Returns array of all products with their slugs
export function getAllProducts() {
  return Object.entries(productsData.products).map(([slug, product]) => ({
    ...product,
    slug,
  }))
}

// Returns products for a specific brand (case-insensitive match)
// brand param examples: "merikit", "ronas", "orjade", "bethique"
export function getProductsByBrand(brand) {
  const allProducts = getAllProducts()
  const brandMap = {
    'merikit': "MERIKIT",
    'ronas': "RONAS",
    'orjade': "OR'JADE",
    'bethique': "B'ETHIQUE",
  }
  const normalised = brand.toLowerCase().replace(/[^a-z]/g, '')
  const brandName = brandMap[normalised]
  if (!brandName) return []
  return allProducts.filter(p => p.brand === brandName)
}

// Returns a single product by slug
export function getProductBySlug(slug) {
  const product = productsData.products[slug]
  if (!product) return null
  return { ...product, slug }
}

// Returns unique product lines for a brand
export function getProductLinesByBrand(brand) {
  const products = getProductsByBrand(brand)
  const lines = [...new Set(products.map(p => p.product_line).filter(Boolean))]
  return lines
}
