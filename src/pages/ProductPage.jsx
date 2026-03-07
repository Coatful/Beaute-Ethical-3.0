import { useParams, Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext.jsx'
import { getProductBySlug } from '../utils/getProducts.js'
import { getProductImagePath, getBrandSlug, makeImageFallback } from '../utils/getProductImage.js'
import '../styles/product-page.css'

export default function ProductPage() {
  const { brand, slug } = useParams()
  const { lang, t } = useLanguage()
  const product = getProductBySlug(slug)

  if (!product) {
    return (
      <main className="product-page">
        <div className="product-not-found">
          <p>Product not found.</p>
          <Link to="/catalog">&larr; Back to Catalog</Link>
        </div>
      </main>
    )
  }

  const imgSrc = getProductImagePath(product.brand, product.name, product.slug)
  const d = product.descriptions

  const fields = [
    { label: t('product.features'), value: d?.product_features?.[lang] },
    { label: t('product.skinType'), value: d?.skin_type?.[lang] },
    { label: t('product.ingredients'), value: d?.main_ingredients?.[lang] },
    { label: t('product.howToUse'), value: d?.how_to_use?.[lang] },
    { label: t('product.content'), value: d?.content?.[lang] },
  ].filter(f => f.value)

  return (
    <main className="product-page">
      <div className="product-page-inner">
        <div className="product-breadcrumb">
          <Link to="/catalog">Catalog</Link>
          <span> / </span>
          <Link to={`/catalog/${getBrandSlug(product.brand)}`}>{product.brand}</Link>
          <span> / </span>
          <span>{product.name}</span>
        </div>
        <div className="product-layout">
          <div className="product-image-col">
            <div className="product-image-wrap">
              <img
                src={imgSrc}
                alt={product.name}
                onError={makeImageFallback()}
              />
            </div>
          </div>
          <div className="product-info-col">
            <p className="product-brand-label">{product.brand}</p>
            <h1 className="product-name">{product.name}</h1>
            {product.product_line && (
              <p className="product-line-label">{product.product_line}</p>
            )}
            <div className="product-divider" />
            <dl className="product-fields">
              {fields.map(({ label, value }) => (
                <div key={label} className="product-field">
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </main>
  )
}
