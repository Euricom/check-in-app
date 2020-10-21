const loadDB = require('../shared/mongo');

module.exports = async function (context, req) {
  const id = req.params.id;

  try {
    const database = await loadDB();
    let user = await database.collection('users').findOne({ _id: id });

    context.res = { body: user };
  } catch (error) {
    context.log(`Error code: ${error.code} message: ${error.message}`);

    context.res = {
      status: 500,
      body: { message: 'Oops something went wrong :/, please try again later' },
    };
  }
};
