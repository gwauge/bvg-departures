const fetch = require('node-fetch');
const util = require('..//util/util');

exports.departures = async (req, res) => {
    console.log(`GET request to /departures by ${req.headers['user-agent']} through host ${req.headers['host']}`);

    const id = req.params.id; // station ID

    const page_data = {}; // used to store information and submit it to the templating engine

    // get information about the station
    const info_url = `https://3.vbb.transport.rest/stops/${id}?results=${10}`;
    page_data['station_info'] = await (await fetch(info_url)).json();

    // get upcoming departures at that station
    const dep_url = `https://3.vbb.transport.rest/stops/${id}/departures?results=${10}&duration=${30}`
    page_data["departures"] = await (await fetch(dep_url)).json();

    // render file index(.pug) (directory specified in app.js)
    res.render('departures/index', page_data);
};

exports.nearest = async (req, res) => {
    console.log(`GET request to /nearest by ${req.headers['user-agent']} through host ${req.headers['host']}`);

    const latlon = req.params.latlon.split(",");

    const base_url = 'https://3.vbb.transport.rest/stops/nearby';
    const params = {
        latitude: latlon[0],
        longitude: latlon[1],
        results: 8,
        distance: 500
    };

    // get nearest stations
    const nearest = await (await fetch(util.createURL(base_url, params))).json();

    // add indices to the stations to be used in the lablels in the static map
    let i = 1;
    for (const station of Object.values(nearest)) {
        station.latlon = station.location.latitude + "," + station.location.longitude;
        station['index'] = i;
        i++;
    }

    // send nearest stations as well as URL for static maps with stations
    res.json(nearest);
};