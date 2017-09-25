function area(e) {
    if (e.target.feature.properties.area != null) {
        console.log('Площа: ' + e.target.feature.properties.area);
        return('Площа, кв. км: ' + e.target.feature.properties.area + '<br />');
    }
    else {
        console.log('No data about areas')
        return('')
    }
};

function city_popul(e) {
    if (e.target.feature.properties.city_popul != null) {
        console.log('Міське населення, осіб: ' + e.target.feature.properties.city_popul);
        return('Міське населення, осіб: ' + e.target.feature.properties.city_popul + '<br />');
    }
    else {
        console.log('No data about city population');
        return('');
    }
};

function urban_index(e) {
    if (e.target.feature.properties.urban_index != null) {
        console.log('Рівень урбанізації, %: ' + e.target.feature.properties.urban_index)
        return('Рівень урбанізації, %: ' + e.target.feature.properties.urban_index + '<br />')
    }
    else {
        console.log('No data about urban index')
        return('')
    }
};

function settl_num(e) {
    if (e.target.feature.properties.settl_num != null) {
        console.log('Кількість населених пунктів: ' + e.target.feature.properties.settl_num)
        return('Кількість населених пунктів: ' + e.target.feature.properties.settl_num + '<br />')
    }
    else {
        console.log('No data about number of settlements')
        return('')
    }
};

function elections(e) {
    if (e.target.feature.properties.elections != null) {
        console.log('Дата перших виборів: ' + e.target.feature.properties.elections)
        return('Дата перших виборів: ' + e.target.feature.properties.elections + '<br />')
    }
    else {
        console.log('No data about the date of first elections')
        return('')
    }
};

function income_pps(e) {
    if (e.target.feature.properties.income_pps != null) {
        console.log('Власні доходи на мешканця, 2016: ' + e.target.feature.properties.income_pps)
        return('Власні доходи на мешканця, грн у 2016: ' + e.target.feature.properties.income_pps + '<br />')
    }
    else {
        console.log('No data about the income per person')
        return('')
    }
};

function outlay_pps(e) {
    if (e.target.feature.properties.outlay_pps != null) {
        console.log('Капітальні видатки на мешканця, 2016: ' + e.target.feature.properties.outlay_pps)
        return('Капітальні видатки на мешканця, грн у 2016: ' + e.target.feature.properties.outlay_pps + '<br />')
    }
    else {
        console.log('No data about the outlay per person')
        return('')
    }
};

function subsidy(e) {
    if (e.target.feature.properties.subsidy != null) {
        console.log('Рівень дотаційності бюджетів: ' + e.target.feature.properties.subsidy)
        return('Рівень дотаційності бюджетів: ' + e.target.feature.properties.subsidy + '<br />')
    }
    else {
        console.log('No data about the budget subsidy')
        return('')
    }
};

function outlay_adm(e) {
    if (e.target.feature.properties.outlay_adm != null) {
        console.log('Питома вага видатків на утримання апарату управління: ' + e.target.feature.properties.outlay_adm)
        return('Питома вага видатків на утримання апарату управління: ' + e.target.feature.properties.outlay_adm + '<br />')
    }
    else {
        console.log('No data about the outlay for administration')
        return('')
    }
};

function subvent_infr(e) {
    if (e.target.feature.properties.subvent_infr != null) {
        console.log('Обсяг субвенцій на формування інфраструктури ОТГ, тис. грн: ' + e.target.feature.properties.subvent_infr)
        return('Обсяг субвенцій на формування інфраструктури ОТГ, тис. грн: ' + e.target.feature.properties.subvent_infr + '<br />')
    }
    else {
        console.log('No data about the subventions for infrastructure')
        return('')
    }
};

function subvent_pcnt(e) {
    if (e.target.feature.properties.subvent_pcnt != null) {
        console.log('Частка субвенцій на формування інфраструктури ОТГ: ' + e.target.feature.properties.subvent_pcnt)
        return('Частка субвенцій на формування інфраструктури ОТГ: ' + e.target.feature.properties.subvent_pcnt + '<br />')
    }
    else {
        console.log('No data about the subventions part in budget')
        return('')
    }
};