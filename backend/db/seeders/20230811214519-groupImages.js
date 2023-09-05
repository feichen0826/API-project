'use strict';
const { GroupImage } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await GroupImage.bulkCreate([
      {
        groupId: 1,
        url: 'https://secure.meetupstatic.com/photos/event/7/e/2/f/clean_495992303.webp',
        preview: true,
      },
      {
        groupId: 1,
        url: 'https://secure.meetupstatic.com/photos/event/3/1/6/a/clean_515412650.webp',
        preview: false,
      },
      {
        groupId: 2,
        url: 'https://secure.meetupstatic.com/photos/event/1/a/2/6/clean_499926694.webp',
        preview: true,
      },
      {
        groupId: 2,
        url: 'https://secure.meetupstatic.com/photos/event/a/e/1/f/clean_515324575.webp',
        preview: false,
      },
      {
        groupId: 2,
        url: 'https://secure.meetupstatic.com/photos/event/6/b/3/2/clean_514587442.webp',
        preview: true,
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
    options.tableName = 'GroupImages';
    return queryInterface.bulkDelete(options)
  }
};
