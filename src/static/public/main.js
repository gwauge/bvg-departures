document.getElementById('geolocate').addEventListener('click', async () => {

    // remove button and label
    let button = document.getElementById("geolocate");
    let label = document.getElementById("geolocate_label");

    button.parentNode.removeChild(button);
    label.parentNode.removeChild(label);


    if ('geolocation' in navigator) {
        console.log('geolocation available');

        navigator.geolocation.getCurrentPosition(async position => {
            // get position
            const coords = {};
            coords.lat = position.coords.latitude;
            coords.lon = position.coords.longitude;

            const latlon = `${coords.lat},${coords.lon}`; // latlon string (lat,lon)
            console.log('latlon:', latlon);

            // get nearest stations to my location from server
            const data = await (await fetch(`/nearest/${latlon}`)).json();
            console.log(data);

            // add nearest stations to table
            const table = document.getElementById("stations");
            table.style['display'] = 'table'; // make table visible

            const nearest = data.nearest;
            let index = 1;
            for (const station of Object.values(nearest)) {
                // add index to station object so it can be displayed properly in the table and on the map
                station["index"] = index;
                index += 1;

                const row = document.createElement("TR");
                const table_values = [station.index, station.name, station.id, station.distance];

                for (let i = 0; i < table_values.length; i++) {
                    let cell = document.createElement("TD");
                    if (i == 1) {
                        // add link to station names which redirects to departures site
                        //cell.innerHTML = '<a href="/departures/' + station.id + '">' + table_values[i] + "</a>";
                        cell.innerHTML = `<a href="/departures/${station.id}">${table_values[i]}</a>`;
                    } else {
                        cell.innerHTML = table_values[i];
                    }
                    row.appendChild(cell);
                }
                table.appendChild(row);
            }

            // add map to the page
            const img = document.createElement('img');
            img.setAttribute('src', data.map);
            img.setAttribute('class', 'staticmap');
            document.getElementById('mapholder').appendChild(img);

        });
    } else {
        console.log('geolocation not available');
    }

});