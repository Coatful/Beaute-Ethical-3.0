import ScrollStory from '../components/ScrollStory.jsx'
import RecommendedProducts from '../components/RecommendedProducts.jsx'
import '../styles/home-page.css'

export default function HomePage() {
  return (
    <main className="home-page">
      <ScrollStory />
      <RecommendedProducts />
    </main>
  )
}
