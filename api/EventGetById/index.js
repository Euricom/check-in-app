const loadDB = require('../shared/mongo');

module.exports = async function (context, req) {
  const id = parseInt(req.params.id);

  try {
    const database = await loadDB();
    let item = await database
      .collection('events')
      .aggregate([
        { $match: { eventId: id } },
        {
          $group: {
            _id: '$_id',
            eventId: { $first: '$eventId' },
            name: { $first: '$name' },
          },
        },
      ])
      .toArray();

    let users = await database
      .collection('users')
      .aggregate([
        { $unwind: { path: '$subscribed', preserveNullAndEmptyArrays: true } },
        { $match: { 'subscribed.id': id } },
        {
          $group: {
            _id: '$_id',
            firstName: { $first: '$firstName' },
            lastName: { $first: '$lastName' },
            phoneNumber: { $first: '$phoneNumber' },
            checkedIn: { $first: '$subscribed.checkedIn' },
          },
        },
      ])
      .toArray();

    context.res = { body: { item: item[0], users: users } };
  } catch (error) {
    context.log(`Error code: ${error.code} message: ${error.message}`);

    context.res = {
      status: 500,
      body: { message: 'Oops something went wrong :/, please try again later' },
    };
  }
};
