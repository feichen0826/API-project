const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();
const {Group,GroupImage,Venue,Event, Attendance,Membership, sequelize} = require('../../db/models')

const validateGroup = [
  check('name')
    .isLength({ max: 60 })
    .withMessage('Name must be 60 characters or less'), // Customize error message
  check('about')
    .isLength({ min: 50 })
    .withMessage('About must be 50 characters or more'), // Customize error message
  check('type')
    .isIn(['Online', 'In person'])
    .withMessage("Type must be 'Online' or 'In person'"), // Customize error message
  check('private')
    .isBoolean()
    .withMessage('Private must be a boolean'), // Customize error message
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required'), // Customize error message
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required'), // Customize error message
  handleValidationErrors
];

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

const validateVenue = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage('Street address is required'), // Customize error message
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required'), // Customize error message
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required'), // Customize error message
  check('lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude is not valid'), // Customize error message
  check('lng')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude is not valid'), // Customize error message
  handleValidationErrors
];

const validateMembership = [
  check('status')
  .isIn('co-host', 'member')
  .withMessage("Cannot change a membership status to pending"),
  handleValidationErrors
]
  // Get all Groups
  router.get('/', async (req, res) => {

      const groups = await Group.findAll({
        include:[{
          model:Membership,
        },{
          model:GroupImage
        }]
      });
      let url;
      for(let i = 0; i < groups.length; i++){

        const groupImage =  await GroupImage.findAll({
          where:{
            groupId:groups[i].id
          }
        })
        for(let j= 0 ; j < groupImage.length; j++){
         url = groupImage[i].url

        }

      }


        const formattedGroups = groups.map(group => ({
          id: group.id,
          organizerId: group.organizerId,
          name: group.name,
          about: group.about,
          type: group.type,
          private: group.private,
          city: group.city,
          state: group.state,
          createdAt: group.createdAt,
          updatedAt: group.updatedAt,
          numMembers: group.Memberships.length,
          previewImage: url

        })
        );


        res.status(200).json({ Groups: formattedGroups });

      })


  // Get all Groups joined or organized by the Current User
  router.get('/current', async (req, res) => {

      const user = req.user;

      //const previewImage = await Group.getPreviewImage()
      const group = await Group.findAll({
        include:[{
          model:Membership,
        },{
          model:GroupImage
        }],
        where: {
           organizerId: req.user.id
        }
      });


    if (!group) {
      return res.status(404).json({ message: 'User not found' });
    }

    let url;
    for(let i = 0; i < group.length; i++){

      const groupImage =  await GroupImage.findAll({
        where:{
          groupId:group[i].id
        }
      })
      for(let j= 0 ; j < groupImage.length; j++){
       url = groupImage[i].url

      }

    }
    const groupList = group.map(group => ({

        id: group.id,
        organizerId: group.organizerId,
        name: group.name,
        about: group.about,
        type: group.type,
        private: group.private,
        city: group.city,
        state: group.state,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
        numMembers: group.Memberships.length,
        previewImage: url

     })
    )

      console.log(groupList)
    res.status(200).json( groupList);




  });

  // Get details of a Group from an id
  router.get('/:groupId', async (req, res) => {
    const groupId = req.params.groupId;

      const group = await Group.findByPk(groupId, {
        include: [
          { model: GroupImage },
          { model : Membership },
          {
            model: User,
            as:'Organizer',
            attributes: ['id', 'firstName', 'lastName']
          },
          { model: Venue }
        ]
      });
      if (!group) {
        return res.status(404).json({ message: "Group couldn't be found"});
      }

      let url;
      for(let i = 0; i < group.length; i++){

        const groupImage =  await GroupImage.findAll({
          where:{
            groupId:group[i].id
          }
        })
        for(let j= 0 ; j < groupImage.length; j++){
         url = groupImage[i].url

        }

      }
      console.log(group)
      const groupDetails = {
        id: group.id,
        organizerId: group.organizerId,
        name: group.name,
        about: group.about,
        type: group.type,
        private: group.private,
        city: group.city,
        state: group.state,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
        numMembers: group.Memberships.length,
        GroupImages: url,
        Organizer: group.Organizer,
        Venues: group.Venues,
      };

      res.status(200).json(groupDetails);

  });

  // Create a Group
  router.post('/', validateGroup, async (req, res) => {
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
router.post('/:groupId/images', async (req, res) => {
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

//edit a group
router.put('/:groupId', validateGroup, async (req, res) => {
    const groupId = req.params.groupId;
    const { name, about, type, private, city, state } = req.body;


      const group = await Group.findByPk(groupId);

      if (!group) {
        return res.status(404).json({ message: "Group couldn't be found" });
      }


      group.name = name;
      group.about = about;
      group.type = type;
      group.private = private;
      group.city = city;
      group.state = state;

      await group.save();

      return res.status(200).json(group);


  });

//  DELETE /api/groups/:groupId
  router.delete('/:groupId', async (req, res) => {
     const groupId = req.params.groupId;


      const group = await Group.findByPk(groupId);

      if (!group) {
        return res.json({ message: "Group couldn't be found" });
      }

      await group.destroy();

      return res.json({ message: 'Successfully deleted' });

  });

//Create a new Venue for a Group specified by its id


  router.post('/:groupId/venues', validateVenue, async (req, res) => {
    const groupId = req.params.groupId;
    const { address, city, state, lat, lng } = req.body;


      const group = await Group.findByPk(groupId);

      if (!group) {
        return res.status(404).json({ message: "Group couldn't be found" });
      }

      const newVenue = await Venue.create({
        groupId,
        address,
        city,
        state,
        lat,
        lng
      },{
        attributes:{
          exclude:['createAt','updateAt']
        }
      });

      return res.status(200).json(newVenue);

  });
//Get All Venues for a Group specified by its id
  router.get('/:groupId/venues', async (req, res) => {
    const groupId = req.params.groupId;


      const group = await Group.findByPk(groupId, {
        include: [{ model: Venue }],
        attributes:{
          exclude: ['createAt','updateAt']
        }
      });

      if (!group) {
        return res.status(404).json({ message: "Group couldn't be found" });
      }



      return res.status(200).json({ Venues: group.Venues });

  });

//Create an Event for a Group specified by its id

  router.post('/:groupId/events', validateEvent, async (req, res) => {
    const groupId = req.params.groupId;
    const userData = req.user;
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

      const newEvent = await Event.create({
        groupId,
        venueId,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate,
      }, {
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      });

      res.status(200).json(newEvent);

  });

    //Get all Events of a Group specified by its id
    router.get('/:groupId/events', async (req, res) => {

        const groupId = req.params.groupId;

        const group = await Group.findByPk(groupId);
        if (!group) {
          return res.status(404).json({ message: "Group couldn't be found" });
        }

        const events = await Event.findAll({
          where: { groupId: groupId },
          include: [
            {
              model: Group,
              attributes: ['id', 'name', 'city', 'state'],
            },
            {
              model: Venue,
              attributes: ['id', 'city', 'state'],
            },
            {
              model: User,
              attributes:[],
              through: {
                model: Attendance,
              },
            },
          ],
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'groupId', 'venueId'], // Exclude unwanted attributes
            include: [
              'id',
              [
                sequelize.fn('COUNT', sequelize.col('Users.id')),
                'numAttending'
              ], // Count of attendees
            ],
          },
          group: ['Event.id', 'Group.id', 'Venue.id'], // Group by event, group, and venue
        });

        res.json({
          Events: events
        });
    });

// //Get all Members of a Group specified by its id
// router.get('/:groupId/members', async (req, res) => {
//   const groupId = req.params.groupId;
//   const userData = req.user; // Assuming you have user data available in req.user


//     const group = await Group.findByPk(groupId, {
//       include: [
//         {
//           model: User,
//           attributes: ['id', 'firstName', 'lastName'],
//           through: { attributes: ['status'] },
//         },
//       ],
//     });

//     if (!group) {
//       return res.status(404).json({ message: "Group couldn't be found" });
//     }

//     // Determine if the user is the organizer or a co-host
//     const isOrganizerOrCoHost =
//       userData && (userData.id === group.organizerId || userData.id === group.Membership.organizerId);

//     // Filter members based on the user's role and membership status
//     const members = group.Users.filter(user => {
//       if (isOrganizerOrCoHost) {
//         return true; // Show all members
//       }
//       return user.Membership.status !== 'pending'; // Show only non-pending members
//     });

//     // Prepare the response
//     const response = {
//       Members: members.map(user => ({
//         id: user.id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         Membership: {
//           status: user.Membership.status,
//         },
//       })),
//     };


//     res.status(200).json(response);

// });

// //Request a Membership for a Group based on the Group's id

// router.post('/:groupId/membership', async (req, res) => {

//     const groupId = req.params.groupId;
//     const userId = req.user.id;

//     const group = await Group.findByPk(groupId);
//     if (!group) {
//       return res.status(404).json({ message: "Group couldn't be found" });
//     }

//     const existingRequest = await Membership.findOne({
//       where: {
//         userId,
//         groupId,
//         status: 'pending'
//       }
//     });
//     if (existingRequest) {
//       return res.status(400).json({ message: "Membership has already been requested" });
//     }


//     const existingMembership = await Membership.findOne({
//       where: {
//         userId,
//         groupId,
//         status: 'member'
//       }
//     });
//     if (existingMembership) {
//       return res.status(400).json({ message: "User is already a member of the group" });
//     }


//     const newMembership = await Membership.create({
//       userId,
//       status: 'pending'
//     });

//     res.status(200).json(newMembership);

// });

// //Change the status of a membership for a group specified by id
// router.put('/:groupId/membership', validateMembership, async (req, res) => {
//   const groupId = req.params.groupId;
//   const memberId = req.body.memberId;
//   const newStatus = req.body.status;

//     const user = await User.findByPk(memberId);
//     if (!user) {
//       return res.status(400).json({
//         message: 'Validation Error',
//         errors: { memberId: "User couldn't be found" },
//       });
//     }

//     const group = await Group.findByPk(groupId);
//     if (!group) {
//       return res.status(404).json({ message:  "Group couldn't be found" });
//     }


//     const membership = await Membership.findOne({
//       where: { groupId, userId: memberId },
//     });

//     if (!membership) {
//       return res.status(404).json({
//         message: 'Membership between the user and the group does not exist',
//       });
//     }

//     membership.status = newStatus;
//     await membership.save();

//     return res.status(200).json(membership);

// });

  module.exports = router;
