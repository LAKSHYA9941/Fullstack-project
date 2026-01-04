import { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import './App.css';

const API_BASE_URL = 'http://localhost:8000/api/v1/users';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login Logic
        const response = await axios.post(`${API_BASE_URL}/login`, {
          email: formData.email,
          password: formData.password
        });
        
        toast.success('Login Successful!');
        console.log('Login Response:', response.data);
        // Store tokens if needed
        // localStorage.setItem('accessToken', response.data.data.accessToken);
      } else {
        // Signup Logic (Multipart for avatar/cover)
        // Note: Backend currently expects multipart because of multer.fields
        const data = new FormData();
        data.append('fullname', formData.fullname);
        data.append('username', formData.username);
        data.append('email', formData.email);
        data.append('password', formData.password);
        
        const response = await axios.post(`${API_BASE_URL}/register`, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        toast.success('Registration Successful! Please login.');
        setIsLogin(true);
        console.log('Signup Response:', response.data);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Something went wrong';
      toast.error(errorMessage);
      console.error('Auth Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Toaster position="top-right" />
      <div className="glass-card auth-card animate-fade-in">
        <div className="auth-header">
          <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p>{isLogin ? 'Enter your credentials to access your account' : 'Join us and start your journey today'}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="input-group animate-fade-in">
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="fullname"
                  placeholder="John Doe" 
                  value={formData.fullname}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="input-group animate-fade-in">
                <label>Username</label>
                <input 
                  type="text" 
                  name="username"
                  placeholder="johndoe123" 
                  value={formData.username}
                  onChange={handleInputChange}
                  required 
                />
              </div>
            </>
          )}
          
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email"
              placeholder="name@example.com" 
              value={formData.email}
              onChange={handleInputChange}
              required 
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password"
              placeholder="••••••••" 
              value={formData.password}
              onChange={handleInputChange}
              required 
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Get Started')}
            {!loading && (
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M5 12h14m-7-7 7 7-7 7"/>
              </svg>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              className="toggle-btn"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
