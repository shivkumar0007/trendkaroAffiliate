import { useMemo } from 'react'
import { useProducts } from '../context/ProductsContext.jsx'
import ProductCard from './ProductCard.jsx'
import './ProductGrid.css'

function ProductGrid({ activeCategory = 'trend' }) {
  const { products, isLoading, error } = useProducts()

  const filteredProducts = useMemo(
    () => products.filter((product) => product.category === activeCategory),
    [products, activeCategory],
  )

  if (isLoading) {
    return (
      <section className="product-grid-wrap" aria-label="Loading products">
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
    return <p className="product-grid-state">{error}</p>
  }

  if (filteredProducts.length === 0) {
    return <p className="product-grid-state">No products in this category yet</p>
  }

  return (
    <section className="product-grid-wrap" aria-label="Products">
      <div className="product-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

export default ProductGrid
