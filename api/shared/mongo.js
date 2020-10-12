const MongoClient = require('mongodb').MongoClient;

const auth = {
  user: process.env.user,
  password: process.env.password,
};

let db = null;

const loadDB = async () => {
  if (db) {
    return db;
  }
  const client = await MongoClient.connect(
    `mongodb://${process.env.user}:${process.env.password}@euri-checkin.mongo.cosmos.azure.com:${process.env.port}/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@euri-checkin@`,
    { auth: auth }
  );
  db = client.db('checkInApp');
  return db;
};

module.exports = loadDB;
