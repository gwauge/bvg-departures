const fetch = require('node-fetch');
const util = require('../util/util');

exports.stations = async (req, res) => {
    console.log(req.body);
    res.end();
};