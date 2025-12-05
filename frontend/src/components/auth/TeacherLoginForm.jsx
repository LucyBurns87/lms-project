/**
 * Teacher Login Form
 * Separate login for teachers with validation
 */
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './LoginForm.css';

const TeacherLoginForm = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(credentials.username, credentials.password);
      
      // After login, check if user is actually a teacher
      const response = await fetch('http://localhost:8000/api/users/profile/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access')}`
        }
      });
      const userData = await response.json();
      
      if (userData.role === 'teacher' || userData.role === 'admin') {
        navigate('/teacher/dashboard');
      } else {
        setError('Access denied. This login is for teachers only.');
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
      }
    } catch (err) {
      setError('Invalid credentials or access denied');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Teacher Login</h2>
        <p className="auth-subtitle">Access your teaching dashboard</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={credentials.username}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login as Teacher'}
          </button>
        </form>
        
        <div className="auth-links">
          <p>
            Student? <a href="/login">Student Login</a>
          </p>
          <p>
            Need an account? <a href="/register">Register as Student</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherLoginForm;