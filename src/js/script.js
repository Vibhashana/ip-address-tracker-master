const api = "https://geo.ipify.org/api/v2/country,city"; //"https://geo.ipify.org/api/v2/country,city"

const createMap = (lat, lan) => {
  // Creating map options
  const mapOptions = {
    center: [lat, lan],
    zoom: 15,
  };

  const mapMarker = L.icon({
    iconUrl: "../images/icon-location.svg",

    iconSize: [46, 56],
    iconAnchor: [23, 56],
  });

  const container = L.DomUtil.get("map");
  if (container != null) {
    container._leaflet_id = null;
  }

  // Creating a map object
  const map = new L.map("map", mapOptions);

  const marker = L.marker(mapOptions.center, { icon: mapMarker }).addTo(map);

  // Creating a Layer object
  const layer = new L.TileLayer(
    "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  );

  // Adding layer to the map
  map.addLayer(layer);
};

const fetchDetails = async (ipAddress, domain) => {
  const endpoint = new URL(api);

  endpoint.searchParams.set("apiKey", "at_7hrZB3shHVrCHeTqH9Q8mnepcVrHq");

  if (ipAddress) {
    endpoint.searchParams.set("ipAddress", ipAddress);
  }

  if (domain) {
    endpoint.searchParams.set("domain", domain);
  }

  const response = await fetch(endpoint);

  if (response.status !== 200) {
    return;
  }

  const data = await response.json();

  const ip = document.getElementById("ip");
  const location = document.getElementById("location");
  const timezone = document.getElementById("timezone");
  const isp = document.getElementById("isp");

  ip.innerHTML = data.ip;
  location.innerHTML = `${data.location.city}, ${data.location.region} ${
    data.location.postalCode || ""
  }`;
  timezone.innerHTML = data.location.timezone
    ? `UTC${data.location.timezone}`
    : "N/A";
  isp.innerHTML = data.isp ? data.isp : "N/A";

  createMap(data.location.lat, data.location.lng);
};

const validateIpAddress = (ipAddress) => {
  const ipV4Regex = new RegExp(
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  );

  const ipV6Regex = new RegExp(
    /((^\h*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\h*$)|(^\h*((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\h*$))/gi
  );

  return ipV4Regex.test(ipAddress)
    ? true
    : ipV6Regex.test(ipAddress)
    ? true
    : false;
};

const validateDomainAddress = (domain) => {
  const regEx = new RegExp(
    /^(?!-)[A-Za-z0-9-]+([\-\.]{1}[a-z0-9]+)*\.[A-Za-z]{2,6}$/
  );

  return regEx.test(domain);
};

// fetchDetails();
// createMap("7.3548286", "80.7115405");

const handleSubmit = (e) => {
  e.preventDefault();

  const ipAddress = document.getElementById("ip-input").value;

  if (!ipAddress) {
    alert("Add an IP address");
    return;
  }

  if (validateIpAddress(ipAddress)) {
    // alert("Valid IP address");
    fetchDetails(ipAddress);
    return;
  } else if (validateDomainAddress(ipAddress)) {
    // alert("Valid domain address");
    fetchDetails(null, ipAddress);
    return;
  } else {
    alert("Neither valid IP address nor domain address");
    return;
  }
};

document.querySelector("form").addEventListener("submit", handleSubmit);
