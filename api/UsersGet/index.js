const loadDB = require('../shared/mongo');

module.exports = async function (context, req) {
  try {
    const database = await loadDB();
    let users = await database
      .collection('users')
      .aggregate([
        {
          $group: {
            _id: '$_id',
            firstName: { $first: '$firstName' },
            lastName: { $first: '$lastName' },
            subscribed: { $first: '$subscribed' },
          },
        },
      ])
      .toArray();

    context.res = { body: users };
  } catch (error) {
    context.log(`Error code: ${error.code} message: ${error.message}`);

    context.res = {
      status: 500,
      body: { message: 'Oops something went wrong :/, please try again later' },
    };
  }
};
