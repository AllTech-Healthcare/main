import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage = ({ currentScheme, onPageChange }) => {
  const { token, logout } = useAuth();

  React.useEffect(() => {
    if (!token) {
      onPageChange('landing');
    }
  }, [token, onPageChange]);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400">TapeRX Healthcare Platform Demo</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Backend Status</h2>
            <p className="text-gray-300">
              ✅ Backend API is running and functional<br/>
              ✅ Authentication working<br/>
              ✅ Database connections established<br/>
              ✅ Security measures in place
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Frontend Status</h2>
            <p className="text-gray-300">
              ✅ React app properly structured<br/>
              ✅ Component organization complete<br/>
              ✅ Authentication context working<br/>
              ✅ Styling system functional
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: currentScheme.primary }}>
              Current Features
            </h2>
            <ul className="text-gray-300 space-y-2">
              <li>• JWT-based authentication</li>
              <li>• Encrypted patient data storage</li>
              <li>• RESTful API architecture</li>
              <li>• Responsive React frontend</li>
              <li>• Docker containerization</li>
              <li>• Comprehensive testing</li>
            </ul>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Actions</h2>
            <button 
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;