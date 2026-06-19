import { Link, Navigate, useParams } from 'react-router-dom'
import { FiExternalLink } from 'react-icons/fi'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import SEO, { SITE_NAME, SITE_URL } from '../components/SEO.jsx'
import ImageCarousel from '../components/ImageCarousel.jsx'
import { useProducts } from '../context/ProductsContext.jsx'
import categories from '../data/categories.js'
import { getProductCategories } from '../utils/productHelpers.js'
import './ProductDetail.css'

function truncateDescription(value, limit = 155) {
  const description = (value || '').trim()

  if (description.length <= limit) {
    return description
  }

  return `${description.slice(0, limit - 1).trim()}...`
}

function getProductSchema(product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.images || [],
    offers: {
      '@type': 'Offer',
      url: product.affiliateLink,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
  }
}

function getBreadcrumbSchema(product, category) {
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

  items.push({
    '@type': 'ListItem',
    position: items.length + 1,
    name: product.title,
    item: `${SITE_URL}/product/${product.id}`,
  })

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  }
}

function ProductDetail() {
  const { productId } = useParams()
  const { products, isLoading, error } = useProducts()
  const product = products.find((item) => item.id === productId)

  if (isLoading) {
    return (
      <>
        <SEO
          title={`Loading Product - ${SITE_NAME}`}
          description="Loading the latest affiliate product details."
          url={`${SITE_URL}/product/${productId || ''}`}
          type="product"
        />
        <Header />
        <main className="main-content">
          <p className="product-detail-state">Loading product...</p>
        </main>
        <Footer />
      </>
    )
  }

  if (error || !product) {
    return <Navigate to="/" replace />
  }

  const productCategoryIds = getProductCategories(product)
  const productCategories = productCategoryIds
    .map((categoryId) => categories.find((item) => item.id === categoryId))
    .filter(Boolean)
  const category = productCategories[0]
  const description = truncateDescription(product.description)
  const canonicalUrl = `${SITE_URL}/product/${product.id}`
  const image = product.images?.[0]
  const structuredData = [
    getProductSchema(product),
    getBreadcrumbSchema(product, category),
  ]

  return (
    <>
      <SEO
        title={`${product.title} - ${SITE_NAME}`}
        description={description}
        image={image}
        url={canonicalUrl}
        type="product"
        structuredData={structuredData}
      />
      <Header />

      <main className="main-content">
        <article className="product-detail">
          <div className="product-detail-media">
            <ImageCarousel images={product.images || []} title={product.title} />
          </div>

          <div className="product-detail-copy">
            {productCategories.map((item) => (
              <Link className="product-detail-category" to={`/category/${item.id}`} key={item.id}>
                {item.label}
              </Link>
            ))}
            <h1>{product.title}</h1>
            <p>{product.description}</p>
            {product.affiliateLink && (
              <a
                className="product-detail-button"
                href={product.affiliateLink}
                target="_blank"
                rel="noreferrer"
              >
                View deal
                <FiExternalLink aria-hidden="true" />
              </a>
            )}
          </div>
        </article>
      </main>

      <Footer />
    </>
  )
}

export default ProductDetail
