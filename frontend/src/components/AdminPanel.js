// src/App.js
import React, { useState, useEffect } from 'react';
import { Container, Box, Button, Typography, AppBar, Toolbar } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Componentes
import WelcomeScreen from '../components/WelcomeScreen';
import StudentLogin from '../components/StudentLogin';
import CandidateCard from '../components/CandidateCard';
import ResultsScreen from '../components/ResultsScreen';
import AdminPanel from '../components/AdminPanel';
import AdminPasswordDialog from '../components/AdminPaswordDialog'

// Llamadas API
import { getCandidates, voteCandidate, checkStudent } from '../../src/services/api'

function App() {
  // Vistas: 'welcome', 'verification', 'voting', 'results', 'admin'
  const [currentView, setCurrentView] = useState('welcome');
  const [studentId, setStudentId] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  // Para el diálogo de contraseña y distinguir su propósito
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [adminMode, setAdminMode] = useState(null);

  useEffect(() => {
    // Cargamos candidatos solo si vamos a votar o ver resultados
    if (currentView === 'voting' || currentView === 'results') {
      fetchCandidates();
    }
  }, [currentView]);

  const fetchCandidates = async () => {
    try {
      const data = await getCandidates();
      setCandidates(data);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar los candidatos');
      toast.error('No se pudieron cargar los candidatos');
    }
  };

  // Toast helpers
  const showSuccessToast = (msg) => {
    toast.success(msg, {
      position: 'top-right',
      autoClose: 3000,
      theme: 'colored'
    });
  };

  const showErrorToast = (msg) => {
    toast.error(msg, {
      position: 'top-right',
      autoClose: 3000,
      theme: 'colored'
    });
  };

  // Lógica para verificación de estudiante
  const handleLogin = async (id) => {
    try {
      const hasVoted = await checkStudent(id);
      if (hasVoted) {
        setStudentId(null);
        showErrorToast('Este estudiante ya votó.');
        return;
      }
      setStudentId(id);
      setError('');
      setMessage('');
      showSuccessToast('Estudiante verificado. Puede votar.');
      // Pasar a vista de votación
      setCurrentView('voting');
    } catch (err) {
      console.error(err);
      showErrorToast('Error al verificar el estudiante');
    }
  };

  // Lógica para votar
  const handleVote = async (candidateId) => {
    if (!studentId) {
      showErrorToast('Debes iniciar sesión antes de votar');
      return;
    }
    setError('');
    setMessage('');
    try {
      await voteCandidate(studentId, candidateId);
      showSuccessToast('¡Voto registrado con éxito!');
      fetchCandidates();
      setStudentId(null);
      // Después de votar, volvemos a la verificación para el siguiente alumno
      setCurrentView('verification');
    } catch (err) {
      setError(err.message);
      showErrorToast(err.message);
    }
  };

  // Navegación manual (Header)
  const goToWelcome = () => setCurrentView('welcome');
  const goToVerification = () => {
    setStudentId(null);
    setCurrentView('verification');
  };
  const goToVoting = () => setCurrentView('voting');

  // Para acceder a resultados o panel admin, abrimos el diálogo de contraseña
  const openAdminDialog = (mode) => {
    setAdminMode(mode);
    setShowAdminDialog(true);
  };

  const handleDialogSuccess = () => {
    setShowAdminDialog(false);
    if (adminMode === 'admin') {
      setCurrentView('admin');
    } else if (adminMode === 'results') {
      setCurrentView('results');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 2 }}>
      {/* Encabezado persistente */}

      {/* Contenido principal según la vista */}
      <Box sx={{ mt: 4 }}>
        {currentView === 'welcome' && <WelcomeScreen onStart={goToVerification} />}
        {currentView === 'verification' && <StudentLogin onLogin={handleLogin} />}
        {currentView === 'voting' && (
          studentId ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', mt: 2 }}>
              {candidates.map((candidate) => (
                <CandidateCard key={candidate.id} candidate={candidate} onVote={handleVote} />
              ))}
            </Box>
          ) : (
            <StudentLogin onLogin={handleLogin} />
          )
        )}
        {currentView === 'results' && (
          <>
            <ResultsScreen candidates={candidates} />
            <Button variant="contained" onClick={goToVerification} sx={{ mt: 2 }}>
              Regresar
            </Button>
          </>
        )}
        {/* {currentView === 'admin' && (
          <>
            <AdminPanel showSuccessToast={showSuccessToast} showErrorToast={showErrorToast} />
            <Button variant="contained" onClick={goToVerification} sx={{ mt: 2 }}>
              Finalizar carga y volver a verificación
            </Button>
          </>
        )} */}
        {error && <Typography variant="body1" color="error">{error}</Typography>}
        {message && <Typography variant="body1" sx={{ color: 'green' }}>{message}</Typography>}
      </Box>

      {/* Diálogo para ingresar contraseña para admin/results */}
      <AdminPasswordDialog
        open={showAdminDialog}
        onClose={() => setShowAdminDialog(false)}
        onSuccess={handleDialogSuccess}
        showErrorToast={showErrorToast}
      />

      {/* ToastContainer se renderiza una sola vez aquí */}
      <ToastContainer />
    </Container>
  );
}

export default App;
