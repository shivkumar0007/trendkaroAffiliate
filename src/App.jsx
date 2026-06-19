import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Admin from './pages/Admin.jsx'
import AdminLogin from './pages/AdminLogin.jsx'

function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
