import { useLanguage } from '../context/LanguageContext.jsx'
import '../styles/contact-page.css'

export default function ContactPage() {
  const { t } = useLanguage()
  return (
    <main className="contact-page">
      <div className="contact-inner">
        <div className="contact-header">
          <h1 className="contact-title">{t('contact.title')}</h1>
          <div className="contact-gold-line" />
        </div>
        <div className="contact-layout">
          <div className="contact-info">
            <div className="contact-field">
              <span className="contact-label">{t('contact.email')}</span>
              <a href="mailto:beauteethical@yahoo.com.sg" className="contact-value">
                beauteethical@yahoo.com.sg
              </a>
            </div>
            <div className="contact-field">
              <span className="contact-label">{t('contact.phone')}</span>
              <a href="tel:+6581880911" className="contact-value">+65 8188 0911</a>
            </div>
            <div className="contact-field">
              <span className="contact-label">{t('contact.address')}</span>
              <span className="contact-value">30 Ceylon Road, Singapore</span>
            </div>
          </div>
          <div className="contact-qr">
            <img src={`${import.meta.env.BASE_URL}images/Contact QR.png`} alt="Contact QR Code" />
            <p>Scan to contact us on WhatsApp</p>
          </div>
        </div>
      </div>
    </main>
  )
}
