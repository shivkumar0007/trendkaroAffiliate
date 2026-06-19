import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase.js'
import SEO, { SITE_NAME, SITE_URL } from '../components/SEO.jsx'
import './AdminLogin.css'

function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/admin', { replace: true })
      } else {
        setIsCheckingAuth(false)
      }
    })

    return () => unsubscribe()
  }, [navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
      navigate('/admin', { replace: true })
    } catch {
      setError('Invalid email or password')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isCheckingAuth) {
    return (
      <>
        <SEO
          title={`Admin Login - ${SITE_NAME}`}
          description="Admin login for Trendkaro."
          url={`${SITE_URL}/admin-login`}
          noIndex
        />
        <main className="auth-page">Checking admin session...</main>
      </>
    )
  }

  return (
    <>
      <SEO
        title={`Admin Login - ${SITE_NAME}`}
        description="Admin login for Trendkaro."
        url={`${SITE_URL}/admin-login`}
        noIndex
      />
      <main className="auth-page">
        <form className="auth-card" onSubmit={handleSubmit}>
          <div className="auth-card-heading">
            <h1>Admin Login</h1>
            <p>Sign in with the admin account created in Firebase.</p>
          </div>

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </main>
    </>
  )
}

export default AdminLogin
