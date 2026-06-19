import { FaFemale, FaFire, FaGlobeAsia, FaLaptop, FaMale } from 'react-icons/fa'
import categories from '../data/categories.js'

const categoryIcons = {
  FaFire,
  FaFemale,
  FaMale,
  FaLaptop,
  FaGlobeAsia,
}

function CategoryBar({ activeCategory = 'trend', onCategoryChange }) {
  const handleCategoryClick = (categoryId) => {
    onCategoryChange?.(categoryId)
  }

  return (
    <nav className="category-bar" aria-label="Product categories">
      <div className="category-scroll">
        {categories.map((category) => {
          const Icon = categoryIcons[category.icon] || FaFire
          const isActive = activeCategory === category.id

          return (
            <button
              key={category.id}
              type="button"
              className={`category-pill${isActive ? ' active' : ''}`}
              onClick={() => handleCategoryClick(category.id)}
              aria-pressed={isActive}
            >
              <Icon aria-hidden="true" />
              <span>{category.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default CategoryBar
