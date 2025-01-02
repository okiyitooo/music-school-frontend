import React, { useState, useEffect } from 'react';
import AppRoutes from './routes/AppRoutes.jsx';
import { AuthContext } from './context/AuthContext';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './assets/styles/theme';
import ErrorBoundary from './components/boundary/ErrorBoundary.jsx';
import Footer from './components/layout/Footer'; // Import your Footer component

function App() {
  const [auth, setAuth] = useState({ isAuthenticated: false, user: null, token: null });

  // Load authentication state from localStorage on initial render
  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
  }, []);

  const logout = () => {
    setAuth({ isAuthenticated: false, user: null, token: null });
    localStorage.removeItem('auth');
  };

  return (
    <ChakraProvider theme={theme}>
      <AuthContext.Provider value={{ auth, setAuth, logout }}>
        <div className="app-container">
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
          <Footer />
        </div>
      </AuthContext.Provider>
    </ChakraProvider>
  );
}

export default App;
