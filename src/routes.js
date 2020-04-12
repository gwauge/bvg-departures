const express = require('express');
const router = express.Router();

const bvgController = require('./controller/bvgController');
const mapsController = require('./controller/mapsController');


router.get('/departures/:id', bvgController.departures);

router.get('/nearest/:latlon', bvgController.nearest);

router.get('/nearby_staticmap', mapsController.nearbyStaticMap);

module.exports = router;