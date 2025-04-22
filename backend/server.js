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
  const data = fs.readFileSync(DB_PATH, 'utf8');
  return JSON.parse(data);
}

// Función para escribir en el JSON
function writeDB(newData) {
  fs.writeFileSync(DB_PATH, JSON.stringify(newData, null, 2), 'utf8');
}

// Función para leer el archivo JSON de estudiantes
function readStudents() {
  const data = fs.readFileSync(STUDENTS_JSON_PATH, 'utf8');
  return JSON.parse(data);
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

// Ruta para subir el CSV de estudiantes habilitados
app.post('/upload-students', upload.single('studentsCSV'), async (req, res) => {
  try {
    // Este método ya no es necesario porque ahora estamos usando el JSON
    res.status(200).json({ message: 'Ahora estamos utilizando el archivo JSON para los estudiantes.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hubo un error al cargar el CSV.' });
  }
});

// Ruta para verificar si el estudiante puede votar
app.post('/check-student', (req, res) => {
  const { studentId } = req.body;
  const students = readStudents(); // Lee los estudiantes desde el archivo JSON

  const student = students.find((row) => String(row.id).trim() === String(studentId).trim());

  if (student) {
    const db = readDB(); // Leemos los datos de la base de datos
    const hasVoted = db.studentsWhoVoted.includes(studentId);

    res.json({
      isValid: !hasVoted,
      name: student.name,
      studentId,
      hasVoted
    });
  } else {
    res.json({
      isValid: false,
      name: 'Estudiante no encontrado',
      studentId
    });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
