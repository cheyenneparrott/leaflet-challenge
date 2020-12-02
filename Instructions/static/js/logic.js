const API_KEY = "pk.eyJ1IjoiY2hleWVubmVwYXJyb3R0IiwiYSI6ImNraGJhZnp6czBkbG0ycnNhMWozcGpsYWMifQ.lL6x_cnw_ya4MtHSvTJ_gA";
//   var myMap = L.map("map", mapProperties)
var mapProperties = L.map("mapid", {
  center: [45, -94.1689],
  zoom: 2.5
  // layers: [satelliteMap, lightmap, outdoors]
}); //lightmap.addTo(mapProperties)


  // Adding a tile layer (the background map image) to our map
  // We use the addTo method to add objects to our map
  var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    mapZoom: 15,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY});
  var lightmap =L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: API_KEY
    });
var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  mapZoom: 15,
  zoomOffset: -1,
  id: "mapbox/outdoors-v11",
  accessToken: API_KEY});
  // Create a baseMaps object to hold the lightmap layer
   var baseMaps = {
    "Outdoors": outdoors,
     "Satellite": satelliteMap,
     "Light Map": lightmap
  };
outdoors.addTo(mapProperties);

var earthquakeData = new L.LayerGroup()
// Create an overlayMaps object to hold the earthquake layer
var overlayMaps = {
  "Earthquakes": earthquakeData
};
// Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
      }).addTo(mapProperties);
  

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  // L.control.layers(baseMaps, overlayMaps, {
  //   collapsed: false
  // }).addTo(mapProperties);

  USGS_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

  d3.json(USGS_url, function(earthquake) {
      function earthCirclesize(magnitude){
          if (magnitude === 0)
          return 1;
          else
          return(magnitude * 3);
      }
      function earthCirclecolor(depth){
        if (depth > 90) return "red";
        else if (depth > 70) return "orange";
        else if (depth > 50) return "lightorange";
        else if (depth > 30) return "yellow";
        else if (depth > 10) return "lightgreen";
        else return "green";
    }
    function circleMaking(feature) {
      return {
        radius: earthCirclesize(feature.properties.mag),
        fillColor: earthCirclecolor(feature.geometry.coordinates[2]),
        weight: 0.5,
        color: "purple"
      }
    }
    // Create a Geojson layer containing a features array of the earthquake data
    L.geoJson(earthquake, {
      pointToLayer: function(feature, latLong){
        return L.circleMarker(latLong);
      },
      style: circleMaking,
      onEachFeature: function (feature, layer){
        layer.bindPopup(feature.properties.mag + "<br> Location: " + feature.properties.place + "<br> Depth:" + feature.geometry.coordinates[2])
      }
    }).addTo(earthquakeData);
  earthquakeData.addTo(mapProperties);


 // Creating legend
var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  var colors = ["green", "lightgreen", "yellow", "lightorange", "orange", "red"];
  var depthLabels = ["-20", "20", "50", "100", "120", "140"];

for(var i = 0; depthLabels.length; i++) {
  div.innerHTML += "<i style='background:" +colors[i] + "'></i>" + depthLabels[i] +  "<br>";
}
    return div;
};

// Adding legend to the map
legend.addTo(myMap);
});
