import { useEffect, useMemo, useState } from 'react'
import { FiExternalLink, FiSearch, FiX } from 'react-icons/fi'
import { useProducts } from '../context/ProductsContext.jsx'
import categories from '../data/categories.js'
import './SearchPopup.css'

const categoryLabelById = categories.reduce((labels, category) => {
  labels[category.id] = category.label
  return labels
}, {})

function getCategoryLabel(product) {
  return categoryLabelById[product.category] || product.category || ''
}

function matchesSearch(product, query) {
  const searchValue = query.trim().toLowerCase()

  if (!searchValue) {
    return false
  }

  return [product.title, product.description, getCategoryLabel(product)]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .includes(searchValue)
}

function SearchPopup({ isOpen, initialQuery = '', onClose }) {
  const { products, isLoading, error } = useProducts()
  const [popupQuery, setPopupQuery] = useState(initialQuery)

  useEffect(() => {
    if (isOpen) {
      setPopupQuery(initialQuery)
    }
  }, [initialQuery, isOpen])

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const filteredProducts = useMemo(() => {
    const searchValue = popupQuery.trim()

    if (!searchValue) {
      return []
    }

    return products.filter((product) => matchesSearch(product, searchValue))
  }, [products, popupQuery])

  const openProduct = (product) => {
    if (product.affiliateLink) {
      window.open(product.affiliateLink, '_blank', 'noopener,noreferrer')
    }

    onClose()
  }

  if (!isOpen) {
    return null
  }

  const trimmedQuery = popupQuery.trim()

  return (
    <div className="full-search-backdrop" role="presentation" onClick={onClose}>
      <section
        className="full-search-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="full-search-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="full-search-header">
          <div>
            <h2 id="full-search-title">Search products</h2>
            <p>Find products by title, description, or category.</p>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Close search"
            title="Close search"
          >
            <FiX aria-hidden="true" />
          </button>
        </div>

        <div className="full-search-input-wrap">
          <FiSearch aria-hidden="true" />
          <input
            type="search"
            value={popupQuery}
            onChange={(event) => setPopupQuery(event.target.value)}
            placeholder="Search products..."
            autoFocus
            aria-label="Search all products"
          />
          {popupQuery && (
            <button
              type="button"
              onClick={() => setPopupQuery('')}
              aria-label="Clear search"
              title="Clear search"
            >
              <FiX aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="full-search-results">
          {isLoading && <p className="full-search-state">Loading products...</p>}
          {!isLoading && error && <p className="full-search-state">{error}</p>}
          {!isLoading && !error && !trimmedQuery && (
            <p className="full-search-state">Type a keyword to search all products.</p>
          )}
          {!isLoading && !error && trimmedQuery && filteredProducts.length === 0 && (
            <div className="full-search-state">
              <strong>No products found for '{trimmedQuery}'</strong>
              <span>Try searching with different keywords</span>
            </div>
          )}
          {!isLoading &&
            !error &&
            filteredProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                className="full-search-result"
                onClick={() => openProduct(product)}
              >
                <img
                  src={product.images?.[0] || 'https://placehold.co/120x120?text=Product'}
                  alt={product.title}
                />
                <span className="full-search-copy">
                  <strong>{product.title}</strong>
                  <span className="full-search-description">
                    {product.description || 'No description available'}
                  </span>
                  <span className="full-search-category">{getCategoryLabel(product)}</span>
                </span>
                <FiExternalLink aria-hidden="true" />
              </button>
            ))}
        </div>
      </section>
    </div>
  )
}

export default SearchPopup
