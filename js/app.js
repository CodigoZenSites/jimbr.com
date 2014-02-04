/*global L, alert, $*/
$('#startDate').val(new Date().toJSON().slice(0, 10));
$('#endDate').val(new Date().toJSON().slice(0, 10));

$("#mapSearch").click(function () {
    var $mapUi = $("#map-ui"),
        $eventCarousel = $("#eventCarousel");
    if ($mapUi.css("display") === "none") {
        $eventCarousel.css("width", $eventCarousel.width() - $mapUi.width() + 'px')
        $mapUi.show();
        $("#searchControls").css("right", "" + $mapUi.css("width"));
    } else {
        $eventCarousel.css("width", $eventCarousel.width() + $mapUi.width() + 'px')
        $mapUi.hide();
        $("#searchControls").css("right", "0px");
    }
});

$('.datepicker').datepicker()

var mapView = new MapView({
    id: 'map',
    maxZoom: 18,
    urlTemplate: 'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png',
    attribution: 'Imagery <a href="http://cloudmade.com">CloudMade</a>'
});




function onMapClick(e) {
    "use strict";
    alert(e.latlng);
    L.marker(e.latlng).addTo(map);
}



function getEvents(e) {
    "use strict";
    var baseballIcon = L.icon({
        iconUrl: 'js/vendor/leaflet/images/marker-green.png',
        iconAnchor: [16, 37],
        popupAnchor: [0, -28]
    });
    var geojsonFeature = {
        "type": "FeatureCollection",
        "features": [{
                "type": "Feature",
                "properties": {
                    id : 2,
                    "name": "O Gordo",
                    "data": "",
                    "events": ["imgs/event1.jpg"]
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [-8.47924, 40.68873]
                }
            }, {
                "type": "Feature",
                "properties": {
                    id: 1,
                    "name": "Encostadinho",
                    "data": "",
                    "events": ["imgs/event2.jpg", "imgs/event1.jpg"]
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [-8.47930, 40.68882]
                }
            }, {
                "type": "Feature",
                "properties": {
                    id: 3,
                    "name": "Digodá",
                    "data": "",
                    "events": ["imgs/event2.jpg"]
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [-8.48069, 40.68707]
                }
            }

        ]
    };

    function onEachFeature(feature, layer) {
        var popupContent = "Eventos no " + feature.properties.name;
        layer.bindPopup(popupContent);
    }

    var geojson = L.geoJson(geojsonFeature, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                icon: baseballIcon
            });
        }
    }).on('click', function (e) {
        var imageSpanSize = 12 / e.layer.feature.properties.events.length,
            i,
            htmlString="";
        if($('#entityEvents_'+e.layer.feature.properties.id).length !== 0){
            $('#carouselContent').html(htmlString);
            $('#eventCarousel').hide();
        }else {
            htmlString = '<div id="entityEvents_'+e.layer.feature.properties.id+'" class="item active"><div class="row">';
            for (i = 0; i < e.layer.feature.properties.events.length; i++) {
                htmlString += '<div class="col-sm-' + imageSpanSize + '"><a href="#x" class="thumbnail">'
                htmlString += '<img src="' + e.layer.feature.properties.events[i] + '" alt="Image" class="img-responsive">'
                htmlString += '</a></div>';
    
            }
            htmlString += '</div>< /div>';
            $('#carouselContent').html(htmlString);
            $('#eventCarousel').show();
        }


    });
    var markers = L.markerClusterGroup({
        spiderfyOnMaxZoom: false,
        showCoverageOnHover: true,
        zoomToBoundsOnClick: false,
        maxClusterRadius: 10
    });
    markers.addLayer(geojson)
    mapView.map.addLayer(markers);

}


mapView.map.on('load', getEvents);

mapView.map.locate({
    setView: true,
    maxZoom: 16
});