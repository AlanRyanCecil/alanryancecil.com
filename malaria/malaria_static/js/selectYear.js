'use strict';

var year = 2006;
let yearDisplay = d3.select('.year-display');
d3.select('.year-minus').on('click', function() {
    year > 2006 ? year-- : null;
    yearDisplay.text(year);
    drawWorld();
    drawBars();
    scatter();
});

d3.select('.year-plus').on('click', function() {
    year < 2013 ? year++ : null;
    yearDisplay.text(year);
    drawWorld();
    drawBars();
    scatter();
});

$('.btn').on('click', function(event) {
    event.preventDefault();
    let hash = this.hash;
    if (hash !== '') {
        $('html, body').animate({
            scrollTop: $(hash).offset().top
        }, 500, function() {
            // window.location.hash = hash;
        });
    }
});