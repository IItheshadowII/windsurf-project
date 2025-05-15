import React, { useState } from 'react';
import { Button, Typography, Container, Alert, Box } from '@mui/material';
import axios from 'axios';

function Subscription() {
  const [url, setUrl] = useState(null);
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubscribe = async () => {
    try {
      const res = await axios.post('/backend/billing/create-session', { email });
      setUrl(res.data.url);
      setMsg('Redirigiendo a Mercado Pago...');
      window.location.href = res.data.url;
    } catch (e) {
      setMsg('Error creando sesión de pago');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Box sx={{ p: 3, bgcolor: '#fff', borderRadius: 2, boxShadow: 2 }}>
        <Typography variant="h5" gutterBottom>Suscripción</Typography>
        <Typography variant="body1" gutterBottom>Ingresa tu email para suscribirte y acceder al sistema.</Typography>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', marginBottom: 16, padding: 8 }} />
        <Button variant="contained" color="primary" fullWidth onClick={handleSubscribe}>Suscribirse con Mercado Pago</Button>
        {msg && <Alert sx={{ mt: 2 }} severity={url ? 'success' : 'error'}>{msg}</Alert>}
      </Box>
    </Container>
  );
}

export default Subscription;
