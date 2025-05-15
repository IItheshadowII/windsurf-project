import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, List, ListItem, ListItemText
} from '@mui/material';
import { Edit, Delete, Add, Business, ContactPhone, Email, LocationOn, Inventory2 } from '@mui/icons-material';
import db from '../db';

const emptySupplier = { name: '', contact: '', phone: '', email: '', address: '' };

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [supplier, setSupplier] = useState(emptySupplier);
  const [linkedProducts, setLinkedProducts] = useState([]);

  useEffect(() => {
    fetchSuppliers();
    fetchProducts();
  }, []);

  async function fetchSuppliers() {
    setSuppliers(await db.suppliers.toArray());
  }
  async function fetchProducts() {
    setProducts(await db.products.toArray());
  }

  function handleOpen(s = emptySupplier) {
    setSupplier(s);
    setEditing(s.id || null);
    setOpen(true);
    setLinkedProducts(products.filter(p => p.supplierId === s.id));
  }
  function handleClose() {
    setSupplier(emptySupplier);
    setEditing(null);
    setOpen(false);
    setLinkedProducts([]);
  }
  function handleChange(e) {
    setSupplier({ ...supplier, [e.target.name]: e.target.value });
  }
  async function handleSave() {
    if (editing) {
      await db.suppliers.update(editing, supplier);
    } else {
      await db.suppliers.add(supplier);
    }
    handleClose();
    fetchSuppliers();
  }
  async function handleDelete(id) {
    await db.suppliers.delete(id);
    fetchSuppliers();
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#1976d2' }}>
        <Business sx={{ mr: 1 }} /> Proveedores
      </Typography>
      <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()} sx={{ mb: 2, backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#115293' } }}>
        Agregar Proveedor
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Business sx={{ verticalAlign: 'middle', color: '#1976d2' }} /> Nombre</TableCell>
              <TableCell><ContactPhone sx={{ verticalAlign: 'middle', color: '#1976d2' }} /> Contacto</TableCell>
              <TableCell><ContactPhone sx={{ verticalAlign: 'middle', color: '#1976d2' }} /> Teléfono</TableCell>
              <TableCell><Email sx={{ verticalAlign: 'middle', color: '#1976d2' }} /> Email</TableCell>
              <TableCell><LocationOn sx={{ verticalAlign: 'middle', color: '#1976d2' }} /> Dirección</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map(row => (
              <TableRow key={row.id} sx={{ backgroundColor: '#f5faff', '&:hover': { backgroundColor: '#e3f2fd' } }}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.contact}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.address}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleOpen(row)}><Edit /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(row.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ color: '#1976d2' }}>{editing ? 'Editar proveedor' : 'Agregar proveedor'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 350, py: 3 }}>
          <TextField label="Nombre" name="name" value={supplier.name} onChange={handleChange} fullWidth InputProps={{ startAdornment: <Business sx={{ mr: 1, color: '#1976d2' }} /> }} />
          <TextField label="Contacto" name="contact" value={supplier.contact} onChange={handleChange} fullWidth InputProps={{ startAdornment: <ContactPhone sx={{ mr: 1, color: '#1976d2' }} /> }} />
          <TextField label="Teléfono" name="phone" value={supplier.phone} onChange={handleChange} fullWidth InputProps={{ startAdornment: <ContactPhone sx={{ mr: 1, color: '#1976d2' }} /> }} />
          <TextField label="Email" name="email" value={supplier.email} onChange={handleChange} fullWidth InputProps={{ startAdornment: <Email sx={{ mr: 1, color: '#1976d2' }} /> }} />
          <TextField label="Dirección" name="address" value={supplier.address} onChange={handleChange} fullWidth InputProps={{ startAdornment: <LocationOn sx={{ mr: 1, color: '#1976d2' }} /> }} />
          {editing && (
            <>
              <Typography variant="subtitle1" sx={{ mt: 2, color: '#1976d2', display: 'flex', alignItems: 'center' }}><Inventory2 sx={{ mr: 1 }} />Productos vinculados</Typography>
              <List dense>
                {products.filter(p => p.supplierId === editing).map(p => (
                  <ListItem key={p.id}>
                    <ListItemText primary={p.name} secondary={`SKU: ${p.sku}`} />
                  </ListItem>
                ))}
                {products.filter(p => p.supplierId === editing).length === 0 && (
                  <ListItem><ListItemText primary="Sin productos vinculados" /></ListItem>
                )}
              </List>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave} sx={{ backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#115293' } }}>{editing ? 'Actualizar' : 'Agregar'}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Suppliers;
