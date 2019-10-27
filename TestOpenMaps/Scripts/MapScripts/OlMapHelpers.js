var count = 1;


class MapInteraction {
    EPGS3857 = "EPSG:3857";
    EPGS4326 = "EPSG:4326";
    source = new ol.source.Vector();
    draw;
    snap; // global so we can remove them later
    typeSelect = document.getElementById('type');
    VectorLayers = [];
    VectorLayersName = [];
    vector;
    source = new ol.source.Vector();
    modify = new ol.interaction.Modify({ source: this.source });
    raster = new ol.layer.Tile({
        source: new ol.source.OSM()
    });


    constructor() {
        this.instantiateVector();
        this.initMap();
    }
    initMap = () => {
        this._map = new ol.Map({
            layers: [this.raster, this.vector],
            target: 'map',
            view: new ol.View({
                // center: [-11000000, 4600000],
                center: [2801875.7088214206, 5745618.542140128],
                zoom: 6
            }),
        });
    };
    addMarker = (Position) => {
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
        this._map.getOverlays().clear();
    }
    removeAllFeatures = () => {
        vector.getSource().clear();
        clearOverlays();
    }
    removeLastFeature = () => {
        var features = vector.getSource.getFeatures();
        var lastFeature = features[features.length - 1];
        vector.removeFeature(lastFeature);
    }
    instantiateVector = () => {
       this.vector = new ol.layer.Vector({
            source: this.source,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
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

    }
}

var map = new MapInteraction();


