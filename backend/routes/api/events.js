// const express = require('express')
// const bcrypt = require('bcryptjs');

// const { setTokenCookie, requireAuth } = require('../../utils/auth');
// const { User } = require('../../db/models');
// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');
// const router = express.Router();
// const {Group,GroupImage,Venue, Event} = require('../../db/models')


// router.get('/',async (req, res) => {

//       const events = await Event.findAll({
//         include: [
//           {
//             model: Group,
//             attributes: ['id', 'name', 'city', 'state']
//           },
//           {
//             model: Venue,
//             attributes: ['id', 'city', 'state']
//           }
//         ],
//         attributes: { exclude: ['createdAt', 'updatedAt'] } // Exclude timestamps
//       });

//       res.status(200).json({ Events: events });

//   });

//   // router.post('/:eventId/images', async (req, res) => {
//   //   try {

//   //     const imageDetails = req.body;

//   //     // Check if the event exists
//   //     const event = await Event.findByPk(req.params.eventId);
//   //     if (!event) {
//   //       return res.status(404).json({ message: 'Event couldn\'t be found' });
//   //     }

//   //     // Check if the current user is an attendee, host, or co-host of the event
//   //     const isAttendee = event.attendees.includes(req.user.id);
//   //     const isHost = event.hostId === req.user.id;
//   //     const isCoHost = event.coHosts.includes(req.user.id);

//   //     if (!isAttendee && !isHost && !isCoHost) {
//   //       return res.status(403).json({ message: 'Unauthorized' });
//   //     }

//   //     // Create the image
//   //     const image = await Image.create({
//   //       eventId,
//   //       url: imageDetails.url,
//   //       preview: imageDetails.preview
//   //     });

//   //     res.status(200).json(image);
//   //   } catch (error) {
//   //     console.error(error);
//   //     res.status(500).json({ message: 'Internal server error' });
//   //   }
//   // });

//   module.exports = router
