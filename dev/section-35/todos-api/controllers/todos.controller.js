const Todo = require("../models/todo.model");

async function getTodos(req, res) {
  const todos = await Todo.findAll();

  res.status(200).json({
    todos: todos,
  });
}

async function saveTodo(req, res) {
  const todo = new Todo(req.body.title, req.body.description);
  if (!todo.title || !todo.description) {
    return res.json({
      hasError: true,
      message: 'invalid todo.'
    });
  }

  const result = await todo.save();

  return res.status(200).json({
    hasError: false,
    id: result.insertedId
  })
}

module.exports = {
  getTodos: getTodos,
  saveTodo: saveTodo
};
