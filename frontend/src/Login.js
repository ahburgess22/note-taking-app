import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // for navigation

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Checking credentials...')
      const response = await axios.post('http://127.0.0.1:5000/login', { email, password });
      localStorage.setItem('authToken', response.data.token);
      console.log('Login successful, navigating to /notes');
      navigate('/notes'); // redirect to notes page after successful login
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed!');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '0 100px' }}>
  <h1>"Who goes there?" -🧙🏾‍♂️</h1>

    <form onSubmit={handleSubmit} style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  </div>
  );
};

export default Login;
