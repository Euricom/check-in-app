const { connect } = require('http2');
const loadDB = require('../shared/mongo');

module.exports = async function (context, req) {
  const id = req.params.id;
  const item = req.body.item;
  const data = req.body.data;

  try {
    const database = await loadDB();

    if (data.field === 'updateSubscribed') {
      context.l;
      let eventId = parseInt(item.eventId);
      let subscribed = item.subscribed;

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
    }

    if (data.field === 'updateEventCheckedIn') {
      let eventId = parseInt(item.eventId);
      let checkedIn = data.value;
      let user = await database
        .collection('users')
        .update(
          { _id: id, 'subscribed.id': eventId },
          { $set: { 'subscribed.$.checkedIn': checkedIn } }
        );
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
