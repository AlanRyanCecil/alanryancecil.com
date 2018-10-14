'use strict';

let svgWidth, svgHeight, chartMargin,
    chartWidth, chartHeight, fontSize,
    xScale, yScale, xAxis, yAxis,
    xLabel, yLabel, circles, data,
    selectedAttrs, unSelectedAttrs, circleRadius,
    dimensions = ['poverty', 'age', 'income', 'healthcare', 'obesity', 'smokes'],
    svg = d3.select('#plot').append('svg'),
    chartGroup = svg.append('g'),
    dimeX = 'healthcare',
    dimeY = 'poverty',
    transTime = 1000;

function setChartSize() {
    svgWidth = window.innerWidth * 0.8;
    svgHeight = svgWidth * 0.6;
    chartMargin = svgWidth * 0.1;
    chartWidth = svgWidth - (chartMargin * 1.5);
    chartHeight = svgHeight - (chartMargin * 2);
    fontSize = svgWidth * 0.016;
    circleRadius = svgWidth * 0.008;

    unSelectedAttrs = {
        'class': 'label-option',
        'fill': 'black',
        'opacity': 0.4,
        'font-size': fontSize,
    };

    selectedAttrs = {
        'class': 'label-option selected',
        'fill': 'red',
        'opacity': 1,
        'font-size': fontSize * 2,
    };
}

setChartSize();

function format(d, dime) {
    switch (dime) {
        case 'income':
            return '$' + d[dime].toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        case 'age':
            return d[dime];
        default:
            return d[dime] + '%';
    }
}

function tipHTML(d) {
    return `<h6>${d.state}</h6>
        ${dimeX}: ${format(d, dimeX)}<br/>
        ${dimeY}: ${format(d, dimeY)}`;
}

function prepData(data) {
    data.forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
            if (!key.match(/state|abbr/)) {
                obj[key] = +value;
            }
        });
    });
    return data;
}

function setXAxis() {
    xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d[dimeX]))
        .range([0, chartWidth]);
    xAxis = d3.axisBottom(xScale);
}

function setYAxis() {
    yScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d[dimeY]))
        .range([chartHeight, 0]);
    yAxis = d3.axisLeft(yScale);
}

let circlePosition = {
    transform: d => `translate(${xScale(d[dimeX])}, ${yScale(d[dimeY])})`
};

function buildChart() {
    setChartSize();
    setXAxis();
    setYAxis();

    chartGroup.selectAll('g, text').remove();
    svg.attr('width', svgWidth).attr('height', svgHeight);
    chartGroup.attr('transform', `translate(${chartMargin}, ${chartMargin})`);
    chartGroup.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${chartHeight})`)
        .style('font-size', fontSize * 0.75)
        .call(xAxis);

    chartGroup.append('g')
        .attr('class', 'y-axis')
        .style('font-size', fontSize * 0.75)
        .call(yAxis);

    xLabel = chartGroup.append('text')
        .attr('class', 'x axis-label')
        .attr('transform', `translate(${chartWidth / 2}, ${chartHeight + chartMargin / 2})`);

    yLabel = chartGroup.append('text')
        .attr('class', 'y axis-label')
        .attr('transform', `rotate(-90),
            translate(${-chartHeight / 2}, ${-chartMargin / 2})`)

    dimensions.forEach(d => {
        xLabel.append('tspan').attrs(unSelectedAttrs).text(d + ' ');
        yLabel.append('tspan').attrs(unSelectedAttrs).text(d + ' ');
    });
    d3.selectAll('.label-option').on('click', selectDimension);

    xLabel.selectAll('tspan').filter(function() {
        return this.innerHTML.trim() === dimeX;
    }).attrs(selectedAttrs);

    yLabel.selectAll('tspan').filter(function() {
        return this.innerHTML.trim() === dimeY;
    }).attrs(selectedAttrs);

    let tip = d3.tip()
        .attr('class', 'd3-tip')
        .html(tipHTML);
    chartGroup.call(tip);

    circles = chartGroup.append('g')
        .attr('id', 'circle-group')
        .selectAll('.circle')
        .data(data).enter().append('g')
        .attrs(circlePosition);

    circles.append('circle')
        .attrs({
            class: 'circle',
            fill: '#000',
            opacity: 0.8,
            r: circleRadius,
        });
    circles.append('text')
        .text(d => d.abbr)
        .attrs({
            class: 'circle-text',
            'dy': fontSize * 0.2,
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);
}

function selectDimension() {
    let parent = d3.select(this.parentNode),
        thisDim = this.innerHTML.toLowerCase().trim(),
        crossFade = parent.transition().duration(300);

    if (parent.classed('x')) {
        dimeX = thisDim;
        setXAxis();
        chartGroup.select('.x-axis').transition().duration(transTime).call(xAxis);
    } else {
        dimeY = thisDim;
        setYAxis();
        chartGroup.select('.y-axis').transition().duration(transTime).call(yAxis);
    }

    parent.selectAll('tspan').classed('selected', false);
    d3.select(this).classed('selected', true);

    crossFade.selectAll('tspan').attrs(unSelectedAttrs);
    crossFade.select('.selected').attrs(selectedAttrs);
    circles.transition().duration(1000).attrs(circlePosition);
}

d3.csv('health_static/data/data.csv').then(res => {
    data = prepData(res);
    buildChart();
});

window.addEventListener('resize', buildChart);
