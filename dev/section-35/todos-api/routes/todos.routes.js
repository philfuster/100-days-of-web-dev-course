const express = require('express');
const todosController = require('../controllers/todos.controller');

const router = express.Router();

router.get('/', todosController.getTodos);

module.exports = router;