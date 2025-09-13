import React, { useState, useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import { COLOR_SCHEMES } from '../constants';

const ColorSchemeSelector = ({ selectedColorScheme, onSchemeChange, currentScheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const handleColorSelection = (key) => {
    onSchemeChange(key);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 hover:bg-gray-800"
        title="Change color theme"
      >
        <div 
          className="w-5 h-5 rounded-full border-2 border-white shadow-lg"
          style={{ backgroundColor: currentScheme.primary }}
        />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-12 bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl z-50 min-w-[180px]">
          <p className="text-white text-xs font-medium mb-3 text-center">Choose Theme</p>
          <div className="space-y-2">
            {Object.entries(COLOR_SCHEMES).map(([key, scheme]) => (
              <button
                key={key}
                onClick={() => handleColorSelection(key)}
                className={`w-full flex items-center space-x-3 p-2 rounded text-sm transition-all duration-200 ${
                  selectedColorScheme === key 
                    ? 'bg-gray-800 text-white transform scale-105' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <div 
                  className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm" 
                  style={{ backgroundColor: scheme.primary }}
                />
                <span className="flex-grow text-left">{scheme.name}</span>
                {selectedColorScheme === key && (
                  <Check className="w-4 h-4 text-green-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorSchemeSelector;