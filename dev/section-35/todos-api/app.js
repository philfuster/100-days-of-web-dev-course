const express = require('express');

const db = require('./data/database');
const todosRoutes = require('./routes/todos.routes');

const app = express();

app.use(express.urlencoded({ extended: false}));

app.use('/todos', todosRoutes);

app.use(function(error, req, res, next) {
  console.log(error);
});

db.initDb().then(function() {
  app.listen(3000);
}).catch(function(error) {
  next(error);
})
