import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Button,
  Paper,
  Container
} from '@mui/material';
import jsPDF from 'jspdf';

function ResultsScreen() {
  const [candidates, setCandidates] = useState([]);
  const [winner, setWinner] = useState(null);
  const imageBaseUrl = process.env.REACT_APP_IMAGE_BASE_URL;
  const bck = process.env.REACT_APP_BACKEND
;
  // Fetch candidates data from the server
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await fetch(`${bck}/candidates`);
        const data = await response.json();
        setCandidates(data);
        
        // Ordenar por votos descendentes para detectar al ganador
        const sorted = [...data].sort((a, b) => b.votes - a.votes);
        setWinner(sorted[0]); // El que más votos tiene
      } catch (error) {
        console.error("Error al obtener los candidatos:", error);
      }
    };

    fetchCandidates();
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    const marginTop = 20;
    const logo = new Image();
    logo.src = `${imageBaseUrl}/presentacionCenteno.jpeg`; // Usar template string

    // logo
    logo.onload = () => {
      const logoWidth = 50;
      const logoHeight = 50;
      const logoX = (doc.internal.pageSize.width - logoWidth) / 2;

      // Agregar el logo
      doc.addImage(logo, "PNG", logoX, marginTop, logoWidth, logoHeight);

      // Agregar el texto del encabezado
      doc.setFontSize(16);
      const headerText = "Centro de Educación Básica ";
      const headerX = (doc.internal.pageSize.width - doc.getTextWidth(headerText)) / 2;
      doc.text(headerText, headerX, marginTop + 60); // Agregar el nombre de la escuela

      doc.setFontSize(14);
      const subHeaderText = "\"PRESENTACION CENTENO\"";
      const subHeaderX = (doc.internal.pageSize.width - doc.getTextWidth(subHeaderText)) / 2;
      doc.text(subHeaderText, subHeaderX, marginTop + 70);

      doc.setFontSize(12);
      const eventText = "ELECCIONES GOBIERNO ESTUDIANTIL";
      const eventX = (doc.internal.pageSize.width - doc.getTextWidth(eventText)) / 2;
      doc.text(eventText, eventX, marginTop + 90);

      // Ahora agregar el contenido del ganador
      const imageX = (doc.internal.pageSize.width - 50) / 2;
      const img = new Image();
      img.src = imageBaseUrl + winner.image; // Ruta de la imagen del ganador

      img.onload = () => {
        doc.addImage(img, "PNG", imageX, marginTop + 100, 50, 50); // Ajustar la posición y el tamaño de la imagen

        // Agregar el nombre del ganador, justo debajo de la imagen
        doc.setFontSize(16);
        const winnerText = `Ganador: ${winner.name}`;
        const winnerTextX = (doc.internal.pageSize.width - doc.getTextWidth(winnerText)) / 2;
        doc.text(winnerText, winnerTextX, marginTop + 160);

        // Agregar el total de votos debajo del nombre del ganador
        doc.setFontSize(12);
        const votesText = `Total de Votos: ${winner.votes}`;
        const votesTextX = (doc.internal.pageSize.width - doc.getTextWidth(votesText)) / 2;
        doc.text(votesText, votesTextX, marginTop + 170);

        // Ajustar las líneas de firma
        const lineYStart = 220;
        const lineWidth = 150;
        const lineXStart = (doc.internal.pageSize.width - lineWidth) / 2;

        doc.text("______________________________________________________________________", lineXStart, lineYStart); // Línea
        doc.text("PRESIDENTE (A) JUNTA RECEPTORA DE VOTOS", (doc.internal.pageSize.width - doc.getTextWidth("PRESIDENTE (A) JUNTA RECEPTORA DE VOTOS")) / 2, lineYStart + 5); // Texto centrado

        doc.text("______________________________________________________________________", lineXStart, lineYStart + 20); // Línea
        doc.text("SECRETARIO (A) JUNTA RECEPTORA DE VOTOS", (doc.internal.pageSize.width - doc.getTextWidth("SECRETARIO (A) JUNTA RECEPTORA DE VOTOS")) / 2, lineYStart + 25); // Texto centrado

        const lineYSecondStart = lineYStart + 40;
        doc.text("______________________________________________________________________", lineXStart, lineYSecondStart); // Línea
        doc.text("PRESIDENTE (A) TRIBUNAL ELECTORAL ESTUDIANTIL", (doc.internal.pageSize.width - doc.getTextWidth("PRESIDENTE (A) TRIBUNAL ELECTORAL ESTUDIANTIL")) / 2, lineYSecondStart + 5); // Texto centrado

        doc.text("______________________________________________________________________", lineXStart, lineYSecondStart + 20); // Línea
        doc.text("SECRETARIO (A) TRIBUNAL ELECTORAL ESTUDIANTIL", (doc.internal.pageSize.width - doc.getTextWidth("SECRETARIO (A) TRIBUNAL ELECTORAL ESTUDIANTIL")) / 2, lineYSecondStart + 25); // Texto centrado

        // Guardar el PDF
        doc.save("resultado_electoral.pdf");
      };

      // Si la imagen no se carga, mostrar un error
      img.onerror = () => {
        console.error("No se pudo cargar la imagen del ganador.");
      };
    };

    // Si el logo no se carga, mostrar un error
    logo.onerror = () => {
      console.error("No se pudo cargar el logo.");
    };
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mt: 2 }}>
        <Typography variant="h4" gutterBottom align="center">
          Resultados Electorales
        </Typography>

        <Grid container spacing={2} justifyContent="center">
          {candidates.map((candidate) => (
            <Grid item key={candidate.id}>
              <Card sx={{ width: 200, boxShadow: 3, borderRadius: 2 }}>
                <CardMedia
                  component="img"
                  image={imageBaseUrl + candidate.image}
                  alt={candidate.name}
                  sx={{
                    height: 150,
                    objectFit: 'contain', // Asegúrate de que las imágenes se ajusten correctamente
                    borderBottom: 1,
                    borderColor: 'grey.300',
                    margin: '0 auto', // Centrar la imagen
                  }}
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

        {/* Mostrar el ganador */}
        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Paper sx={{ padding: 3, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              El ganador es:
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
              {winner && winner.name}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, fontStyle: 'italic' }}>
              Total de votos: {winner && winner.votes}
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ fontSize: '16px' }}
                onClick={generatePDF}
              >
                Ver Ganador
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}

export default ResultsScreen;
