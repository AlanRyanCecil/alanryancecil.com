'use strict';

let category_elem = document.getElementById('business-categories'),
    star_plot = document.getElementById('star-bar-plot'),
    review_section = $('#review-section'),
    sum_sect = $('#summary-section'),
    current_business, current_reviews,
    current_star, keyword, review_page, reviews_title,
    data, categories,
    star_words = ['One', 'Two', 'Three', 'Four', 'Five'];


$('.dropdown-item').on('click', function(event) {
    current_business = event.target.innerText;
    current_star = 0;
    review_page = 0;
    keyword = null;
    d3.json('/n-yelp-p/data/' + current_business).then(function(response) {
        data = response;
        data.forEach(x => x.date = new Date(x.date));
        draw_twoAxis_bubbles(data);
        setMapLocation(data[0].business_id);
        categories = data[0].categories
            .replace(/[^\w]/g, ' ').split(' ').filter(x => x).join(' - ');
        categories = '<span class="yelp-blue">' + categories + '</span>'
        $('#business-name').text(data[0].name);
        $('#business-details').html(data[0].price + ' &#8226; ' + categories);

        $('#map').show();
        world.invalidateSize();
        reviews_title = 'Most Recent Reviews';
        populateReviewSection();
        writeSummary();
        generateWordcloud();

        let star_list = [0, 0, 0, 0, 0];
        data.forEach(x => star_list[x.stars - 1] += 1);
        Plotly.newPlot(star_plot, [{
            x: star_list,
            y: [
                '&#9733;',
                '&#9733;&#9733;',
                '&#9733;&#9733;&#9733;',
                '&#9733;&#9733;&#9733;&#9733;',
                '&#9733;&#9733;&#9733;&#9733;&#9733;'
            ],
            orientation: 'h',
            hoverinfo: 'x',
            type: 'bar',
            width: 0.8,
            marker: {
                color: '#FFD20E',
            },
        }], {
            title: data[0].review_count + ' Total Reviews',
            // title: data[0].name,
            font: {
                // size: 32,
            },
            xaxis: {
                showgrid: false,
                showticklabels: false,
                font: {
                    size: 3
                },
            },
            yaxis: {
                showgrid: false,
            },
            margin: {l: 80, r: 0, b: 80, t: 80, pad: 4},
        }, {
            displayModeBar: false,
        });

        star_plot.on('plotly_click', function(event) {
            current_star = event.points[0].pointIndex + 1;
            review_page = 0;
            keyword = null;

            reviews_title = 'Most Recent ' + star_words[current_star - 1] + ' Star Reviews';
            populateReviewSection();
            writeSummary();
        });
    });
});

function toTitle(str) {
    return str.split(' ')
        .map(x => x.toLowerCase().replace(/\w/, x => x.toUpperCase())).join(' ');
}

function writeSummary() {
    sum_sect.empty();
    sum_sect.append('<h4 class="yelp-red">Generating Review Summary...</h4>');
    sum_sect.append('<hr>');
    sum_sect.append('<p id="fill-text"></p>');
    let fillText = $('#fill-text');
    fillText.append(randomText(2000));
    let text_gen = summarySimulator(fillText);


    // d3.json('/n-yelp-p/test').then(function(tokens) {
    d3.json('/n-yelp-p/tokens/' + current_business + '/' + current_star).then(function(tokens) {
        sum_sect.empty();
        let starword = current_star ? star_words[current_star - 1] + ' Star' : '';
        sum_sect.append(
            '<h4 class="yelp-red">Summary of the 300 Most Recent ' + starword + ' Reviews</h4>');
        sum_sect.append('<hr>');
        sum_sect.append('<p>' + tokens.summary + '</p>')

        $('.adj-btn, .noun-btn').on('click', function(event) {
            review_page = 0;
            keyword = event.target.innerText;
            $('.last-btn').addClass('disabled', true);
            reviews_title = starword + ' Reviews Containing "' + toTitle(keyword) + '"';
            populateReviewSection();
        });
    });
}


function populateReviewSection() {
    let page = (review_page + 1) * 3;
    let reviews = current_star ? data.filter(x => x.stars === current_star) : data.slice(0);
    if (keyword) {
        var re = new RegExp(' ' + keyword + ' ', 'gi');
        reviews = reviews.filter(x => x.text.match(re));
    }
    review_section.empty();
    review_section.append('<h4 class="yelp-red">' + reviews_title + '</h4>');
    review_section.append('<hr>');
    reviews.slice(page - 3, page).forEach(function(x) {
        let text = x.text.replace(re, '<span class="adj-btn">' + keyword + '</span>'),
            vader_score = '<span class="sentiment-score">Sentiment: ' + x.vader + '</span> ';
        review_section.append(
            '<p>' + text + '</p><p>' + vader_score + vaderEmoji(x.vader) + '<p><hr>');
        review_section.append('<br>');
    });
    $('#review-page-btns').css('display', 'inline-flex');
}

$('.last-btn, .next-btn').on('click', function(event) {
    event.preventDefault();
    if (this.hash !== '') {
        $('html, body').animate({
            scrollTop: $(this.hash).offset().top * 1.05
        }, 500);
    }

    let current_page = review_page;
    let page_up = event.target.innerText === 'next page';
    page_up ? review_page += 1 : review_page ? review_page -= 1 : 0;
    current_page !== review_page ? populateReviewSection() : null;

    review_page ? $('.last-btn').removeClass('disabled') :
        $('.last-btn').addClass('disabled', true);
});

function vaderEmoji(score) {
    let face = score <= -0.05 ? '🙁' : score >= 0.05 ? '😀' : '😐';
    return '<span class="vader-face">' + face + '</span>';
}

function randomText(length) {
    length = length || 1;
    let text = '';
    for (let i = 0; i < length; i++) {
        if (Math.floor(Math.random() * 3)) {
            text += String.fromCharCode(Math.floor(Math.random() * 25) + 97);
        } else {
            text += ' ';
        }
    }
    return text;
}

function summarySimulator(elem) {
    return setInterval(function() {
        let i = Math.floor(Math.random() * elem[0].innerText.length);
        let text = elem[0].innerText
            .slice(0, i) + randomText() + elem[0].innerText.slice(i + 1);
        elem.empty();
        elem.append(text);
    }, 64);
}


function generateWordcloud() {
    $('.generating').fadeIn(1000, function() {
        $('.word-cloud').remove();
    });
    let rnd = Math.round(Math.random() * 1000000);
    d3.json('/n-yelp-p/wordcloud/' + current_business + '/' + 0).then(function(res) {
        console.log(res);
    $('.word-cloud-section')
        .prepend('<img class="word-cloud" src="yelp_static/images/wordcloud.png?dummy=' + rnd + '">');
        $('.generating').fadeOut(1000);
    });
}
