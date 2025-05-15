import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import NavBar from './components/NavBar';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import POS from './pages/POS';
import Suppliers from './pages/Suppliers';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import Subscription from './pages/Subscription';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#ff9800' },
  },
});

function App() {
  const [user, setUser] = useState(() => {
    const jwt = localStorage.getItem('jwt');
    const u = localStorage.getItem('user');
    return jwt && u ? JSON.parse(u) : null;
  });
  function handleLogin(u) {
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
  }
  function handleLogout() {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('jwt');
  }
  React.useEffect(() => {
    if (!localStorage.getItem('jwt')) {
      setUser(null);
      localStorage.removeItem('user');
    }
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {user && <NavBar user={user} onLogout={handleLogout} />}
        <Routes>
          {!user && <Route path="/register" element={<Register onRegister={handleLogin} />} />}
          {!user && <Route path="*" element={<Login onLogin={handleLogin} />} />}
          {user && <Route path="/" element={<POS />} />}
          {user && <Route path="/inventory" element={<Inventory />} />}
          {user && <Route path="/pos" element={<POS />} />}
          {user && <Route path="/suppliers" element={<Suppliers />} />}
          {user && <Route path="/reports" element={<Reports />} />}
          {user && user.role === 'admin' && <Route path="/settings" element={<Settings user={user} />} />}
          {user && user.role !== 'admin' && <Route path="/settings" element={<Navigate to="/" replace />} />}
          <Route path="/subscription" element={<Subscription />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
