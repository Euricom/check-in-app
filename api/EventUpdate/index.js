const loadDB = require('../shared/mongo');

module.exports = async function (context, req) {
  const id = parseInt(req.params.id);
  const option = req.body.option;

  try {
    const database = await loadDB();

    context.log('api call triggered');

    if (option === 'updateEvent') {
      context.log('we got an update');
      const item = req.body.item;
      let event = await database
        .collection('events')
        .update(
          { eventId: id },
          {
            $set: {
              name: item.name,
              startDate: item.startDate,
              endDate: item.endDate,
            },
          }
        );
      context.res = { body: event };
    }

    if (option === 'unSubAll') {
      let users = await database.collection('users').update(
        {},
        { $pull: { subscribed: { id: id } } },
        {
          multi: true,
        }
      );
      context.res = { body: users };
    }

    if (option === 'checkOutAll') {
      let users = await database.collection('users').update(
        { 'subscribed.id': id },
        { $set: { 'subscribed.$.checkedIn': false } },
        {
          multi: true,
        }
      );
      context.res = { body: users };
    }
  } catch (error) {
    context.log(`Error code: ${error.code} message: ${error.message}`);

    context.res = {
      status: 500,
      body: { message: 'Oops something went wrong :/, please try again later' },
    };
  }
};
