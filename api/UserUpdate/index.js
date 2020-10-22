const loadDB = require('../shared/mongo');

module.exports = async function (context, req) {
  const id = req.params.id;
  const eventId = parseInt(req.body.eventId);
  const subscribed = req.body.subscribed;
  context.log(id, subscribed, eventId);

  try {
    const database = await loadDB();

    if (subscribed) {
      let user = await database
        .collection('users')
        .update(
          { _id: id },
          { $push: { subscribed: { id: eventId, checkedIn: false } } }
        );
      context.res = { body: user };
    }

    if (!subscribed) {
      let user = await database
        .collection('users')
        .update({ _id: id }, { $pull: { subscribed: { id: eventId } } });
      context.res = { body: user };
    }
  } catch (error) {
    context.log(`Error code: ${error.code} message: ${error.message}`);

    context.res = {
      status: 500,
      body: { message: 'Oops something went wrong :/, please try again later' },
    };
  }
};
