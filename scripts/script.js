var map = L.map('map')
var southWest = L.latLng(40.00, 0.00),
northEast = L.latLng(55.00, 43.00),
bounds = L.latLngBounds(southWest, northEast);

map.setView([49.03, 31.50],6);
map.setMaxBounds(bounds);
map.setMinZoom(5);
map.setMaxZoom(10);

// create pane for showing labels on top the geojson file
map.createPane('labels_pane');
map.getPane('labels_pane').style.zIndex = 650;
map.getPane('labels_pane').style.pointerEvents = 'none';

map.createPane('basemap_pane');
map.getPane('basemap_pane').style.zIndex = 100;
map.getPane('basemap_pane').style.pointerEvents = 'none';        

//main basemap
L.tileLayer('https://api.mapbox.com/styles/v1/mykola-kozyr/cj47dr6zg117v2rlsm62ctk8x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibXlrb2xhLWtvenlyIiwiYSI6ImNpemNzeHBhaDAwNHkycW8wZm40OHptdTMifQ.6q-bTx4fwm9Ch-knzk1i3Q', {
    maxZoom: 18,
    attribution: '<a href="http://tdukr.com/uk/">Товариство дослідників України</a> | ' + 
                    '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors | ' +
                    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets',
    pane: 'basemap_pane'
}).addTo(map);

//labels' basemap
L.tileLayer('https://api.mapbox.com/styles/v1/mykola-kozyr/cj4734xjt0snd2splhlf0z4c8/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibXlrb2xhLWtvenlyIiwiYSI6ImNpemNzeHBhaDAwNHkycW8wZm40OHptdTMifQ.6q-bTx4fwm9Ch-knzk1i3Q', {
    maxZoom: 18,
    id: 'mapbox.labels',
    pane: 'labels_pane'
}).addTo(map);

//define and add sidebar to the map
var sidebar = L.control.sidebar('sidebar', {
    closeButton: true,
    position: 'left'
});
map.addControl(sidebar);

//highlight feature while mouseover
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 3,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.5
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

//define otg layer
var otgLayer;

function resetHighlight(e) {
    otgLayer.resetStyle(e.target);
    info.update();
};

function openSidebar(e) {
    sidebar.show();
    sidebar.setContent('<h2>' + e.target.feature.properties.OTG + '</h2><br />' + 
        area(e) + 
        city_popul(e) +
        urban_index(e) +
        settl_num(e) +
        elections(e) +
        income_pps(e) +
        outlay_pps(e) +
        subsidy(e) +
        outlay_adm(e) +
        subvent_infr(e) +
        subvent_pcnt(e)
        );
    data(e);
};

function regStyle(feature){
    return {
        fillColor: 'blue',
        weight: 1,
        fillOpacity: 0.3,
        color: 'white',
        dashArray: 3,
        opacity: 0.8,
    }
};

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: openSidebar
    });
};

setTimeout(function () {
    sidebar.show();
}, 500);

var marker = L.marker([50.2, 31]).addTo(map).on('click', function () {
    sidebar.toggle();
});

var otgLayer = L.geoJson(otg, {
    style: regStyle,
    onEachFeature: onEachFeature,
}).addTo(map);

map.on('click', function () {
    sidebar.hide();
});

/*//SIDEBAR console.log part for handling the issue
        sidebar.on('show', function () {
            console.log('Sidebar will be visible.');
        });

        sidebar.on('shown', function () {
            console.log('Sidebar is visible.');
        });

        sidebar.on('hide', function () {
            console.log('Sidebar will be hidden.');
        });

        sidebar.on('hidden', function () {
            console.log('Sidebar is hidden.');
        });

        L.DomEvent.on(sidebar.getCloseButton(), 'click', function () {
            console.log('Close button clicked.');
        });*/

// INFOPANEL BLOCK
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

/*// show all the information saved in GEOJSON file
function featureprops (props) {
    var infocontent = [];
    for (var prop in props) {
        infocontent.push(prop + ': ' + props[prop]);
    }
    return infocontent.join('<br />');
};*/

// updates the infopanel for showing some short information
info.update = function (props) {
    this._div.innerHTML = "<h4>Об'єднані територіальні громади</h4>" +  (props ?
        '<b>' + props.OTG + '</b><br /> Населення: ' + props.popul_text +
        "<br /> Кількість об'єднаних адміністративних одиниць: " + props.num_units + 
        '<h5>Натисніть для відображення детальної інформації</h5>' : 'Наведіть на ОТГ');
};
info.addTo(map);