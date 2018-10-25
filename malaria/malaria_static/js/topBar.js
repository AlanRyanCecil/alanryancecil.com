'use strict';

var drawBars;
(function() {
    drawBars = function () {
        d3.json('/top/10').then(response => {
            let cases = 'Malaria cases/100,000 pop.';
            let data = response.filter(d => d.Year === year).slice(0,5);
            let trace = {
                x: [],
                y: [],
                data: [],
                type: 'bar',
            };
            data.sort((a, b) => b[cases] - a[cases]);
            data.forEach(d => {
                trace.x.push(d['Country']);
                trace.y.push(d[cases]);
                trace.data.push('Alan');
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
    $('#bar-chart').on('plotly_hover', function(data) {
        console.log(data);
    });
    drawBars();
})();