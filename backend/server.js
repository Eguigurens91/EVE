// backend/server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use(express.json()); 
app.use(cors());
// app.use(bodyParser.json());

// 1) Montar la carpeta images como estática
// Esto hará que las imágenes sean accesibles vía http://TU_HOST:3001/images/archivo.jpg
app.use('/images', express.static(path.join(__dirname, 'data', 'images')));

// Ruta absoluta al archivo JSON donde guardaremos los datos
const DB_PATH = path.join(__dirname, 'data', 'db.json');



/**
 * Estructura esperada en db.json:
 * {
 *   "candidates": [
 *       { "id": 1, "name": "Alumno A", "votes": 0, "image": "url_o_ruta_de_imagen" },
 *       { "id": 2, "name": "Alumno B", "votes": 0, "image": "url_o_ruta_de_imagen" }
 *   ],
 *   "studentsWhoVoted": []
 * }
 *
 */

// Función para leer el JSON
function readDB() {
  const data = fs.readFileSync(DB_PATH, 'utf8');
  return JSON.parse(data);
}

// Función para escribir en el JSON
function writeDB(newData) {
  fs.writeFileSync(DB_PATH, JSON.stringify(newData, null, 2), 'utf8');
}

// Ruta para obtener la lista de candidatos
app.get('/candidates', (req, res) => {
  try {
    const db = readDB();
    res.json(db.candidates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al leer los candidatos' });
  }
});

// Ruta para votar
app.post('/vote', (req, res) => {
  const { studentId, candidateId } = req.body;
  try {
    let db = readDB();
    // Revisar si el estudiante ya votó
    if (db.studentsWhoVoted.includes(studentId)) {
      return res.status(400).json({ error: 'Este estudiante ya ha votado' });
    }

    // Buscar el candidato y aumentar el voto
    const candidateIndex = db.candidates.findIndex(c => c.id === candidateId);
    if (candidateIndex === -1) {
      return res.status(404).json({ error: 'Candidato no encontrado' });
    }
    db.candidates[candidateIndex].votes += 1;

    // Registrar que este estudiante ya votó
    db.studentsWhoVoted.push(studentId);

    // Guardar en db.json
    writeDB(db);

    res.json({
      success: true,
      message: `Voto registrado para el candidato con id ${candidateId}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar el voto' });
  }
});
app.post('/check-student', (req, res) => {
  const { studentId } = req.body;
  try {
    console.log("CHECK-STUDENT => studentId:", studentId); // Para debug

    const db = readDB(); // tu función que lee el JSON
    const hasVoted = db.studentsWhoVoted.includes(studentId);

    // Si todo va bien, respondemos status 200 con un JSON
    return res.json({ hasVoted });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al verificar estudiante' });
  }
});



// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});