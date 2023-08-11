const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();
const {Group,GroupImage,Venue, Event,Attendance,EventImage ,sequelize} = require('../../db/models')

const validateEvent = [
  check('venueId')
    .exists({ checkFalsy: true })
    .withMessage('Venue does not exist'), // Customize error message
  check('name')
    .isLength({ min: 5 })
    .withMessage('Name must be at least 5 characters'), // Customize error message
  check('type')
    .isIn(['Online', 'In person'])
    .withMessage('Type must be Online or In person'), // Customize error message
  check('capacity')
    .isInt()
    .withMessage('Capacity must be an integer'), // Customize error message
  check('price')
    .isFloat({ min: 0 })
    .withMessage('Price is invalid'), // Customize error message
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required'), // Customize error message
  check('startDate')
    .custom((value, { req }) => {
      const currentDate = new Date();
      const startDate = new Date(value);
      if (startDate <= currentDate) {
        throw new Error('Start date must be in the future'); // Customize error message
      }
      return true;
    }),
  check('endDate')
    .custom((value, { req }) => {
      const startDate = new Date(req.body.startDate);
      const endDate = new Date(value);
      if (endDate <= startDate) {
        throw new Error('End date is less than start date'); // Customize error message
      }
      return true;
    }),
  handleValidationErrors
];


router.get('/',async (req, res) => {

      const events = await Event.findAll({
        include: [
          {
            model: Group,
            attributes:['id', 'name', 'city', 'state']

          },
          {
            model: Venue,
            attributes:['id', 'city', 'state'],
          },
          {
            model: User,

            attributes: [],
            through: {
              model: Attendance,
              attributes: [],
            },
          },
        ],
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'groupId', 'venueId'],
          include: [
            [
              sequelize.fn('COUNT', sequelize.col('Users.id')),
              'numAttending'
            ],
          ],
        },
        group: ['Event.id', 'Group.id', 'Venue.id'],
      });

      res.json(events);

  });

  //Add an Image to a Event based on the Event's id
  router.post('/:eventId/images', async (req, res) => {
    const eventId = req.params.eventId;
    const { url, preview } = req.body;

    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event couldn't be found" });
    }
      const newImage = await EventImage.create({
        eventId: eventId,
        url: url,
        preview: preview,
      });

      return res.status(200).json({
        id: newImage.id,
        url: newImage.url,
        preview: newImage.preview,
      });

  });

//Edit an Event specified by its id
  router.put('/:eventId', validateEvent, async (req, res) => {
    const eventId = req.params.eventId;
    const eventData = req.body;
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event couldn't be found" });
    }
      await event.update(eventData);

      const updatedEvent = await Event.findByPk(eventId,{
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          }
        });

      return res.status(200).json(updatedEvent);

  });



//Get details of an Event specified by its id
  router.get('/:eventId', async (req, res) => {
  const event = await Event.findByPk(req.params.eventId, {
        include: [
          {
            model: Group,
            attributes: ['id', 'name', 'private', 'city', 'state'],
          },
          {
            model: Venue,
            attributes: ['id', 'address', 'city', 'state', 'lat', 'lng'],
          },
          {
            model: EventImage,
            attributes: ['id', 'url', 'preview'],
          },
        ],
      });

      if (!event) {
        return res.json({ message: "Event couldn't be found" });
      }

      const num = await event.countUsers();

      const eventDetails = {
        id: event.id,
        groupId: event.groupId,
        venueId: event.venueId,
        name: event.name,
        description: event.description,
        type: event.type,
        capacity: event.capacity,
        price: event.price,
        startDate: event.startDate,
        endDate: event.endDate,
        numAttending: num,
        Group: event.Group,
        Venue: event.Venue,
        EventImages: event.EventImages,
      };

      res.json(eventDetails);

  });

  //delete an event by id
  router.delete('/:eventId', async (req, res) => {
    const eventId = req.params.eventId;



      const event = await Event.findOne({
        where: {
          id: eventId,
          // Check if the user is the organizer or co-host of the event's group
        },
      });

      if (!event) {
        return res.status(404).json({ message: "Event couldn't be found" });
      }


      await event.destroy();

      res.status(200).json({ message: 'Successfully deleted' });

  });
  module.exports = router
