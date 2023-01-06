const api = "";

// Creating map options
const mapOptions = {
  center: [7.354222, 80.7120348],
  zoom: 15,
};

const mapMarker = L.icon({
  iconUrl: "../images/icon-location.svg",

  iconSize: [46, 56],
  iconAnchor: [23, 56],
});

// Creating a map object
const map = new L.map("map", mapOptions);

const marker = L.marker(mapOptions.center, { icon: mapMarker }).addTo(map);

// Creating a Layer object
const layer = new L.TileLayer(
  "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
);

// Adding layer to the map
map.addLayer(layer);
