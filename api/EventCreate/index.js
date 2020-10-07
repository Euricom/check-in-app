const loadDB = require('../shared/mongo');

module.exports = async function (context, req) {
  try {
    const database = await loadDB();
    const newEvent = { ...req.body };

    const sequenceDocument = await database
      .collection('counters')
      .findOneAndUpdate(
        { _id: 'eventId' },
        { $inc: { sequence_value: 1 } },
        { new: true }
      );

    const events = await database.collection('events').insertOne({
      ...newEvent,
      eventId: sequenceDocument.value.sequence_value,
    });

    context.res = { body: events.ops[0] };
  } catch (error) {
    context.log(`Error code: ${error.code} message: ${error.message}`);

    context.res = {
      status: 500,
      body: { message: 'Oops something went wrong :/, please try again later' },
    };
  }
};
