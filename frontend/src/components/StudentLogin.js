import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

function StudentLogin({ onLogin }) {
  const [studentId, setStudentId] = useState('');
  const [message, setMessage] = useState('');
  const imageBaseUrl = process.env.REACT_APP_IMAGE_BASE_URL;
  const bck = process.env.REACT_APP_BACKEND;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar si el estudiante está habilitado para votar
    const response = await fetch(`${bck}/check-student`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId }),
    });

    const data = await response.json();
    console.log("Response from server: ", data); // Log de la respuesta del servidor

    if (data.isValid) {
      setMessage(`Estás habilitado para votar, ${data.name}`);
      onLogin(studentId); // Procede con la votación
    } else {
      setMessage('No estás habilitado para votar');
    }
  };

  return (
    <Box
      component="section"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: 400,
        mx: 'auto',
        p: 2
      }}
    >
      {/* Logo y nombre de la escuela */}
      <Box
        component="img"
        src={`${imageBaseUrl}/presentacionCenteno.jpeg`} 
        alt="Logo del Colegio"
        sx={{
          width: { xs: '60%', sm: '40%', md: '30%' },
          mb: 2
        }}
      />
      <Typography variant="h5" sx={{ mb: 2, textAlign: 'center' }}>
        Centro de Educación Básica “PRESENTACION CENTENO"
      </Typography>
      <Typography variant="h6" sx={{ mb: 3, textAlign: 'center' }}>
        ELECCIONES GOBIERNO ESTUDIANTIL 2020
      </Typography>

      {/* Formulario de ingreso de ID */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: '100%'
        }}
      >
        <TextField
          label="ID de Estudiante"
          variant="outlined"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)} // Eliminar validación para 13 dígitos
          required
          fullWidth
          helperText="Ingresar número de identidad"
        />
        <Button 
          type="submit" 
          variant="contained" 
          size="large" 
          fullWidth
        >
          Verificar
        </Button>
      </Box>

      {/* Mensaje de resultado */}
      {message && <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>{message}</Typography>}
    </Box>
  );
}

export default StudentLogin;
