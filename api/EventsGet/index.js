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
    `mongodb://${process.env.user}:M4KEdAwZK9syMTzxU9ET1ONtImZFsSJTR5ZuzIAHUZBfEzxnDSvUjotAyNz4CdvjisyydEKaekr78brLEBmAyQ==@euri-checkin.mongo.cosmos.azure.com:${process.env.port}/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@euri-checkin@`,
    { auth: auth },
  );
  db = client.db('checkInApp');
  return db;
};
module.exports = async function (context) {
  try {
    const database = await loadDB();
    let events = await database.collection('events').find().toArray();
    context.res = { body: { items: events } };
  } catch (error) {
    context.log(`Error code: ${error.code} message: ${error.message}`);
    context.res = {
      status: 500,
      body: { message: 'Oops something went wrong :/, please try again later' },
    };
  }
};
