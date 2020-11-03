const loadDB = require('../shared/mongo');

module.exports = async function (context, req) {
  const id = parseInt(req.params.id);
  const option = req.body;

  try {
    const database = await loadDB();

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
