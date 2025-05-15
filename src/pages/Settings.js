import React, { useEffect, useState } from 'react';
import {
  Container, Typography, TextField, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import db from '../db';
import { useTranslation } from 'react-i18next';

const emptyExpense = { description: '', amount: '', date: '', recurring: false };

function Settings({ user }) {
  const { t } = useTranslation();
  const [settings, setSettings] = useState({ storeName: '', currency: '', taxes: '' });
  const [expenses, setExpenses] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [expense, setExpense] = useState(emptyExpense);

  useEffect(() => {
    fetchSettings();
    fetchExpenses();
  }, []);

  async function fetchSettings() {
    const s = await db.settings.get(1);
    setSettings(s || { storeName: '', currency: '', taxes: '' });
  }
  async function fetchExpenses() {
    setExpenses(await db.expenses.toArray());
  }

  function handleChange(e) {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  }
  async function handleSaveSettings() {
    await db.settings.put({ ...settings, id: 1 });
    fetchSettings();
  }

  function handleExpenseOpen(exp = emptyExpense) {
    setExpense(exp);
    setEditing(exp.id || null);
    setOpen(true);
  }
  function handleExpenseClose() {
    setExpense(emptyExpense);
    setEditing(null);
    setOpen(false);
  }
  function handleExpenseChange(e) {
    setExpense({ ...expense, [e.target.name]: e.target.value });
  }
  async function handleExpenseSave() {
    if (editing) {
      await db.expenses.update(editing, expense);
    } else {
      await db.expenses.add(expense);
    }
    handleExpenseClose();
    fetchExpenses();
  }
  async function handleExpenseDelete(id) {
    await db.expenses.delete(id);
    fetchExpenses();
  }

  // Botón de restablecer base de datos solo para admin
  const [confirmOpen, setConfirmOpen] = useState(false);
  async function handleResetDatabase() {
    await import('../db/sampleData').then(mod => mod.seedSampleData());
    window.location.reload();
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Configuración</Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Configuración de la tienda</Typography>
        <TextField label="Nombre del negocio" name="storeName" value={settings.storeName} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
        <TextField label="Moneda" name="currency" value={settings.currency} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
        <TextField label="Impuestos (%)" name="taxes" value={settings.taxes} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
        <Button variant="contained" onClick={handleSaveSettings}>Guardar configuración</Button>
      </Paper>
      <Typography variant="h6">Gastos recurrentes</Typography>
      <Button variant="contained" startIcon={<Add />} onClick={() => handleExpenseOpen()} sx={{ mb: 2 }}>
        Agregar gasto
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Descripción</TableCell>
              <TableCell>Monto</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Recurrente</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.description}</TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.recurring ? t('Yes') : t('No')}</TableCell>
                <TableCell align="right">
                  <Button size="small" onClick={() => handleExpenseOpen(row)}><Edit fontSize="small" /></Button>
                  <Button size="small" color="error" onClick={() => handleExpenseDelete(row.id)}><Delete fontSize="small" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleExpenseClose}>
        <DialogTitle>{editing ? 'Editar gasto' : 'Agregar gasto'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 350 }}>
          <TextField label="Descripción" name="description" value={expense.description} onChange={handleExpenseChange} fullWidth />
          <TextField label="Monto" name="amount" type="number" value={expense.amount} onChange={handleExpenseChange} fullWidth />
          <TextField label="Fecha" name="date" type="date" value={expense.date} onChange={handleExpenseChange} fullWidth InputLabelProps={{ shrink: true }} />
          <Button
            variant={expense.recurring ? "contained" : "outlined"}
            color="primary"
            onClick={() => setExpense({ ...expense, recurring: !expense.recurring })}
            sx={{ mb: 1 }}
          >
            {expense.recurring ? "Recurrente" : "No recurrente"}
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleExpenseClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleExpenseSave}>{editing ? 'Actualizar' : 'Agregar'}</Button>
        </DialogActions>
      </Dialog>
      {/* Solo admin puede ver el botón de restablecimiento */}
      {user?.role === 'admin' && (
        <>
          <Button variant="outlined" color="error" sx={{ mt: 3, mb: 2 }} onClick={() => setConfirmOpen(true)}>
            {t('Reset Demo Data')}
          </Button>
          <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
            <DialogTitle>{t('Reset Database')}</DialogTitle>
            <DialogContent>{t('Are you sure you want to reset all data? This cannot be undone.')}</DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmOpen(false)}>{t('Cancel')}</Button>
              <Button color="error" variant="contained" onClick={handleResetDatabase}>{t('Reset')}</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Container>
  );
}

export default Settings;
