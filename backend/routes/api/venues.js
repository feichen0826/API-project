const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();
const {Group,Venue} = require('../../db/models')

router.put('/:venueId', async (req, res) => {
    const venueId = req.params.venueId;
    const { address, city, state, lat, lng } = req.body;


    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({
    //     message: 'Bad Request',
    //     errors: errors.array()
    //   });
    // }


      const venue = await Venue.findByPk(venueId);

      if (!venue) {
        return res.status(404).json({ message: "Venue couldn't be found" });
      }
      venue.address = address;
      venue.city = city;
      venue.state = state;
      venue.lat = lat;
      venue.lng = lng;

      await venue.save();

      return res.json(venue);

  });


  module.exports = router;
