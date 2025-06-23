import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { SUPPORTED_LANGUAGES } from './types/language';
import MainLayout from './layouts/MainLayout';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route - redirect to preferred language */}
        <Route path="/" element={<LanguageRedirect />} />
        
        {/* Language-specific routes */}
        {SUPPORTED_LANGUAGES.map(lang => (
          <Route 
            key={lang.code} 
            path={`/${lang.code}/*`} 
            element={
              <LanguageProvider>
                <MainLayout />
              </LanguageProvider>
            } 
          />
        ))}
        
        {/* Catch-all route - redirect to preferred language */}
        <Route path="*" element={<LanguageRedirect />} />
      </Routes>
    </Router>
  );
}

// Component to redirect to the preferred language
function LanguageRedirect() {
  const location = useLocation();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    // Get preferred language
    const getPreferredLanguage = () => {
      // First check localStorage
      const saved = localStorage.getItem('preferred-language');
      if (saved) {
        const found = SUPPORTED_LANGUAGES.find(lang => lang.code === saved);
        if (found) return found;
      }
      
      // Then check browser language
      const browserLang = navigator.language.split('-')[0];
      const detected = SUPPORTED_LANGUAGES.find(lang => lang.code === browserLang);
      
      return detected || SUPPORTED_LANGUAGES[0]; // Default to Swedish
    };
    
    const preferredLanguage = getPreferredLanguage();
    const newPath = `/${preferredLanguage.code}${location.pathname === '/' ? '' : location.pathname}${location.search}${location.hash}`;
    
    navigate(newPath, { replace: true });
  }, [location, navigate]);
  
  return <div>Loading...</div>;
}

export default App;