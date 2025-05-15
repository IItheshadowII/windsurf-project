import React from 'react';
import { Container, Typography, Grid, Paper, Button } from '@mui/material';
import { seedSampleData } from '../db/sampleData';
import { useTranslation } from 'react-i18next';

function Dashboard({ user }) {
  const { t } = useTranslation();
  async function handleSeed() {
    await seedSampleData();
    window.location.reload();
  }
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('Dashboard')}
      </Typography>
      {user?.role === 'admin' && (
        <Button variant="outlined" onClick={handleSeed} sx={{ mb: 2 }}>
          {t('Seed Demo Data')}
        </Button>
      )}
      <Grid container spacing={3}>
        {/* Placeholders for dashboard widgets */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>{t('Sales Summary')}</Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>{t('Inventory Value')}</Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>{t('Low Stock Alerts')}</Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;

