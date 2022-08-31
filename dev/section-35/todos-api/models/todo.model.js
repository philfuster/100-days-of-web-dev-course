const db = require("../data/database");

class Todo {
  constructor(title, description) {
    this.title = title;
    this.description = description;
  }

  static async findAll() {
    let todos;
    try {
      todos = await db.getDb().collection("todos").find().toArray();
    } catch (error) {
      console.log("Error retrieving list of todos.");
      return;
    }
    return todos;
  }

  async save() {
    if (this.id) {
      // update a todo.
    } else {
      const todoDocument = {
        title: this.title,
        description: this.description,
      };
      return await db.getDb().collection("todos").insertOne(todoDocument);
    }
  }
}

module.exports = Todo;
