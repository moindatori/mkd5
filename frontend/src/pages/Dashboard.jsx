import React, { useState } from 'react'
import axios from 'axios'

const Dashboard = ({ user, onLogout, onAdmin }) => {
  const [credits, setCredits] = useState(user?.credits || 0)
  const [prompt, setPrompt] = useState('')
  const [images, setImages] = useState([])

  const generateImage = async () => {
    if (!prompt.trim()) return
    
    try {
      const response = await axios.post(
        'http://localhost:5000/api/use-credit',
        {},
        { headers: { Authorization: localStorage.getItem('token') } }
      )
      
      setCredits(response.data.credits)
      // Here you would integrate with your image generation API
      // For now, we'll just add a placeholder
      setImages(prev => [...prev, { id: Date.now(), prompt, url: `https://via.placeholder.com/512?text=${encodeURIComponent(prompt)}` }])
      setPrompt('')
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to generate image')
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Dashboard</h2>
        <div>
          <span>Credits: {credits}</span>
          <button onClick={onAdmin} style={{ marginLeft: '10px' }}>Admin</button>
          <button onClick={onLogout} style={{ marginLeft: '10px' }}>Logout</button>
        </div>
      </div>
      
      <div>
        <input
          type="text"
          placeholder="Enter prompt for image generation"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{ width: '300px', marginRight: '10px' }}
        />
        <button onClick={generateImage} disabled={!prompt.trim() || credits <= 0}>
          Generate Image (1 Credit)
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Generated Images</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
          {images.map(img => (
            <div key={img.id} style={{ border: '1px solid #ccc', padding: '10px' }}>
              <img src={img.url} alt={img.prompt} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <p>{img.prompt}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
