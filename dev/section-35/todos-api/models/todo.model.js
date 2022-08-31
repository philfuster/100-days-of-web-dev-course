const db = require("../data/database");
const mongodb = require("mongodb");

class Todo {
  constructor(text, id) {
    this.text = text;
    if(id) {
      this.id = id;
    }
  }

  static async getAllTodos() {
    let todoDocuments;
    try {
      todoDocuments = await db.getDb().collection("todos").find().toArray();
    } catch (error) {
      console.log("Error retrieving list of todos.");
      return;
    }
    return todoDocuments.map(function(todo) {
      return new Todo(todo.text, todo._id);
    });
  }

  static async findById(id) {
    let todo;
    try {
      const todoId = new mongodb.ObjectId(id);

      todo = await db.getDb().collection("todos").findOne({_id: todoId});
    } catch(error) {
      console.log('error requesting a single todo.');
      return;
    }
    return todo;
  }

  async delete() {
    if (!this.id) {
      throw new Error('Trying to delete todo without id!');
    }
    const todoId = new mongodb.ObjectId(this.id);
    let result;
    try {
      result = await db.getDb().collection("todos").deleteOne({_id: todoId});
    } catch(error) {
      console.log('error deleting a single todo');
      return;
    }
    return result;
  }

  async save() {
    const todoDocument = {
      text: this.text,
    };
    if (this.id) {
      // update a todo.
      const todoId = new mongodb.ObjectId(this.id);
      return await db
        .getDb()
        .collection("todos")
        .updateOne({ _id: todoId }, { $set: todoDocument });
    } else {
      return await db.getDb().collection("todos").insertOne(todoDocument);
    }
  }
}

module.exports = Todo;
