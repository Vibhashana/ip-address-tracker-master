const api = "https://geo.ipify.org/api/v2/country,city";

const map = L.map("map").setView([0, 0], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

const mapMarker = L.icon({
  iconUrl: "../images/icon-location.svg",

  iconSize: [46, 56],
  iconAnchor: [23, 56],
});

const marker = L.marker([51.505, -0.09], { icon: mapMarker }).addTo(map);

let layerGroup = L.layerGroup().addTo(map);

const setCoordinates = (lat, lon) => {
  layerGroup.clearLayers();
  map.setView([lat, lon]);
  const marker = L.marker([lat, lon], { icon: mapMarker }).addTo(layerGroup);
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
    displayErrors("Sorry, nothing found. Please try again.");
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

  setCoordinates(data.location.lat, data.location.lng);
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

fetchDetails();

const handleSubmit = (e) => {
  e.preventDefault();
  clearErrors();

  const ipAddress = document.getElementById("ip-input").value;

  if (!ipAddress) {
    displayErrors("Add a valid IP address or a valid domain.");
    return;
  }

  if (validateIpAddress(ipAddress)) {
    fetchDetails(ipAddress);
    return;
  } else if (validateDomainAddress(ipAddress)) {
    fetchDetails(null, ipAddress);
    return;
  } else {
    displayErrors(
      "Neither a valid IP address nor a valid domain. Please check and try again."
    );
    return;
  }
};

const displayErrors = (message) => {
  const form = document.getElementById("form");
  const errorMsg = document.getElementById("form-feedback");

  errorMsg.innerHTML = message;
  form.classList.add("has-error");
  errorMsg.setAttribute("aria-hidden", false);
};

const clearErrors = () => {
  const form = document.getElementById("form");
  const errorMsg = document.getElementById("form-feedback");

  errorMsg.innerHTML = "";
  form.classList.remove("has-error");
  errorMsg.setAttribute("aria-hidden", true);
};

document.querySelector("form").addEventListener("submit", handleSubmit);
