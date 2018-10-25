'use strict';

let svgWidth, svgHeight, chartMargin,
    chartWidth, chartHeight, fontSize,
    xScale, yScale, xAxis, yAxis,
    xLabel, yLabel, circles, stackData,
    svg = d3.select('#stacked').append('svg'),
    chartGroup = svg.append('g'),
    transTime = 1000;

let cases = 'Malaria cases/100,000 pop. - wef_cm';

let yearFormat = d3.timeFormat('%Y');

function setXAxis() {
    xScale = d3.scaleTime()
        .domain([new Date(2006, 1, 1), new Date(2014, 1, 1)])
        .range([0, chartWidth]);
    xAxis = d3.axisBottom(xScale);
}

function setYAxis() {
    yScale = d3.scaleLinear()
        .domain([0, 50000])//d3.max(stackData, d => d[cases])])
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

    let area = d3.area()
        // .curve(d3.curveStep)
        .x(d => xScale(d.Year))
        .y0(d => yScale(0))
        .y1(d => yScale(d[cases]));

    let line = d3.line()
        .x(d => xScale(d.Year))
        .y(d => yScale(d[cases]));

    chartGroup.selectAll('g, text').remove();
    chartGroup.attr('transform', `translate(${chartMargin}, ${chartMargin})`);
    svg.attr('width', svgWidth).attr('height', svgHeight);

    chartGroup.append("g")
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(xAxis);

    chartGroup.append("g")
        .call(yAxis);

    let pathGroup = chartGroup.append('g');
    stackData.forEach(x => {
        pathGroup.append('path')
            .datum(x.values)
            .attr('d', area)
            .attr('fill', 'blue');
    });
}

d3.json('/top/5').then(data => {
    console.log(data);
    stackData = d3.nest()
        .key(d => d.Entity)
        .entries(data);
    buildChart();
});
