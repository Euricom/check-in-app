const loadDB = require('../shared/mongo');

module.exports = async function (context) {
  try {
    const database = await loadDB();
    let events = await database.collection('events').find().toArray();
    context.res = { body: events };
  } catch (error) {
    context.log(`Error code: ${error.code} message: ${error.message}`);
    context.res = {
      status: 500,
      body: { message: 'Oops something went wrong :/, please try again later' },
    };
  }
};
