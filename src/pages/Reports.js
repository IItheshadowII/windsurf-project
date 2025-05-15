import React, { useEffect, useRef, useState } from 'react';
import { Container, Typography, Grid, Paper, Checkbox, FormControlLabel, Button, CircularProgress, Box } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import * as XLSX from 'xlsx';
import db from '../db';
import { seedSampleData } from '../db/sampleData';

function groupByPeriod(sales, period) {
  const fmt = (date) => {
    const d = new Date(date);
    if (period === 'day') return d.toISOString().slice(0, 10);
    if (period === 'week') {
      const first = new Date(d.setDate(d.getDate() - d.getDay()));
      return first.toISOString().slice(0, 10);
    }
    if (period === 'month') return d.toISOString().slice(0, 7);
  };
  const grouped = {};
  sales.forEach(s => {
    const key = fmt(s.date);
    grouped[key] = (grouped[key] || 0) + s.total;
  });
  return grouped;
}

const CLIENT_ID = '1048920844686-t8n780b73861l25es99hugqkofrpp9tb.apps.googleusercontent.com';
const SCOPES    = 'https://www.googleapis.com/auth/drive.file';

function Reports() {
  const [checks, setChecks]   = useState({ sales:false, stock:true, profit:false });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg]         = useState('');
  const [dbReady, setDbReady] = useState(false);
  const [token, setToken]     = useState(null);
  const [fileId, setFileId]   = useState(() => localStorage.getItem('warehouse_report_file_id') || null);
  const tokenClientRef = useRef(null);

  useEffect(() => {
    // DESARROLLO: Descomenta para borrar IndexedDB y forzar seed limpio
    // indexedDB.deleteDatabase('WarehouseDB');

    // Precarga datos de ejemplo si la base está vacía
    (async () => {
      const productsCount = await db.products.count();
      const suppliersCount = await db.suppliers.count();
      if (productsCount === 0 || suppliersCount === 0) {
        await seedSampleData();
        console.log('Datos de ejemplo cargados en la base.');
      }
      setDbReady(true);
    })();
    const init = () => {
      tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope:     SCOPES,
        callback:  (resp) => {
          if (resp.error) { setMsg(`Error: ${resp.error}`); setLoading(false); return; }
          setToken(resp.access_token);
          uploadReport(resp.access_token);
        }
      });
    };
    if (window.google?.accounts?.oauth2) init();
    else window.onGoogleLibraryLoad = init;
  }, []);

  const toggle = key => setChecks({ ...checks, [key]: !checks[key] });

  // Descarga el archivo de Drive, o crea uno nuevo si no existe
  const getOrCreateWorkbook = async (accessToken) => {
    let id = fileId;
    let wb;
    // Si no hay ID, crea el archivo
    if (!id) {
      wb = XLSX.utils.book_new();
      const buf = XLSX.write(wb, { bookType:'xlsx', type:'array' });
      const blob = new Blob([buf], { type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const metadata = { name: 'Reportes_Warehouse.xlsx', mimeType: blob.type };
      const body = new FormData();
      body.append('metadata', new Blob([JSON.stringify(metadata)], { type:'application/json' }));
      body.append('file', blob);
      const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body
      });
      if (!res.ok) throw new Error('No se pudo crear el archivo');
      const { id: newId } = await res.json();
      localStorage.setItem('warehouse_report_file_id', newId);
      setFileId(newId);
      id = newId;
      wb = XLSX.utils.book_new();
    } else {
      // Descarga el archivo existente
      const res = await fetch(`https://www.googleapis.com/drive/v3/files/${id}?alt=media`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!res.ok) {
        // Si fue borrado, lo recrea
        localStorage.removeItem('warehouse_report_file_id');
        setFileId(null);
        return await getOrCreateWorkbook(accessToken);
      }
      const arrayBuffer = await res.arrayBuffer();
      try {
        wb = XLSX.read(arrayBuffer, { type: 'array' });
        if (!wb.SheetNames || wb.SheetNames.length === 0) {
          // Archivo vacío, lo recrea
          throw new Error('Archivo vacío');
        }
      } catch (e) {
        // Si falla la lectura, lo recrea
        console.warn('Archivo de Drive corrupto o vacío, se recrea:', e);
        localStorage.removeItem('warehouse_report_file_id');
        setFileId(null);
        return await getOrCreateWorkbook(accessToken);
      }
    }
    return { wb, id };
  };

  // Agrega hojas según checks y sube el archivo
  const buildAndUploadWorkbook = async (accessToken) => {
    const fecha = new Date();
    const fechaStr = `${fecha.getDate()}-${fecha.getMonth()+1}-${fecha.getFullYear()}`;
    const wb = XLSX.utils.book_new();
    let hojas = 0;

    // Stock
    if (checks.stock) {
      const products = await db.products.toArray();
      console.log('Productos para hoja Stock:', products, 'Cantidad:', products.length);
      if (products && products.length > 0 && Object.keys(products[0]).length > 0) {
        const ws = XLSX.utils.json_to_sheet(products);
        XLSX.utils.book_append_sheet(wb, ws, `Stock-${fechaStr}`);
        hojas++;
      } else {
        console.warn('No se agrega hoja Stock: sin datos reales.');
      }
    }
    // Ventas
    if (checks.sales) {
      const sales = await db.sales.toArray();
      console.log('Ventas para hoja Ventas:', sales, 'Cantidad:', sales.length);
      if (sales && sales.length > 0 && Object.keys(sales[0]).length > 0) {
        const ws = XLSX.utils.json_to_sheet(sales);
        XLSX.utils.book_append_sheet(wb, ws, `Ventas-${fechaStr}`);
        hojas++;
      } else {
        console.warn('No se agrega hoja Ventas: sin datos reales.');
      }
    }
    // Ganancias
    if (checks.profit) {
      const sales = await db.sales.toArray();
      const profitRows = sales.map(s => {
        let cost = 0;
        if (Array.isArray(s.items)) {
          s.items.forEach(item => {
            cost += (item.costPrice || 0) * (item.quantity || item.qty || 0);
          });
        }
        return {
          date: s.date,
          total: s.total,
          cost,
          profit: s.total - cost
        };
      });
      console.log('Ganancias para hoja Ganancias:', profitRows, 'Cantidad:', profitRows.length);
      if (profitRows && profitRows.length > 0 && Object.keys(profitRows[0]).length > 0) {
        const ws = XLSX.utils.json_to_sheet(profitRows);
        XLSX.utils.book_append_sheet(wb, ws, `Ganancias-${fechaStr}`);
        hojas++;
      } else {
        console.warn('No se agrega hoja Ganancias: sin datos reales.');
      }
    }
    console.log('Hojas en workbook antes de subir:', wb.SheetNames);
    if (hojas === 0 || !wb.SheetNames || wb.SheetNames.length === 0) {
      throw new Error('No hay datos para generar el reporte seleccionado (el archivo no tiene hojas).');
    }
    const buf = XLSX.write(wb, { bookType:'xlsx', type:'array' });
    const blob = new Blob([buf], { type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const metadata = { name: 'Reportes_Warehouse.xlsx', mimeType: blob.type };
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', blob);
    let uploadUrl = '';
    let method = '';
    let id = fileId;
    if (!id) {
      uploadUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id';
      method = 'POST';
    } else {
      uploadUrl = `https://www.googleapis.com/upload/drive/v3/files/${id}?uploadType=multipart`;
      method = 'PATCH';
    }
    const res = await fetch(uploadUrl, {
      method,
      headers: { Authorization: `Bearer ${accessToken}` },
      body: form
    });
    if (!res.ok) throw new Error('No se pudo subir el archivo');
    const json = await res.json();
    if (json.id) {
      setFileId(json.id);
      localStorage.setItem('warehouse_report_file_id', json.id);
      return json.id;
    } else if (id) {
      setFileId(id);
      localStorage.setItem('warehouse_report_file_id', id);
      return id;
    }
    throw new Error('No se pudo obtener el ID del archivo subido');
  };





  const uploadReport = async (accessToken) => {
    try {
      const id = await buildAndUploadWorkbook(accessToken);
      setFileId(id);
      setMsg(`✅ Reporte actualizado. ID: ${id}`);
    } catch (e) {
      setMsg(`Error subiendo reporte: ${e.message}`);
    } finally { setLoading(false); }
  };

  const handleGenerate = () => {
    setMsg('');
    setLoading(true);
    token ? uploadReport(token)
          : tokenClientRef.current.requestAccessToken({ prompt:'consent' });
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{display:'flex',alignItems:'center',mb:2}}>
        <AssessmentIcon sx={{mr:1}}/> Reportes
      </Typography>
      <Paper sx={{p:3,mb:4}}>
        <Typography variant="h6" gutterBottom>Selecciona los reportes a generar:</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <FormControlLabel control={<Checkbox checked={checks.sales}  onChange={()=>toggle('sales')} />}  label="Ventas"   />
            <FormControlLabel control={<Checkbox checked={checks.stock}  onChange={()=>toggle('stock')} />}  label="Stock"    />
            <FormControlLabel control={<Checkbox checked={checks.profit} onChange={()=>toggle('profit')} />} label="Ganancias"/>
          </Grid>
          <Grid item xs={12} md={4} sx={{display:'flex',alignItems:'center'}}>
            <Button variant="contained" onClick={handleGenerate} disabled={loading || !dbReady}>
              {loading || !dbReady ? <CircularProgress size={24}/> : 'GENERAR REPORTE'}
            </Button>
          </Grid>
        </Grid>
        {msg && <Box mt={2}><Typography variant="body2">{msg}</Typography></Box>}
        {fileId && (
          <Box mt={2}>
            <a
              href={`https://docs.google.com/spreadsheets/d/${fileId}/edit`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <Button variant="outlined" color="success">
                Ver Reporte en Google Drive
              </Button>
            </a>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default Reports;
