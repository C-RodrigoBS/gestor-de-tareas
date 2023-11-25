const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
// Configuración de CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.use(bodyParser.json());
app.use(morgan('dev'));
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'taks',
});

// Conectar a la base de datos MySQL
db.connect((err) => {
    if (err) {
        console.error('Error al conectar a MySQL: ' + err.message);
    } else {
        console.log('Conexión exitosa a MySQL');
    }
});

// Rutas CRUD para las tareas
app.get('/tasks', (req, res) => {
    // Endpoint para obtener todas las tareas

    // Configuración de CORS para esta ruta
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    db.query('SELECT * FROM tasks', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/tasks', (req, res) => {
    // Configuración de CORS para esta ruta
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'POST');  
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    // Endpoint para crear una nueva tarea
    const { title, description } = req.body;
    db.query('CALL InsertTasks(?, ?)', [title, description], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Tarea creada con éxito', id: result.insertId });
    });
});

app.put('/tasks/:id', (req, res) => {
    // Endpoint para actualizar una tarea existente
    const taskId = req.params.id;
    const { title, description } = req.body;
    db.query('UPDATE tasks SET title = ?, description = ? WHERE id = ?', [title, description, taskId], (err) => {
        if (err) throw err;
        res.json({ message: 'Tarea actualizada con éxito' });
    });
});

app.delete('/tasks/:id', (req, res) => {
    // Endpoint para eliminar una tarea
    const taskId = req.params.id;
    db.query('DELETE FROM tasks WHERE id = ?', [taskId], (err) => {
        if (err) throw err;
        res.json({ message: 'Tarea eliminada con éxito' });
    });
});



// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});