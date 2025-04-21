import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

function StudentLogin({ onLogin }) {
  const [studentId, setStudentId] = useState('');
  const imageBaseUrl = process.env.REACT_APP_IMAGE_BASE_URL;

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(studentId);
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
          onChange={(e) => setStudentId(e.target.value.replace(/[^0-9]/g, ''))}
          required
          fullWidth
          inputProps={{
            maxLength: 13,
            inputMode: 'numeric'
          }}
          helperText={
            studentId.length > 0 && studentId.length !== 13 
              ? 'Debe contener 13 dígitos numéricos' 
              : 'Ingresar número de identidad de 13 dígitos'
          }
          error={studentId.length > 0 && studentId.length !== 13}
        />
        <Button 
          type="submit" 
          variant="contained" 
          size="large" 
          fullWidth
          disabled={studentId.length !== 13}
        >
          Verificar
        </Button>
      </Box>
    </Box>
  );
}

export default StudentLogin;
