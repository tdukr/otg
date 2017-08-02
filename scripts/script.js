var map = L.map('map')
var southWest = L.latLng(40.00, 0.00),
northEast = L.latLng(55.00, 50.00),
bounds = L.latLngBounds(southWest, northEast);

map.setView([48.50, 30.50],6);
map.setMaxBounds(bounds);
map.setMinZoom(5);
map.setMaxZoom(18);

//create pane for showing labels on top the geojson file
map.createPane('labels_pane');
map.getPane('labels_pane').style.zIndex = 650;
map.getPane('labels_pane').style.pointerEvents = 'none';
//create pane for search .geojson
map.createPane('search_pane');
map.getPane('search_pane').style.zIndex = 200;
map.getPane('search_pane').style.pointerEvents = 'none';

//BASEMAPS
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

// SIDEBAR
//define and add sidebar to the map
var sidebar = L.control.sidebar('sidebar', {
    closeButton: true,
    position: 'left'
});
map.addControl(sidebar);
//open sidebar while clicking on the OTG
function openSidebar(e) {
    console.log(e);
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

    // crazy stuff for highlighting the invisible otg_layer
    var bounds = e.target._bounds._northEast.lat;
    console.log(bounds);
    var features = otg_layer._layers;
    for (key in features) {
        //console.log(features[key]._bounds._northEast);
        if (features[key]._bounds._northEast.lat == bounds) {
            features[key].setStyle({
                opacity: 0.8,
                weight: 2,
                color: 'red',
                dashArray: 4,
                pane: 'labels_pane'
            });
        }
        else {
            features[key].setStyle({
                opacity: 0,
                pane: 'search_pane'
            });
        }
    };  

    data(e);
    infobutton();
};
//sidebar  animation
setTimeout(function () {
    sidebar.show();
}, 500);
//hide sidebar when clicking on the map
map.on('click', function () {
    console.log(sidebar.isVisible());
    sidebar.hide();
});

//FUNCTIONS FOR LAYERS' EVENTS
//highlight feature while mouseover
function highlightFeature(e) {
    var layer = e.target;
    opacity = layer.options.fillOpacity

    layer.setStyle({
        weight: 3,
        color: '#666',
        dashArray: '',
        fillOpacity: opacity - 0.1
    });
    // console.log('Highlight. Opacity is ' + (opacity - 0.1))

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}
//reset highlight functions for filtered layers
function resetHighlight(e) {
    target = e.target;
    // year = target.feature.properties.year;
    // layer_string = 'otgLayer_' + year;
    // layer = window[layer_string];
    
    opacity = target.options.fillOpacity
    // console.log('Reset Highlight. Opacity is ' + (opacity + 0.1))

    e.target.setStyle({
        fillOpacity: opacity + 0.1,
        color: 'white',
        dashArray: 3,
        opacity: 0.8,
        weight: 1,
    });
    
    info.update();
};
//zoom to feature function for doubleclick event
function zoomToFeature(e){


    map.fitBounds(e.target.getBounds(), {
        paddingTopLeft: [500,0]
    });
    console.log('zoomToFeature is starting')
    
    // crazy stuff for highlighting the invisible otg_layer
    // style polygon with red outline
    var bounds = e.target._bounds._northEast.lat;
    console.log(bounds);
    var features = otg_layer._layers;
    for (key in features) {
        //console.log(features[key]._bounds._northEast);
        if (features[key]._bounds._northEast.lat == bounds) {
            features[key].setStyle({
                opacity: 0.8,
                weight: 2,
                color: 'red',
                dashArray: 4,
                pane: 'labels_pane'
            });
        }
        else {
            features[key].setStyle({
                opacity: 0,
                pane: 'search_pane'
            });
        }
    };
};

//LAYERS' STYLES
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
function style_00(feature){
    return {
        fillColor: 'black',
        weight: 0,
        fillOpacity: 0,
        color: 'white',
        opacity: 0,
    }
};


//EVENTS
map.doubleClickZoom.disable();

//events for filtered layers
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        dblclick: zoomToFeature,
        click: openSidebar
    });
};

//LAYERS
var otgLayer_2015 = L.geoJson(otg, {
    filter: function(feature, layer){
        return feature.properties.year == "2015";
    },
    style: style_15,
    onEachFeature: onEachFeature,
}).addTo(map);

var otgLayer_2016 = L.geoJson(otg, {
    filter: function(feature, layer){
        return feature.properties.year == "2016";
    },
    style: style_16,
    onEachFeature: onEachFeature,
}).addTo(map);

var otgLayer_2017 = L.geoJson(otg, {
    filter: function(feature, layer){
        return feature.properties.year == "2017";
    },
    style: style_17,
    onEachFeature: onEachFeature,
}).addTo(map);

var otg_layer = L.geoJson(otg, {
    style: style_00,
    pane: 'search_pane',
}).addTo(map);

// ZOOM DEPENDANT STYLE
map.on('zoomend', function(e) {
    map.getZoom()
    // console.log(map.getZoom())
    if ( map.getZoom() <= 5 && map.getZoom() < 7){
        console.log(map.getZoom())
        otgLayer_2017.setStyle({
            'fillOpacity': 0.6
        });
        otgLayer_2016.setStyle({
            'fillOpacity': 0.6
        });
        otgLayer_2015.setStyle({
            'fillOpacity': 0.6
        });
    }
    else if ( map.getZoom() <= 7 && map.getZoom() < 8){
        // console.log(map.getZoom())
        otgLayer_2017.setStyle({
            'fillOpacity': 0.6
        });
        otgLayer_2016.setStyle({
            'fillOpacity': 0.6
        });
        otgLayer_2015.setStyle({
            'fillOpacity': 0.6
        });
    }
    else if ( map.getZoom() <= 8 && map.getZoom() < 9){
        // console.log(map.getZoom())
        otgLayer_2017.setStyle({
            'fillOpacity': 0.5
        });
        otgLayer_2016.setStyle({
            'fillOpacity': 0.5
        });
        otgLayer_2015.setStyle({
            'fillOpacity': 0.5
        });
    }
    else if ( map.getZoom() <= 9 && map.getZoom() < 10){
        // console.log(map.getZoom())
        otgLayer_2017.setStyle({
            'fillOpacity': 0.4
        });
        otgLayer_2016.setStyle({
            'fillOpacity': 0.4
        });
        otgLayer_2015.setStyle({
            'fillOpacity': 0.4
        });
    }
    else if ( map.getZoom() <= 10 && map.getZoom() < 11) {
        // console.log(map.getZoom())
        otgLayer_2017.setStyle({
            'fillOpacity': 0.3
        });
        otgLayer_2016.setStyle({
            'fillOpacity': 0.3
        });
        otgLayer_2015.setStyle({
            'fillOpacity': 0.3
        });
    }
    else if ( map.getZoom() <= 11 && map.getZoom() < 12) {
        // console.log(map.getZoom())
        otgLayer_2017.setStyle({
            'fillOpacity': 0.2
        });
        otgLayer_2016.setStyle({
            'fillOpacity': 0.2
        });
        otgLayer_2015.setStyle({
            'fillOpacity': 0.2
        });
    }
    else if ( map.getZoom() > 12) {
        // console.log(map.getZoom())
        otgLayer_2017.setStyle({
            'fillOpacity': 0.12
        });
        otgLayer_2016.setStyle({
            'fillOpacity': 0.12
        });
        otgLayer_2015.setStyle({
            'fillOpacity': 0.12
        });
    }    
});


// INFOPANEL
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

// LAYERS CONTROL
// switching on and off OTGlayers, based on elections year
var overlay = {
    "2015 рік виборів": otgLayer_2015,
    "2016 рік виборів": otgLayer_2016,
    "2017 рік виборів": otgLayer_2017,
};
layerControl = L.control.layers(null, overlay, {position: 'topleft'});
layerControl.addTo(map);

// function for checking if sidebar is open
// returns padding to the moveToLocation on leaflet-search if needed 
function checkSidebar() {
    console.log(sidebar.isVisible());
    if (sidebar.isVisible() == false) {
        return [0,0]
    }
    else {
        return [500,0]
    }
}

// SEARCH CONTROL
var searchControl = new L.Control.Search({
      layer: otg_layer,
      propertyName: 'OTG',
      marker: false,
      moveToLocation: function(latlng, title, map) {
        map.fitBounds( latlng.layer.getBounds(), {
            paddingTopLeft: checkSidebar()
        });
    }
});

searchControl.on('search:locationfound', function(e) {
    // change style for the feature
    console.log(e.layer);
    e.layer.setStyle({
        opacity: 0.8,
        weight: 2,
        color: 'red',
        dashArray: 4,
        pane: 'labels_pane'
    });
    // I am having some fun, never mind :)
    data = e.layer.feature.properties;
    data_style = e.layer.options;
    var a = {
        target: {
            feature: {
                properties: data
            },
            options: data_style
        }
    };
    openSidebar(a);
}).on('search:canceled', function(e) {

    otg_layer.eachLayer(function(layer) {   //restore feature color
        otg_layer.resetStyle(layer);
    }); 
});

map.addControl( searchControl );  //inizialize search control