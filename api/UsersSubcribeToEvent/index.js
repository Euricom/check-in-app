const { connect } = require('http2');
const loadDB = require('../shared/mongo');

module.exports = async function (context, req) {
  const eventId = req.params.id;
  const userIds = req.body;

  console.log(userIds, eventId);

  try {
    const database = await loadDB();

    let subscribedUsers = await database
      .collection('users')
      .update(
        { _id: { $in: userIds } },
        {
          $addToSet: {
            subscribed: { id: parseInt(eventId), checkedIn: false },
          },
        },
        { multi: true }
      );
    context.res = { body: subscribedUsers };
  } catch (error) {
    context.log(`Error code: ${error.code} message: ${error.message}`);

    context.res = {
      status: 500,
      body: { message: 'Oops something went wrong :/, please try again later' },
    };
  }
};
