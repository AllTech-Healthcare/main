import React, { useState, useContext } from 'react';
import { Menu } from 'lucide-react';
import { AuthContext } from '../auth/AuthContext';
import { NAVIGATION_ITEMS } from '../constants';
import ColorSchemeSelector from './ColorSchemeSelector';

const Navigation = ({ currentPage, onPageChange, currentScheme, selectedColorScheme, onSchemeChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { token, logout } = useContext(AuthContext);

  const handleNavigation = (page) => {
    onPageChange(page);
    setMobileMenuOpen(false);
  };

  return (
    <nav 
      className="bg-gray-900 border-b sticky top-0 z-50" 
      style={{ borderBottomColor: currentScheme.primary }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => handleNavigation('landing')}
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
            {/* Navigation Items */}
            {token && currentPage !== 'landing' && (
              <div className="hidden md:flex space-x-1">
                {NAVIGATION_ITEMS.map(({ key, label, icon: Icon }) => (
                  <button 
                    key={key}
                    onClick={() => handleNavigation(key)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      currentPage === key 
                        ? 'text-white shadow-lg transform scale-105' 
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                    style={currentPage === key ? { backgroundColor: currentScheme.primary } : {}}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{label}</span>
                  </button>
                ))}
              </div>
            )}
            
            {/* Color Scheme Selector */}
            <ColorSchemeSelector 
              selectedColorScheme={selectedColorScheme}
              onSchemeChange={onSchemeChange}
              currentScheme={currentScheme}
            />
            
            {token && (
              <button onClick={logout} className="text-gray-300 hover:text-white">
                Logout
              </button>
            )}
            
            {/* Mobile Menu Button */}
            {token && currentPage !== 'landing' && (
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-800 text-gray-300"
              >
                <Menu size={24} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && token && currentPage !== 'landing' && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="space-y-2">
              {NAVIGATION_ITEMS.map(({ key, label, icon: Icon }) => (
                <button 
                  key={key}
                  onClick={() => handleNavigation(key)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    currentPage === key 
                      ? 'text-white' 
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                  style={currentPage === key ? { backgroundColor: currentScheme.primary } : {}}
                >
                  <Icon size={18} />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
              <button onClick={logout} className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-800">
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;