import ImageCarousel from './ImageCarousel.jsx'
import './ProductCard.css'

function ProductCard({ product }) {
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
        <h3 title={product.title}>{product.title}</h3>
        <p title={product.description}>{product.description}</p>
      </div>
    </article>
  )
}

export default ProductCard
