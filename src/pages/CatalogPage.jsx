import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext.jsx'
import '../styles/catalog-page.css'

const BASE = import.meta.env.BASE_URL
const BRANDS = [
  { slug: 'merikit', name: 'MERIKIT', logo: `${BASE}images/MERIKIT Logo.png` },
  { slug: 'ronas', name: 'RONAS', logo: `${BASE}images/RONAS Logo.png` },
  { slug: 'orjade', name: "OR'JADE", logo: `${BASE}images/OR'JADE Logo.png` },
  { slug: 'bethique', name: "B'ETHIQUE", logo: `${BASE}images/B'ethique Logo.png` },
]

export default function CatalogPage() {
  const { t } = useLanguage()
  return (
    <main className="catalog-page">
      <div className="catalog-header-section">
        <h1 className="catalog-title">{t('catalog.header')}</h1>
        <div className="catalog-gold-line" />
      </div>
      <div className="catalog-brands-grid">
        {BRANDS.map(brand => (
          <Link key={brand.slug} to={`/catalog/${brand.slug}`} className="brand-box">
            <img src={brand.logo} alt={brand.name} loading="lazy" />
          </Link>
        ))}
      </div>
    </main>
  )
}
