import React, { useState } from 'react'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'

function App() {
  const [currentPage, setCurrentPage] = useState('login')
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(null)

  const handleLogin = (userData) => {
    setToken(userData.token)
    setUser(userData)
    localStorage.setItem('token', userData.token)
    setCurrentPage('dashboard')
  }

  const handleLogout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    setCurrentPage('login')
  }

  return (
    <div>
      {!token && currentPage === 'login' && (
        <Login onLogin={handleLogin} onSwitchToSignup={() => setCurrentPage('signup')} />
      )}
      {!token && currentPage === 'signup' && (
        <Signup onSwitchToLogin={() => setCurrentPage('login')} />
      )}
      {token && currentPage === 'dashboard' && (
        <Dashboard user={user} onLogout={handleLogout} onAdmin={() => setCurrentPage('admin')} />
      )}
      {token && currentPage === 'admin' && (
        <Admin onBack={() => setCurrentPage('dashboard')} />
      )}
    </div>
  )
}

export default App
