const loadDB = require('../shared/mongo');
// const auth = require('../shared/auth');

module.exports = async function (context, req) {
  const members = req.params.body;
  // const members = [
  //   {
  //     _id: '3ee83cb0-0b0d-4d50-a52d-e72969fdd173',
  //     firstName: 'Stijn',
  //     lastName: 'Menu',
  //     email: 'stijn.menu@euri.com',
  //     phoneNumber: '+32 496 12 29 21',
  //     subscribed: [],
  //     role: '',
  //   },
  //   {
  //     _id: '3d8adaf0-bc2e-4dbd-91c3-4ffa1d6f4a4a',
  //     firstName: 'Wim',
  //     lastName: 'Van Hoye',
  //     email: 'wim.vanhoye@euri.com',
  //     phoneNumber: '+32 495 29 20 10',
  //     subscribed: [],
  //     role: '',
  //   },
  //   {
  //     _id: '96f9d38d-0695-460d-a832-c1d289f4521a',
  //     firstName: 'Sonja',
  //     lastName: 'Buts',
  //     email: 'sonja.buts@euri.com',
  //     phoneNumber: '+32 478 37 71 59',
  //     subscribed: [],
  //     role: '',
  //   },
  //   {
  //     _id: '381f36f0-08ea-44d9-b4d6-f1eed84f48da',
  //     firstName: 'Luk',
  //     lastName: 'Vanderstraeten',
  //     email: 'luk.vanderstraeten@euri.com',
  //     phoneNumber: '+32 473 10 20 33',
  //     subscribed: [],
  //     role: '',
  //   },
  //   {
  //     _id: 'b3859788-62e8-478c-81cc-c1678c477d8a',
  //     firstName: 'Kim',
  //     lastName: 'Dufraing',
  //     email: 'kim.dufraing@euri.com',
  //     phoneNumber: '+32 472 75 29 06',
  //     subscribed: [],
  //     role: '',
  //   },
  //   {
  //     _id: '3e77d9c2-7b25-4407-b02d-e3eca6779319',
  //     firstName: 'Mayte',
  //     lastName: 'Van de Velde',
  //     email: 'mayte.vandevelde@euri.com',
  //     phoneNumber: '+32 471 34 61 55',
  //     subscribed: [],
  //     role: '',
  //   },
  //   {
  //     _id: 'a19c5290-d59a-467d-925e-fe0a7c7a8871',
  //     firstName: 'Gilles',
  //     lastName: 'Plaetinck',
  //     email: 'gilles.plaetinck@euri.com',
  //     phoneNumber: '+32 474 37 39 98',
  //     subscribed: [],
  //     role: '',
  //   },
  //   {
  //     _id: 'c9945e77-14b5-4c28-8f6c-1bbf1c810728',
  //     firstName: 'Ellen',
  //     lastName: 'De Baeck',
  //     email: 'ellen.debaeck@euri.com',
  //     phoneNumber: '+32 498 31 23 70',
  //     subscribed: [],
  //     role: '',
  //   },
  //   {
  //     _id: 'cdb23f58-65db-4b6b-b132-cf2d13d08e76',
  //     firstName: 'Adil',
  //     lastName: 'Khan',
  //     email: 'adil.khan@euri.com',
  //     phoneNumber: '+32489474220',
  //     subscribed: [],
  //     role: 'Admin',
  //   },
  // ];

  const memberIds = members.map((item) => item._id);

  try {
    const database = await loadDB();

    let usersToRemove = await database
      .collection('users')
      .find({
        _id: {
          $nin: memberIds,
        },
      })
      .toArray();

    let existingUsers = await database
      .collection('users')
      .find({
        _id: {
          $in: memberIds,
        },
      })
      .toArray();

    const removeIds = usersToRemove.map((item) => item._id);
    const existingIds = existingUsers.map((item) => item._id);
    const usersToAdd = members.filter(
      (item) => !existingIds.includes(item._id)
    );

    if (usersToAdd.length) {
      await database.collection('users').insertMany(usersToAdd);
    }

    if (usersToRemove.length) {
      await database
        .collection('users')
        .deleteMany({ _id: { $in: removeIds } });
    }

    context.res = {
      body: {
        added: usersToRemove,
        removed: removeIds,
      },
    };
  } catch (error) {
    context.log(`Error code: ${error.code} message: ${error.message}`);

    context.res = {
      status: 500,
      body: { message: 'Oops something went wrong :/, please try again later' },
    };
  }
};
