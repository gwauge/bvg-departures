const fetch = require('node-fetch');
const util = require('..//util/util');

/**
 * Creates static map using Bing Maps, containing the users location as well as all nearby stations with a label.
 * @param {number[]} latlon Array containing the latitude and longitude of the users location. [lat, lon]
 * @param {object} nearest Object containing the nearest stations to the given location.
 */
function nearestStaticMap_gmaps(latlon, nearest) {

    // specify parameters of the static map
    const params = {
        size: "400x300",
        markers: [
            "color:red|" + latlon
        ],
        sensor: false,
        key: process.env.GMAPS_KEY
    };

    // add stations as markers to the map
    for (const station of Object.values(nearest)) {
        params.markers.push(`color:blue|label:${station.index}|${station.latlon}`);
    }

    const url = "https://maps.googleapis.com/maps/api/staticmap";
    return util.createURL(url, params);
}

/**
 * Creates static map using Google Maps, containing the users location as well as all nearby stations with a label.
 * @param {number[]} latlon Array containing the latitude and longitude of the users location. [lat, lon]
 * @param {object} nearest Object containing the nearest stations to the given location.
 */
function nearestStaticMap_bmaps(latlon, nearest) {
    // docs: https://docs.microsoft.com/en-us/bingmaps/rest-services/imagery/get-a-static-map
    // pushpins: https://docs.microsoft.com/en-us/bingmaps/rest-services/common-parameters-and-types/pushpin-syntax-and-icon-styles

    function createPP(coords, icon, label) {
        return `${coords};${icon};${label}`;
    }

    const mycoords = '52.4803,13.60376';

    const mapType = 'Road';
    const coords = latlon;
    const zoomLevel = 15;

    const params = {
        o: 'json',
        mapSize: '400,300',
        mapLayer: 'TrafficFlow',
        pp: [createPP(latlon, 80, '')],
        key: process.env.BMAPS_KEY
    };

    for (const station of nearest) {
        params.pp.push(createPP(station.latlon, 1, station.index));
    }

    const url = `https://dev.virtualearth.net/REST/v1/Imagery/Map/${mapType}/${coords}/${zoomLevel}`;
    return util.createURL(url, params);
}

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

    console.log({
        bmaps: nearestStaticMap_bmaps(latlon, nearest),
        gmaps: nearestStaticMap_gmaps(latlon, nearest)
    });

    // send nearest stations as well as URL for static maps with stations
    res.json({
        'nearest': nearest,
        'map': nearestStaticMap_bmaps(latlon, nearest)
    });
};