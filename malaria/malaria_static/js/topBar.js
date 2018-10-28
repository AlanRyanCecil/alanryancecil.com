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
                type: 'bar',
            };
            data.sort((a, b) => b[cases] - a[cases]);
            data.forEach(d => {
                trace.x.push(d['Country']);
                trace.y.push(d[cases]);
            });
            Plotly.newPlot('bar-chart', [trace], layout);
        });

        let layout = {
            title: 'Top Five Countries',
            titlefont: {
                size: 28,
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
        let name = event.points[0].x;
        name !== "Cote d'Ivoire" ? name : name = 'Ivory Coast';
        let country = geojson.getLayers()
                .filter(x => x.feature.properties.name === name)[0];
        world.flyToBounds(country.getBounds());
        country.openPopup();
    });
    drawBars();
})();
