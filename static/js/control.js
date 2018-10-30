'use strict';

(function() {
$(function() {
    $('#fswd').on('click', function(event) {
        event.preventDefault();
        $('html, body').animate({
            scrollTop: $(this.hash).offset().top
        }, 500);
    })
})
})();