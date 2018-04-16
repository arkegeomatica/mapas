$("#info-btn").click(function() {
  $("#infoModal").modal("show");
  return false;
});

$("#full-extent-btn").click(function() {
  map.fitBounds(limite_ch.getBounds());
  return false;
});

$("#ayuda-btn").click(function() {
  $("#ayudaModal").modal("show");
  return false;
});
$("#list-btn").click(function() {
  $('#sidebar').toggle();
  map.invalidateSize();
  return false;
});

$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});

        
        var center = [41.99579,-5.92117]; 

        var PNOA = L.tileLayer.wms("http://www.ign.es/wms-inspire/pnoa-ma?", {
            layers: 'OI.OrthoimageCoverage',
            format: 'image/png',
            transparent: true,
            attribution: 'Cedido por © Instituto Geográfico Nacional'
        });
        var PNOAA = L.tileLayer.wms("http://www.ign.es/wms-inspire/pnoa-ma?", {
            layers: 'OI.OrthoimageCoverage',
            format: 'image/png',
            transparent: true,
            attribution: 'Cedido por © Instituto Geográfico Nacional'
        });
        var PNOAB = L.tileLayer.wms("http://www.ign.es/wms-inspire/pnoa-ma?", {
            layers: 'OI.OrthoimageCoverage',
            format: 'image/png',
            transparent: true,
            attribution: 'Cedido por © Instituto Geográfico Nacional'
        });
        
            var orto2004 = L.tileLayer.wms("http://www.ign.es/wms/pnoa-historico?", {
            layers: 'PNOA2004',
            format: 'image/png',
            transparent: true,
            attribution: 'PNOA cedido por © Instituto Geográfico Nacional de España'
        });
            var orto2004A = L.tileLayer.wms("http://www.ign.es/wms/pnoa-historico?", {
            layers: 'PNOA2004',
            format: 'image/png',
            transparent: true,
            attribution: 'PNOA cedido por © Instituto Geográfico Nacional de España'
        });
            var orto2004B = L.tileLayer.wms("http://www.ign.es/wms/pnoa-historico?", {
            layers: 'PNOA2004',
            format: 'image/png',
            transparent: true,
            attribution: 'PNOA cedido por © Instituto Geográfico Nacional de España'
        });

// ######### limite_ch ###########
var limite_ch = L.geoJson(null, {
  style: function (feature) {
    return {
      color: "orange",
      fill: false,
      opacity: 1
 
    };0
  }
});
$.getJSON("data/LIMITE.geojson", function (data) {
  limite_ch.addData(data);
});


        var mapB = L.map('mapB', {
            layers: [orto2004B],
            center: center,
            zoom: 14
        });

        var mapA = L.map('mapA', {
            layers: [orto2004],
            center: center,
            zoom: 14
    
        });
        var map = L.map('map', {
            layers: [PNOA,LIMITE],
            center: center,
            zoom: 14,
        });

        map.sync(mapA);
        map.sync(mapB);
    
         mapA.sync(map);
         mapA.sync(mapB);

         mapB.sync(map);
         mapB.sync(mapA);

        var baseMaps = {

            "PNOA (Máx actialidad)": PNOA,
            "Ortofotos deL 2004 ": orto2004,
            "Ortofoto 2004": orto2004A,
            "Ortofoto 2004": orto2004B
        };

        var baseMapsA = {

            "PNOA": PNOAA,
            "Ortofotos de 1956 ": orto2004A,
            "Ortofoto 1977/83": PNOA,
            "Ortofoto 1997/98": orto2004
        };
                var baseMapsB = {

            "PNOA": PNOAB,
            "Ortofotos de 1956 ": orto2004B,
            "Ortofoto 1977/83": orto2004A,
            "Ortofoto 1997/98": PNOA
        };


        var overlayMaps = {
              "CH": LIMITE
            
        };

       var control = new L.control.layers(baseMaps, overlayMaps).addTo(map);
       var controlA = new L.control.layers(baseMapsA, overlayMaps).addTo(mapA);
       var controlB = new L.control.layers(baseMapsB, overlayMaps).addTo(mapB);




/* Typeahead search functionality */
$(document).one("ajaxStop", function () {
  $("#loading").hide();
  map.fitBounds(LIMITE.getBounds());
   
});

//  Buscador  
    new L.Control.GeoSearch({
     provider: new L.GeoSearch.Provider.Google()
        }).addTo(map);

// Cargador

 var style = {color:'red', opacity: 1.0, fillOpacity: 1.0, weight: 2, clickable: false};
        L.Control.FileLayerLoad.LABEL = '<i class="fa fa-folder-open"></i>';
        L.Control.fileLayerLoad({
            fitBounds: true
            // layerOptions: {style: style,
            //                pointToLayer: function (data, latlng) {
            //                   return L.circleMarker(latlng, {style: style});
            //                }},
        }).addTo(map);