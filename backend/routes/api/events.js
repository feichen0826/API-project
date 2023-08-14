const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();
const {Group,GroupImage,Venue, Event,Attendance,EventImage ,sequelize, Membership} = require('../../db/models');
const e = require('express');

const validateEvent = [
  check('venueId')
    .exists({ checkFalsy: true })
    .withMessage('Venue does not exist'),
  check('name')
    .isLength({ min: 5 })
    .withMessage('Name must be at least 5 characters'),
  check('type')
    .isIn(['Online', 'In person'])
    .withMessage('Type must be Online or In person'),
  check('capacity')
    .isInt()
    .withMessage('Capacity must be an integer'),
  check('price')
    .isFloat({ min: 0 })
    .withMessage('Price is invalid'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required'),
  check('startDate')
    .custom((value, { req }) => {
      const currentDate = new Date();
      const startDate = new Date(value);
      if (startDate <= currentDate) {
        throw new Error('Start date must be in the future');
      }
      return true;
    }),
  check('endDate')
    .custom((value, { req }) => {
      const startDate = new Date(req.body.startDate);
      const endDate = new Date(value);
      if (endDate <= startDate) {
        throw new Error('End date is less than start date');
      }
      return true;
    }),
  handleValidationErrors
];

//get all events
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

        },

      });


      for (const event of events) {
        const numAttending = await Attendance.count({
          where: {
            eventId: event.id,
            status: 'attending'
           },
        });
        event.dataValues.numAttending = numAttending;
        const images = await event.getEventImages();
        const imageUrls = images.map(image => image.url);
        event.dataValues.previewImage = imageUrls;
      }
      res.json({Event: events});

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
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event couldn't be found" });
    }
    const venue = await Venue.findByPk(venueId);
    if (!venue) {
      return res.status(404).json({ message: "Venue couldn't be found" });
    }
      await event.update({
        venueId,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate,
      });

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

      let num;

       num = await Attendance.count({
          where: {
            eventId: event.id,
            status: 'attending'
           },
        });



          const images = await event.getEventImages();
          const imageUrls = images.map(image => image.url);



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
        EventImages: imageUrls,
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

  //Request attendance for an event specified by id
  router.post('/:eventId/attendance', async (req, res) => {
    const eventId = req.params.eventId;
    const userId = req.user.id;



      const event = await Event.findByPk(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event couldn't be found" });
      }





      const existingAttendance = await Attendance.findOne({
        where: { eventId, userId },
      });

      if (existingAttendance) {
        if (existingAttendance.status === 'pending') {
          return res.status(400).json({ message: 'Attendance has already been requested' });
        } else if (existingAttendance.status === 'attending') {
          return res.status(400).json({ message: 'User is already an attendee of the event' });
        }
      }


      const newAttendance = await Attendance.create({
        eventId,
        userId,
        status: 'pending',
      });

      return res.status(200).json(newAttendance);

  });


  const isOrganizerOrCoHost = async (eventId, userId) => {
    const event = await Event.findOne({
      where: { id: eventId },

    });

    if (!event) {
      return false;
    }

    if (event.organizerId === userId) {
      return true;
    }

    const coHostMembership = await Membership.findOne({
      where: { groupId: event.groupId, userId, status: 'co-host' },
    });
    return !!coHostMembership;
};
//Change the status of an attendance for an event specified by id
  router.put('/:eventId/attendance', async (req, res) => {

    const { userId, status } = req.body;


    const event = await Event.findByPk(req.params.eventId);
    console.log(event)
    if (!event) {
      return res.status(404).json({ message: "Event couldn't be found" });
    }


   const isOrganizer = await isOrganizerOrCoHost(req.params.eventId, req.user.id);
    if (!isOrganizer) {
      return res.status(403).json({ message: "You don't have permission to change attendance status" });
    }


    const attendance = await Attendance.findOne({
      where: {
        eventId: req.params.eventId,
        userId: userId
      }
    });

    console.log(attendance)

    if (!attendance) {
      return res.status(404).json({ message: "Attendance between the user and the event does not exist" });
    }

    if (status === 'pending') {
      return res.status(400).json({ message: "Cannot change an attendance status to pending" });
    }


    attendance.status = status;
    await attendance.save();
// await attendance.update({status:status})
    res.status(200).json({
      id: userId,
      eventId: attendance.eventId,
      userId: attendance.userId,
      status: attendance.status
    });

    // const eventId = req.params.eventId;
    // const userId = req.user.id;

    // const event = await Event.findOne({
    //   where: { id: eventId },
    // });

    // if (!event) {
    //   return res.status(404).json({ message: "Event couldn't be found" });
    // }

    // const attendance = await Attendance.findOne({
    //   where: { groupId: event.groupId, userId },
    // });

    // // const pendingAttendance = await Attendance.findOne({
    // //   where: { eventId, userId, status: 'pending' },
    // // });

    // // if (pendingAttendance) {
    // //   return res.status(400).json({ message: "Attendance has already been requested" });
    // // }

    // const acceptedAttendance = await Attendance.findOne({
    //   where: { eventId, userId, status: 'attending' },
    // });

    // if (acceptedAttendance) {
    //   return res.status(400).json({ message: "User is already an attendee of the event" });
    // }


    // await Attendance.create({
    //   eventId,
    //   userId,
    //   status: 'pending',
    // });

    // res.status(200).json({ userId, status: 'pending' });
  });

  //Get all Attendees of an Event specified by its id


  router.get('/:eventId/attendees', async (req, res) => {
    const eventId = req.params.eventId;


      const event = await Event.findOne({
        where: { id: eventId },

      });

      if (!event) {
        return res.status(404).json({ message: "Event couldn't be found" });
      }

      const attendees = await event.getUsers({
        attributes: ['id', 'firstName', 'lastName'],

      });

      console.log(attendees)



      const requesterIsOrganizerOrCoHost = await isOrganizerOrCoHost(eventId, req.user.id);

      if (!requesterIsOrganizerOrCoHost) {
        const filteredAttendees = attendees.filter(ele => ele.Attendance.status !== 'pending');
        return res.status(200).json({ Attendees: filteredAttendees });
      }

      res.status(200).json({ Attendees: attendees });

  });

  router.put('/:eventId/attendance', async (req, res) => {
    const eventId = req.params.eventId;
    const userId = req.user.id;
    const { status } = req.body;


    const event = await Event.findOne({
      where: { id: eventId },
    });

    if (!event) {
      return res.status(404).json({ message: "Event couldn't be found" });
    }

    const membership = await Membership.findOne({
      where: { groupId: event.groupId, userId },
    });

    if (!membership) {
      return res.status(403).json({ message: "Current User is not a member of the group" });
    }


    if (status === 'pending') {
      return res.status(400).json({ message: "Cannot change an attendance status to pending" });
    }


    const attendance = await Attendance.findOne({
      where: { eventId, userId },
    });

    if (!attendance) {
      return res.status(404).json({ message: "Attendance between the user and the event does not exist" });
    }


    await attendance.update({ status });

    res.status(200).json(attendance);
  });

  router.delete('/:eventId/attendance', async (req, res) => {
    const eventId = req.params.eventId;
    const userId = req.user.id;
    const { userId: attendanceUserId } = req.body;

    const event = await Event.findOne({
      where: { id: eventId },
    });

    if (!event) {
      return res.status(404).json({ message: "Event couldn't be found" });
    }


    const attendance = await Attendance.findOne({
      where: { eventId, userId: attendanceUserId },
    });

    if (!attendance) {
      return res.status(404).json({ message: "Attendance does not exist for this User" });
    }


    if (userId !== attendanceUserId && userId !== event.organizerId) {
      return res.status(403).json({ message: "Only the User or organizer may delete an Attendance" });
    }


    await attendance.destroy();

    res.status(200).json({ message: "Successfully deleted attendance from event" });
  });
  module.exports = router
