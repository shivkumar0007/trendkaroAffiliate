import { useMemo } from 'react'
import { useProducts } from '../context/ProductsContext.jsx'
import ProductCard from './ProductCard.jsx'
import './ProductGrid.css'

function ProductGrid({ activeCategory = 'trend', categoryLabel = 'Products' }) {
  const { products, isLoading, error } = useProducts()

  const filteredProducts = useMemo(
    () => products.filter((product) => product.category === activeCategory),
    [products, activeCategory],
  )

  if (isLoading) {
    return (
      <section className="product-grid-wrap" aria-labelledby="product-grid-title">
        <h2 id="product-grid-title" className="visually-hidden">
          {categoryLabel} Deals
        </h2>
        <div className="product-grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <article className="product-skeleton" key={index}>
              <div className="skeleton-image" />
              <div className="skeleton-line wide" />
              <div className="skeleton-line" />
            </article>
          ))}
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="product-grid-wrap" aria-labelledby="product-grid-title">
        <h2 id="product-grid-title" className="visually-hidden">
          {categoryLabel} Deals
        </h2>
        <p className="product-grid-state">{error}</p>
      </section>
    )
  }

  if (filteredProducts.length === 0) {
    return (
      <section className="product-grid-wrap" aria-labelledby="product-grid-title">
        <h2 id="product-grid-title" className="product-grid-title">
          {categoryLabel} Deals
        </h2>
        <p className="product-grid-state">No products in this category yet</p>
      </section>
    )
  }

  return (
    <section className="product-grid-wrap" aria-labelledby="product-grid-title">
      <h2 id="product-grid-title" className="product-grid-title">
        {categoryLabel} Deals
      </h2>
      <div className="product-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

export default ProductGrid
