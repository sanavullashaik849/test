const { body, validationResult } = require('express-validator');

function validateTodoBody(req, res, next) {
    const { task, status } = req.body;
    if (!task || typeof task !== "string") {
        return res.status(400).json({ error: "Task is required and must be a string" });
    }
    if (status !== undefined && typeof status !== "boolean") {
        return res.status(400).json({ error: "Status must be a boolean" });
    }
    next();
}

function validateTodoId(req, res, next) {
    const { id } = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID parameter. ID must be a number" });
    }
    next();
}

const validateUpdateBody = [
    body('task')
        .optional()
        .isString().withMessage('Task must be a string')
        .notEmpty().withMessage('Task cannot be empty'),

    body('status')
        .optional()
        .isBoolean().withMessage('Status must be a boolean')
        .toBoolean(), // Converts "true"/"false" strings to boolean

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
];


module.exports = { validateTodoBody, validateTodoId, validateUpdateBody };
