// frontend/src/services/api.js
const apiBackend = process.env.REACT_APP_BACKEND;
// const apiBackend = 'http://localhost:3001';


export async function getCandidates() {
  const response = await fetch(`${apiBackend}/candidates`);
  if (!response.ok) {
    throw new Error('Error al obtener candidatos');
  }
  return response.json();
}

export async function voteCandidate(studentId, candidateId) {
  const response = await fetch(`${apiBackend}/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId, candidateId })
  });
  if (!response.ok) {
    // si hay error, lo arrojamos para manejarlo en el componente
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al votar');
  }
  return response.json();
}

export async function checkStudent(studentId) {
  const response = await fetch(`${apiBackend}/check-student`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId })
  });
  
  if (!response.ok) {
    // Esta es la parte que genera “Error al verificar estudiante”
    throw new Error('Error al verificar estudiante');
  }

  const data = await response.json();
  return data.hasVoted; // true/false
}


