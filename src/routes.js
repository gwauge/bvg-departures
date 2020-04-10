const express = require('express');
const router = express.Router();

const bvgController = require('./controller/bvgController');
const gmapsController = require('./controller/gmapsController');


router.get('/departures/:id', bvgController.departures);

router.get('/nearest/:latlon', bvgController.nearest);

module.exports = router;