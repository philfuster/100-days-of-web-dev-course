const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let database;

async function connectToDatabase() {
  const client = await MongoClient.connect("mongodb://localhost:27017");
  database = client.db('blog');
}

function getDb() {
  if (database == null) {
    throw { message: 'You must connect first!'};
  }
  return database;
}

module.exports = {
  connectToDatabase,
  getDb,
}