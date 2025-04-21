// src/components/ResultsScreen.js
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography
} from '@mui/material';

function ResultsScreen({ candidates }) {
  // Ordenar por votos descendentes para detectar al ganador
  const sorted = [...candidates].sort((a, b) => b.votes - a.votes);
  const winner = sorted[0]; // El que más votos tiene
  

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h4" gutterBottom>
        Resultados
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {candidates.map((candidate) => (
          <Grid item key={candidate.id}>
            <Card
              sx={{
                width: 200,
                height: 320,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <CardMedia
                component="img"
                image={candidate.image}
                alt={candidate.name}
                sx={{ height: 150, objectFit: 'cover' }}
              />
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6">{candidate.name}</Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  Votos: {candidate.votes}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {winner && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            El ganador es: {winner.name}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default ResultsScreen;
