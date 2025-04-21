import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';

function CandidateCard({ candidate, onVote }) {
  console.log('Image URL:', candidate.image);
  return (
    <Card
      onClick={() => onVote(candidate.id)}
      sx={{
        width: 240,
        margin: 2,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: 3,
        borderRadius: 2
      }}
    >
      <CardMedia
        component="img"
        image={candidate.image}
        alt={candidate.name}
        sx={{
          width: '100%',
          height: 180,
          objectFit: 'contain',
          borderBottom: '2px solid #000',
        }}
      />
      <CardContent sx={{ textAlign: 'center', padding: '10px' }}>
        <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'black' }}>
          {candidate.name}
        </Typography>
        <Typography variant="body2" sx={{ color: 'blue', mt: 1 }}>
          CASILLA #{candidate.casillaNumber}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default CandidateCard;