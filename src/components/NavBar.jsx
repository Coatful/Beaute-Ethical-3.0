import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext.jsx'
import '../styles/navbar.css'

function NavLink({ to, active, children }) {
  return (
    <Link to={to} className={`nav-link ${active ? 'active' : ''}`}>
      <span className="nav-link-text">{children}</span>
      <span className="nav-link-hover">
        <span>{children}</span>
        <span className="nav-link-arrow">→</span>
      </span>
      <span className="nav-link-dot" />
    </Link>
  )
}

export default function NavBar() {
  const { t, lang, toggle } = useLanguage()
  const location = useLocation()

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <img src={`${import.meta.env.BASE_URL}images/beaute-ethical-logo.jpg`} alt="Beaute Ethical" />
      </Link>
      <div className="navbar-links">
        <NavLink to="/" active={location.pathname === '/'}>{t('nav.home')}</NavLink>
        <NavLink to="/catalog" active={location.pathname.startsWith('/catalog')}>{t('nav.catalog')}</NavLink>
        <NavLink to="/contact" active={location.pathname === '/contact'}>{t('nav.contact')}</NavLink>

        {/* Pill language toggle */}
        <button
          className={`lang-switch ${lang === 'zh' ? 'zh' : ''}`}
          onClick={toggle}
          aria-label="Toggle language"
        >
          <span className="lang-switch-pill" />
          <span className="lang-switch-labels">
            <span className={`lang-switch-label ${lang === 'en' ? 'active' : ''}`}>EN</span>
            <span className={`lang-switch-label ${lang === 'zh' ? 'active' : ''}`}>中文</span>
          </span>
        </button>
      </div>
    </nav>
  )
}
