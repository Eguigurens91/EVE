import React from 'react';
import { Typography, Box } from '@mui/material';

function CandidateTitle() {
  const imageBaseUrl = process.env.REACT_APP_IMAGE_BASE_URL;
  return (

    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      textAlign: 'center', 
      mb: 4 
    }}>
      {/* Imagen de la izquierda */}
      <Box sx={{ flex: 1, textAlign: 'left' }}>
        <img  src={`${imageBaseUrl}/presentacionCenteno.jpeg`}  alt="Imagen izquierda" style={{ width: '100px', height: '100px' }} />
      </Box>

      {/* Texto centrado */}
      <Box sx={{ flex: 2 }}>

      <Box sx={{ flex: 2, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black' }}>
          Centro de Educación Básica “PRESENTACION CENTENO"
        </Typography>
        <img  src={`${imageBaseUrl}/honduras.png`} alt="Imagen junto al texto" style={{ width: '40px', height: '40px', marginRight: '8px' }} />
      </Box>

        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black' }}>
          ELECCIONES GOBIERNO ESTUDIANTIL
        </Typography>
        <Typography variant="h4" sx={{ color: 'blue' }}>
          VOTACIONES 2025
        </Typography>
        <Typography variant="h4" sx={{ color: 'black', mt: 3 }}>
          PLANILLA GOBIERNO ESTUDIANTIL
        </Typography>
      </Box>

      {/* Imagen de la derecha */}
      <Box sx={{ flex: 1, textAlign: 'right' }}>
        <img src={`${imageBaseUrl}/votaya.jpeg`}   alt="Imagen derecha" style={{ width: '100px', height: '100px' }} />
      </Box>
    </Box>
  );
}

export default CandidateTitle;
