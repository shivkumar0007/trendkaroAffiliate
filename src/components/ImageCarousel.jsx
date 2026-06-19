import { useEffect, useRef, useState } from 'react'
import './ImageCarousel.css'

const AUTO_SCROLL_MS = 2500
const SWIPE_CLICK_THRESHOLD = 8

function ImageCarousel({ images = [], title = 'Product image', onImageClick }) {
  const safeImages = images.length > 0 ? images : ['https://placehold.co/800x1000?text=Product']
  const altBase = `${title} - affiliate product image`
  const [activeIndex, setActiveIndex] = useState(0)
  const intervalRef = useRef(null)
  const scrollerRef = useRef(null)
  const pointerStartRef = useRef({ x: 0, y: 0 })

  const scrollToIndex = (index) => {
    const scroller = scrollerRef.current

    if (!scroller) {
      return
    }

    scroller.scrollTo({
      left: scroller.clientWidth * index,
      behavior: 'smooth',
    })
  }

  const stopAutoScroll = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const startAutoScroll = () => {
    stopAutoScroll()

    if (safeImages.length <= 1) {
      return
    }

    intervalRef.current = window.setInterval(() => {
      setActiveIndex((current) => {
        const nextIndex = (current + 1) % safeImages.length
        scrollToIndex(nextIndex)
        return nextIndex
      })
    }, AUTO_SCROLL_MS)
  }

  useEffect(() => {
    startAutoScroll()

    return () => stopAutoScroll()
  }, [safeImages.length])

  const activeImageIndex = Math.min(activeIndex, safeImages.length - 1)

  const handleScroll = () => {
    const scroller = scrollerRef.current

    if (!scroller) {
      return
    }

    const nextIndex = Math.round(scroller.scrollLeft / scroller.clientWidth)
    setActiveIndex(Math.min(nextIndex, safeImages.length - 1))
  }

  const handlePointerDown = (event) => {
    pointerStartRef.current = {
      x: event.clientX,
      y: event.clientY,
    }
  }

  const handlePointerUp = (event) => {
    const deltaX = Math.abs(event.clientX - pointerStartRef.current.x)
    const deltaY = Math.abs(event.clientY - pointerStartRef.current.y)

    if (deltaX <= SWIPE_CLICK_THRESHOLD && deltaY <= SWIPE_CLICK_THRESHOLD) {
      onImageClick?.()
    }
  }

  if (safeImages.length === 1) {
    return (
      <button
        type="button"
        className="image-carousel single-image"
        onClick={onImageClick}
        aria-label={`Open ${title}`}
      >
        <img
          src={safeImages[0]}
          alt={altBase}
          width="800"
          height="1000"
          loading="lazy"
        />
      </button>
    )
  }

  return (
    <div
      className="image-carousel"
      onMouseEnter={stopAutoScroll}
      onMouseLeave={startAutoScroll}
      onTouchStart={stopAutoScroll}
      onTouchEnd={startAutoScroll}
    >
      <div
        className="image-carousel-track"
        ref={scrollerRef}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        {safeImages.map((image, index) => (
          <img
            key={`${image}-${index}`}
            src={image}
            alt={`${altBase} ${index + 1}`}
            width="800"
            height="1000"
            loading="lazy"
          />
        ))}
      </div>

      <div className="image-carousel-dots" aria-label="Product image position">
        {safeImages.map((image, index) => (
          <button
            key={`${image}-dot-${index}`}
            type="button"
            className={`image-carousel-dot${activeImageIndex === index ? ' active' : ''}`}
            onClick={() => {
              stopAutoScroll()
              setActiveIndex(index)
              scrollToIndex(index)
              startAutoScroll()
            }}
            aria-label={`Show image ${index + 1}`}
            aria-current={activeImageIndex === index}
          />
        ))}
      </div>
    </div>
  )
}

export default ImageCarousel
