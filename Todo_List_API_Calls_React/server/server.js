import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());

const dbName = "todo_list_db";

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'example',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to server', err);
        return;
    }

    console.log('Connected to server');

    db.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`, (error) => {
        if (error) {
            console.error('Error creating database', error);
        } else {
            console.log(`Database ${dbName} created or already exists`);
        }

        db.query(`USE ${dbName}`, (useDbError) => {
            if (useDbError) {
                console.error('Error switching to todo_list_db', useDbError);
            } else {
                console.log(`Switched to database "${dbName}"`);

                const createTableQuery = `
                    CREATE TABLE IF NOT EXISTS tasks (
                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                        name VARCHAR(255) NOT NULL,
                        description TEXT,
                        createdAt TEXT
                    )
                `;

                db.query(createTableQuery, (tableError) => {
                    if (tableError) {
                        console.error('Error creating tasks table', tableError);
                    } else {
                        console.log('tasks table created or already exists');
                    }
                });
            }
        });
    });
});

app.use(express.json());

app.get('/tasks', (req, res) => {
    db.query('SELECT * FROM tasks', (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

app.post('/tasks', (req, res) => {
    const newTask = req.body;
    newTask.createdAt = new Date().toLocaleString();

    db.query('INSERT INTO tasks SET ?', newTask, (error, result) => {
        if (error) throw error;
        newTask.id = result.insertId;
        res.json(newTask);
    });
});

app.put('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedTask = req.body;

    db.query('UPDATE tasks SET ? WHERE id = ?', [updatedTask, id], (error) => {
        if (error) throw error;
        res.json(updatedTask);
    });
});

app.delete('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);

    db.query('DELETE FROM tasks WHERE id = ?', id, (error) => {
        if (error) throw error;
        res.json({message: 'Task deleted successfully'});
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
