'use strict';

function init() {
    let alienData = data.map(row => {
        return {
            date: row.datetime,
            country: row.country.toUpperCase(),
            state: row.state.toUpperCase(),
            city: toTitle(row.city),
            shape: toTitle(row.shape),
            duration: String(row.durationMinutes).replace(/min.*/, '').trim(),
            comment: pareseHTMLCharCodes(row.comments),
        };
    });

    let states = alienData.map(x => x.state).filter(getUnique).sort(),
        countries = alienData.map(x => x.country).filter(getUnique).sort(),
        shapes = alienData.map(x => x.shape).filter(getUnique).sort();

    countries.forEach(x => {
        countryInupt.append('input')
            .attr('type', 'checkbox')
            .attr('id', 'country-box-' + x)
            .attr('class', 'cstm-checkbox');
        countryInupt.append('label').attr('class', 'cstm-label')
            .attr('for', 'country-box-' + x).text(x);
    });

    shapes.forEach(x => {
        let check = shapeInput.append('div').attr('class', 'col-sm-6');
        check.append('input').attr('type', 'checkbox').attr('class', 'cstm-checkbox')
            .attr('id', 'shape' + x);
        check.append('label').attr('for', 'shape' + x)
            .attr('class', 'cstm-label').text(x);
    });
    return alienData;
}

const shapesToggle = d3.select('#all-shapes'),
    table= d3.select('tbody'),
    form = d3.select('#main-form'),
    dateInput = d3.select('#date-input'),
    countryInupt = d3.select('#country-checks'),
    stateInput = d3.select('#state-input'),
    cityInput = d3.select('#city-input'),
    shapeInput = d3.select('#shape-form'),
    durationInput = d3.select('#duration-input'),
    keywordInput = d3.select('#keyword-input');

const alienData = init();
refreshTable(table, alienData);

shapesToggle.on('change', toggleShapes);
form.on('change keyup', handleFormChange);
