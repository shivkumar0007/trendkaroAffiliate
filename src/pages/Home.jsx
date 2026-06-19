import { useState } from 'react'
import Header from '../components/Header.jsx'
import BannerCarousel from '../components/BannerCarousel.jsx'
import CategoryBar from '../components/CategoryBar.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import Footer from '../components/Footer.jsx'
import './Home.css'

function Home() {
  const [activeCategory, setActiveCategory] = useState('trend')

  return (
    <>
      <Header />

      <main className="main-content home-main">
        <div className="home-page">
          <BannerCarousel />
          <CategoryBar
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          <ProductGrid activeCategory={activeCategory} />
        </div>
      </main>

      <Footer />
    </>
  )
}

export default Home
