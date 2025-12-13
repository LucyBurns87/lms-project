import React, { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';

function AuthLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  // Validation function
  const validateForm = () => {
    const errors = {};

    // Username validation
    if (!username.trim()) {
      errors.username = 'Username is required';
    } else if (username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    // Password validation
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});

    // Validate before submitting
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              // Clear validation error when user types
              if (validationErrors.username) {
                setValidationErrors(prev => ({ ...prev, username: '' }));
              }
            }}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: validationErrors.username ? '2px solid red' : '1px solid #ccc',
              borderRadius: '4px'
            }}
            required
            minLength={3}
          />
          {validationErrors.username && (
            <p style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {validationErrors.username}
            </p>
          )}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <input
            type="password"
            placeholder="Password (min 8 characters)"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              // Clear validation error when user types
              if (validationErrors.password) {
                setValidationErrors(prev => ({ ...prev, password: '' }));
              }
            }}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: validationErrors.password ? '2px solid red' : '1px solid #ccc',
              borderRadius: '4px'
            }}
            required
            minLength={8}
          />
          {validationErrors.password && (
            <p style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {validationErrors.password}
            </p>
          )}
          <p style={{ color: '#666', fontSize: '0.75rem', marginTop: '0.25rem' }}>
            Password must be at least 8 characters
          </p>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
}

export default AuthLogin;