import React from 'react';
import { Box } from '@mui/material';
import CandidateCard from '../components/CandidateCard';  
import CandidateTitle from '../components/CandidateTitle';  

function CandidateList({ candidates, onVote }) {
  return (
    <Box>
      {/* Aquí va el título general, que solo aparecerá una vez */}
      <CandidateTitle />

      {/* Mapeo de candidatos para generar las tarjetas */}
      {candidates.map((candidate) => (
        <CandidateCard key={candidate.id} candidate={candidate} onVote={onVote} />
      ))}
    </Box>
  );
}

export default CandidateList;
