import { useParams, Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext.jsx'
import { getProductsByBrand, getProductLinesByBrand } from '../utils/getProducts.js'
import { getBrandFromSlug, getBrandSlug, getProductImagePath } from '../utils/getProductImage.js'
import { IMAGE_MAP } from '../utils/imageMap.js'
import ProductCard from '../components/ProductCard.jsx'
import '../styles/brand-page.css'

// Returns true when every product in the line maps to the same image file
function hasSharedImage(lineProducts) {
  if (lineProducts.length < 2) return false
  const first = IMAGE_MAP[lineProducts[0].slug]
  return first && lineProducts.every(p => IMAGE_MAP[p.slug] === first)
}

function SharedImageLineSection({ products, lang }) {
  const brandSlug = getBrandSlug(products[0].brand)
  const sharedImgSrc = getProductImagePath(products[0].brand, products[0].name, products[0].slug)

  return (
    <div className="shared-image-line">
      <div className="shared-image-line-img">
        <img src={sharedImgSrc} alt={products[0].product_line} />
      </div>
      <ul className="shared-image-product-list">
        {products.map(product => {
          const desc = product.descriptions?.product_features?.[lang] ?? ''
          const short = desc.length > 120 ? desc.slice(0, 120) + '\u2026' : desc
          return (
            <li key={product.slug}>
              <Link to={`/catalog/${brandSlug}/${product.slug}`} className="shared-image-product-item">
                <span className="shared-image-product-name">{product.name}</span>
                {short && <span className="shared-image-product-desc">{short}</span>}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default function BrandPage() {
  const { brand } = useParams()
  const { lang } = useLanguage()
  const brandName = getBrandFromSlug(brand)
  const products = getProductsByBrand(brand)
  const lines = getProductLinesByBrand(brand)

  const scrollToLine = (line) => {
    const el = document.getElementById(`line-${line.replace(/\s+/g, '-')}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const productsByLine = lines.reduce((acc, line) => {
    acc[line] = products.filter(p => p.product_line === line)
    return acc
  }, {})

  return (
    <main className="brand-page">
      <div className="brand-page-header">
        <h1 className="brand-page-title">{brandName}</h1>
        <div className="brand-gold-line" />
      </div>
      <div className="brand-page-layout">
        {/* Left sidebar */}
        <aside className="brand-sidebar">
          <h3 className="sidebar-heading">Product Lines</h3>
          <ul className="sidebar-list">
            {lines.map(line => (
              <li key={line}>
                <button className="sidebar-link" onClick={() => scrollToLine(line)}>
                  {line}
                </button>
              </li>
            ))}
          </ul>
        </aside>
        {/* Main content */}
        <div className="brand-content">
          {lines.map(line => {
            const lineProducts = productsByLine[line]
            return (
              <div key={line} id={`line-${line.replace(/\s+/g, '-')}`} className="product-line-section">
                <h2 className="product-line-title">{line}</h2>
                {hasSharedImage(lineProducts) ? (
                  <SharedImageLineSection products={lineProducts} lang={lang} />
                ) : (
                  <div className="product-line-grid">
                    {lineProducts.map(product => (
                      <ProductCard key={product.slug} product={product} />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
