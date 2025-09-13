import React, { useEffect, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';

const CommunicationPage = ({ currentScheme, onPageChange }) => {
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (!token) onPageChange('landing');
  }, [token, onPageChange]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Clinical Team</h1>
          <p className="text-xl text-gray-400">AI-enhanced clinical communications</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Coming Soon</h3>
          <p className="text-gray-400 text-center">
            Secure messaging and clinical team communication features.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommunicationPage;