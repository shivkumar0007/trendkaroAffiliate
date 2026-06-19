import { useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header.jsx'
import BannerCarousel from '../components/BannerCarousel.jsx'
import CategoryBar from '../components/CategoryBar.jsx'
import ProductGrid from '../components/ProductGrid.jsx'
import Footer from '../components/Footer.jsx'
import SEO, { DEFAULT_IMAGE, SITE_NAME, SITE_URL } from '../components/SEO.jsx'
import categories from '../data/categories.js'
import './Home.css'

const homeDescription =
  'Shop curated affiliate deals on fashion, tech, trending products, and daily finds from Trendkaro.'

function getPageDescription(isCategoryPage, category) {
  if (!isCategoryPage || !category) {
    return homeDescription
  }

  return `Browse ${category.label} affiliate deals on Trendkaro, including curated products, trending finds, and daily offers.`
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  sameAs: [
    'https://instagram.com/your-handle',
    'https://youtube.com/your-channel',
    'https://facebook.com/your-page',
  ],
}

function getBreadcrumbSchema(category) {
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: SITE_URL,
    },
  ]

  if (category) {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: category.label,
      item: `${SITE_URL}/category/${category.id}`,
    })
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  }
}

function Home() {
  const navigate = useNavigate()
  const { categoryId } = useParams()
  const activeCategory = useMemo(() => {
    if (!categoryId) {
      return 'trend'
    }

    return categories.some((category) => category.id === categoryId)
      ? categoryId
      : 'trend'
  }, [categoryId])

  const activeCategoryData = useMemo(
    () => categories.find((category) => category.id === activeCategory) || categories[0],
    [activeCategory],
  )

  useEffect(() => {
    if (categoryId && activeCategory !== categoryId) {
      navigate('/category/trend', { replace: true })
    }
  }, [activeCategory, categoryId, navigate])

  const handleCategoryChange = (nextCategory) => {
    navigate(`/category/${nextCategory}`)
  }

  const isCategoryPage = Boolean(categoryId)
  const title = isCategoryPage
    ? `${activeCategoryData.label} Affiliate Deals - ${SITE_NAME}`
    : 'Trendkaro - Best Affiliate Deals on Fashion, Tech & Trends'
  const description = getPageDescription(isCategoryPage, activeCategoryData)
  const canonicalUrl = isCategoryPage
    ? `${SITE_URL}/category/${activeCategoryData.id}`
    : SITE_URL
  const structuredData = [
    organizationSchema,
    getBreadcrumbSchema(isCategoryPage ? activeCategoryData : null),
  ]

  return (
    <>
      <SEO
        title={title}
        description={description}
        image={DEFAULT_IMAGE}
        url={canonicalUrl}
        type="website"
        structuredData={structuredData}
      />
      <Header />

      <main className="main-content home-main">
        <div className="home-page">
          <h1 className="visually-hidden">
            Best Affiliate Products - Fashion, Tech & Trending Deals
          </h1>
          <BannerCarousel />
          <CategoryBar
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />

          <ProductGrid
            activeCategory={activeCategory}
            categoryLabel={activeCategoryData.label}
          />
        </div>
      </main>

      <Footer />
    </>
  )
}

export default Home
