const fetch = require('node-fetch');
const util = require('../util/util');

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

exports.nearbyStaticMap = async (req, res) => {
    console.log(req.body);
    res.json(req.body);
};