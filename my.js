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
        // drawCircle();
    });
    map.on('rotate', function(e) {
        dragAndDropped = true;
    });

    map.on('drag', function(e) {
        dragAndDropped = true;
    });

    map.on('mouseup', function(e) {
        console.log('[', e.lngLat.lng, ',', e.lngLat.lat, '],');
        var zoom = map.getZoom();
        var bearing = map.getBearing();
        var pitch = map.getPitch();
        var zoomleveldiv = 'zoom: ' + trimit(zoom) + '   bearing: '
            + trimit(bearing) + '    pitch: ' + trimit(pitch) + '    time: '
            + (new Date()).getTime();
        console.log(zoomleveldiv);
        $("#zoomLevel").val(zoomleveldiv);
        $("#zoomLevel").text(zoomleveldiv);

        closePopup();
        if (dragAndDropped) {
            dragAndDropped = false;
            // console.log('bailing');
            return;
        }
        console.log('mouseup', e.originalEvent.which);
        console.log(e.originalEvent.which);
        if (e.originalEvent.which == 1) { // left click
            createMarker(e.lngLat.lng, e.lngLat.lat);
        } else { // not left click
            makePopupPicker(e);
        }
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

function trimit(x){
    if(x && x.length > 4) return x.substring(0,4);
    return x;
}

function createMarker(lng, lat) {
    console.log('yoyo',lng,lat);
    // console.log('createMarker', e.lngLat.lat, e.lngLat.lng);
    let marker = getGeoJsonForMarker(lng, lat);
    // console.log('marker', marker);
    let randomImg = 'a' + Math.floor((Math.random() * 8) + 1) + '.gif';

    // create a DOM element for the marker
    var el = document.createElement('div');
    el.className = 'marker';
    el.id = 'markerId_' + kounter;
    el.style.backgroundImage = 'url(images/' + randomImg + ')';
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
            "circle-color": "red"
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

var stopSweep = true;

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

    miles = $('#slider1').val();

    var lnglat = map.getCenter();

    if (sweepDirectionClockWise) {
        leftBearing += 10;
        if (leftBearing > 360) {
            leftBearing = 0;
        }
    } else {
        leftBearing -= 10;
        if (leftBearing < 0) {
            leftBearing = 360;
        }
    }

    var arrayOfLines = [
        [lnglat.lng, lnglat.lat]
    ];

    for (var i = 0; i < 21; i++) {
        arrayOfLines.push(ruler.destination([lnglat.lng, lnglat.lat], miles, leftBearing + i));
    }

    map.getSource('triangle').setData({
        'type': 'Feature',
        'geometry': {
            'type': 'Polygon',
            'coordinates': [
                arrayOfLines
            ]
        }
    });

    window.setTimeout(doSpinnyThing, $('#slider2').val());

    var randomnumber = Math.floor(Math.random() * 10)
    map.setPaintProperty('triangle', 'fill-color', colors[randomnumber]);
}


function addTriangle() {
    var lnglat = map.getCenter();
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
    drawBuilding(-97.47823091415519, 35.5803942751275);
    drawBuilding(-97.56932968086862, 35.52934262490645);
    drawBuilding(-97.4297454357804, 35.332845123425);
    drawBuilding(-97.73882483561242, 35.37299595493684);

    drawS(bbb, 'idbbb');
    drawS(sss, 'idssss');
    drawS(sss2, 'idssss2');
}

var bbb = [
    [-98.61366427972878, 36.93218754678894],
    [-97.97763132645048, 36.911036061510146],
    [-97.81624193314349, 36.70556239489642],
    [-97.94588259333499, 36.588811923466665],
    [-98.62583462741351, 36.57394007973569],
    [-97.98027705420401, 36.56331558031347],
    [-97.73951582813815, 36.36117261587896],
    [-97.89925726009395, 36.180666969172464],
    [-98.6850384045393, 36.15076392284173],
    [-98.61366427972878, 36.93218754678894]
];

var sss = [
    [-96.58952354177613, 36.8395258646125],
    [-96.83205239933287, 36.98081091375451],
    [-97.15773400804478, 36.795147239139624],
    [-96.89095226473539, 36.58399766147852],
    [-96.61377642752878, 36.35273852801181],
    [-96.98796380775356, 36.199114843403834],
    [-97.4106569594912, 36.4057382400116],
    [-97.10922823653192, 36.3108711440553],
    [-96.8181936074699, 36.44755459926873],
    [-97.04686367316363, 36.572868471730615],
    [-97.3309689062942, 36.77572350046444],
    [-96.9844991097878, 36.98081091375451],
    [-96.6310999173575, 36.809018323587836],
    [-96.58952354177613, 36.8395258646125]
];
var sss2 = [
    [-95.76369278221456, 36.89647758564284],
    [-96.08463940342189, 37.0864765778481],
    [-96.32251748737501, 36.902516592240545],
    [-96.07708771821298, 36.61513650937147],
    [-95.72230746199715, 36.39661631076254],
    [-96.0432540832045, 36.19881192604862],
    [-96.37175238963019, 36.405733629764654],
    [-96.0337611681654, 36.175172588623354],
    [-95.61338402508473, 36.4277412879559],
    [-95.91922727587924, 36.54310196426461],
    [-96.27038063790413, 36.81866136354378],
    [-95.96453738710959, 37.03598602352001],
    [-95.60960818248148, 36.827728922679086],
    [-95.76369278221456, 36.89647758564284]
];

function drawS(sssx, idd) {
    map.addLayer({
        'id': idd,
        'type': 'fill-extrusion',
        'source': {
            'type': 'geojson',
            'data': {
                "features": [{
                    "type": "Feature",
                    "properties": {
                        "level": 1,
                        "name": "towerrx",
                        "height": 500000,
                        "base_height": 250000,
                        "color": "red"
                    },
                    "geometry": {
                        "coordinates": [
                            sssx
                        ],
                        "type": "Polygon"
                    },
                    "id": "08a10ab2bf15c4d14234rwecsdf2388062f7f08"
                }],
                "type": "FeatureCollection"
            }

        },
        'paint': {
            // See the Mapbox Style Spec for details on property functions
            // https://www.mapbox.com/mapbox-gl-style-spec/#types-function
            'fill-extrusion-color': {
                // Get the fill-extrusion-color from the source 'color' property.
                'property': 'color',
                'type': 'identity'
            },
            'fill-extrusion-height': {
                // Get fill-extrusion-height from the source 'height' property.
                'property': 'height',
                'type': 'identity'
            },
            'fill-extrusion-base': {
                // Get fill-extrusion-base from the source 'base_height' property.
                'property': 'base_height',
                'type': 'identity'
            },
            // Make extrusions slightly opaque for see through indoor walls.
            'fill-extrusion-opacity': 1
        }
    });
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

function drawBuilding(lngg, latt) {

    var newLngLat = ruler.destination([lngg, latt], 0.1, 90);
    var newLngLat2 = ruler.destination(newLngLat, 0.1, 180);
    var newLngLat3 = ruler.destination(newLngLat2, 0.1, 270);

    // console.log('4', lngg, latt);
    // console.log('1',newLngLat);
    // console.log('2',newLngLat2);
    // console.log('3',newLngLat3);
    // console.log('4',lngg, latt);

    map.addLayer({
        'id': 'room-extrusion' + lngg + '' + latt,
        'type': 'fill-extrusion',
        'source': {
            'type': 'geojson',
            'data': {
                "features": [{
                    "type": "Feature",
                    "properties": {
                        "level": 1,
                        "name": "towerr",
                        "height": 111600,
                        "base_height": 0,
                        "color": "red"
                    },
                    "geometry": {
                        "coordinates": [
                            [
                                [lngg, latt], newLngLat, newLngLat2, newLngLat3, [lngg, latt]
                            ]
                        ],
                        "type": "Polygon"
                    },
                    "id": "08a10ab2bf15c4d14669b588062f7f08"
                }],
                "type": "FeatureCollection"
            }

        },
        'paint': {
            // See the Mapbox Style Spec for details on property functions
            // https://www.mapbox.com/mapbox-gl-style-spec/#types-function
            'fill-extrusion-color': {
                // Get the fill-extrusion-color from the source 'color' property.
                'property': 'color',
                'type': 'identity'
            },
            'fill-extrusion-height': {
                // Get fill-extrusion-height from the source 'height' property.
                'property': 'height',
                'type': 'identity'
            },
            'fill-extrusion-base': {
                // Get fill-extrusion-base from the source 'base_height' property.
                'property': 'base_height',
                'type': 'identity'
            },
            // Make extrusions slightly opaque for see through indoor walls.
            'fill-extrusion-opacity': 1
        }
    });
}

function drawCircle(){

        map.addLayer({
            'id': 'population',
            'type': 'circle',
            'source': {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [
                                -97.51239873448141, 35.52814112741868
                        ]
                    }
                }
            },
            // 'source-layer': 'asdfafsd',
            'paint': {
                // make circles larger as the user zooms from z12 to z22
                'circle-radius': 33,
                // color circles by ethnicity, using data-driven styles
                'circle-color': 'red'
                // {
                //     property: 'ethnicity',
                //     type: 'categorical',
                //     stops: [
                //         ['White', '#fbb03b'],
                //         ['Black', '#223b53'],
                //         ['Hispanic', '#e55e5e'],
                //         ['Asian', '#3bb2d0'],
                //         ['Other', '#ccc']]
                // }
                // 'fill-extrusion-color':'green',
                // 'fill-extrusion-height': 111000,
                // 'fill-extrusion-base': 2000,
                // 'fill-extrusion-opacity': 1
            }
        });
}

function doTTT(){
    alert("BOO!");
    
    var c=document.getElementById("line1");
    var ctx=c.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(300,150);
    ctx.lineWidth = 10;
    ctx.stroke();
    
}
