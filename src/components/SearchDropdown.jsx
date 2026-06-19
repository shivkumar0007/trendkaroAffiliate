import { useEffect, useMemo, useState } from 'react'
import { FiExternalLink } from 'react-icons/fi'
import { useProducts } from '../context/ProductsContext.jsx'
import categories from '../data/categories.js'

const MAX_RESULTS = 6
const DEBOUNCE_MS = 250

const categoryLabelById = categories.reduce((labels, category) => {
  labels[category.id] = category.label
  return labels
}, {})

function getProductCategoryLabel(product) {
  return categoryLabelById[product.category] || product.category || ''
}

function productMatchesSearch(product, query) {
  const searchValue = query.trim().toLowerCase()

  if (!searchValue) {
    return false
  }

  const searchableText = [
    product.title,
    product.description,
    getProductCategoryLabel(product),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return searchableText.includes(searchValue)
}

function SearchDropdown({ isOpen, query, onClose, onClear }) {
  const { products, isLoading, error } = useProducts()
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [highlightedIndex, setHighlightedIndex] = useState(0)

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setDebouncedQuery(query.trim())
      setHighlightedIndex(0)
    }, DEBOUNCE_MS)

    return () => window.clearTimeout(timerId)
  }, [query])

  const results = useMemo(() => {
    if (!debouncedQuery) {
      return []
    }

    return products
      .filter((product) => productMatchesSearch(product, debouncedQuery))
      .slice(0, MAX_RESULTS)
  }, [products, debouncedQuery])

  const safeHighlightedIndex = Math.min(highlightedIndex, Math.max(results.length - 1, 0))

  const openProduct = (product) => {
    if (product.affiliateLink) {
      window.open(product.affiliateLink, '_blank', 'noopener,noreferrer')
    }

    onClear()
  }

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (results.length === 0) {
        return
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setHighlightedIndex((current) => (current + 1) % results.length)
        return
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setHighlightedIndex((current) => (current - 1 + results.length) % results.length)
        return
      }

      if (event.key === 'Enter') {
        event.preventDefault()
        openProduct(results[safeHighlightedIndex])
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, results, safeHighlightedIndex])

  if (!isOpen || !query.trim()) {
    return null
  }

  return (
    <div
      id="search-dropdown"
      className="search-dropdown"
      role="listbox"
      aria-live="polite"
      aria-label="Search results"
    >
      {isLoading && <p className="search-dropdown-state">Loading products...</p>}
      {!isLoading && error && <p className="search-dropdown-state">{error}</p>}
      {!isLoading && !error && debouncedQuery && results.length === 0 && (
        <p className="search-dropdown-state">No matches found</p>
      )}
      {!isLoading &&
        !error &&
        results.map((product, index) => (
          <button
            key={product.id}
            type="button"
            className={`search-dropdown-item${safeHighlightedIndex === index ? ' highlighted' : ''}`}
            onMouseEnter={() => setHighlightedIndex(index)}
            onClick={() => openProduct(product)}
            role="option"
            aria-selected={safeHighlightedIndex === index}
          >
            <img
              src={product.images?.[0] || 'https://placehold.co/96x96?text=Product'}
              alt={`${product.title} - affiliate product image`}
              width="96"
              height="96"
              loading="lazy"
            />
            <span className="search-dropdown-copy">
              <strong>{product.title}</strong>
              <span>{getProductCategoryLabel(product)}</span>
            </span>
            <FiExternalLink aria-hidden="true" />
          </button>
        ))}
    </div>
  )
}

export default SearchDropdown
