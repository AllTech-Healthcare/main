import React, { useState, useMemo, useCallback } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { COLOR_SCHEMES } from './utils/constants';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import Navigation from './components/Navigation';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedColorScheme, setSelectedColorScheme] = useState('electric-blue');
  
  const currentScheme = useMemo(() => COLOR_SCHEMES[selectedColorScheme], [selectedColorScheme]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleSchemeChange = useCallback((scheme) => {
    setSelectedColorScheme(scheme);
  }, []);

  const renderCurrentPage = () => {
    const pageProps = { currentScheme, onPageChange: handlePageChange };
    
    switch(currentPage) {
      case 'landing':
        return <LandingPage {...pageProps} />;
      case 'dashboard':
        return <DashboardPage {...pageProps} />;
      default:
        return <LandingPage {...pageProps} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-black">
        <Navigation 
          currentPage={currentPage}
          onPageChange={handlePageChange}
          currentScheme={currentScheme}
          selectedColorScheme={selectedColorScheme}
          onSchemeChange={handleSchemeChange}
        />
        
        <main role="main">
          {renderCurrentPage()}
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;