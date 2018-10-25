'use strict';

var drawBars;
(function() {
    drawBars = function () {
        d3.json('/mapping-malaria/top/10').then(response => {
            let cases = 'Malaria cases/100,000 pop.';
            let data = response.filter(d => d.Year === year).slice(0,5);
            let trace = {
                x: [],
                y: [],
                latlng: [],
                type: 'bar',
            };
            data.sort((a, b) => b[cases] - a[cases]);
            data.forEach(d => {
                trace.x.push(d['Country']);
                trace.y.push(d[cases]);
                trace.latlng.push(L.latLng(d['Latitude Number'], d['Longitude Number']));
            });
            Plotly.newPlot('bar-chart', [trace], layout);
        });

        let layout = {
            title: 'Top Five Countries',
            titlefont: {
                size: 24,
                family: 'Oxygen',
            },
            xaxis: {
                title: 'Country',
            },
            yaxis: {
                title: 'Malaria Cases per 100,000 pop.',
            },
        };
    }
    $('#bar-chart').on('plotly_click', function(x, event) {
        let data = event.points[0],
            index = data.pointIndex,
            name = data.x,
            latlng = data.data.latlng[index];
        name !== "Cote d'Ivoire" ? name : name = 'Ivory Coast';
        let country = geojson.getLayers()
                .filter(x => x.feature.properties.name === name)[0];
        world.flyTo(latlng);
        world.flyToBounds(country.getBounds());
        country.openPopup();
    });
    drawBars();
})();
