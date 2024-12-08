import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [isRegistering, setIsRegistering] = useState(false); // State to toggle between login and register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // For registration
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegistering) {
      // Registration logic
      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }

      try {
        const response = await axios.post('http://127.0.0.1:5000/register', { email, password });
        console.log('Registration successful:', response);
        // Optionally, auto-login after registration or show a success message
        navigate('/notes');
      } catch (error) {
        console.error('Registration failed:', error);
        alert('Registration failed!');
      }
    } else {
      // Login logic
      try {
        const response = await axios.post('http://127.0.0.1:5000/login', { email, password });
        localStorage.setItem('authToken', response.data.token);
        console.log('Login successful:', response);
        navigate('/notes');
      } catch (error) {
        console.error('Login failed:', error);
        alert('Login failed!');
      }
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>{isRegistering ? 'Register' : 'Login'}</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: '10px' }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={{ width: '300px', margin: '10px auto', padding: '10px' }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={{ width: '300px', margin: '10px auto', padding: '10px' }}
        />
        {isRegistering && (
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            style={{ width: '300px', margin: '10px auto', padding: '10px' }}
          />
        )}
        <button
         type="submit"
         style = {{ 
          height: '30px',
          margin: '10px auto',
          backgroundColor: 'blue',
          color: 'white',
          border: '1px solid darkblue',
          cursor: 'pointer'
         }}
        
        >
          {isRegistering ? 'Register' : 'Login'}</button>
      </form>

      <p>
        {isRegistering ? (
          <span>
            Already have an account?{' '}
            <button onClick={() => setIsRegistering(false)}>Login here</button>
          </span>
        ) : (
          <span>
            Don’t have an account?{' '}
            <button onClick={() => setIsRegistering(true)}>Register here</button>
          </span>
        )}
      </p>
    </div>
  );
}

export default Login;
