var map, featureList;

$(document).on("click", ".feature-row", function(e) {
  sidebarClick(parseInt($(this).attr('id')));
});

$("#ayuda-btn").click(function() {
  $("#ayudaModal").modal("show");
  return false;
});
$("#info-btn").click(function() {
  $("#infoModal").modal("show");
  return false;
});

$("#full-extent-btn").click(function() {
  map.fitBounds(limite_ch.getBounds());
  return false;
});

$("#legend-btn").click(function() {
  $("#legendModal").modal("show");
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

// ######### espacios_catalogados ###########

var espacios_catalogados = L.geoJson(null, {
  style: function (feature) {
    return {
      color: "#dcdcdc",
      fill: true,
      opacity: 1,
      //stroke: false,
      fillColor: "#dcdcdc",
      weight: 2
//   fillOpacity: 0.7,
 
    };
  },
   onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<h2>"+feature.properties.id+"</h2><p><b>Dirección: </b>"+feature.properties.av_nombre+"</p>"+"<p><b>Ficha: </b> <a target='_blank' href='http://www.gmucordoba.es/"+feature.properties.av_pdf+"'>Ver ficha</a></p>"+"<p><b>Imagen: </b><br><img src='http://www.gmucordoba.es/"+feature.properties.av_img+"' width='70%'></p>";
      layer.on({
        click: function (e) {
          $("#feature-title").html("Espacio Catalogado");
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
          //opacity: 1,
          //fillOpacity: 0.3,
          //fill: true,
      
        });


      var contentpopup = "<p><b>"+feature.properties.id+"</b><br>"+feature.properties.av_nombre+"</p";
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
        espacios_catalogados.resetStyle(e.target);
        /// Borrar opup emergente en hover
        map.closePopup();
      }
    });
  }
});
$.getJSON("data/espacios_catalogados.geojson", function (data) {
  espacios_catalogados.addData(data);
});

// ######### al_espacios ###########
var al_espacios = L.geoJson(null, {
  style: function (feature) {
if (feature.properties.cod === "ESPACIOS PRIMARIOS") {
      return {
        color: "#c1dd6e",
        fillColor: "#c1dd6e",
        weight: 2,
        fill: true,
        opacity: 1
      };
    }
    if (feature.properties.cod === "ESPACIOS MEDIOS") {
      return {
        color: "#dddd6e",
        fillColor: "#dddd6e",
        weight: 2,
        fill: true,
        opacity: 1
      };
    }
    if (feature.properties.cod === "ESPACIOS LOCALES") {
      return {
        color: "#ffff7e",
        fillColor: "#ffff7e",
        weight: 2,
        fill: true,
        opacity: 1
      };
    }

  },
   onEachFeature: function (feature, layer) {

    layer.on({mouseover: function (e) {
        var layer = e.target;
         layer.setStyle({
          weight: 3,
          color: "#00FFFF",
          fillColor:"#00FFFF",
          //opacity: 1,
          //fillOpacity: 0.3,
          //fill: true,
      
        });

      /// Añade opup emergente en hover
  var contentpopup = "<p>"+feature.properties.cod+"</p>";
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
        al_espacios.resetStyle(e.target);
        /// Borrar opup emergente en hover
        map.closePopup();
      }
    });
  }
});
$.getJSON("data/al_espacios.geojson", function (data) {
  al_espacios.addData(data);
});

// ######### ed_monumentos ###########

var ed_monumentos = L.geoJson(null, {
  style: function (feature) {
    return {
      color: "#ff6602",
      fill: true,
      opacity: 1,
      //stroke: false,
      fillColor: "#ff6602",
      weight: 2
//   fillOpacity: 0.7,
 
    };
  },
   onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<h2>"+feature.properties.id0+"</h2><p><b>PARCELAS: </b>"+feature.properties.Parcela+"</p>"+"<p><b>Ficha: </b> <a target='_blank' href='http://www.gmucordoba.es/"+feature.properties.pdf+"'>Ver ficha</a></p>"+"<p><b>Imagen: </b><br><img src='http://www.gmucordoba.es/"+feature.properties.img+"' width='70%'></p>";
      layer.on({
        click: function (e) {
          $("#feature-title").html("PARCELA");
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
          //opacity: 1,
          //fillOpacity: 0.3,
          //fill: true,
      
        });


      var contentpopup = "<p><b>"+feature.properties.id0+"</b><br>"+feature.properties.nombre+"</p";
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
        ed_monumentos.resetStyle(e.target);
        /// Borrar opup emergente en hover
        map.closePopup();
      }
    });
  }
});
$.getJSON("data/parcelas.geojson", function (data) {
  ed_monumentos.addData(data);
});

// ######### ed_conjuntos ###########

var ed_conjuntos = L.geoJson(null, {
  style: function (feature) {
    return {
      color: "#ffcd67",
      fill: true,
      opacity: 1,
      //stroke: false,
      fillColor: "#ffcd67",
      weight: 2
//   fillOpacity: 0.7,
 
    };
  },
   onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<h2>"+feature.properties.id0+"</h2><p><b>PARCELAS: </b>"+feature.properties.Parcela+"</p>"+"<p><b>Ficha: </b> <a target='_blank' href='http://www.gmucordoba.es/"+feature.properties.pdf+"'>Ver ficha</a></p>";
      layer.on({
        click: function (e) {
          $("#feature-title").html("PARCELAS");
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
          //opacity: 1,
          //fillOpacity: 0.3,
          //fill: true,
      
        });


      var contentpopup = "<p><b>"+feature.properties.id0+"</b><br>"+feature.properties.Parcela+"</p";
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
        ed_conjuntos.resetStyle(e.target);
        /// Borrar opup emergente en hover
        map.closePopup();
      }
    });
  }
});
$.getJSON("data/parcelas.geojson", function (data) {
  ed_conjuntos.addData(data);
});

// ######### ed_edificios ###########

var ed_edificios = L.geoJson(null, {
  style: function (feature) {
    return {
      color: "#ffcc00",
      fill: true,
      opacity: 1,
      //stroke: false,
      fillColor: "#ffcc00",
      weight: 2
//   fillOpacity: 0.7,
 
    };
  },
   onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<h2>"+feature.properties.id0+"</h2><p><b>PARCELA: </b>"+feature.properties.Parcela+"</p>"+"<p><b>Valoración: </b> <a target='_blank' href='http://www.gmucordoba.es/"+feature.properties.pdf+"'>Ver ficha</a></p>"+"<p><b>Imagen: </b><br><img src='http://www.gmucordoba.es/"+feature.properties.img+"' width='70%'></p>";
      layer.on({
        click: function (e) {
          $("#feature-title").html("PARCELAS");
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
          //opacity: 1,
          //fillOpacity: 0.3,
          //fill: true,
      
        });


      var contentpopup = "<p><b>"+feature.properties.id0+"</b><br>"+feature.properties.nombre+"</p";
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
        ed_edificios.resetStyle(e.target);
        /// Borrar opup emergente en hover
        map.closePopup();
      }
    });
  }
});
$.getJSON("data/frierapuntos.geojson", function (data) {
  ed_edificios.addData(data);
});
// ######### ed_hitos ###########

var ed_hitos = L.geoJson(null, {
  style: function (feature) {
    return {
      color: "#000000",
      fill: true,
      opacity: 1,
      //stroke: false,
      fillColor: "#000000",
      weight: 2
//   fillOpacity: 0.7,
 
    };
  },
   onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "<h2>"+feature.properties.id0+"</h2><p><b>Nombre: </b>"+feature.properties.nombre+"</p>"+"<p><b>Ficha: </b> <a target='_blank' href='http://www.gmucordoba.es/"+feature.properties.pdf+"'>Ver ficha</a></p>"+"<p><b>Imagen: </b><br><img src='http://www.gmucordoba.es/"+feature.properties.img+"' width='70%'></p>";
      layer.on({
        click: function (e) {
          $("#feature-title").html("PARCELAS");
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
          //opacity: 1,
          //fillOpacity: 0.3,
          //fill: true,
      
        });


      var contentpopup = "<p><b>"+feature.properties.id0+"</b><br>"+feature.properties.nombre+"</p";
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
        ed_hitos.resetStyle(e.target);
        /// Borrar opup emergente en hover
        map.closePopup();
      }
    });
  }
});
$.getJSON("data/ed_hitos.geojson", function (data) {
  ed_hitos.addData(data);
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
$.getJSON("data/limite_ch.geojson", function (data) {
  limite_ch.addData(data);
});



// MAP
map = L.map("map", {
  zoom: 14,
  center: [42.883094,-6.776287],
  layers: [PNOA, limite_ch, espacios_catalogados,al_espacios],
  zoomControl: false,
  attributionControl: true
});



/* Clear feature highlight when map is clicked */
map.on("click", function(e) {
  highlight.clearLayers();
});



var zoomControl = L.control.zoom({
  //position: "bottomright"
  zoomInTitle: 'Aumentar zoom',
  zoomOutTitle: 'Disminuir zoom'

}).addTo(map);

L.control.scale({imperial:false}).addTo(map);

/* GPS enabled geolocation control set to follow the user's location */
var locateControl = L.control.locate({
  //position: "bottomright",
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
    title: "Mi ubicación",
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
 
  "Catastro": catastro,
  
  "OpenStreetMap":osm
  //"Google":ggl
  
};

var groupedOverlays = {
  
  "HISPANIA": {
    
    "CH":limite_ch
    //"1994":limite_humanidad_94,
    //"1984":limite_humanidad_84
    

  },
  "PARCELAS": {
    
    
    "Catalogados":espacios_catalogados,
    "Áreas Libres":al_espacios

  },
  "CATASTRO": {
        
    "RUSTICAS SITRAMA":ed_monumentos,
    "RUSTICAS FRIERA":ed_edificios,
    "URBANAS":ed_conjuntos,
    "Hitos":ed_hitos,

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

 var style = {color:'red', opacity: 1.0, fillOpacity: 1.0, weight: 2, clickable: false};
        L.Control.FileLayerLoad.LABEL = '<i class="fa fa-folder-open"></i>';
        L.Control.fileLayerLoad({
            fitBounds: true
            // layerOptions: {style: style,
            //                pointToLayer: function (data, latlng) {
            //                   return L.circleMarker(latlng, {style: style});
            //                }},
        }).addTo(map);

// Leyenda
// var legend = L.control({
//   position: 'bottomleft',
//   toggleDisplay: true});

// legend.onAdd = function (map) {
// var div = L.DomUtil.create('div', 'info legend');
// //div.innerHTML +="<img alt='legend' src='./data/leyendas/01_lim.png'/>";
// div.innerHTML +="<img alt='legend' src='./data/leyendas/02_espacios_catalogados.png'/>";
// //width='127' height='120'
// return div;
// };
// legend.addTo(map);



// Minimap

// var miniMap = new L.Control.MiniMap(osm, { 
//   toggleDisplay: true,
//   zoomLevelOffset: -4,
//   zoomAnimation: false
//    }).addTo(map);

