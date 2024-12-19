let map, directionsService, directionsRenderer, startTime, timerInterval;
let markers = [];

function initMap() {
  // Initialize the map
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco
  });

  // Initialize Directions Service and Renderer
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    map: map,
    suppressMarkers: true, // We'll handle custom markers
  });

  // Add click listener to select route points
  map.addListener("click", (event) => {
    addMarker(event.latLng);

    // Calculate route when 2 markers are added
    if (markers.length === 2) {
      calculateRoute();
      startTimer();
    }
  });
}

function addMarker(location) {
  // Add a marker at the clicked location
  const marker = new google.maps.Marker({
    position: location,
    map: map,
  });
  markers.push(marker);
}

function calculateRoute() {
  const start = markers[0].getPosition();
  const end = markers[1].getPosition();

  const request = {
    origin: start,
    destination: end,
    travelMode: "WALKING", // Change to "DRIVING" or "BICYCLING" if needed
  };

  directionsService.route(request, (result, status) => {
    if (status === "OK") {
      directionsRenderer.setDirections(result);
    } else {
      console.error("Error calculating route:", status);
    }
  });
}

function clearRoute() {
  // Clear route and reset markers
  directionsRenderer.setDirections({ routes: [] });
  markers.forEach((marker) => marker.setMap(null));
  markers = [];
  clearTimer();
}

function startTimer() {
  // Start the timer
  startTime = new Date();
  clearInterval(timerInterval); // Clear any previous timer
  timerInterval = setInterval(updateTimer, 1000);
}

function clearTimer() {
  clearInterval(timerInterval);
  document.getElementById("timer").textContent = "Elapsed Time: 00:00:00";
}

function updateTimer() {
  const now = new Date();
  const elapsed = now - startTime;

  const hours = Math.floor(elapsed / 3600000);
  const minutes = Math.floor((elapsed % 3600000) / 60000);
  const seconds = Math.floor((elapsed % 60000) / 1000);

  document.getElementById("timer").textContent =
    `Elapsed Time: ${String(hours).padStart(2, "0")}:` +
    `${String(minutes).padStart(2, "0")}:` +
    `${String(seconds).padStart(2, "0")}`;
}
