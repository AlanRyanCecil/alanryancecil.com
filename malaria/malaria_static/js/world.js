'use strict';
var drawWorld;
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

    let world = L.map('world', {
        center: [3, 16.845402],
        zoom: 2,
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
            return hardCases(lookup[feature.properties.name].filter(x => x)[0]);
        } catch (err) {
            return 0;
        }
    }

    let capitals, flagLayer, geojson;
    let cases = 'Malaria cases/100,000 pop.';

    drawWorld = function() {
        let countryLookUp = {};

        d3.json(world_json).then(function(geoData) {
            L.geoJson(geoData, {
                style: geoStyle,
            }).bindPopup(function(layer) {
                return layer.feature.properties.name_long;
            });

            d3.json('/malaria').then(response => {
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
                    scale: ["#07F", "#F00"],
                    steps: 16,
                    mode: "q",
                    style: {
                        color: "#000",
                        weight: 0.5,
                        fillOpacity: 0.7,
                    },
                    onEachFeature: function(feature, layer) {
                        layer.bindPopup(
                            `<h6>${feature.properties.name}</h6>
                        <hr class="pophr">
                        <h6>Cases: ${formatThousands(getValueProperty(feature, countryLookUp))}</h6>`
                        );
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
                                fillOpacity: 0.7
                            });
                        });
                        layer.on('click', function(event) {
                            world.fitBounds(this.getBounds());
                        });
                    }
                });
                // let flagList = [];
                // d3.json('/top/10').then(response => {
                //     let cases = 'Malaria cases/100,000 pop.';
                //     let flagData = response.filter(d => d.Year === year).slice(0, 5);
                //     flagData.forEach(x => {
                //         let code = x['Country Code'].slice(0, 2).toLowerCase();
                //         let latlng = L.latLng(
                //             x['Latitude Number'],
                //             x['Longitude Number']
                //         );

                //         let flag = L.icon({
                //             iconUrl: `../malaria_static/images/flags/${code}.png`,
                //             iconSize: [32, 32],
                //         });
                //         flagList.push(
                //             L.marker(latlng, {
                //                 icon: flag,
                //             })
                //         );
                //     });
                // });
                // flagLayer = L.layerGroup(flagList);
                world.eachLayer(function(layer) {
                    world.removeLayer(layer);
                });
                world.addLayer(geojson);
                // world.addLayer(capitals);
                // world.addLayer(flagList);
                let baseMaps = {
                    // geojson: geojson,
                };
                let overlayMaps = {
                    Capitals: capitals,
                };
                // let control = L.control.layers(baseMaps, overlayMaps, {
                //     collapsed: false,
                //     position: 'bottomright',
                // });
                // control.addTo(world);
                        });
                    });
                }
                drawWorld();
                // d3.select('.year-minus').on('click', drawMap);
                // d3.select('.year-plus').on('click', drawMap);
})();