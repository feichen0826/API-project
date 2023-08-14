const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();
const {Group,GroupImage,Venue,Event, Attendance,Membership, sequelize, EventImage} = require('../../db/models')

const validateGroup = [
  check('name')
    .isLength({ max: 60 })
    .withMessage('Name must be 60 characters or less'),
  check('about')
    .isLength({ min: 50 })
    .withMessage('About must be 50 characters or more'),
  check('type')
    .isIn(['Online', 'In person'])
    .withMessage("Type must be 'Online' or 'In person'"),
  check('private')
    .isBoolean()
    .withMessage('Private must be a boolean'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required'),
  handleValidationErrors
];

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

const validateVenue = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage('Street address is required'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required'),
  check('lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude is not valid'),
  check('lng')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude is not valid'),
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

      // let url;
      // for(let i = 0; i < group.length; i++){

      //   const groupImage =  await GroupImage.findAll({
      //     where:{
      //       groupId:group[i].id
      //     }
      //   })
      //   for(let j= 0 ; j < groupImage.length; j++){
      //    url = groupImage[i].url

      //   }

      // }
      const groupDetails ={

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
        GroupImages: group.GroupImages.map(image => ({
          id: image.id,
        url: image.url,
        preview: image.preview
        })),
        Organizer: group.Organizer,
        Venues: group.Venues,
      }

      res.status(200).json(groupDetails);

  });

  // Create a Group
  router.post('/', validateGroup, async (req, res) => {
    const { name, about, type, private, city, state } = req.body;

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

    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group couldn't be found" });
    }

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
      })

      const responseEvent = {
        id: newEvent.id,
        groupId: newEvent.groupId,
        venueId: newEvent.venueId,
        name: newEvent.name,
        type: newEvent.type,
        capacity: newEvent.capacity,
        price: newEvent.price,
        description: newEvent.description,
        startDate: newEvent.startDate,
        endDate: newEvent.endDate,
      };

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
            {
              model:EventImage,
              attributes:['url'],
              as:'previewImage'
            },

          ],

          group: ['Event.id', 'Group.id', 'Venue.id'],
        });
        const eventsWithNumAttending = await Promise.all(
          events.map(async (event) => {
            const numAttending = await Attendance.count({
              where: {
                eventId: event.id,
                status: 'attending',
              },
            });
            event.dataValues.numAttending = numAttending;
            return event;
          })
        );

        res.json({
          Events: eventsWithNumAttending,
        });
      });

//Get all Members of a Group specified by its id
router.get('/:groupId/members', async (req, res) => {
  const groupId = req.params.groupId;
  const userId = req.user.id

  const isOrganizerOrCoHost = async (groupId, userId) => {
    const membership = await Membership.findOne({
      where: { groupId, userId },
    });
    return membership && (membership.status === 'organizer' || membership.status === 'co-host');
  };

  const group = await Group.findOne({
    where: { id: groupId },
    include: [
      {
        model: User,
        as: 'Organizer',
        attributes: ['id', 'firstName', 'lastName'],
      },
      {
        model: Membership,
        attributes: ['status'],
        include: {
          model: User,
          attributes: ['id', 'firstName', 'lastName'],
        },
      },
    ],
  });

  if (!group) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }

  const members = [];
  if (await isOrganizerOrCoHost(group.id, userId)) {
    for (const membership of group.Memberships) {
      members.push({
        id: membership.User.id,
        firstName: membership.User.firstName,
        lastName: membership.User.lastName,
        Membership: {
          status: membership.status,
        },
      });
    }
  } else {
    for (const membership of group.Memberships) {
      if (membership.status !== 'pending') {
        members.push({
          id: membership.User.id,
          firstName: membership.User.firstName,
          lastName: membership.User.lastName,
          Membership: {
            status: membership.status,
          },
        });
      }
    }
  }

  res.status(200).json({ Members: members });

});

// //Request a Membership for a Group based on the Group's id
router.post('/:groupId/membership', validateMembership, async (req, res) => {
  const groupId = req.params.groupId;
  const userId = req.user.id;

  const group = await Group.findOne({
    where: { id: groupId },
  });

  if (!group) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }

    const existingPendingMembership = await Membership.findOne({
      where: { groupId, userId, status: 'pending' },
    });

    if (existingPendingMembership) {
      return res.status(400).json({ message: "Membership has already been requested" });
    }


    const existingAcceptedMembership = await Membership.findOne({
      where: { groupId, userId, status: 'co-host' },
    });

    if (existingAcceptedMembership) {
      return res.status(400).json({ message: "User is already a member of the group" });
    }

    await Membership.create({
      groupId,
      userId,
      status: 'pending',
    });

    res.status(200).json({ memberId: userId, status: 'pending' });
});

router.put('/:groupId/membership', async (req, res) => {
  const groupId = req.params.groupId;
  const { memberId, status } = req.body;
  const userId = req.user.id;

  const group = await Group.findOne({
    where: { id: groupId },
    include: [
      {
        model: User,
        as: 'Organizer',
        attributes: ['id'],
      },
      {
        model: Membership,
        attributes: ['id', 'status'],
      },
    ],
  });
  const targetUser = await User.findByPk(memberId);
  if (!targetUser) {
    return res.status(400).json({
      message: "User couldn't be found",
      });
  }


  if (!group) {
    return res.status(404).json({ message: "Group couldn't be found" });
  }
  //console.log(group.Memberships)
  // Check if the current user can change the membership status

  // const currentUserMembership = group.Memberships.find(membership =>  membership.dataValues.userId === userId);
  const existingMembership = await Membership.findOne({
        where: { groupId, userId},
      });
  const targetMembership = group.Memberships.find(membership => memberId === membership.id);
  if (!targetMembership) {
    return res.status(404).json({
      message: "Membership between the user and the group does not exist",
    });
  }
  if (status === 'pending') {
    return res.status(400).json({ message: "Cannot change a membership status to pending" });
  }

  if (status === 'member') {
    //console.log(currentUserMembership)
    if (group.organizerId === userId || existingMembership.status === 'co-host') {
      targetMembership.status = status;
      await targetMembership.save();
      return res.status(200).json({
        id: targetMembership.id,
        groupId: groupId,
        memberId: memberId,
        status: status,
      });
    }
  }

  if (status === 'co-host') {
    if (group.organizerId === userId) {
      targetMembership.status = status;
      await targetMembership.save();
      return res.status(200).json({
        id: targetMembership.id,
        groupId: groupId,
        memberId: memberId,
        status: status,
      });
    }
  }

  return res.status(400).json({ message: "Invalid membership status" });
  // const groupId = req.params.groupId;
  // const userId = req.user.id;
  // const { memberId, status } = req.body;


  //   const group = await Group.findOne({
  //     where: { id: groupId },
  //   });
  //   //console.log(group)
  //   if (!group) {
  //     return res.status(404).json({ message: "Group couldn't be found" });
  //   }


  //   const existingMembership = await Membership.findOne({
  //     where: { groupId, userId},
  //   });

  //   if (!existingMembership) {
  //     return res.status(404).json({ message: "Membership between the user and the group does not exist" });
  //   }


  //   const member = await User.findOne({
  //     where: { id: memberId },
  //   });

  //   if (!member) {
  //     return res.status(400).json({ message: "User couldn't be found" });
  //   }

  //   if (status === 'pending') {
  //     return res.status(400).json({ message: "Cannot change a membership status to pending" });
  //   }



  //   existingMembership.status = status;
  //   await existingMembership.save();

  //   res.status(200).json({ id:existingMembership.id, memberId, groupId, status:existingMembership.status});

});

router.delete('/:groupId/membership', async (req, res) => {
  const groupId = req.params.groupId;
  const userId = req.user.id;
  const { memberId } = req.body;


    const group = await Group.findOne({
      where: { id: groupId },
    });

    if (!group) {
      return res.status(404).json({ message: "Group couldn't be found" });
    }


    const member = await User.findOne({
      where: { id: memberId },
    });

    if (!member) {
      return res.status(400).json({ message: "User couldn't be found" });
    }


    const existingMembership = await Membership.findOne({
      where: { groupId, userId: memberId },
    });

    if (!existingMembership) {
      return res.status(404).json({ message: "Membership does not exist for this User" });
    }


    if (userId !== memberId && group.organizerId !== userId) {
      return res.status(403).json({ message: "Unauthorized to delete membership" });
    }


    await existingMembership.destroy();

    res.status(200).json({ message: "Successfully deleted membership from group" });

});
  module.exports = router;
