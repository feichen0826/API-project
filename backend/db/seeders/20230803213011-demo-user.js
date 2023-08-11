'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        firstName: 'fakeFirstName1',
        lastName: 'fakeLastName1',
        hashedPassword: bcrypt.hashSync('password1')
      },
      {
        email: 'user2@user.io',
        username: 'FakeUser2',
        firstName: 'fakeFirstName2',
        lastName: 'fakeLastName2',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'user3@user.io',
        username: 'FakeUser3',
        firstName: 'fakeFirstName3',
        lastName: 'fakeLastName3',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        email: 'user4@user.io',
        username: 'FakeUser4',
        firstName: 'fakeFirstName4',
        lastName: 'fakeLastName4',
        hashedPassword: bcrypt.hashSync('password4'),
      },
      {
        email: 'user5@user.io',
        username: 'FakeUser5',
        firstName: 'fakeFirstName5',
        lastName: 'fakeLastName5',
        hashedPassword: bcrypt.hashSync('password5'),
      },
      {
        email: 'user6@user.io',
        username: 'FakeUser6',
        firstName: 'fakeFirstName6',
        lastName: 'fakeLastName6',
        hashedPassword: bcrypt.hashSync('password6'),
      },
      {
        email: 'user7@user.io',
        username: 'FakeUser7',
        firstName: 'fakeFirstName7',
        lastName: 'fakeLastName7',
        hashedPassword: bcrypt.hashSync('password7'),
      },
      {
        email: 'user8@user.io',
        username: 'FakeUser8',
        firstName: 'fakeFirstName8',
        lastName: 'fakeLastName8',
        hashedPassword: bcrypt.hashSync('password8'),
      },

    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
    }, {});
  }
};
