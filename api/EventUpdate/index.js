const loadDB = require('../shared/mongo');

module.exports = async function (context, req) {
  const id = parseInt(req.params.id);
  const updatedEvent = req.body || {};

  if (!id || !updatedEvent) {
    context.res = {
      status: 400,
      body: 'Fields are required',
    };

    return;
  }

  try {
    const database = await loadDB();
    let item = await database
      .collection('events')
      .findOneAndUpdate({ eventId: id }, { $set: updatedEvent });

    context.res = { body: { item: item } };
  } catch (error) {
    context.log(`Error code: ${error.code} message: ${error.message}`);

    context.res = {
      status: 500,
      body: { message: 'Oops something went wrong :/, please try again later' },
    };
  }
};
