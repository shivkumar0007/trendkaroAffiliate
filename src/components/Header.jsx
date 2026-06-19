import { useEffect, useRef, useState } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import SearchDropdown from './SearchDropdown.jsx'
import SearchPopup from './SearchPopup.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import './SearchDropdown.css'

function Header() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const searchRef = useRef(null)

  const openSearch = () => {
    setIsDropdownOpen(false)
    setIsPopupOpen(true)
  }

  const clearSearch = () => {
    setSearchTerm('')
    setIsDropdownOpen(false)
  }

  const closeSearch = () => {
    setIsDropdownOpen(false)
  }

  const closePopup = () => {
    setIsPopupOpen(false)
  }

  const handleSearchChange = (event) => {
    const nextSearchTerm = event.target.value

    setSearchTerm(nextSearchTerm)
    setIsDropdownOpen(Boolean(nextSearchTerm.trim()))
  }

  const handleSearchFocus = () => {
    if (searchTerm.trim()) {
      setIsDropdownOpen(true)
    }
  }

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      event.stopPropagation()
      openSearch()
    }
  }

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!searchRef.current?.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('touchstart', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('touchstart', handleOutsideClick)
    }
  }, [])

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="site-logo" to="/" aria-label="Trendkaro home">
          Trendkaro
        </Link>

        <div className="header-search" role="search" ref={searchRef}>
          <FiSearch className="search-input-icon" aria-hidden="true" />
          <input
            type="search"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search products..."
            aria-label="Search products"
            aria-expanded={isDropdownOpen}
            aria-controls="search-dropdown"
          />

          {searchTerm && (
            <button
              type="button"
              className="search-clear-button"
              onClick={clearSearch}
              aria-label="Clear search"
              title="Clear search"
            >
              <FiX aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            className="icon-button search-submit"
            onClick={openSearch}
            aria-label="Open full search"
            title="Search"
          >
            <FiSearch aria-hidden="true" />
          </button>

          <SearchDropdown
            isOpen={isDropdownOpen && !isPopupOpen}
            query={searchTerm}
            onClose={closeSearch}
            onClear={clearSearch}
          />
        </div>

        <div className="header-actions">
          <ThemeToggle />
        </div>
      </div>

      <SearchPopup
        isOpen={isPopupOpen}
        initialQuery={searchTerm}
        onClose={closePopup}
      />
    </header>
  )
}

export default Header
