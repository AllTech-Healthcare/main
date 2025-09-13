import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Navigation = ({ currentPage, onPageChange, currentScheme }) => {
  const { token, logout } = useAuth();

  return (
    <nav 
      className="bg-gray-900 border-b sticky top-0 z-50" 
      style={{ borderBottomColor: currentScheme.primary }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => onPageChange('landing')}
            className="flex items-center space-x-3 transition-transform hover:scale-105"
          >
            <div 
              className="rounded-lg w-10 h-10 flex items-center justify-center font-bold text-lg shadow-lg"
              style={{ backgroundColor: currentScheme.primary, color: 'white' }}
            >
              T
            </div>
            <span className="text-2xl font-bold">
              <span className="text-white">Tape</span>
              <span style={{ color: currentScheme.primary }}>RX</span>
            </span>
          </button>
          
          <div className="flex items-center space-x-4">
            {token && (
              <>
                <button 
                  onClick={() => onPageChange('dashboard')}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    currentPage === 'dashboard' 
                      ? 'text-white shadow-lg' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                  style={currentPage === 'dashboard' ? { backgroundColor: currentScheme.primary } : {}}
                >
                  Dashboard
                </button>
                <button 
                  onClick={logout} 
                  className="text-gray-300 hover:text-white px-4 py-2"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;