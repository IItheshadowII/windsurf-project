import React from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ManualRegisterForm from '../components/ManualRegisterForm';
import GoogleLoginButton from '../components/GoogleLoginButton';

export default function Register({ onRegister }) {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  function handleRegister(user) {
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
      navigate('/');
    }, 2000);
    if (onRegister) onRegister(user);
  }

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Registro</Typography>
        <ManualRegisterForm onRegister={handleRegister} />
        <Typography align="center" sx={{ mt: 2, mb: 1 }}>o</Typography>
        <GoogleLoginButton onToken={async (token) => {
          await axios.post('/auth/google', { idToken: token });
          handleRegister();
        }} />
        <Snackbar open={open} autoHideDuration={2000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert severity="success" sx={{ width: '100%' }}>
            ¡Registro exitoso! Redirigiendo al login...
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
}
