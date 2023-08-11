const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();
const {Group,Venue} = require('../../db/models')

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

router.put('/:venueId', validateVenue, async (req, res) => {
    const venueId = req.params.venueId;
    const { address, city, state, lat, lng } = req.body;

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
