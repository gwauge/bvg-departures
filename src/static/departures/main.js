/**
 * Converts a given degree into radians.
 * @param {number} deg Degrees to be converted
 * @returns {number} Degrees converted into Radians 
 */
function toRadians(deg) {
    return deg * (Math.PI / 180);
}

/**
     * Calculates the distance between two coordinates based on the "haversine" fomula.
     * @param {Object} p1 First point
     * @param {Object} p2 Second point
     * @returns {number} Distance in meters.
     */
function distanceBetween(p1, p2) {

    const r = 6371e3; // earth's mean radius in meters
    let phi1 = toRadians(p1.lat);
    let phi2 = toRadians(p2.lat);
    let dphi = toRadians(p2.lat - p1.lat);
    let dlambda = toRadians(p2.lon - p1.lon);

    let a = Math.sin(dphi / 2) ** 2 +
        Math.cos(phi1) * Math.cos(phi2) *
        Math.sin(dlambda / 2) ** 2;
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return r * c;
}

document.getElementById('geolocate').addEventListener('click', event => {
    if ('geolocation' in navigator) {
        //console.log('geolocation available');
        navigator.geolocation.getCurrentPosition(position => {
            // get distance and update DOM elements
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            const me = { lat, lon };
            const station = { lat: info.location.latitude, lon: info.location.longitude };

            document.getElementById('distance').textContent = Math.round(distanceBetween(me, station)) + " m";

            // remove button from DOM
            let button = document.getElementById('geolocate');
            button.parentNode.removeChild(button);
        });

    } else {
        console.log('geolocation not available');
    }
});