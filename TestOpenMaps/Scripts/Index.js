
"use strict"
var count = 1;
const EPGS3857 = "EPSG:3857";
const EPGS4326 = "EPSG:4326";
const EPSG3844 = "EPSG:3844";
const URLGeoserver=""
var source = new ol.source.Vector();
var secondSource = new ol.source.Vector();
var draw, snap, modify; // global so we can remove them later-
var typeSelect = document.getElementById('type');
var VectorLayers = [];
var VectorLayersName = [];
class Point {
    constructor(longitude, latitude) {
        this.longitude = longitude;
        this.latitude = latitude;
    }
}

class MapInteraction {
    constructor(map) {
        this._map = map;
    }
    initMap = () => {
        this._map = new ol.Map({
            layers: [raster, vector],
            target: 'map',
            view: new ol.View({
                // center: [-11000000, 4600000],
                center: [2801875.7088214206, 5745618.542140128],
                zoom: 6
            }),
        });
    };
    AddMarker = (Position) => {
        var element = document.createElement('div');
        element.innerHTML = '<i class="fa fa-map-marker danger">' + count + '</i>';
        var marker = new ol.Overlay({
            position: Position,
            positioning: 'center-center',
            element: element,
            stopEvent: false
        });
        this._map.addOverlay(marker);
        count++;
    }
    clearOverlays = () => {
        map.getOverlays().clear();
    }
}

var RemoveAllFeatures = () => {
    vector.getSource().clear();
    secondvector.getSource().clear();
    clearOverlays();
}

//map interaction functions
function AddMarker(Position) {
    var element = document.createElement('div');
    element.innerHTML = '<i class="fa fa-map-marker danger">' + count + '</i>';
    var marker = new ol.Overlay({
        position: Position,
        positioning: 'center-center',
        element: element,
        stopEvent: false
    });
    map.addOverlay(marker);
    count++;
}

function clearOverlays() {
    map.getOverlays().clear();
}

var RemoveAllFeatures = () => {
    vector.getSource().clear();
    secondvector.getSource().clear();
    clearOverlays();
}

var RemoveLastFeature = () => {
    var features = vector.getSource.getFeatures();
    var lastFeature = features[features.length - 1];
    vector.removeFeature(lastFeature);
}

var raster = new ol.layer.Tile({
    source: new ol.source.OSM()
});

var vector = new ol.layer.Vector({
    source: source,
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.5)'
        }),
        stroke: new ol.style.Stroke({
            color: '#ffcc33',
            width: 2
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#ffcc33'
            })
        })
    })
});
var secondvector = new ol.layer.Vector({
    source: secondSource,
    style: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#FFA07A',
            width: 2
        }),
        image: new ol.style.Circle({
            radius: 7,

        })
    })
})

var map = new ol.Map({
    layers: [raster, vector, secondvector],
    target: 'map',
    view: new ol.View({
        // center: [-11000000, 4600000],
        center: [2801875.7088214206, 5745618.542140128],
        zoom: 6
    }),
});

function AddModify() {
    modify = new ol.interaction.Modify({ source: source });
    map.addInteraction(modify);

    modify.on('modifyend', function (evt) {
        secondvector.getSource().clear();
        ProcessDrawing();
    })
}

function RemoveAllInteraction() {
    if (draw)
        map.removeInteraction(draw);
    if (snap)
        map.removeInteraction(snap);
    if (modify)
        map.removeInteraction(modify);
}

function addInteractions() {
    var r;
    RemoveAllInteraction();
    AddModify();
    draw = new ol.interaction.Draw({
        source: source,
        type: typeSelect.value,
        stopClick: true
    });
    snap = new ol.interaction.Snap({ source: source });

    map.addInteraction(draw);


    map.addInteraction(snap);

    draw.on("drawstart", function (e) {
        if (typeSelect.value !== "Point") {
            if (vector.getSource().getFeatures().length > 0) {
                r = confirm("The existing polygon will be deleted!");
                if (r == true) {
                    RemoveAllFeatures();
                    //bufferVector.getSource().clear();
                    clearOverlays();
                    map.removeInteraction(draw);
                    if (snap) map.removeInteraction(snap);
                    addInteractions();
                } else {
                    map.removeInteraction(draw);
                    if (snap) map.removeInteraction(snap);
                    addInteractions();
                }
            }
        }
    });

    draw.on("drawend", function (e) {
        if (typeSelect.value == "Point") {
            RemoveAllFeatures();
            clearOverlays();
            map.removeInteraction(draw);
            if (snap) map.removeInteraction(snap);
            addInteractions();
        }
    })
}

map.on("dblclick", function (e) {
    alert("fdsa");
});
vector.getSource().on('addfeature', function (event) {
    ProcessDrawing();
})
/**
 * Handle change event.
 */
typeSelect.onchange = function () {
    RemoveAllFeatures();
    map.removeInteraction(draw);
    map.removeInteraction(snap);
    addInteractions();
};

//addInteractions();

var ParseLayersFromGeoserver = () => {
    var parse = new ol.format.WMSCapabilities();
    fetch('https://ahocevar.com/geoserver/wms?VERSION=1.1.1&Request=GetCapabilities&Service=WMS').then(function (response) {
        return response.text();
    }).then(function (text) {
        var result = parse.read(text);
        var layers = result.Capability.Layer.Layer;
        layers.forEach(function (layer) {
            AddLayerToMap(layer.Name);
        });
    });
}
//vector de layere

// to do --add layers to a vector globally
var AddLayerToMap = (name) => {
    var layer = new ol.layer.Tile({
        visible: true,
        source: new ol.source.TileWMS({
            url: 'https://ahocevar.com/geoserver/wms',
            params: { 'LAYERS': name, 'TILED': true, 'TRANSPARENT': true },
            serverType: 'geoserver'
        })
    });
    layer.set('name', name);
    console.log(layer.get('name'));
    VectorLayers.push(layer);
    map.addLayer(layer);
}

var RemoveAllLayerFromMap = () => {
    VectorLayers.forEach(function (layer) {
        console.log(layer);
        map.removeLayer(layer);
    });
}

//parametru layer de tip ol.layer.Tile
var removeLayerFromMap = (layer) => {
    map.removeLayer(layer);
}


//ui interaction functions
var ProcessDrawing = () => {
    return;
    addbuffer();

    count = 1;
    clearOverlays();
    var features = vector.getSource().getFeatures();
    var SelectedGeometry = typeSelect.options[typeSelect.selectedIndex].text;
    features.forEach(function (feature) {
        var geometry = feature.getGeometry().getCoordinates();
        console.log(GetWKTFromFeature(feature));
        let GeometryArray = [];
        if (SelectedGeometry == "LineString") {
            GeometryArray = functionParseLine(geometry);
        }
        if (SelectedGeometry == "Polygon") {
            GeometryArray = functionParsePolygon(geometry);
        }
        if (SelectedGeometry == "Point") {
            GeometryArray = functionParsePoint(geometry);
        }
        AddCoordinatesToTable(GeometryArray);
    })

}

var addbuffer = () => {
    var features = vector.getSource().getFeatures();
    var parser = new jsts.io.OL3Parser();
    //parser.inject(ol.geom.Point, ol.geom.LineString, ol.geom.LinearRing, ol.geom.Polygon, ol.geom.MultiPoint, ol.geom.MultiLineString, ol.geom.MultiPolygon);
    var bufferVector = [];
    features.forEach(function (feature) {
        var jstsGeom = parser.read(feature.getGeometry());
        // create a buffer of 100 meters around each line
        var innerbuffer = jstsGeom.buffer(-100);
        console.log(innerbuffer.getGeometryType());
        var outerbuffer = jstsGeom.buffer(100);
        // convert back from JSTS and replace the geometry on the feature
        //feature.setGeometry(parser.write(buffered));
        var innerfeature = new ol.Feature({
            name: 'innerbuffer',
            geometry: parser.write(innerbuffer)
        });
        var outerfeature = new ol.Feature({
            name: 'outerbuffer',
            geometry: parser.write(outerbuffer)
        });
        bufferVector.push(innerfeature);
        bufferVector.push(outerfeature);
    });
    secondSource.addFeatures(bufferVector);
}

var functionParsePolygon = (geometry) => {
    var coordinateArray = [];
    geometry.forEach(function (coords) {
        coords.forEach(function (point) {
            coordinateArray.push(TransformPoint(point, EPGS3857, EPGS4326));
            if (point != coords[coords.length - 1])
                AddMarker(point);
        });
    });
    return coordinateArray;
}
var functionParsePoint = (geometry) => {
    var coordinateArray = [];
    coordinateArray.push(TransformPoint(geometry, EPGS3857, EPGS4326));
    return coordinateArray;
}
var functionParseLine = (geometry) => {
    var coordsArray = [];
    geometry.forEach(function (point) {
        coordsArray.push(TransformPoint(point, EPGS3857, EPGS4326));
        AddMarker(point);
    })
    return coordsArray;
};
var TransformPoint = (point, EPSGSource, EPSGDestination) => {
    return ol.proj.transform(point, EPSGSource, EPSGDestination);
}

var AddCoordinatesToTable = (coordinatesArray) => {
    var tbody = document.querySelector("table tbody");
    var rows = document.querySelectorAll("table tbody tr");
    rows.forEach(function (row) { tbody.removeChild(row) });
    var toalItems = coordinatesArray.length;
    coordinatesArray.forEach(function (coord) {
        let row = document.createElement('tr');
        let pct = new Point(coord[0], coord[1]);
        row.innerHTML =
            `<td>${pct.longitude}</td>
            <td>${pct.latitude}</td>
        `;
        tbody.appendChild(row);
    })
}


var GetWKTFromFeature = (feature) => {
    var geom = feature.getGeometry();
    var format = new ol.format.WKT();
    return format.writeGeometry(geom);
};
var AddFeatureFromBackend = () => {
    let myGeometry;
    //transformare coordonate
    myGeometry = new ol.geom.Polygon([[
        ol.proj.transform([-10, -22], 'EPSG:4326', 'EPSG:3857'),
        ol.proj.transform([-11, -23], 'EPSG:4326', 'EPSG:3857'),
        ol.proj.transform([-12, -24], 'EPSG:4326', 'EPSG:3857')
    ]]);
    console.log(myGeometry);
    var featureToAdd = new ol.Feature({
        geometry: myGeometry
    });
    vector.getSource().addFeature(featureToAdd);
}

document.querySelector("#RemoveInteraction").addEventListener("click", function (e) { ProcessDrawing(); });
document.querySelector("#Add").addEventListener('click', function (e) { AddFeatureFromBackend() });
document.querySelector("#GeoServer").addEventListener("click", function (e) { ParseLayersFromGeoserver(); })
document.querySelector("#ClearLayers").addEventListener("click", function (e) { RemoveAllLayerFromMap(); })

//partea asta te intereseaza mai mult
//adaug 1000 de feature cu svg si la mine merge ok
document.querySelector("#AddPoints").addEventListener("click", function (e) {
    for (let i = 0; i < 1000; i++) {
        let tempPoint = new Point(genRand(44, 47, 5), genRand(21, 27, 5));
        console.log(tempPoint);

        let svg ='<svg xmlns="http://www.w3.org/2000/svg" version="1.2" baseProfile="tiny" width="158" height="108" viewBox="21 46 158 108"><path d="M25,50 l150,0 0,100 -150,0 z" stroke-width="4" stroke="black" fill="rgb(128,224,255)" fill-opacity="1" ></path><path d="M25,150 C25,110 175,110 175,150" stroke-width="4" stroke="black" fill="none" ></path><text x="100" y="110" text-anchor="middle" font-size="35" font-family="Arial" font-weight="bold" stroke-width="4" stroke="none" fill="black" >SRD</text></svg>'

        var style = new ol.style.Style({
            image: new ol.style.Icon({
                opacity: 1,
                src: 'data:image/svg+xml;utf8,' + svg,
                scale: 0.3
            })
        });

        var marker = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.transform([tempPoint.latitude, tempPoint.longitude], 'EPSG:4326', 'EPSG:3857')),
        });
        marker.setStyle(style);
                    
        let geom = new ol.geom.Point(tempPoint.latitude, tempPoint.longitude);
        console.log(marker);
        let feature = new ol.Feature({
            geometry: geom
        });
        vector.getSource().addFeature(marker);
    }
    console.log(vector.getSource());
});
//2641663.697536
///5780351.408360
function genRand(min, max, decimalPlaces) {
    var rand = Math.random() < 0.5 ? ((1 - Math.random()) * (max - min) + min) : (Math.random() * (max - min) + min);  // could be min or max or anything in between
    var power = Math.pow(10, decimalPlaces);
    return Math.floor(rand * power) / power;
}


