import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, InputLabel, FormControl, Alert
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import db from '../db';
import BarcodeScanner from '../components/BarcodeScanner';

const emptyProduct = {
  name: '', category: '', supplierId: '', costPrice: '', salePrice: '', sku: '', stock: ''
};

function Inventory() {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [product, setProduct] = useState(emptyProduct);
  const [lowStockAlert, setLowStockAlert] = useState([]);
  const [scannerOpen, setScannerOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, []);

  async function fetchProducts() {
    const all = await db.products.toArray();
    setProducts(all);
    setLowStockAlert(all.filter(p => p.stock !== undefined && p.stock <= 5));
  }
  async function fetchSuppliers() {
    setSuppliers(await db.suppliers.toArray());
  }

  function handleOpen(product = emptyProduct) {
    setProduct(product);
    setEditing(product.id || null);
    setOpen(true);
  }
  function handleClose() {
    setProduct(emptyProduct);
    setEditing(null);
    setOpen(false);
  }
  function handleChange(e) {
    setProduct({ ...product, [e.target.name]: e.target.value });
  }
  async function handleSave() {
    if (editing) {
      await db.products.update(editing, product);
    } else {
      await db.products.add(product);
    }
    handleClose();
    fetchProducts();
  }
  async function handleDelete(id) {
    await db.products.delete(id);
    fetchProducts();
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Inventario</Typography>
      {lowStockAlert.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Stock bajo: {lowStockAlert.map(p => `${p.name} (${p.stock})`).join(', ')}
        </Alert>
      )}
      <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()} sx={{ mb: 2 }}>
        Agregar Producto
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Proveedor</TableCell>
              <TableCell>Precio de costo</TableCell>
              <TableCell>Precio de venta</TableCell>
              <TableCell>Código/SKU</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map(row => (
              <TableRow key={row.id} sx={row.stock <= 5 ? { backgroundColor: '#fff3e0' } : {}}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>{suppliers.find(s => s.id === row.supplierId)?.name || ''}</TableCell>
                <TableCell>{row.costPrice}</TableCell>
                <TableCell>{row.salePrice}</TableCell>
                <TableCell>{row.sku}</TableCell>
                <TableCell>{row.stock}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(row)}><Edit /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(row.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editing ? 'Editar producto' : 'Agregar producto'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 350 }}>
          <TextField label="Nombre" name="name" value={product.name} onChange={handleChange} fullWidth />
          <TextField label="Categoría" name="category" value={product.category} onChange={handleChange} fullWidth />
          <FormControl fullWidth>
            <InputLabel>Proveedor</InputLabel>
            <Select name="supplierId" value={product.supplierId} label="Proveedor" onChange={handleChange}>
              <MenuItem value="">Ninguno</MenuItem>
              {suppliers.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField label="Precio de costo" name="costPrice" type="number" value={product.costPrice} onChange={handleChange} fullWidth />
          <TextField label="Precio de venta" name="salePrice" type="number" value={product.salePrice} onChange={handleChange} fullWidth />
          <TextField label="Código/SKU" name="sku" value={product.sku} onChange={handleChange} fullWidth
            InputProps={{
              endAdornment: (
                <Button size="small" onClick={() => setScannerOpen(true)} sx={{ minWidth: 0, ml: 1 }}>
                  Escanear
                </Button>
              )
            }}
          />
          <BarcodeScanner open={scannerOpen} onDetected={code => setProduct(p => ({ ...p, sku: code }))} onClose={() => setScannerOpen(false)} />
          <TextField label="Stock" name="stock" type="number" value={product.stock} onChange={handleChange} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>{editing ? 'Actualizar' : 'Agregar'}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Inventory;
