import { FiMoon, FiSun } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext.jsx'

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      className="icon-button theme-toggle"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {isDark ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
    </button>
  )
}

export default ThemeToggle
