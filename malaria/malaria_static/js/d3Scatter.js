'use strict';

(function() {
let svgWidth, svgHeight, chartMargin,
    chartWidth, chartHeight, fontSize,
    xScale, yScale, xAxis, yAxis,
    xLabel, yLabel, circles, data,
    svg = d3.select('#gdp-scatter').append('svg'),
    chartGroup = svg.append('g'),
    transTime = 1000;

let cases = 'Malaria cases/100,000 pop.';

let yearFormat = d3.timeFormat('%Y');

function setXAxis() {
    xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d['GDP/capita']) * 1.1])
        .range([0, chartWidth]);
    xAxis = d3.axisBottom(xScale);
}

function setYAxis() {
    yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[cases]) * 1.1])
        .range([chartHeight, 0]);
    yAxis = d3.axisLeft(yScale);
}

function buildChart() {
    svgWidth = window.innerWidth * 0.8;
    svgHeight = svgWidth * 0.6;
    chartMargin = svgWidth * 0.1;
    chartWidth = svgWidth - (chartMargin * 1.5);
    chartHeight = svgHeight - (chartMargin * 2);
    fontSize = svgWidth * 0.016;

    setXAxis();
    setYAxis();

    chartGroup.selectAll('g, text').remove();
    svg.attr('width', svgWidth).attr('height', svgHeight);
    chartGroup.attr('transform', `translate(${chartMargin}, ${chartMargin})`);

    chartGroup.append("g")
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(xAxis);

    chartGroup.append("g")
        .call(yAxis);

    circles = chartGroup.append('g')
        .attr('id', 'circle-group')
        .selectAll('.circle')
        .data(data).enter().append('g')
    circles.append('circle')
        .attrs({
            cx: d => xScale(d['GDP/capita']),
            cy: d => xScale(d[cases]),
            class: 'circle',
            fill: '#F40',
            opacity: 0.8,
            r: 12,
        });

}

d3.json('/malaria').then(response => {
    data = response.filter(x => x[cases] > 100);
    buildChart();
});

})();