'use strict';

let API_KEY = 'pk.eyJ1IjoiYWxhbnJ5YW5jZWNpbCIsImEiOiJjam4xMXZtbzQ0ZzhtM3hxY2RkZTg0ZTRkIn0.TQM4BtDAX6tAh7LrIc99-A';

var streetMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        maxZoom: 18,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

var world = L.map('map', {
    center: [36.11, -115.17],
    zoom: 10,
    layers: [streetMap],
});

var markers = L.layerGroup();
world.addLayer(markers);
function setMapLocation(bid) {
    d3.json('/n-yelp-p/business/' + bid).then(function(budata) {
        let latlng = [budata.coordinates.latitude, budata.coordinates.longitude]
        world.flyTo(latlng, 16);
        markers.clearLayers();
        markers.addLayer(L.marker(latlng));
    });
}