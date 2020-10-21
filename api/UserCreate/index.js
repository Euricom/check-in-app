const loadDB = require('../shared/mongo');

module.exports = async function (context, req) {
  try {
    const database = await loadDB();
    const newUser = req.body;

    const users = await database.collection('users').insertOne(newUser);

    context.log(`create new user`);

    context.res = { body: users.ops[0] };
  } catch (error) {
    context.log(`Error code: ${error.code} message: ${error.message}`);

    context.res = {
      status: 500,
      body: { message: 'Oops something went wrong :/, please try again later' },
    };
  }
};
