'use strict';
const { Group } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await UserActivation.bulkCreate([
      {
        name: 'Tech Enthusiasts',
        about: 'A group for technology enthusiasts.',
        type: 'In person',
        private: false,
        city: 'San Francisco',
        state: 'CA',
        organizerId: 1,
      },
      {
        name: 'Fitness Club',
        about: 'Join us for group workouts and fitness challenges.',
        type: 'In person',
        private: false,
        city: 'New York',
        state: 'NY',
        organizerId: 2,
      },

    ])
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Groups';

    return queryInterface.bulkDelete(options);
  }
};
