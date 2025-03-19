const express = require("express");
const app = express();
const morgan = require("morgan");
require('dotenv').config();
const { validateTodoBody, validateTodoId, validateUpdateBody } = require("./middlewares/validationMiddleware")
const { requestLogger, responseLogger } = require('./middlewares/loggingMiddleware');
app.use(express.json());
app.use(morgan('dev'))
const port = process.env.PORT || 3000;

app.use(requestLogger);

const todos = [
    { "id": 1, "task": "Complete backend API for user authentication", "status": false },
    { "id": 2, "task": "Optimize database queries for faster response time", "status": true },
    { "id": 3, "task": "Implement JWT authentication for secure login", "status": false },
    { "id": 4, "task": "Write unit tests for user service functions", "status": false },
    { "id": 5, "task": "Refactor code to improve maintainability", "status": true }
];

// GET all todos
app.get('/todos', (req, res, next) => {
    try {
        if (!todos || todos.length === 0) {
            throw new Error("No todos found");
        }
        return res.status(200).json({ success: true, data: todos });
    } catch (error) {
        next(error);
    }
});

//GET a todo using ID and validate on ID
app.get('/todo/:id', validateTodoId, (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const todo = todos.find(t => t.id === id);
        if (!todo) {
            return res.status(404).json({ success: false, message: "Todo not found" });
        }
        res.status(200).json({ success: true, data: todo });
    } catch (error) {
        next(error);
    }
});

// POST a new todo (with validation)
app.post('/todos', validateUpdateBody, (req, res, next) => {
    try {
        const { task, status } = req.body;
        const newTodo = { id: todos.length + 1, task, status: status || false };
        todos.push(newTodo);
       return res.status(201).json({ success: true, data: newTodo });
    } catch (error) {
        next(error);
    }
});
app.put('/todo/:id', validateTodoId, validateTodoBody, (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const index = todos.findIndex(t => t.id === id);

        if (index === -1) {
            return res.status(404).json({ success: false, message: "Todo not found" });
        }

        let { task, status } = req.body;

        // Stick to old values if not provided
        todos[index] = { 
            ...todos[index], 
            task: task !== undefined ? task : todos[index].task, 
            status: status !== undefined ? status : todos[index].status 
        };

        res.json({ success: true, message: "Todo updated successfully", todo: todos[index] });
    } 
    catch (error) {
        next(error);
    }
});

app.delete('/todo/:id', validateTodoId, (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const index = todos.findIndex(t => t.id === id);

        if (index === -1) {
            return res.status(404).json({ success: false, message: "Todo not found" });
        }

        todos.splice(index, 1);

        return res.status(200).json({ success: true, message: "Todo deleted successfully" });
    } catch (error) {
        next(error);
    }
});

app.use(responseLogger);

// 404 Route Handler
app.use((req, res, next) => {
    return res.status(404).json({ success: false, message: "Route not found" });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    return res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

app.use((req, res, next) => {
    return res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
