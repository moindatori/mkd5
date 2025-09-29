import React, { useState } from 'react'
import axios from 'axios'

const Signup = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:5000/api/signup', {
        email,
        password
      })
      setMessage('Signup successful! Please login.')
      setError('')
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed')
      setMessage('')
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Signup</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={onSwitchToLogin}>Switch to Login</button>
    </div>
  )
}

export default Signup
