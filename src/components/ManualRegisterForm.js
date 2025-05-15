import React, { useState } from 'react';
import { TextField, Button, Alert, Box } from '@mui/material';
import axios from 'axios';

export default function ManualRegisterForm({ onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }
    try {
      const res = await axios.post('/auth/register', { email, password, name });
      setSuccess('Registro exitoso. Ahora puedes iniciar sesión.');
      setEmail('');
      setPassword('');
      setName('');
      setConfirmPassword('');
      if (onRegister) onRegister(res.data.user);
    } catch (e) {
      setError(e.response?.data?.message || 'Error en el registro');
    }
    setLoading(false);
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, mb: 2 }}>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <TextField
        label="Nombre"
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        fullWidth
        margin="normal"
        required
      />
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
      <TextField
        label="Confirmar contraseña"
        type="password"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
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
      >
        Registrarse
      </Button>
    </Box>
  );
}
