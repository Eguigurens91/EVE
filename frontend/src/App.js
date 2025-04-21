import React, { useState, useEffect } from 'react';
import { Container, Box, Button, Typography, AppBar, Toolbar } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Componentes
import WelcomeScreen from './components/WelcomeScreen';
import StudentLogin from './components/StudentLogin';
import CandidateCard from './components/CandidateCard';
import ResultsScreen from './components/ResultsScreen';
import AdminPanel from './components/AdminPanel';
import AdminPasswordDialog from './components/AdminPaswordDialog';
import CandidateTitle from './components/CandidateTitle'; // Importa CandidateTitle


// API
import { getCandidates, voteCandidate, checkStudent } from './services/api';

function App() {
  const [currentView, setCurrentView] = useState('welcome');
  const [studentId, setStudentId] = useState(null);
  const [verified, setVerified] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [adminMode, setAdminMode] = useState(null);

  useEffect(() => {
    if (currentView === 'voting' || currentView === 'results') {
      fetchCandidates();
    }
  }, [currentView]);

  const fetchCandidates = async () => {
    try {
      const data = await getCandidates();
      setCandidates(data);
    } catch {
      toast.error('No se pudieron cargar los candidatos');
    }
  };

  const showSuccess = msg => toast.success(msg, { autoClose: 2000 });
  const showError = msg => toast.error(msg, { autoClose: 2000 });

  const handleLogin = async id => {
    try {
      const hasVoted = await checkStudent(id);
      if (hasVoted) {
        showError('Este estudiante ya votó.');
        return;
      }
      setStudentId(id);
      setVerified(true);
      showSuccess('Estudiante habilitado para votar');
    } catch {
      showError('Error al verificar el estudiante');
    }
  };

  const proceedToVoting = () => {
    setCurrentView('voting');
    setVerified(false);
  };

  const handleVote = async candidateId => {
    try {
      await voteCandidate(studentId, candidateId);
      showSuccess('¡Voto registrado con éxito!');
      setStudentId(null);
      setCurrentView('verification');
    } catch (err) {
      showError(err.message);
    }
  };

  const openAdmin = mode => {
    setAdminMode(mode);
    setShowAdminDialog(true);
  };

  const onAdminSuccess = () => {
    setShowAdminDialog(false);
    setCurrentView(adminMode === 'admin' ? 'admin' : 'results');
  };

  const goTo = view => {
    setVerified(false);
    setStudentId(null);
    setCurrentView(view);
  };

  return (
    <Container maxWidth="md">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Sistema de Votación Escolar
          </Typography>
          <Button color="inherit" onClick={() => goTo('welcome')}>Inicio</Button>
          <Button color="inherit" onClick={() => goTo('verification')}>Verificar</Button>
          {/* <Button color="inherit" onClick={() => goTo('voting')}>Votación</Button> */}
          <Button color="inherit" onClick={() => openAdmin('results')}>Resultados</Button>
          {/* <Button color="inherit" onClick={() => openAdmin('admin')}>Panel Admin</Button> */}
        </Toolbar>
      </AppBar>

      <Box sx={{ mt: 4 }}>
        {currentView === 'welcome' && <WelcomeScreen onStart={() => goTo('verification')} />}

        {currentView === 'verification' && (
          <Box>
            <StudentLogin onLogin={handleLogin} />
            {verified && (
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="h6" color="primary">
                  ¡Estás habilitado para votar!
                </Typography>
                <Button variant="contained" sx={{ mt: 1 }} onClick={proceedToVoting}>
                  Ir a votación
                </Button>
              </Box>
            )}
          </Box>
        )}

      {currentView === 'voting' && (
        <Box sx={{ textAlign: 'center' }}>
          <CandidateTitle />

          {/* Mostrar las tarjetas de los candidatos */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
            {candidates.map((candidate) => (
              <CandidateCard key={candidate.id} candidate={candidate} onVote={handleVote} />
            ))}
          </Box>
        </Box>
      )}


        {currentView === 'results' && (
          <>
            <ResultsScreen candidates={candidates} />
            <Button sx={{ mt: 2 }} onClick={() => goTo('verification')}>
              Regresar
            </Button>
          </>
        )}

        {currentView === 'admin' && (
          <>
            <AdminPanel showSuccessToast={showSuccess} showErrorToast={showError} />
            <Button sx={{ mt: 2 }} onClick={() => goTo('verification')}>
              Finalizar carga
            </Button>
          </>
        )}
      </Box>

      <AdminPasswordDialog
        open={showAdminDialog}
        onClose={() => setShowAdminDialog(false)}
        onSuccess={onAdminSuccess}
        showErrorToast={showError}
      />

      <ToastContainer />
    </Container>
  );
}

export default App;
