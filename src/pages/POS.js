import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Grid, Paper, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import db from '../db';
import BarcodeScanner from '../components/BarcodeScanner';
import { useTranslation } from 'react-i18next';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import PaymentIcon from '@mui/icons-material/Payment';
import SearchIcon from '@mui/icons-material/Search';

function POS() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [paymentType, setPaymentType] = useState('cash');
  const [amountReceived, setAmountReceived] = useState('');
  const [change, setChange] = useState(0);
  const [receipt, setReceipt] = useState(null);
  const [openReceipt, setOpenReceipt] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setProducts(await db.products.toArray());
  }

  function addToCart(product) {
    setCart(prev => {
      const idx = prev.findIndex(item => item.id === product.id);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx].qty += 1;
        return updated;
      } else {
        return [...prev, { ...product, qty: 1 }];
      }
    });
  }

  function removeFromCart(id) {
    setCart(prev => prev.map(item => item.id === id ? { ...item, qty: item.qty - 1 } : item).filter(item => item.qty > 0));
  }

  function clearCart() {
    setCart([]);
    setDiscount(0);
    setAmountReceived('');
    setChange(0);
  }

  const subtotal = cart.reduce((sum, item) => sum + item.salePrice * item.qty, 0);
  const total = Math.max(subtotal - Number(discount || 0), 0);

  useEffect(() => {
    if (paymentType === 'cash' && amountReceived) {
      setChange(Number(amountReceived) - total);
    } else {
      setChange(0);
    }
  }, [amountReceived, total, paymentType]);

  async function handleCheckout() {
    // Save sale
    const sale = {
      date: new Date().toISOString(),
      items: cart.map(({ id, name, qty, salePrice }) => ({ id, name, qty, salePrice })),
      total,
      paymentType,
      discount: Number(discount || 0),
      change: paymentType === 'cash' ? change : 0,
      receipt: '' // will be set below
    };
    const saleId = await db.sales.add(sale);
    // Update stock
    for (const item of cart) {
      const prod = await db.products.get(item.id);
      await db.products.update(item.id, { stock: prod.stock - item.qty });
    }
    // Generate receipt
    sale.receipt = `Sale #${saleId}\n${sale.date}\n` +
      cart.map(i => `${i.name} x${i.qty} @${i.salePrice} = ${i.qty * i.salePrice}`).join('\n') +
      `\nSubtotal: ${subtotal}\nDiscount: ${discount}\nTotal: ${total}\nPaid: ${amountReceived || total}\nChange: ${change}\nPayment: ${paymentType}`;
    setReceipt(sale.receipt);
    setOpenReceipt(true);
    clearCart();
    fetchProducts();
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>{t('Point of Sale (POS)')}</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={7}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', color: 'primary.main', mb: 1 }}>
            <ShoppingCartIcon sx={{ mr: 1 }} /> {t('Products')}
          </Typography>
          <Button variant="contained" color="secondary" size="small" onClick={() => setScannerOpen(true)} sx={{ mb: 1 }}>
            {t('Scan Barcode')}
          </Button>
          <TextField
            variant="outlined"
            size="small"
            placeholder={t('Search products...')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1 }} />,
              sx: { bgcolor: 'background.paper', borderRadius: 2, mb: 1, width: '100%' }
            }}
            sx={{ mb: 2, width: '100%' }}
          />
          <BarcodeScanner open={scannerOpen} onDetected={code => {
            const found = products.find(p => p.sku === code);
            if (found) addToCart(found);
            setScannerOpen(false);
          }} onClose={() => setScannerOpen(false)} />
          <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>{t('Name')}</TableCell>
                  <TableCell>{t('Category')}</TableCell>
                  <TableCell>{t('Price')}</TableCell>
                  <TableCell>{t('Stock')}</TableCell>
                  <TableCell align="right">{t('Add')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.filter(p =>
                  p.name.toLowerCase().includes(search.toLowerCase()) ||
                  p.category.toLowerCase().includes(search.toLowerCase()) ||
                  (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
                ).map(p => (
                  <TableRow key={p.id} hover sx={{ bgcolor: p.stock <= 5 ? 'rgba(255,0,0,0.08)' : 'inherit' }}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell>{p.salePrice}</TableCell>
                    <TableCell>{p.stock}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="primary" onClick={() => addToCart(p)}>
                        <ShoppingCartIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} md={5}>
          <Typography variant="h6">{t('Cart')}</Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t('Product')}</TableCell>
                  <TableCell>{t('Qty')}</TableCell>
                  <TableCell align="right">{t('Remove')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.qty}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="error" onClick={() => removeFromCart(item.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TextField label={t('Discount')} type="number" value={discount} onChange={e => setDiscount(e.target.value)} fullWidth sx={{ mt: 2 }} />
          <Typography sx={{ mt: 1 }}>{t('Subtotal')}: {subtotal}</Typography>
          <Typography>{t('Total')}: {total}</Typography>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>{t('Payment Type')}</InputLabel>
            <Select value={paymentType} label={t('Payment Type')} onChange={e => setPaymentType(e.target.value)}>
              <MenuItem value="cash">{t('Cash')}</MenuItem>
              <MenuItem value="card">{t('Card')}</MenuItem>
              <MenuItem value="transfer">{t('Transfer')}</MenuItem>
            </Select>
          </FormControl>
          {paymentType === 'cash' && (
            <TextField label={t('Amount Received')} type="number" value={amountReceived} onChange={e => setAmountReceived(e.target.value)} fullWidth sx={{ mt: 1 }} />
          )}
          {paymentType === 'cash' && (
            <Typography>{t('Change')}: {change}</Typography>
          )}
          <Button variant="contained" color="primary" onClick={handleCheckout} startIcon={<PaymentIcon />} sx={{ mt: 2 }}>
            {t('Checkout')}
          </Button>
          <Button variant="outlined" color="secondary" onClick={clearCart} startIcon={<DeleteIcon />} sx={{ mt: 2, ml: 2 }}>
            {t('Cancel')}
          </Button>
        </Grid>
      </Grid>
      <Dialog open={openReceipt} onClose={() => setOpenReceipt(false)}>
        <DialogTitle>{t('Receipt')}</DialogTitle>
        <DialogContent>
          <pre style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>{receipt}</pre>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReceipt(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default POS;
