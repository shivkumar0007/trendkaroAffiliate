import { useEffect, useMemo, useRef, useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { useProducts } from '../context/ProductsContext.jsx'

const SLIDE_INTERVAL_MS = 3500

function normalizeFeaturedProducts(products) {
  if (products.length === 0) {
    return []
  }

  const slides = [...products]

  while (slides.length < 4) {
    slides.push(...products.slice(0, 4 - slides.length))
  }

  return slides.slice(0, 4)
}

function BannerCarousel() {
  const { products, isLoading, error } = useProducts()
  const [activeIndex, setActiveIndex] = useState(0)
  const intervalRef = useRef(null)
  const touchStartX = useRef(null)

  const featuredProducts = useMemo(
    () => products.filter((product) => product.isFeatured).slice(0, 4),
    [products],
  )

  const slides = useMemo(
    () => normalizeFeaturedProducts(featuredProducts),
    [featuredProducts],
  )

  const stopAutoScroll = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const startAutoScroll = () => {
    stopAutoScroll()

    if (slides.length <= 1) {
      return
    }

    intervalRef.current = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length)
    }, SLIDE_INTERVAL_MS)
  }

  useEffect(() => {
    startAutoScroll()

    return () => stopAutoScroll()
  }, [slides.length])

  const activeSlideIndex = slides.length ? Math.min(activeIndex, slides.length - 1) : 0

  const goToPrevious = () => {
    if (slides.length === 0) {
      return
    }

    setActiveIndex((current) => (current - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    if (slides.length === 0) {
      return
    }

    setActiveIndex((current) => (current + 1) % slides.length)
  }

  const openAffiliateLink = (affiliateLink) => {
    if (affiliateLink) {
      window.open(affiliateLink, '_blank', 'noopener,noreferrer')
    }
  }

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX
    stopAutoScroll()
  }

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) {
      startAutoScroll()
      return
    }

    const deltaX = touchStartX.current - event.changedTouches[0].clientX
    touchStartX.current = null

    if (Math.abs(deltaX) >= 40) {
      if (deltaX > 0) {
        goToNext()
      } else {
        goToPrevious()
      }
    }

    startAutoScroll()
  }

  if (isLoading) {
    return (
      <section className="banner-carousel banner-state" aria-labelledby="featured-deals-title">
        <h2 id="featured-deals-title" className="visually-hidden">Featured Deals</h2>
        Loading featured offers...
      </section>
    )
  }

  if (error || slides.length === 0) {
    return (
      <section className="banner-carousel banner-state" aria-labelledby="featured-deals-title">
        <h2 id="featured-deals-title" className="visually-hidden">Featured Deals</h2>
        {error || 'No featured products yet.'}
      </section>
    )
  }

  return (
    <section
      className="banner-carousel"
      aria-labelledby="featured-deals-title"
      onMouseEnter={stopAutoScroll}
      onMouseLeave={startAutoScroll}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <h2 id="featured-deals-title" className="visually-hidden">Featured Deals</h2>
      <div className="banner-viewport">
        <div
          className="banner-track"
          style={{ transform: `translateX(-${activeSlideIndex * 100}%)` }}
        >
          {slides.map((product, index) => (
            <button
              key={`${product.id}-${index}`}
              type="button"
              className="banner-slide"
              onClick={() => openAffiliateLink(product.affiliateLink)}
              aria-label={`Open ${product.title}`}
            >
              <img
                src={product.images?.[0] || 'https://placehold.co/1200x500?text=Best+Offer'}
                alt={`${product.title} - featured affiliate product image`}
                width="1200"
                height="500"
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : 'auto'}
              />
              <span className="offer-badge">Best Offer</span>
              <span className="banner-title">{product.title}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="banner-arrow banner-arrow-left"
        onClick={goToPrevious}
        aria-label="Previous featured offer"
      >
        <FiChevronLeft aria-hidden="true" />
      </button>
      <button
        type="button"
        className="banner-arrow banner-arrow-right"
        onClick={goToNext}
        aria-label="Next featured offer"
      >
        <FiChevronRight aria-hidden="true" />
      </button>

      <div className="banner-dots" aria-label="Featured offer position">
        {slides.map((product, index) => (
          <button
            key={`${product.id}-dot-${index}`}
            type="button"
            className={`banner-dot${activeSlideIndex === index ? ' active' : ''}`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to featured offer ${index + 1}`}
            aria-current={activeSlideIndex === index}
          />
        ))}
      </div>
    </section>
  )
}

export default BannerCarousel
