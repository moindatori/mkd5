import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Admin = ({ onBack }) => {
  const [users, setUsers] = useState([])
  const [creditAmount, setCreditAmount] = useState(10)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: localStorage.getItem('token') }
      })
      setUsers(response.data)
    } catch (err) {
      alert('Failed to fetch users')
    }
  }

  const addCredits = async (userId) => {
    try {
      await axios.post('http://localhost:5000/api/admin/add-credit', 
        { userId, amount: creditAmount },
        { headers: { Authorization: localStorage.getItem('token') } }
      )
      fetchUsers() // Refresh the list
    } catch (err) {
      alert('Failed to add credits')
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Admin Panel</h2>
        <button onClick={onBack}>Back to Dashboard</button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>
          Credit Amount to Add: 
          <input
            type="number"
            value={creditAmount}
            onChange={(e) => setCreditAmount(parseInt(e.target.value))}
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>

      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Credits</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.credits}</td>
              <td>
                <button onClick={() => addCredits(user.id)}>
                  Add {creditAmount} Credits
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Admin
