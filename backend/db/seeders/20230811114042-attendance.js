'use strict';
const { Attendance } = require('../models');
//const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Attendance.bulkCreate([
      {
        status: 'attending',
        eventId: 1,
        userId: 1,
      },
      {
        status: 'attending',
        eventId: 1,
        userId: 2,
      },
      {
        status: 'waitlist',
        eventId: 1,
        userId: 3,
      },
      {
        status: 'attending',
        eventId: 1,
        userId: 4,
      },
      {
        status: 'pending',
        eventId: 1,
        userId: 5,
      },
      {
        status: 'attending',
        eventId: 1,
        userId: 6,
      },
      {
        status: 'waitlist',
        eventId: 1,
        userId: 7,
      },
      {
        status: 'attending',
        eventId: 1,
        userId: 8,
      },

      {
        status: 'attending',
        eventId: 2,
        userId: 1,
      },
      {
        status: 'attending',
        eventId: 2,
        userId: 2,
      },
      {
        status: 'waitlist',
        eventId: 2,
        userId: 3,
      },
      {
        status: 'attending',
        eventId: 2,
        userId: 4,
      },
      {
        status: 'pending',
        eventId: 2,
        userId: 5,
      },
      {
        status: 'attending',
        eventId: 2,
        userId: 6,
      },
      {
        status: 'waitlist',
        eventId: 2,
        userId: 7,
      },
      {
        status: 'attending',
        eventId: 2,
        userId: 8,
      },

      {
        status: 'attending',
        eventId: 3,
        userId: 1,
      },
      {
        status: 'attending',
        eventId: 3,
        userId: 3,
      },
      {
        status: 'waitlist',
        eventId: 3,
        userId: 3,
      },
      {
        status: 'attending',
        eventId: 3,
        userId: 4,
      },
      {
        status: 'pending',
        eventId: 3,
        userId: 5,
      },
      {
        status: 'attending',
        eventId: 3,
        userId: 6,
      },
      {
        status: 'waitlist',
        eventId: 3,
        userId: 7,
      },
      {
        status: 'attending',
        eventId: 3,
        userId: 8,
      },
    ])
  },
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */


  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Attendances';
    return queryInterface.bulkDelete(options);
  }
};
