// src/components/AdminPaswordDialog.js
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material';

function AdminPasswordDialog({ open, onClose, onSuccess, showErrorToast }) {
  const [password, setPassword] = useState('');

  const handleConfirm = () => {
    // Hardcode 'admin123' para la demo
    if (password === 'admin123') {
      onSuccess();
    } else {
      showErrorToast('Contraseña incorrecta. No tienes permiso.');
    }
    setPassword('');
    onClose();
  };

  const handleCancel = () => {
    setPassword('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Contraseña de Administrador</DialogTitle>
      <DialogContent>
        <TextField
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancelar</Button>
        <Button onClick={handleConfirm} variant="contained">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AdminPasswordDialog;
