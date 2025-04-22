import jsPDF from "jspdf";
import { useState } from "react";

// Suponiendo que tienes un estado con los resultados
const ResultPage = ({ winner, totalVotes, winnerImage }) => {
  const [showPDF, setShowPDF] = useState(false);
  const imageBaseUrl = process.env.REACT_APP_IMAGE_BASE_URL;

  // Función para generar el PDF
  const generatePDF = () => {
    const doc = new jsPDF();
  
    // Cargar la imagen del ganador
    const img = new Image();
    img.src = imageBaseUrl + winner.image; // Ruta de la imagen del ganador
  
    // Asegurarse de que la imagen esté completamente cargada antes de agregarla al PDF
    img.onload = () => {
      doc.addImage(img, "JPEG", 15, 40, 50, 50); // Ajusta la posición y el tamaño de la imagen
  
      // Agregar el nombre del ganador
      doc.setFontSize(16);
      doc.text(`Ganador: ${winner.name}`, 80, 60);
  
      // Agregar el total de votos
      doc.setFontSize(14);
      doc.text(`Total de Votos: ${winner.votes}`, 80, 80);
  
      // Ajustar las líneas de firma para que no se monten
      doc.setFontSize(12);
      doc.text("__________________________", 15, 130);
      doc.text("PRESIDENTE (A) JUNTA RECEPTORA DE VOTOS", 15, 135);
      doc.text("__________________________", 100, 130);
      doc.text("SECRETARIO (A) JUNTA RECEPTORA DE VOTOS", 100, 135);
  
      doc.text("__________________________", 15, 160);
      doc.text("PRESIDENTE (A) TRIBUNAL ELECTORAL ESTUDIANTIL", 15, 165);
      doc.text("__________________________", 100, 160);
      doc.text("SECRETARIO (A) TRIBUNAL ELECTORAL ESTUDIANTIL", 100, 165);
  
      // Guardar el PDF
      doc.save("resultado_electoral.pdf");
    };
  };

  return (
    <div>
      <button onClick={() => setShowPDF(true)}>Ver Ganador</button>

      {showPDF && (
        <div>
          <h2>Resultado Electoral</h2>
          <button onClick={generatePDF}>Generar PDF</button>
        </div>
      )}
    </div>
  );
};

export default ResultPage;
