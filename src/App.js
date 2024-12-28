import React, { useState } from 'react';
import AppRoutes from './routes/AppRoutes.jsx'
import { AuthContext } from './context/AuthContext';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './assets/styles/theme.js/index.js'

function App() {
  const [auth, setAuth] = useState({ isAuthenticated: false, user: null, token: null})
  const logout = () => {
    setAuth({ isAuthenticated: false, user:null, token:null })
  }
  return (
    <ChakraProvider theme={theme}>
      <AuthContext.ChakraProvider value={{auth, setAuth, logout}}>
        <AppRoutes/>
      </AuthContext.ChakraProvider>
    </ChakraProvider>
  );
}

export default App;
