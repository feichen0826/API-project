'use strict';
const { Venue } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await Venue.bulkCreate([
    {
      groupId: 1,
      address: '123 Tech Street',
      city: 'San Francisco',
      state: 'CA',
      lat: 37.7749,
      lng: -122.4194,

    },
    {
      groupId: 2,
      address: '456 Fitness Avenue',
      city: 'New York',
      state: 'NY',
      lat: 40.7128,
      lng: -74.0060,

    },
    {
      groupId: 1,
      address: '789 Code Lane',
      city: 'Seattle',
      state: 'WA',
      lat: 47.6062,
      lng: -122.3321,

    },

])
  },
  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Venues';

    return queryInterface.bulkDelete(options);
  }
};
