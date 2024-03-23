
    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12',
    center: listing.geometry.coordinates, // starting position [lng, lat]
    zoom: 8 // starting zoom
    });


    const marker = new mapboxgl.Marker({color:"red"})
         .setPopup(
            new mapboxgl.Popup({offset:25})
            .setHTML(`<h4>${listing.location}</h4><p>Exact location will be provide after booking</p>`)
         )
        .setLngLat(listing.geometry.coordinates)
        .addTo(map);

        map.on('load', function () {
            map.addLayer({
                'id': 'circle-layer',
                'type': 'circle',
                'source': {
                    'type': 'geojson',
                    'data': {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': listing.geometry.coordinates
                        }
                    }
                },
                'paint': {
                    'circle-radius': 50, // Adjust the radius of the circle as needed
                    'circle-color': 'rgba(255, 109, 96, 0.29)', // Adjust the color and opacity of the circle
                    'circle-stroke-color': 'transparent', // Adjust the stroke color if desired
                    'circle-stroke-width': 2, // Adjust the stroke width if desired
                }
            });
        });

    
    
        

        
    