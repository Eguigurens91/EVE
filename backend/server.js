const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer'); // Para manejar el upload de archivos
const app = express();
app.use(express.json());
app.use(cors());

// 1) Montar la carpeta images como estática
// Esto hará que las imágenes sean accesibles vía http://TU_HOST:3001/images/archivo.jpg
app.use('/images', express.static(path.join(__dirname, 'data', 'images')));

// Configuración de multer para almacenar el archivo CSV
const upload = multer({ dest: 'uploads/' }); // Carpeta donde se guardarán los archivos CSV

// Ruta absoluta al archivo JSON donde guardamos los datos de la aplicación
const DB_PATH = path.join(__dirname, 'data', 'db.json');
const STUDENTS_JSON_PATH = path.join(__dirname, 'data', 'students.json'); // Ruta al archivo de estudiantes en JSON

// Función para leer el JSON
function readDB() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer el archivo DB:', error);
    throw new Error('Error al leer la base de datos');
  }
}

// Función para escribir en el JSON
function writeDB(newData) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(newData, null, 2), 'utf8');
  } catch (error) {
    console.error('Error al escribir en el archivo DB:', error);
    throw new Error('Error al guardar los datos en la base de datos');
  }
}

// Función para leer el archivo JSON de estudiantes
function readStudents() {
  try {
    const data = fs.readFileSync(STUDENTS_JSON_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer los estudiantes:', error);
    throw new Error('Error al leer el archivo de estudiantes');
  }
}

// Ruta para obtener la lista de candidatos
app.get('/candidates', (req, res) => {
  try {
    const db = readDB();
    res.json(db.candidates);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer los candidatos' });
  }
});

// Ruta para votar
// Ruta para votar
app.post('/vote', (req, res) => {
  const { studentId, candidateId } = req.body;
  try {
    let db = readDB();

    // Revisar si el estudiante ya votó
    if (db.studentsWhoVoted.includes(studentId)) {
      console.log("Students who have already voted:", db.studentsWhoVoted);
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


// Ruta para verificar si el estudiante puede votar
app.post('/check-student', (req, res) => {
  const { studentId } = req.body;
  try {
    const students = readStudents();
    const student = students.find((row) => String(row.id).trim() === String(studentId).trim());

    if (student) {
      const db = readDB();
      const hasVoted = db.studentsWhoVoted.includes(studentId);

      return res.json({
        isValid: !hasVoted,
        name: student.name,
        studentId,
        hasVoted
      });
    } else {
      return res.status(404).json({
        isValid: false,
        name: 'Estudiante no encontrado',
        studentId
      });
    }
  } catch (error) {
    console.error('Error al verificar el estudiante:', error);
    res.status(500).json({ error: 'Error al verificar el estudiante' });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
