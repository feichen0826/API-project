'use strict';
const { Event } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Event.bulkCreate( [
      {
        name: 'Tech Talk: AI and Machine Learning',
        description: 'Join us for an insightful tech talk about AI and machine learning advancements.',
        type: 'Online',
        capacity: 100,
        price: 0,
        startDate: new Date('2023-08-15 10:00:00'),
        endDate: new Date('2023-08-15 12:00:00'),
        venueId: null,
        groupId: 1,

      },
      {
        name: 'Outdoor Yoga Session',
        description: 'Experience the beauty of yoga in nature with our outdoor yoga session.',
        type: 'In person',
        capacity: 30,
        price: 15.99,
        startDate: new Date('2023-08-20 08:00:00'),
        endDate: new Date('2023-08-20 09:30:00'),
        venueId: 1,
        groupId: 2,
      },
      {
        name: 'Cooking Workshop: Italian Cuisine',
        description: 'Learn to cook delicious Italian dishes with our experienced chefs.',
        type: 'In person',
        capacity: 20,
        price: 25.50,
        startDate: new Date('2023-08-25 18:30:00'),
        endDate: new Date('2023-08-25 21:00:00'),
        venueId: 2,
        groupId: 1,

      },
      // Add more events...
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
    options.tableName = 'Events';

    return queryInterface.bulkDelete(options);
  }
};
