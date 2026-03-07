import { Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import Footer from './components/Footer.jsx'
import HomePage from './pages/HomePage.jsx'
import CatalogPage from './pages/CatalogPage.jsx'
import BrandPage from './pages/BrandPage.jsx'
import ProductPage from './pages/ProductPage.jsx'
import ContactPage from './pages/ContactPage.jsx'

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/catalog/:brand" element={<BrandPage />} />
        <Route path="/catalog/:brand/:slug" element={<ProductPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
      <Footer />
    </>
  )
}
