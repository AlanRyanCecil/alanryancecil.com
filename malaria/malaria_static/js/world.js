'use strict';
var world = L.map('world', {
    center: [3, 16.845402],
    zoom: 2,
}),
drawWorld, geojson;
(function() {

    function hardCases(d) {
        return Math.ceil(d['Malaria cases/100,000 pop.'] * (d.Population / 100000));
    }


    let lightMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.light',
        accessToken: API_KEY
    });
    var africa = 'malaria_static/json/africa_geo.json';
    let world_json = 'malaria_static/json/world.geojson';
    var geoStyle = {
        stroke: false,
        color: '#000',
        weight: 1,
        fill: true,
        fillColor: '#9FD341',
        fillOpacity: 0.8
    }

    function getValueProperty(feature, lookup) {
        try {
            let name = feature.properties.name;
            name !== 'Ivory Coast' ? name : name = "Cote d'Ivoire";
            return hardCases(lookup[name].filter(x => x)[0]);
        } catch (err) {
            return 0;
        }
    }

    let capitals, flagLayer;
    let cases = 'Malaria cases/100,000 pop.';

    drawWorld = function() {
        let countryLookUp = {};

        d3.json(world_json).then(function(geoData) {
            L.geoJson(geoData, {
                style: geoStyle,
            }).bindPopup(function(layer) {
                return layer.feature.properties.name_long;
            });

            d3.json('/mapping-malaria/malaria').then(response => {
                let data = response.filter(d => d.Year === year);
                let capitalMarkers = [];
                let latlng;
                data.forEach(d => {
                    if (d[cases]) {
                        latlng = L.latLng(
                            d['Latitude Number'],
                            d['Longitude Number']
                        );
                        capitalMarkers.push(
                            L.circle(latlng, {
                                color: '#AFA',
                                weight: 1,
                                fillColor: '#0F0',
                                fillOpacity: 0.5,
                                radius: Math.ceil(d[cases]) * 30,
                            })
                        );
                    }
                });



                let countryNest = d3.nest()
                    .key(x => x.Country)
                    .entries(data);
                countryNest.forEach(o => {
                    countryLookUp[o.key] = o.values;
                });

                capitals = L.layerGroup(capitalMarkers);


                function formatThousands(num) {
                    return String(num).replace(/(\d)(?=(\d{3})+\b)/g, '$1,');
                }

                geojson = L.choropleth(geoData, {
                    valueProperty: x => getValueProperty(x, countryLookUp),
                    // scale: ["#07F", "#F00"],
                    scale: ["#39F", "#F00"],
                    steps: 5,
                    mode: "q",
                    style: {
                        color: "#000",
                        weight: 0.5,
                        fillOpacity: 0.5,
                    },
                    onEachFeature: function(feature, layer) {
                        let popup = L.popup({autoPan: false})
                            .setContent(
                            `<h6>${feature.properties.name}</h6>
                        <hr class="pophr">
                        <h6>recorded cases: ${formatThousands(getValueProperty(feature, countryLookUp))}</h6>`
                        );
                        layer.bindPopup(popup);
                        layer.on('mouseover', function(event) {
                            this.openPopup();
                            this.getPopup().setLatLng(event.latlng);
                            this.setStyle({
                                fillOpacity: 0.3
                            });
                        });
                        layer.on('mouseout', function(event) {
                            this.closePopup();
                            this.setStyle({
                                fillOpacity: 0.5
                            });
                        });
                        layer.on('click', function(event) {
                            world.fitBounds(this.getBounds());
                        });
                    }
                });
                world.eachLayer(function(layer) {
                    world.removeLayer(layer);
                });
                world.addLayer(geojson);
                world.addLayer(lightMap);
                let baseMaps = {
                };
                let overlayMaps = {
                    Capitals: capitals,
                };
                        });
                    });
                }
                drawWorld();
})();