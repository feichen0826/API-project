const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Event, EventImage, Group} = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

router.delete('/:imageId', async (req, res) => {
    const imageId = req.params.imageId;
    const userId = req.user.id;

    // Check if the image exists
    const eventImage = await EventImage.findOne({
      where: { id: imageId },
      include: {
        model: Event,
        include: {
          model: Group,
        },
      },
    });

    if (!eventImage) {
      return res.status(404).json({ message: "Event Image couldn't be found" });
    }

    const groupId = eventImage.Event.Group.id;

    // Check if the requester is the organizer or a co-host of the group
    const group = await Group.findOne({
      where: { id: groupId },
    });

    if (!group) {
      return res.status(404).json({ message: "Group couldn't be found" });
    }

    if (userId !== group.organizerId && userId !== group.coHostId) {
      return res.status(403).json({ message: "Only the organizer or co-host may delete an Event Image" });
    }

    // Delete the image
    await eventImage.destroy();

    res.status(200).json({ message: "Successfully deleted" });
  });

  module.exports = router;
