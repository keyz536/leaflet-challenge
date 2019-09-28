var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

d3.json(url, function(quakes) {

  console.log(quakes.features);
  createFeatures(quakes.features);
});

var legend = L.control({position: 'bottomleft'});

legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend'),
        strength = [1,2,3,4,5]

    for (var i = 0; i < strength.length; i++)
    {
      div.innerHTML +=
        '<i style="background:' + getColor(strength[i] + 1) + '"></i> ' +
        strength[i] + (strength[i + 1] ? '&ndash;' + strength[i + 1] + '<br>' : '+');
    }
    console.log('div' + div);
  return div;
};

function getColor(c)
{
  x = Math.ceil(c);
  switch (Math.ceil(x)) {
    case 1:
      return "#1561ad";
    case 2:
      return "#1c77ac";
    case 3:
      return "#1dbab4";
    case 4:
      return "#4f5f76";
    case 5:
      return "#091f36";
    default:
      return "#76c1d4";
  }
}

function createFeatures(earthquakeData) {
  var earthquakes = L.geoJson(earthquakeData,{
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: feature.properties.mag*5,
        fillColor: getColor(feature.properties.mag),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.9})
        .bindPopup("<p>" + "Magnitude: " + feature.properties.mag + "</p>");
  }
});

  createMap(earthquakes);
}

function createMap(earthquakes) {

  var lightshade = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  })

  var darkshade = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  })

  var base = {
    "Light": lightshade,
    "Dark": darkshade
  };

  var overlay = {
    Earthquakes: earthquakes
  };

  var myMap = L.map("map", {
    center: [0.00, 0.00],
    zoom: 2,
    layers: [lightshade, earthquakes]
  });
    console.log(myMap);

  L.control.layers(base, overlay, {
    collapsed: false
   }).addTo(myMap);

  legend.addTo(myMap);
}