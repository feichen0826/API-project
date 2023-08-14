const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Group, GroupImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

router.delete('/:imageId', async (req, res) => {
    const imageId = req.params.imageId;
    const userId = req.user.id; // Assuming you're using authentication middleware to attach user info

    // Check if the image exists
    const groupImage = await GroupImage.findOne({
      where: { id: imageId },
    });

    if (!groupImage) {
      return res.status(404).json({ message: "Group Image couldn't be found" });
    }

    // Check if the requester is the user or a co-host of the group
    const group = await Group.findOne({
      where: { id: groupImage.groupId },
    });

    if (!group) {
      return res.status(404).json({ message: "Group couldn't be found" });
    }

    if (userId !== group.organizerId && userId !== group.coHostId) {
      return res.status(403).json({ message: "Only the organizer or co-host may delete a Group Image" });
    }

    // Delete the image
    await groupImage.destroy();

    res.status(200).json({ message: "Successfully deleted" });
  });



  module.exports = router;
