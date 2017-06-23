mapboxgl.accessToken = 'pk.eyJ1Ijoib2tpZWJ1YmJhIiwiYSI6ImNpdHZscGs3ajAwNXYyb284bW4ydWUzbGsifQ.1PoNrSP0F65WolWgqKhV4g';

var map;
var kounter = 0;
var markers = [];
var lonlat = [-97.50732685771766, 35.47461778676444];
var dragAndDropped = false;
var miles = 10;
var leftBearing = 3;
var ruler;

$(document).ready(function() {
    console.log('in ready');
    hellothere();
    ruler = cheapRuler(35.05, 'miles');

    map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/streets-v9', //stylesheet location
        center: lonlat, // starting position
        zoom: 10.14 // starting zoom
    });

    map.on('load', function(e) {
        console.log('map has finished loading...');

        doPastMonth();
        addTriangle();

    });
    map.on('rotate', function(e) {
        dragAndDropped = true;
    });

    map.on('drag', function(e) {
        dragAndDropped = true;
    });

    map.on('mouseup', function(e) {
        console.log(e.lngLat.lng, e.lngLat.lat);
        closePopup();
        if (dragAndDropped) {
            dragAndDropped = false;
            // console.log('bailing');
            return;
        }
        console.log('mouseup', e.originalEvent.which);
        // console.log(e.originalEvent.which);
        // if (e.originalEvent.which == 1) { // left click
        //     // createMarker(e.lngLat.lng, e.lngLat.lat);
        // } else { // not left click
        //     makePopupPicker(e);
        // }
        // console.log(map.getZoom());
    });

    map.on('click', function(e) {
        closePopup();
        if (dragAndDropped) {
            dragAndDropped = false;
            // console.log('bailing');
            return;
        }
        console.log('clickkkk', e.originalEvent.which);
        // console.log(e.originalEvent.which);
        // if (e.originalEvent.which == 1) { // left click
        //     // createMarker(e.lngLat.lng, e.lngLat.lat);
        // } else { // not left click
        //     makePopupPicker(e);
        // }
        // console.log(map.getZoom());
    });

    map.addControl(new mapboxgl.NavigationControl());

    map.addControl(new mapboxgl.ScaleControl({
        position: 'bottom-right',
        maxWidth: 80,
        unit: 'imperial'
    }));

    var navigationHtml =
        '<button class="mapboxgl-ctrl-icon mapboxgl-ctrl-geolocate" type="button" onclick="flytolocation()" accesskey="h"' +
        ' title="Reset map back to original view. Hot key: <alt> h"><span class="arrow";"></span></button>';
    // adds a navigation button that resets the view back to where it started
    $('.mapboxgl-ctrl-group').append(navigationHtml);
});

function createMarker(lng, lat) {
    // console.log('createMarker', e.lngLat.lat, e.lngLat.lng);
    let marker = getGeoJsonForMarker(lng, lat);
    // console.log('marker', marker);
    let randomImg = 'a' + Math.floor((Math.random() * 8) + 1) + '.gif';

    // create a DOM element for the marker
    var el = document.createElement('div');
    el.className = 'marker';
    el.id = 'markerId_' + kounter;
    el.style.backgroundImage = 'url(' + randomImg + ')';
    el.style.width = '50px';
    el.style.height = '50px';

    // el.addEventListener('click', function() {
    //     // window.alert(marker.properties.message);
    //     console.log('click', this);
    // });

    var popup = new mapboxgl.Popup({
            offset: 25
        })
        .setText('-' + kounter);

    // add marker to map
    let mkr = markers.push(new mapboxgl.Marker(el, {
            offset: [-25, -25]
        })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map));

    $('#markerId_' + kounter).append('<div class="markerLabel">' + kounter + '</div>');
    closePopup();
    kounter++;
}

function getGeoJsonForMarker(lng, lat) {
    console.log('lng', lng, 'lat', lat);
    var geojson = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            // "properties": {
            //     "title": "Small astronaut",
            //     "message": "Foo"
            // },
            "geometry": {
                "type": "Point",
                "coordinates": [lng, lat]
            }
        }]
    };
    return geojson;
}

function closePopup() {
    $('#popupmain').remove();
}

function makePopupPicker(e) {
    closePopup();
    console.log(e.point.x, e.point.y, e);
    let lng = e.lngLat.lng;
    let lat = e.lngLat.lat;
    let x = e.point.x;
    if (x > 150) x = x - 150;

    let theHtml = '';
    theHtml += "<div id='popupmain' class='popupmain' ";
    theHtml += " style='left: " + x + "px; top: " + e.point.y + "px;'>";
    theHtml += '<div>some text goes here</div>';
    theHtml += "<button onclick='createMarker(" + lng + "," + lat + ")'>Add Marker</button>"
    theHtml += "<button onclick='closePopup()'>Close</button>"
    theHtml += "<br></div>";

    $('#popup').append(theHtml);
}


function flytolocation() {

    map.flyTo({
        center: lonlat,
        pitch: 0,
        bearing: 0,
        zoom: 10.14
    });
}

function hellothere() {
    console.log('-------------------------------');
    console.log('---                         ---');
    console.log('---       Hello there       ---');
    console.log('---                         ---');
    console.log('-------------------------------');
}

function doPastHour() {
    console.log('hour');
    updateMap('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson');
}


function doPastDay() {
    console.log('day');
    updateMap('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
}


function doPastWeek() {
    console.log('week');
    updateMap('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson');
}


function doPastMonth() {
    console.log('month');
    updateMap('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson');
}

function updateMap(theurl) {
    console.log('theurl: ', theurl);
    try {
        if (map.getSource('eqid')) {
            map.removeSource('eqid');
        }
    } catch (e) {}
    try {
        if (map.getLayer('eqidlayer')) {
            map.removeLayer('eqidlayer');
        }
    } catch (e) {}
    try {
        if (map.getLayer('symbols')) {
            map.removeLayer('symbols');
        }
    } catch (e) {}

    map.addSource('eqid', {
        type: 'geojson', // see https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
        data: theurl
    });

    var aaaa = map.getSource('eqid');
    console.log('aaaa', aaaa);
    // howMany

    map.addLayer({
        "id": "eqidlayer",
        "type": "circle",
        "source": "eqid",
        "paint": {
            "circle-radius": 15,
            "circle-color": "lightgreen"
        }
    });
    var bbb = map.getLayer('eqidlayer');
    console.log('bbb', bbb);

    map.addLayer({ // shows the names of the child and parent on the line like street names on google maps
        "id": "symbols",
        "type": "symbol",
        "source": "eqid",
        // "minzoom": 12,
        "layout": {
            "symbol-placement": "point",
            'text-rotation-alignment': 'map',
            'text-keep-upright': false, // at least this keeps the site names pointing to the correct ones.
            "text-font": ["Open Sans Regular"],
            "text-field": "{title}",
            "text-size": 14
        }
    });
}

var stopSweep = false;

function doStopSweep() {
    if (stopSweep) {
        $('#stopSweep').text('Stop Sweep');
        stopSweep = false;
        sweepDirectionClockWise = !sweepDirectionClockWise;
        doSpinnyThing()
    } else {
        $('#stopSweep').text('Start Sweep');
        stopSweep = true;
    }

}

var bearingInterval = 10;
var sweepDirectionClockWise = true;

function doSpinnyThing() {
    if (stopSweep) return;

    var lnglat = map.getCenter();

    if(sweepDirectionClockWise) {
        leftBearing += 10;
        if (leftBearing > 360) {
            leftBearing = 0;
        }
    }else{
        leftBearing -= 10;
        if (leftBearing < 0) {
            leftBearing = 360;
        }
    }

    var newLngLat = ruler.destination([lnglat.lng, lnglat.lat], miles, leftBearing);
    var newLngLat2 = ruler.destination([lnglat.lng, lnglat.lat], miles, leftBearing + 10);

    map.getSource('triangle').setData({
        'type': 'Feature',
        'geometry': {
            'type': 'Polygon',
            'coordinates': [
                [
                    [lnglat.lng, lnglat.lat],
                    newLngLat,
                    newLngLat2, [lnglat.lng, lnglat.lat],
                ]
            ]
        }
    });

    window.setTimeout(doSpinnyThing, 100);

    var randomnumber = Math.floor(Math.random()*10)
    map.setPaintProperty('triangle', 'fill-color', colors[randomnumber]);
}


function addTriangle() {
    var lnglat = map.getCenter(); [0, 0, 0, 1]
    console.log(lnglat);

    var newLngLat = ruler.destination([lnglat.lng, lnglat.lat], miles, leftBearing);
    var newLngLat2 = ruler.destination([lnglat.lng, lnglat.lat], miles, leftBearing + 5);

    console.log('newLngLat', newLngLat);

    map.addLayer({
        'id': 'triangle',
        'type': 'fill',
        'source': {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [
                        [
                            [lnglat.lng, lnglat.lat],
                            newLngLat,
                            newLngLat2, [lnglat.lng, lnglat.lat],
                        ]
                    ]
                }
            }
        },
        'layout': {},
        'paint': {
            'fill-color': 'red',
            'fill-outline-color': 'black',
            'fill-opacity': 0.5
        }
    });
    doSpinnyThing();
}

var colors = [
    '#ffffcc',
    '#a1dab4',
    '#41b6c4',
    '#2c7fb8',
    '#253494',
    '#fed976',
    '#feb24c',
    '#fd8d3c',
    '#f03b20',
    '#bd0026'
];
