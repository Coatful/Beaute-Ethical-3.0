import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext.jsx'
import { getProductImagePath, getBrandSlug, makeImageFallback } from '../utils/getProductImage.js'
import '../styles/product-card.css'

export default function ProductCard({ product }) {
  const { lang } = useLanguage()
  const imgSrc = getProductImagePath(product.brand, product.name, product.slug)
  const brandSlug = getBrandSlug(product.brand)
  const description = product.descriptions?.product_features?.[lang] ?? ''
  const shortDesc = description.length > 100 ? description.slice(0, 100) + '\u2026' : description

  return (
    <Link
      to={`/catalog/${brandSlug}/${product.slug}`}
      className="product-card"
    >
      <div className="product-card-img-wrap">
        <img
          src={imgSrc}
          alt={product.name}
          loading="lazy"
          onError={makeImageFallback()}
        />
      </div>
      <div className="product-card-body">
        <p className="product-card-brand">{product.brand}</p>
        <h3 className="product-card-name">{product.name}</h3>
        <p className="product-card-desc">{shortDesc}</p>
      </div>
    </Link>
  )
}
