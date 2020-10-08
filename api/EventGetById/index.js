const loadDB = require('../shared/mongo');

module.exports = async function (context, req) {
  const id = parseInt(req.params.id);

  try {
    const database = await loadDB();
    let item = await database
      .collection('events')
      .aggregate([
        { $match: { eventId: id } },
        { $unwind: '$users' },
        {
          $lookup: {
            from: 'users',
            localField: 'users.id',
            foreignField: '_id',
            as: 'eventUsers',
          },
        },
        { $unwind: '$eventUsers' },
        {
          $addFields: {
            users: { $mergeObjects: ['$eventUsers', '$users'] },
          },
        },
        {
          $group: {
            _id: '$id',
            name: { $first: '$name' },
            users: { $push: '$users' },
          },
        },
        { $project: { eventUser: 0 } },
      ])
      .toArray();

    context.res = { body: item };
  } catch (error) {
    context.log(`Error code: ${error.code} message: ${error.message}`);

    context.res = {
      status: 500,
      body: { message: 'Oops something went wrong :/, please try again later' },
    };
  }
};
