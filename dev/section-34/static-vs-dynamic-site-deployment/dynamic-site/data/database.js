const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let mongodbUrl = 'mongodb://localhost:27017';

if (process.env.MONGODB_URL) {
  console.log('changing the mongodb url to env variable value.');
  mongodbUrl = process.env.MONGODB_URL;
}

let database;

async function initDatabase() {
  const client = await MongoClient.connect(mongodbUrl);
  database = client.db('deployment');
}

function getDb() {
  if (!database) {
    throw new Error('No database connected!');
  }

  return database;
}

module.exports = {
  initDatabase: initDatabase,
  getDb: getDb,
};
