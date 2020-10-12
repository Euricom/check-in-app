const loadDB = require('../shared/mongo');

module.exports = async function (context, req) {
  const id = parseInt(req.params.id);

  try {
    const database = await loadDB();
    // let item2 = await database.collection('events').findOne({ eventId: id });
    let item = await database
      .collection('events')
      .aggregate([
        { $match: { eventId: id } },
        { $unwind: { path: '$users', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'users',
            localField: 'users.id',
            foreignField: '_id',
            as: 'eventUsers',
          },
        },
        { $unwind: { path: '$eventUsers', preserveNullAndEmptyArrays: true } },
        {
          $addFields: {
            users: { $mergeObjects: ['$eventUsers', '$users'] },
          },
        },
        { $sort: { 'users.firstName': 1, 'users.lastName': 1 } },
        {
          $group: {
            _id: '$_id',
            eventId: { $first: '$eventId' },
            name: { $first: '$name' },
            users: { $push: '$users' },
          },
        },
        { $project: { _id: 0, eventUsers: 0, 'users._id': 0 } },
      ])
      .toArray();

    context.res = { body: item[0] };
  } catch (error) {
    context.log(`Error code: ${error.code} message: ${error.message}`);

    context.res = {
      status: 500,
      body: { message: 'Oops something went wrong :/, please try again later' },
    };
  }
};
