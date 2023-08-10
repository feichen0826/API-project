const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();
const {Group,GroupImage,Venue,Event} = require('../../db/models')




  // Get all Groups
  router.get('/', async (req, res) => {

      const groups = await Group.findAll();
      return res.json(groups);

  });

  // Get all Groups joined or organized by the Current User
  router.get('/current', async (req, res) => {

      const user = req.user;
      const numMembers = await Group.count();
      //const previewImage = await Group.getPreviewImage()
      const groups = await Group.findAll({
        where: {
           organizerId: user.id
        }
      });
      console.log(user)
      return res.json({
        groups,
        numMembers
      })
        //previewImage


  });

  // Get details of a Group from an id
  router.get('/:groupId', async (req, res) => {
    const groupId = req.params.groupId;

      const group = await Group.findByPk(groupId, {
        include: [
          { model: GroupImage },
          { model: User, attributes: ['id', 'firstName', 'lastName']},
          { model: Venue }
        ]
      });
      if (!group) {
        return res.status(404).json({ message: "Group couldn't be found"});
      }
      return res.json(group);

  });

  // Create a Group
  router.post('/', async (req, res) => {
    const { name, about, type, private, city, state } = req.body;

    // Add additional validation and error handling as needed

      const newGroup = await Group.create({
        name,
        about,
        type,
        private,
        city,
        state,
        organizerId: req.user.id
      });

      return res.json(newGroup);
    });

//add an image to a group
router.post('/:groupId/images',async (req, res) => {
    const groupId = req.params.groupId;
    const { url, preview } = req.body;

    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group couldn't be found"});
    }

    // Create the image for the group
    const image = await GroupImage.create({
      groupId,
      url,
      preview,
    });

    return res.json({
      id: image.id,
      url: image.url,
      preview: image.preview,
    });

})

// router.put('/:groupId', async (req, res) => {
//     const groupId = req.params.groupId;
//     const { name, about, type, private, city, state } = req.body;


//       const group = await Group.findByPk(groupId);

//       if (!group) {
//         return res.status(404).json({ message: "Group couldn't be found" });
//       }


//       group.name = name;
//       group.about = about;
//       group.type = type;
//       group.private = private;
//       group.city = city;
//       group.state = state;

//       await group.save();

//       return res.status(200).json(group);


//   });

// //  DELETE /api/groups/:groupId
//   router.delete('/:groupId', async (req, res) => {
//      const groupId = req.params.groupId;


//       const group = await Group.findByPk(groupId);

//       if (!group) {
//         return res.json({ message: "Group couldn't be found" });
//       }



//       await group.destroy();

//       return res.json({ message: 'Successfully deleted' });

//   });


//   router.get('/:groupId/venues', async (req, res) => {
//     const groupId = req.params.groupId;


//       const group = await Group.findByPk(groupId, {
//         include: [{ model: Venue }]
//       });

//       if (!group) {
//         return res.status(404).json({ message: "Group couldn't be found" });
//       }



//       return res.status(200).json({ Venues: group.Venues });

//   });

//   router.post('/:groupId/venues', async (req, res) => {
//     const groupId = req.params.groupId;
//     const { address, city, state, lat, lng } = req.body;


//     // const errors = handleValidationErrors(req);
//     // if (!errors.isEmpty()) {
//     //   return res.status(400).json({
//     //     message: 'Bad Request',
//     //     errors: errors.array()
//     //   });
//     // }


//       const group = await Group.findByPk(groupId);

//       if (!group) {
//         return res.status(404).json({ message: "Group couldn't be found" });
//       }

//       const newVenue = await Venue.create({
//         groupId,
//         address,
//         city,
//         state,
//         lat,
//         lng
//       });

//       return res.status(200).json(newVenue);

//   });

//   router.post('/:groupId/events',async (req, res) => {

//     const eventData = req.body;
//     const group = await Group.findByPk(req.params.groupId,{

//         include:[User],
//         where:{
//           status:'co-host'
//       }
//     });

//     const event = await Event.create({
//       groupId: req.params.groupId,
//       venueId: eventData.venueId,
//       name: eventData.name,
//       type: eventData.type,
//       capacity: eventData.capacity,
//       price: eventData.price,
//       description: eventData.description,
//       startDate: eventData.startDate,
//       endDate: eventData.endDate
//     });
//     res.status(200).json(event);

// })
  module.exports = router;
