'use strict';

(function($) {
    function scrollToTarget(that, event) {
        event.preventDefault();
        $('html, body').animate({
            scrollTop: $(that.hash).offset().top
        }, 600);
    }
    let about = $('#about-link'),
        portfolio = $('#portfolio-link'),
        contact = $('#contact-link');

    about.on('click', function(event) {
        scrollToTarget(this, event);
    });

    portfolio.on('click', function(event) {
        scrollToTarget(this, event);
    });

    contact.on('click', function(event) {
        scrollToTarget(this, event);
    });


    let BG = $('#BG'),
        landing = $('#landing-space'),
        minOpacity = 0,
        maxOpacity = 1,
        range = window.innerHeight / 2;
    $(window).on('scroll', function() {
        let scrollTop = $(this).scrollTop(),
            height = BG.outerHeight(),
            offset = height / 2,
            opacity = 1 - (scrollTop - offset + range) / range / 2;

        opacity = opacity < minOpacity ? minOpacity : 
            opacity > maxOpacity ? maxOpacity : opacity;

        BG.css({opacity: opacity});

    });



console.log(window.innerWidth);





})(window.jQuery);