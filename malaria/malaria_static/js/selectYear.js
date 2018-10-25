'use strict';

let year = 2006;
let yearDisplay = $('#year-display');
let forward, backward;

function playForward() {
    forward = setInterval(function() {
        year < 2013 ? year++ : null;
        yearDisplay.text(year);
        drawWorld();
        drawBars();
        scatter();
        year == 2013 ? clearInterval(forward) : null;
    }, 1000)
}

function playBack() {
    backward = setInterval(function() {
        year > 2006 ? year-- : null;
        yearDisplay.text(year);
        drawWorld();
        drawBars();
        scatter();
        year == 2006 ? clearInterval(backward) : null;
    }, 1000)
}

yearDisplay.on('click', function() {
    clearInterval(forward);
    clearInterval(backward);
});

d3.select('.year-minus').on('click', function() {
    playBack();
});

d3.select('.year-plus').on('click', function() {
    playForward();
});

$('.scroll-anchor').on('click', function(event) {
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