'use strict';
const { EventImage } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await EventImage.bulkCreate([
      {
        url: 'https://secure.meetupstatic.com/photos/event/9/5/b/d/clean_490178333.webp',
        preview: true,
        eventId: 1,
      },
      {
        url: 'https://secure.meetupstatic.com/photos/event/b/c/d/8/clean_481008344.webp',
        preview: false,
        eventId: 1,
      },
      {
        url: 'https://secure.meetupstatic.com/photos/event/3/c/3/4/clean_510855412.webp',
        preview: true,
        eventId: 2,
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
    options.tableName = 'EventImages';
    return queryInterface.bulkDelete(options)
  }
};
