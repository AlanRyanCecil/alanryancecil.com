'use strict';

(function() {
d3.json('/top/5').then(data => {
    let cases = 'Malaria cases/100,000 pop.';
    let plotData = [];
    data = d3.nest()
        .key(x => x.Country)
        .entries(data);
    data.forEach(country => {
        plotData.push({
            x: country.values.map(d => d.Year),
            y: country.values.map(d => d[cases]),
            name: country.key,
            fill: 'tonexty',
            type: 'scatter',
        });
    });
    let layout = {
        title: 'Highest Burden Countries',
        titlefont: {
            size: 32,
        },
    };

    Plotly.newPlot('top-countries', plotData, layout);
});
})();
