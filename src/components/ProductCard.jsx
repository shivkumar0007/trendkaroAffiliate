import { Helmet } from 'react-helmet-async'
import ImageCarousel from './ImageCarousel.jsx'
import categories from '../data/categories.js'
import { getProductCategories } from '../utils/productHelpers.js'
import './ProductCard.css'

const categoryLabelById = categories.reduce((labels, category) => {
  labels[category.id] = category.label
  return labels
}, {})

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

function ProductCard({ product }) {
  const productCategories = getProductCategories(product)

  const openAffiliateLink = () => {
    if (product.affiliateLink) {
      window.open(product.affiliateLink, '_blank', 'noopener,noreferrer')
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openAffiliateLink()
    }
  }

  return (
    <article className="product-card">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(getProductSchema(product))}
        </script>
      </Helmet>
      <div className="product-card-media">
        <ImageCarousel
          images={product.images || []}
          title={product.title}
          onImageClick={openAffiliateLink}
        />
      </div>

      <div
        className="product-card-body"
        role="link"
        tabIndex={0}
        onClick={openAffiliateLink}
        onKeyDown={handleKeyDown}
        aria-label={`Open ${product.title}`}
      >
        {productCategories.length > 0 && (
          <div className="product-card-categories" aria-label="Product categories">
            {productCategories.map((categoryId) => (
              <span className="product-card-category" key={categoryId}>
                {categoryLabelById[categoryId] || categoryId}
              </span>
            ))}
          </div>
        )}
        <h3 title={product.title}>{product.title}</h3>
        <p title={product.description}>{product.description}</p>
      </div>
    </article>
  )
}

export default ProductCard
