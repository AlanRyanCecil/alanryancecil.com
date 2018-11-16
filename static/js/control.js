'use strict';

(function($) {
    let about = $('#about-link'),
        about_me = $('#about-me-section'),
        landing_statement = $('#landing-statement'),
        portfolio = $('#portfolio-link'),
        contact = $('#contact-link'),
        duration = 600;

    function scrollToTarget(that, event) {
        event.preventDefault();
        $('html, body').animate({
            scrollTop: $(that.hash).offset().top
        }, duration);
    }

    function hideAbout() {
        about_me.fadeOut(duration);
        landing_statement.animate({opacity: 1}, duration);
    }

    $('body').on('click', function(event) {
        if (event.target.id !== 'about-link') {
            hideAbout();
        }
    });

    about.on('click', function(event) {
        scrollToTarget(this, event);
        about_me.fadeIn(duration);
        landing_statement.animate({opacity: 0}, duration);
    });

    portfolio.on('click', function(event) {
        scrollToTarget(this, event);
        hideAbout();
    });

    contact.on('click', function(event) {
        scrollToTarget(this, event);
        hideAbout();
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