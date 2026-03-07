import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext.jsx'
import '../styles/footer.css'

export default function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p className="footer-brand">Beaute Ethical</p>
        <nav className="footer-nav">
          <Link to="/">{t('nav.home')}</Link>
          <Link to="/catalog">{t('nav.catalog')}</Link>
          <Link to="/contact">{t('nav.contact')}</Link>
        </nav>
        <p className="footer-copy">© {new Date().getFullYear()} Beaute Ethical Supplies. All rights reserved.</p>
      </div>
    </footer>
  )
}
