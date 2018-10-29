'use strict';

function toTitle(str) {
    return str.split(' ')
        .map(x => x.toLowerCase().replace(/\w/, y => y.toUpperCase())).join(' ');
}

function pareseHTMLCharCodes(str) {
    return str.replace(/&#(\d+)/g, (match, code) => String.fromCharCode(code));
}

function getUnique(item, index, arr) {
    return arr.indexOf(item) === index;
}

function toggleShapes() {
    shapeInput.selectAll('input').property('checked', shapesToggle.property('checked'));
}

function cleanString(str, spltr) {
    return str.toLowerCase().replace(/[^a-z\s]|\//g, spltr).split(spltr).map(x => x.trim());
}

function searched(input, type) {
    let value = input.property('value');
    switch (type) {
        case 'date':
            return value.replace(/(\d+)-0*(\d+)-0*(\d+)/, '$2/$3/$1');
        case 'duration':
            return value;
    }
    let spltr = type === 'city' ? ',' : ' ';
    return value ? cleanString(value, spltr) : null;
}

function checked(input, sub) {
    sub = sub ? new RegExp('^' + sub) : 'country-box-';
    let arr = input.selectAll('input').nodes().filter(x => x.checked)
        .map(x => x.id.toLowerCase().replace(sub, ''));
    return arr.length ? arr : null;
}

function buildSearch() {
    let search = {
        date: searched(dateInput, 'date'),
        country: checked(countryInupt),
        state: searched(stateInput),
        city: searched(cityInput, 'city'),
        shape: checked(shapeInput, 'shape'),
        duration: searched(durationInput, 'duration'),
        comment: searched(keywordInput),
    };
    Object.entries(search).forEach(([key, value]) => {
        value ? 'do nothing' : delete search[key];
    });
    return search;
}

function filterData(search) {
    return alienData.filter(item => {
        return Object.entries(search).every(([key, value]) => {
            let datum = item[key];
            if (key === 'comment') {
                let comment = cleanString(datum, ' ');
                return value.filter(x => x.length).every(x => {
                    let re = new RegExp('^' + x);
                    return comment.some(c => c.match(re));
                });
            }
            if (key === 'duration') {
                let nums = datum.match(/\d+/g);
                return nums ? nums.includes(value) : false;
            }
            if (key === 'city') {
                return value.some(x => {
                    let re = x.length ? new RegExp('^' + x) : null;
                    return datum.toLowerCase().match(re);
                });
            }
            return value.includes(datum.toLowerCase());
        });
    });
}

function refreshTable(table, arr) {
    table.selectAll('tr').remove();
    arr.forEach(sighting => {
        let row = table.append('tr');
        Object.values(sighting).forEach(value => {
            row.append('td').text(value);
        });
    });
}

function handleFormChange() {
    refreshTable(table, filterData(buildSearch()));
}
