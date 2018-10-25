'use strict';
var scatter = function() {
d3.json('/malaria').then(response => {
    let cases = 'Malaria cases/100,000 pop.';
    let data = response.filter(x => x[cases] > 100 && x.Year === year);
    let trace = {
        x: [],
        y: [],
        text: [],
        hoverinfo: 'text',
        mode: 'markers',
        marker: {
            size: 12,
            color: 'rgba(255, 56, 56, 0.7)',
        },
        type: 'scatter',
    };
    data.forEach(d => {
        trace.x.push(d['GDP/capita']);
        trace.y.push(d[cases]);
        trace.text.push(d['Country'])
    });
    Plotly.newPlot('gdp-scatter', [trace], layout);
});

let layout = {
    title: 'GDP and Malaria',
    titlefont: {
        size: 24,
    },
    xaxis: {
        title: 'GDP per Capita',
    },
    yaxis: {
        title: 'Malaria Cases per 100,000 pop',
    },
};
};

scatter();
