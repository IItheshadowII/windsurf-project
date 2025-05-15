// src/components/BarcodeScanner.js
import React, { useEffect, useRef, useCallback } from 'react';
import Quagga from '@ericblade/quagga2';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from '@mui/material';

export default function BarcodeScanner({ open, onDetected, onClose }) {
  const scannerRef = useRef(null);

  // --- callback que cierra el escáner en cuanto encuentra un código ---
  const handleDetected = useCallback(
    (result) => {
      if (!result?.codeResult?.code) return;
      console.log('Detectado:', result.codeResult.code);         // <-- dejalo para debug
      onDetected(result.codeResult.code);
      Quagga.stop();
      onClose();
    },
    [onDetected, onClose]
  );

  // --- lifecycle ---
  useEffect(() => {
    if (!open) return;                          // si el diálogo está cerrado, no inicializamos nada

    const initScanner = async () => {
      try {
        await Quagga.init(
          {
            numOfWorkers: navigator.hardwareConcurrency || 4,   // tira hilos en serio
            locate: true,                                       // mejor rendimiento en mobile
            frequency: 10,                                      // fps de lectura
            inputStream: {
              name: 'Live',
              type: 'LiveStream',
              target: scannerRef.current,                       // div donde mete el canvas
              constraints: {
                facingMode: 'environment',
                width: { min: 640 },                            // si la resolución es baja, no detecta
                height: { min: 480 },
              },
              singleChannel: false,
            },
            locator: {
              patchSize: 'medium',                              // probá small/medium
              halfSample: false,                                // MÁS resolución = mejor lectura
            },
            decoder: {
              readers: [
                'ean_reader',
                'upc_reader',
                'upc_e_reader',
                'code_128_reader',
              ],
            },
          },
          (err) => {
            if (err) {
              console.error('Quagga init error:', err);
              return;
            }
            Quagga.start();
          }
        );

        Quagga.onDetected(handleDetected);

        // --- overlay para ver por qué no engancha ---
        Quagga.onProcessed((result) => {
          const ctx = Quagga.canvas.ctx.overlay;
          const canvas = Quagga.canvas.dom.overlay;
          if (!ctx || !canvas) return;

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (result?.boxes) {
            result.boxes
              .filter((b) => b !== result.box)
              .forEach((b) =>
                Quagga.ImageDebug.drawPath(b, { x: 0, y: 1 }, ctx, {
                  color: 'green',
                  lineWidth: 2,
                })
              );
          }
          if (result?.box) {
            Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, ctx, {
              color: '#00F',
              lineWidth: 2,
            });
          }
          if (result?.codeResult?.code) {
            Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, ctx, {
              color: 'red',
              lineWidth: 3,
            });
          }
        });
      } catch (e) {
        console.error('Quagga init exception:', e);
      }
    };

    initScanner();

    // --- cleanup ---
    return () => {
      Quagga.offDetected(handleDetected);
      Quagga.stop();
    };
  }, [open, handleDetected]);

  // --- UI ---
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Escanear código de barras</DialogTitle>

      <DialogContent>
        <Box
          ref={scannerRef}
          sx={{
            width: '100%',
            height: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'black',
          }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
      </DialogActions>
    </Dialog>
  );
}
