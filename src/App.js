import React, { useState, useMemo, useCallback } from 'react';
import { AuthProvider } from './auth/AuthContext';
import { COLOR_SCHEMES } from './constants';
import Navigation from './components/Navigation';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import SchedulePage from './pages/SchedulePage';
import SymptomsPage from './pages/SymptomsPage';
import CommunicationPage from './pages/CommunicationPage';
import AIAnalyticsPage from './pages/AIAnalyticsPage';

const TapeRxApp = () => {
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
      case 'schedule':
        return <SchedulePage {...pageProps} />;
      case 'symptoms':
        return <SymptomsPage {...pageProps} />;
      case 'communication':
        return <CommunicationPage {...pageProps} />;
      case 'ai-analytics':
        return <AIAnalyticsPage {...pageProps} />;
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
};

export default TapeRxApp;