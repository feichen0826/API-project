'use strict';
const { Membership } = require('../models');


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Membership.bulkCreate([
      // Memberships for the first group
  {
    userId: 1,
    groupId: 1,
    status: 'co-host',
  },
  {
    userId: 2,
    groupId: 1,
    status: 'member',
  },
  {
    userId: 3,
    groupId: 1,
    status: 'pending',
  },
  // Memberships for the second group
  {
    userId: 1,
    groupId: 2,
    status: 'member',
  },
  {
    userId: 4,
    groupId: 2,
    status: 'co-host',
  },
  // Additional memberships
  {
    userId: 5,
    groupId: 1,
    status: 'member',
  },
  {
    userId: 6,
    groupId: 2,
    status: 'pending',
  },
  {
    userId: 7,
    groupId: 2,
    status: 'member',
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
  ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Memberships';
    return queryInterface.bulkDelete(options)
  }
};
