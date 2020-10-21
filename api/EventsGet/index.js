const loadDB = require('../shared/mongo');

module.exports = async function (context, req) {
  const userId = req.params.userId;

  try {
    const database = await loadDB();
    let result = [];
    let filtered = [];

    let subscriptions = await database
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

        { $unwind: { path: '$userEvents', preserveNullAndEmptyArrays: true } },

        {
          $addFields: {
            subscribed: '$userEvents.subscribed.id',
            // isSubbed: {
            //   $cond: ['$userEvents.subscribed.id === $eventId', true, false],
            // },
          },
        },

        {
          $project: {
            userEvents: 0,
            userId: 0,
            // isSubbed: { $cond: ['subscribed === eventId', true, false] },
          },
        },

        { $unwind: { path: '$subscribed', preserveNullAndEmptyArrays: true } },
      ])
      .toArray();

    let events = await database.collection('events').find().toArray();

    // context.log(subscriptions[0].subscribed);

    // if (subscriptions[0].subscribed.lenght === 0 || null) {
    //   this.result = events;
    // }

    subscriptions.forEach((item) => {
      if (item.eventId === item.subscribed) {
        filtered.push({ ...item, subscribed: true });
      }
    });

    context.log(filtered);

    // if (!subscriptions[0].id) {
    //   result = events;
    // } else {
    //   subscriptions.forEach((item) => {
    //     events.forEach((res) => {
    //       if (res.eventId === item.id) {
    //         result.push({ ...res, checkedIn: item.checkedIn });
    //       } else result.push({ ...res });
    //     });
    //   });
    // }

    // subscriptions.forEach((item) => {
    //   context.log(item);
    //   events.forEach((res) => {
    //     context.log(res.eventId, item.id, res.eventId === item.id);
    //     if (res.eventId === item.id) {
    //       result.push({ ...res, subscribed: true });
    //     }
    //   });
    // });

    context.res = { body: subscriptions };
  } catch (error) {
    context.log(`Error code: ${error.code} message: ${error.message}`);
    context.res = {
      status: 500,
      body: { message: 'Oops something went wrong :/, please try again later' },
    };
  }
};
