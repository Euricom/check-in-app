const loadDB = require('../shared/mongo');

module.exports = async function (context, req) {
  const id = parseInt(req.params.id);

  try {
    const database = await loadDB();

    await database.collection('events').deleteOne({ eventId: id });

    await database
      .collection('users')
      .update({}, { $pull: { subscribed: { id: id } } }, { multi: true });

    context.res = {
      status: 204,
    };
  } catch (error) {
    context.log(`Error code: ${error.code} message: ${error.message}`);

    context.res = {
      status: 500,
      body: { message: 'Oops something went wrong :/, please try again later' },
    };
  }
};
