const Todo = require("../models/todo.model");

async function getAllTodos(req, res) {
  const todos = await Todo.getAllTodos();

  res.status(200).json({
    todos: todos,
  });
}

async function addTodo(req, res, next) {
  const todo = new Todo(req.body.text);
  if (!todo.text || todo.text.length < 1) {
    return res.status(400).json({
      hasError: true,
      message: "invalid todo.",
    });
  }

  let insertedId;
  try {
    const result = await todo.save();
    insertedId = result.insertedId.toString();
  } catch(error) {
    return next(error);
  }

  todo.id = insertedId;
  return res.status(200).json({
    hasError: false,
    createdTodo: todo
  });
}

async function updateTodo(req, res) {
  const todoId = req.params.id;
  const existingTodo = await Todo.findById(todoId);
  if (!existingTodo) {
    return res.status(404).json({
      hasError: true,
      message: "Todo not found..",
    });
  }
  const updatedText = req.body.text;
  if (!updatedText || updatedText.length < 1) {
    return res.status(400).json({
      hasError: true,
      message: "Invalid text.",
    });
  }

  const todo = new Todo(updatedText, todoId);

  await todo.save();
  return res.status(200).json({
    hasError: false,
    todo,
  });
}

async function deleteTodo(req, res) {
  const id = req.params.id;
  const todo = new Todo(null, id);
  const result = await todo.delete();


  if (!result.acknowledged) {
    return res.status(500).json({
      hasError: true,
      message: "could not delete todo.",
    });
  } else if (result.deletedCount < 1) {
    return res.status(404).json({
      hasError: true,
      message: "todo could not be found.",
    });
  }
  return res.status(200).json({
    hasError: false,
    message: 'todo deleted.'
  });
}

module.exports = {
  getAllTodos: getAllTodos,
  addTodo: addTodo,
  updateTodo: updateTodo,
  deleteTodo: deleteTodo,
};
