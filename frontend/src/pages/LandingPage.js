import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const LandingPage = ({ currentScheme, onPageChange }) => {
  const { login, token } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  React.useEffect(() => {
    if (token) onPageChange('dashboard');
  }, [token, onPageChange]);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      // For demo purposes - use demo/demo
      if (email === 'demo' && password === 'demo') {
        login('demo_token', 'demo_user');
      } else {
        alert('Use demo/demo for login');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-8">
            <span className="text-white">Safe Medication</span>
            <span className="block" style={{ color: currentScheme.primary }}>
              Tapering Solutions
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-12">
            AI-powered predictive analytics combined with specialized clinical expertise 
            for personalized, adaptive tapering schedules.
          </p>
          
          <form onSubmit={handleAuth} className="max-w-md mx-auto">
            <input 
              type="text" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="Username (try: demo)" 
              className="block w-full mb-4 p-3 bg-gray-800 text-white rounded-lg"
            />
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="Password (try: demo)" 
              className="block w-full mb-4 p-3 bg-gray-800 text-white rounded-lg"
            />
            <button 
              type="submit" 
              style={{ backgroundColor: currentScheme.primary }} 
              className="w-full py-3 text-white rounded-lg font-semibold hover:opacity-90"
            >
              Login to Dashboard
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;