const loadDB = require('../shared/mongo');

module.exports = async function (context, req) {
  const userId = req.params.userId;

  try {
    const database = await loadDB();
    let filtered = [];

    let eventsAndUserSubs = await database
      .collection('events')
      .aggregate([
        {
          $addFields: {
            userId: userId,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userEvents',
          },
        },
        {
          $addFields: {
            subscribed: '$userEvents.subscribed.id',
          },
        },
        {
          $project: {
            userEvents: 0,
            userId: 0,
          },
        },
        { $unwind: { path: '$subscribed', preserveNullAndEmptyArrays: true } },
      ])
      .toArray();

    eventsAndUserSubs.forEach((item) => {
      if (
        item.subscribed &&
        item.eventId ===
          item.subscribed.find((res) => {
            return res === item.eventId;
          })
      ) {
        filtered.push({ ...item, subscribed: true });
      } else {
        filtered.push({ ...item, subscribed: false });
      }
    });

    context.res = { body: filtered };
  } catch (error) {
    context.log(`Error code: ${error.code} message: ${error.message}`);
    context.res = {
      status: 500,
      body: { message: 'Oops something went wrong :/, please try again later' },
    };
  }
};
