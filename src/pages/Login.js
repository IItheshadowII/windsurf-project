import React, { useState } from 'react';
import { Container, Typography, Paper, Alert, TextField, Button, Box, Link } from '@mui/material';
import GoogleLoginButton from '../components/GoogleLoginButton';
import axios from 'axios';

function Login({ onLogin }) {
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleGoogle(token) {
    try {
      const res = await axios.post('/backend/auth/google', { idToken: token });
      localStorage.setItem('jwt', res.data.access_token);
      onLogin(res.data.user);
    } catch (e) {
      setError('Error autenticando con Google');
    }
  }

  async function handleManualLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('/backend/auth/login', { email, password });
      localStorage.setItem('jwt', res.data.access_token);
      onLogin(res.data.user);
    } catch (e) {
      setError(e.response?.data?.message || 'Error en el login');
    }
    setLoading(false);
  }

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Iniciar sesión</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <Box component="form" onSubmit={handleManualLogin} sx={{ mt: 2, mb: 2 }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ mt: 1 }}
          >
            Ingresar
          </Button>
        </Box>
        <Typography align="center" sx={{ mt: 2, mb: 1 }}>o</Typography>
        <GoogleLoginButton onToken={handleGoogle} />
        <Box sx={{ mt: 2 }}>
          <Typography align="center">
            ¿No tienes cuenta?{' '}
            <Link href="/register">Regístrate aquí</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;
