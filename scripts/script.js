var map = L.map('map')
var southWest = L.latLng(40.00, 0.00),
northEast = L.latLng(55.00, 50.00),
bounds = L.latLngBounds(southWest, northEast);

map.setView([48.50, 30.50],6);
map.setMaxBounds(bounds);
map.setMinZoom(5);
map.setMaxZoom(11);

//create pane for showing labels on top the geojson file
map.createPane('labels_pane');
map.getPane('labels_pane').style.zIndex = 650;
map.getPane('labels_pane').style.pointerEvents = 'none';

//main basemap
L.tileLayer('https://api.mapbox.com/styles/v1/mykola-kozyr/cj47dr6zg117v2rlsm62ctk8x/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibXlrb2xhLWtvenlyIiwiYSI6ImNpemNzeHBhaDAwNHkycW8wZm40OHptdTMifQ.6q-bTx4fwm9Ch-knzk1i3Q', {
    maxZoom: 18,
    attribution: '<a href="http://tdukr.com/uk/">Товариство дослідників України</a> | ' + 
                    '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors | ' +
                    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets',
}).addTo(map);

//labels' basemap
L.tileLayer('https://api.mapbox.com/styles/v1/mykola-kozyr/cj4tlgr7d0j0l2spgztk8jkut/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibXlrb2xhLWtvenlyIiwiYSI6ImNpemNzeHBhaDAwNHkycW8wZm40OHptdTMifQ.6q-bTx4fwm9Ch-knzk1i3Q', {
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

//reset highlight functions for filtered layers
function resetHighlight_15(e) {
    otgLayer_15.resetStyle(e.target);
    info.update();
};
function resetHighlight_16(e) {
    otgLayer_16.resetStyle(e.target);
    info.update();
};
function resetHighlight_17(e) {
    otgLayer_17.resetStyle(e.target);
    info.update();
};

//open sidebar while clicking on the OTG
function openSidebar(e) {
    sidebar.show();
    sidebar.setContent('<div id="sidebar"><h1>' + e.target.feature.properties.OTG + '</h1></div><br />' + 
        '<div id="sidebar"><p class="otg_data">Населення ' + e.target.feature.properties.popul_text + '</p></div>' +
        '<div id="sidebar"><p class="otg_data">' + area(e) + '</p></div>' + 
        '<div id="sidebar"><p class="otg_data">' + city_popul(e) + '</p></div>' + 
        '<div id="sidebar"><p class="otg_data">' + urban_index(e) + '</p></div>' + 
        '<div id="sidebar"><p class="otg_data">' + "Кількість об'єднаних адміністративних одиниць: " + e.target.feature.properties.num_units + '</p></div>' +
        '<div id="sidebar"><p class="otg_data">' + settl_num(e) + '</p></div>' + 
        '<div id="sidebar"><p class="otg_data"><div id="line">' + elections(e) + '</div></p></div>' + 
        '<div id="sidebar"><p class="otg_data">' + income_pps(e) + '</p></div>' + 
        '<div id="sidebar"><p class="otg_data">' + outlay_pps(e) + '</p></div>' + 
        '<div id="sidebar"><p class="otg_data">' + subsidy(e) + '</p></div>' + 
        '<div id="sidebar"><p class="otg_data">' + outlay_adm(e) + '</p></div>' + 
        '<div id="sidebar"><p class="otg_data">' + subvent_infr(e) + '</p></div>' + 
        '<div id="sidebar"><p class="otg_data">' + subvent_pcnt(e) + '</p></div>'
        );
    data(e);
    infobutton();
};

//style filtered layers
function style_15(feature){
    return {
        fillColor: '#de2d26',
        weight: 1,
        fillOpacity: 0.6,
        color: 'white',
        dashArray: 3,
        opacity: 0.8,
    }
};
function style_16(feature){
    return {
        fillColor: '#8856a7',
        weight: 1,
        fillOpacity: 0.6,
        color: 'white',
        dashArray: 3,
        opacity: 0.8,
    }
};
function style_17(feature){
    return {
        fillColor: '#2ca25f',
        weight: 1,
        fillOpacity: 0.6,
        color: 'white',
        dashArray: 3,
        opacity: 0.8,
    }
};

//zoom to feature function for doubleclick event
function zoomToFeature(e){
    map.fitBounds(e.target.getBounds(), {
        paddingTopLeft: [500,0]
    });
    console.log('zoomToFeature is starting')
};

map.doubleClickZoom.disable();

//events for filtered layers
function onEachFeature_15(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight_15,
        dblclick: zoomToFeature,
        click: openSidebar
    });
};
function onEachFeature_16(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight_16,
        dblclick: zoomToFeature,
        click: openSidebar
    });
};
function onEachFeature_17(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight_17,
        dblclick: zoomToFeature,
        click: openSidebar
    });
};

//sidebar  animation
setTimeout(function () {
    sidebar.show();
}, 500);

//define filtered layers
var otgLayer_15 = L.geoJson(otg, {
    filter: function(feature, layer){
        return feature.properties.year == "2015";
    },
    style: style_15,
    onEachFeature: onEachFeature_15,
}).addTo(map);

var otgLayer_16 = L.geoJson(otg, {
    filter: function(feature, layer){
        return feature.properties.year == "2016";
    },
    style: style_16,
    onEachFeature: onEachFeature_16,
}).addTo(map);

var otgLayer_17 = L.geoJson(otg, {
    filter: function(feature, layer){
        return feature.properties.year == "2017";
    },
    style: style_17,
    onEachFeature: onEachFeature_17,
}).addTo(map);

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

//hide sidebar when clicking on the map
map.on('click', function () {
    sidebar.hide();
});