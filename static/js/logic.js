// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
  console.log(data.features)
  
});



function createFeatures(earthquakeData) {

var earthquakes = []
    for (var i=0; i<earthquakeData.length; i++) {
        // Conditionals for countries points
          var color = ""
          var depth = earthquakeData[i].geometry.coordinates[2]
          if (depth >=90) {
            color = 'red';
          } 
          else if (depth < 90 && depth >= 70) {
            color = "orange";
          }
          else if (depth < 70 && depth >= 50) {
            color = "yellow";
          }
          else if (depth < 50 && depth >= 30) {
            color = "light yellow";
          }
          else if (depth < 30 && depth >= 10) {
            color = "blue";
          }  
          else {
            color = "gray";
          }
          
          var magsize = (earthquakeData[i].properties.mag)*3
          // Add circles to map
          earthquakes.push(L.circleMarker([earthquakeData[i].geometry.coordinates[1], earthquakeData[i].geometry.coordinates[0]], {
              color: "White",
              fillOpacity: .75,
              fillColor: color,
              radius: magsize
          }))
        //   .bindPopup("<h1>" + countries[i].name + "</h1> <hr> <h3>Points: " + countries[i].points + "</h3>")
        }

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}



function createMap(earthquakes) {

var quakes = L.layerGroup(earthquakes);
  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: quakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, quakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}



