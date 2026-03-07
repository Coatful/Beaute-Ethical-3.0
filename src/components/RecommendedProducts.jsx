import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext.jsx'
import { getAllProducts } from '../utils/getProducts.js'
import ProductCard from './ProductCard.jsx'
import '../styles/recommended-products.css'

// Fisher-Yates shuffle
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function RecommendedProducts() {
  const { t } = useLanguage()

  // Pick 4 random products once on mount — locked for this page load
  const [products] = useState(() => {
    const all = getAllProducts()
    return shuffle(all).slice(0, 4)
  })

  return (
    <section className="recommended-section">
      <div className="recommended-inner">
        <h2 className="recommended-title">{t('recommended.title')}</h2>
        <div className="recommended-grid">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
