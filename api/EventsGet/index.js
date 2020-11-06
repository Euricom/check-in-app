const loadDB = require('../shared/mongo');

module.exports = async function (context, req) {
  const userId = req.params.userId;

  try {
    const database = await loadDB();
    let filtered = [];
    let filteredAndSubCount = [];

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

    let subscriptionCount = await database
      .collection('users')
      .aggregate([
        { $unwind: { path: '$subscribed', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 0,
            firstName: 0,
            lastName: 0,
            phoneNumber: 0,
            email: 0,
            role: 0,
          },
        },
        {
          $group: {
            _id: '$subscribed.id',
            totalCount: { $sum: 1 },
            subCount: {
              $sum: {
                $cond: ['$subscribed.checkedIn', 0, 1],
              },
            },
            checkedInCount: {
              $sum: {
                $cond: ['$subscribed.checkedIn', 1, 0],
              },
            },
          },
        },
      ])
      .toArray();

    eventsAndUserSubs.forEach((item) => {
      // set if user is subscribed
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

    filtered.forEach((item) => {
      // add sub count to event
      let count = subscriptionCount.find((res) => {
        return res._id === item.eventId;
      });
      filteredAndSubCount.push({
        ...item,
        totalCount: count.totalCount,
        subCount: count.subCount,
        checkedInCount: count.checkedInCount,
      });
    });

    context.res = { body: filteredAndSubCount };
  } catch (error) {
    context.log(`Error code: ${error.code} message: ${error.message}`);
    context.res = {
      status: 500,
      body: { message: 'Oops something went wrong :/, please try again later' },
    };
  }
};
