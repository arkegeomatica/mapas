var map, featureList, 
$(window).resize(function() {
  sizeLayerControl();
});

$(document).on("click", ".feature-row", function(e) {
  $(document).off("mouseout", ".feature-row", clearHighlight);
  sidebarClick(parseInt($(this).attr("id"), 10));
});

if ( !("ontouchstart" in window) ) {
  $(document).on("mouseover", ".feature-row", function(e) {
    highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
  });
}

$(document).on("mouseout", ".feature-row", clearHighlight);

$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});
$("#ayuda-btn").click(function() {
  $("#ayudaModal").modal("show");
  return false;
});
$("#full-extent-btn").click(function() {
  map.fitBounds(boroughs.getBounds());
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#legend-btn").click(function() {
  $("#legendModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});

$("#login-btn").click(function() {
  $("#loginModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
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

$("#sidebar-toggle-btn").click(function() {
  $("#sidebar").toggle();
  map.invalidateSize();
  return false;
});

$("#sidebar-hide-btn").click(function() {
  $('#sidebar').hide();
  map.invalidateSize();
});

function sizeLayerControl() {
  $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}

function clearHighlight() {
  highlight.clearLayers();
}

function sidebarClick(id) {
  var layer = markerClusters.getLayer(id);
  map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 17);
  layer.fire("click");
  /* Hide sidebar and go to the map on small screens */
  if (document.body.clientWidth <= 767) {
    $("#sidebar").hide();
    map.invalidateSize();
  }
}

function syncSidebar() {
  /* Empty sidebar features */
  $("#feature-list tbody").empty();
  /* Loop through theaters layer and add only features which are in the map bounds */
  theaters.eachLayer(function (layer) {
    if (map.hasLayer(theaterLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/theater.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* Loop through museums layer and add only features which are in the map bounds */
  museums.eachLayer(function (layer) {
    if (map.hasLayer(museumLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="16" height="18" src="assets/img/museum.png"></td><td class="feature-name">' + layer.feature.properties.NAME + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* Update list.js featureList */
  featureList = new List("features", {
    valueNames: ["feature-name"]
  });
  featureList.sort("feature-name", {
    order: "asc"
  });
}

/* Basemap Layers */
var ortoPNOA = L.tileLayer.wms("http://www.ign.es/wms-inspire/pnoa-ma?", {
    layers: 'OI.OrthoimageCoverage',
    format: 'image/png',
    transparent: true,
    attribution: 'Cedido por © Instituto Geográfico Nacional'
});

var catastro = L.tileLayer.wms("https://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?", {
    layers: 'Catastro',
    format: 'image/png',
    transparent: true,
    attribution: '<a href="https://www.sedecatastro.gob.es/"" target="_blank">Dirección General de Catastro</a>'
});

var osm= L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
  attribution: '<a href="http://openstreetmap.org">OpenStreetMap</a> contributors,<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
});

var cdau1 = L.tileLayer.wms("http://www.callejerodeandalucia.es/servicios/cdau/wms?", {
    layers: 'CDAU_wms',
    format: 'image/png',
    transparent: true,
    attribution: '<a href="http://www.callejerodeandalucia.es/portal/web/cdau/" target="_blank">Fuente: CDAU (Entidades Locales-Junta de Andalucía- IGN).</a>'
});
var cdaubase = L.tileLayer.wms("http://www.callejerodeandalucia.es/servicios/base/wms?", {
    layers: 'CDAU_base',
    format: 'image/png',
    transparent: true,
    attribution: '<a href="http://www.callejerodeandalucia.es/portal/web/cdau/" target="_blank">Fuente: CDAU (Entidades Locales-Junta de Andalucía- IGN).</a>'
});
var cdau = L.layerGroup([cdaubase,cdau1])
var PNOA = L.layerGroup([ortoPNOA,cdau1]);



/* Overlay Layers */
var highlight = L.geoJson(null);

// ######### arqueovisitable ###########

var arqueovisitable = L.geoJson(null, {

  pointToLayer: function (feature, latlng) {

    return L.marker(latlng, {
      icon: L.AwesomeMarkers.icon({
        icon: 'tower', 
        //icon: 'link', 
        prefix: 'glyphicon', 
        markerColor: 'red', 
        //spin:true
      }) 
    });
  },


   onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<h2>"+feature.properties.name+"</h2><p>"+feature.properties.crono+"</p><p>"+feature.properties.address+"</p>";
      layer.on({
        click: function (e) {
          $("#feature-title").html("Patrimonio Arqueológico");
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
       }

      });
    }
    layer.on({mouseover: function (e) {
        var layer = e.target;
        layer.setStyle({
          weight: 3,
          color: "#00FFFF",
          fillColor:"#00FFFF"
        });


      var contentpopup = "<h3>"+feature.properties.name+"</h3><p><b>Cronología: </b> "+feature.properties.crono+"</b><br><b>Dirección: </b>"+feature.properties.address+"</p";
      var infopopup = new L.Rrose({ offset: new L.Point(0,-10), closeButton: false, autoPan: false })
            //.setContent(feature.properties.id)
      .setContent(contentpopup)
      .setLatLng(e.latlng)
      .openOn(map);

        if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
        }
      },
      mouseout: function (e) {
        /// Limpia estilo select
        arqueovisitable.resetStyle(e.target);
        /// Borrar opup emergente en hover
        map.closePopup();
      }
    });
  }
});
$.getJSON("data/arqueologia/arqueovisitable.geojson", function (data) {
  arqueovisitable.addData(data);
});

// ######### arqueomurallas ###########
var arqueomurallas = L.geoJson(null, {
  style: function (feature) {
    return {
      color: "#dcdcdc",
      fill: true,
      opacity: 1,
      fillColor: "green",
      weight: 1
    };
  }
  
});
$.getJSON("data/arqueologia/arqueomurallas.geojson", function (data) {
arqueomurallas.addData(data);
});

// ######### mc ###########
var mc = L.geoJson(null, {
  style: function (feature) {
    return {
      color: "darkred",
      fill: true,
      opacity: 1,
      //stroke: false,
      fillColor: "red",
      weight: 3
    };

  },
   onEachFeature: function (feature, layer) {
     if (feature.properties) {
      var content = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>ID</th><td>" + feature.properties.cadtext + "</td></tr>" + "<tr><th>Denominación</th><td>" + feature.properties.denomina + "</td></tr>" + "<tr><th>Dirección</th><td>" + feature.properties.direccion + "</td></tr>" + "<tr><th>Cronología</th><td>" + feature.properties.cronologia + "</td></tr>" + "<tr><th>Estructura</th><td>" + feature.properties.estructura+ "</td></tr><table><br><p><i>Fuente datos:<a href='http://www.gmucordoba.es/anexo-ii-catalogo-de-bienes-protegidos/fichas/murallas-de-cordoba' target='_blank'> Catálogo de Bienes Protegidos. PEPCH Córdoba</a></i></p>";
      layer.on({
        click: function (e) {
          $("#feature-title").html("Murallas de Córdoba");
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
       }

      });
    }

    layer.on({mouseover: function (e) {
        var layer = e.target;
         layer.setStyle({
          weight: 3,
          color: "#00FFFF",
          fillColor:"#00FFFF",
        });

      /// Añade opup emergente en hover
  
  var contentpopup = "<h3>"+feature.properties.denomina+"</h3><p><b>Recinto: </b> "+feature.properties.recinto+"</b><br><b>Dirección: </b>"+feature.properties.direccion+"</p";
      var infopopup = new L.Rrose({ offset: new L.Point(0,-10), closeButton: false, autoPan: false })
            //.setContent(feature.properties.id)
      .setContent(contentpopup)
      .setLatLng(e.latlng)
      .openOn(map);

        if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
        }
      },
      mouseout: function (e) {
        /// Limpia estilo select
        mc.resetStyle(e.target);
        /// Borrar opup emergente en hover
        map.closePopup();
      }
    });
  }
});
$.getJSON("data/arqueologia/catalogo_pepch_murallas.geojson", function (data) {
  //$.getJSON("data/arqueologia/mc.geojson", function (data) {
  
  mc.addData(data);
});

// ######### arqueoreserva ###########
var arqueoreserva = L.geoJson(null, {
  style: function (feature) {
    return {
      color: "#dcdcdc",
      fill: true,
      opacity: 1,
      fillColor: "blue",
      weight: 1
    };

  }
});
$.getJSON("data/arqueologia/arqueoreserva.geojson", function (data) {
 
  arqueoreserva.addData(data);
});

// ######### arqueozonas ###########
var arqueozonas = L.geoJson(null, {
  style: function (feature) {
    return {
      color: "#dcdcdc",
      fill: true,
      opacity: 1,
      //stroke: false,
      fillColor: "purple",
      
      weight: 1
//   fillOpacity: 0.7,
 
    };

  },
      onEachFeature: function (feature, layer) {
     if (feature.properties) {
      var content = "<h3>Zona "+feature.properties.zona+" "+feature.properties.nombre+"</h3><p>"+feature.properties.txt+"</p><p><a href='"+feature.properties.link+"' target='_blank'>Ver texto completo de la Ordenanza</a>";
      layer.on({
        click: function (e) {
          $("#feature-title").html("Zonificación Arqueógica");
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
       }

      });
    }

    layer.on({mouseover: function (e) {
        var layer = e.target;
         layer.setStyle({
          weight: 3,
          color: "#00FFFF",
          fillColor:"#00FFFF",
        });
  
  var contentpopup = "<h4>Zona "+feature.properties.zona+"</h4><p>"+feature.properties.nombre+"</b></p>";
      var infopopup = new L.Rrose({ offset: new L.Point(0,-10), closeButton: false, autoPan: false })
      .setContent(contentpopup)
      .setLatLng(e.latlng)
      .openOn(map);

        if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
        }
      },
      mouseout: function (e) {
        arqueozonas.resetStyle(e.target);
        map.closePopup();
      }
    });
  }
});
$.getJSON("data/arqueologia/arqueozonas.geojson", function (data) {
  //$.getJSON("data/arqueologia/arqueozonas.geojson", function (data) {
  
  arqueozonas.addData(data);
});
// ######### limite_ch ###########
var limite_ch = L.geoJson(null, {
  style: function (feature) {
    return {
      color: "orange",
      fill: false,
      opacity: 1
 
    };
  }
});
$.getJSON("data/limites/limite_ch.geojson", function (data) {
  limite_ch.addData(data);
});



// MAP
map = L.map("map", {
  zoom: 14,
  center: [37.883094,-4.776287],
  layers: [PNOA, limite_ch, arqueovisitable,mc,arqueomurallas,arqueoreserva],
  zoomControl: false,
  attributionControl: true
});
   
/* Clear feature highlight when map is clicked */
map.on("click", function(e) {
  highlight.clearLayers();
});

//* Attribution control */
function updateAttribution(e) {
  $.each(map._layers, function(index, layer) {
    if (layer.getAttribution) {
      $("#attribution").html((layer.getAttribution()));
    }
  });
}
map.on("layeradd", updateAttribution);
map.on("layerremove", updateAttribution);

var attributionControl = L.control({
  position: "bottomright"
});
attributionControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "leaflet-control-attribution");
  div.innerHTML = "<span class='hidden-xs'>Developed by <a href='http://bryanmcbride.com'>bryanmcbride.com</a> | </span><a href='#' onclick='$(\"#attributionModal\").modal(\"show\"); return false;'>Attribution</a>";
  return div;
};
map.addControl(attributionControl);

var zoomControl = L.control.zoom({
  position: "bottomright"
}).addTo(map);

/* GPS enabled geolocation control set to follow the user's location */
var locateControl = L.control.locate({
  position: "bottomright",
  drawCircle: true,
  follow: true,
  setView: true,
  keepCurrentZoomLevel: true,
  markerStyle: {
    weight: 1,
    opacity: 0.8,
    fillOpacity: 0.8
  },
  circleStyle: {
    weight: 1,
    clickable: false
  },
  icon: "fa fa-location-arrow",
  metric: false,
  strings: {
    title: "Mi Ubicaci�n",
    popup: "You are within {distance} {unit} from this point",
    outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
  },
  locateOptions: {
    maxZoom: 18,
    watch: true,
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
  }
}).addTo(map);

/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
}

function VerLeyenda () {
  $("#feature-title").html("Leyenda");
  $("#feature-info").html("<img src='http://ovc.catastro.meh.es/Cartografia/WMS/simbolos.png'><br><a href='https://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?REQUEST=GetCapabilities&SERVICE=WMS' target='_blank' title='Ver capacidades'>Ver capcidades</a>");
  $("#featureModal").modal("show");

};

var baseLayers = {
  "PNOA": ortoPNOA,
  "PNOA+Callejero": PNOA,
  "Catastro": catastro,
  "Callejero CDAU":cdau,
  "OpenStreetMap":osm
  //"Google":ggl
  
};

var groupedOverlays = {
  
  "Límites": {
    
    "CH":limite_ch

  },
  "Información arqueológica": {
  
    "Patrimonio arqueológico":arqueovisitable,
    "Cautelas por murallas ":arqueomurallas,
    "Reserva arqueológica ":arqueoreserva,
    "Zonas ordenanzas ":arqueozonas,
    "Murallas ":mc
  }
};

var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, {
  collapsed: isCollapsed
}).addTo(map);



/* Typeahead search functionality */
$(document).one("ajaxStop", function () {
  $("#loading").hide();
  map.fitBounds(limite_ch.getBounds());
   
});


// Cargador

 var style = {color:'red', opacity: 1.0, fillOpacity: 1.0, weight: 1, clickable: false};
        L.Control.FileLayerLoad.LABEL = '<i class="fa fa-folder-open"></i>';
        L.Control.fileLayerLoad({
            fitBounds: true
        }).addTo(map);