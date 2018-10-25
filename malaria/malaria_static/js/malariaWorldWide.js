'use strict';
(function() {
function hardCases(d) {
    return Math.ceil(d['Malaria cases/100,000 pop.'] * (d.Population / 100000));
}

let malaria = {
    x: [],
    y: [],
    fill: 'tonexty',
    name: 'Malaria Cases',
}

let population = {
    x: [],
    y: [],
    fill: 'tonexty',
    name: 'Population',
}

d3.json('/malaria').then(data => {
    let years = d3.nest()
        .key(d => d.Year)
        .entries(data);
    years.forEach(year => {
        malaria.x.push(year.key);
        malaria.y.push(year.values.map(x => hardCases(x)).reduce((a, b) => a + b));
        population.x.push(year.key);
        population.y.push(year.values.map(x => x.Population).reduce((a, b) => a + b));
    });
    Plotly.newPlot('world-wide', [malaria, population]);
});
})();