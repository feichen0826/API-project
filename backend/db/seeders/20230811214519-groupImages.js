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
        url: 'https://example.com/image1.jpg',
        preview: true,
      },
      {
        groupId: 1,
        url: 'https://example.com/image2.jpg',
        preview: false,
      },
      {
        groupId: 2,
        url: 'https://example.com/image3.jpg',
        preview: true,
      },
      {
        groupId: 2,
        url: 'https://example.com/image4.jpg',
        preview: false,
      },
      {
        groupId: 2,
        url: 'https://example.com/image5.jpg',
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
