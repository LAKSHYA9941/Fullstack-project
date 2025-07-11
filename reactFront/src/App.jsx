import { set } from 'mongoose'
import React from 'react'

function App() {
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showDetails, setShowDetails] = React.useState(false)

  const handleLogin = () => {
    if (username && password) {
      setShowDetails(true)  // trigger showing the details
    } else {
      alert("Please enter both username and password")
      setShowDetails(false)
    }
  }

return (
  <>
    <div>
      <h1>Welcome to React Frontend</h1>
      <p>This is a simple React application.</p>
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Type your password..."
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      
      {showDetails && (
        <div>
          <h2>Details</h2>
          <p>Username: {username}</p>
          <p>Password: {password}</p>
        </div>
      )}


    </div>
  </>
)
}
export default App