
function initMap() {
  // init map
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 38.89, lng: -77.00},
    zoom: 12,
    zoomControl: true,
    zoomControlOpt: {
      style: 'SMALL',
      position: 'TOP_LEFT'
    },
    styles: [{
      featureType: 'poi',
      stylers: [{ visibility: 'off' }]  // Turn off points of interest.
    }, {
      featureType: 'transit.station',
      stylers: [{ visibility: 'off' }]  // Turn off bus stations, train stations, etc.
    }],
    disableDoubleClickZoom: true
  });


  // public transportation layer
  var transitLayer = new google.maps.TransitLayer();
  transitLayer.setMap(map);

  var metroLayer = new google.maps.Data();
  var aptLayer = new google.maps.Data();

  metroLayer.loadGeoJson('http://localhost:8000/Metro_Stations_Regional');
  aptLayer.loadGeoJson('http://localhost:8000/apts_400');
  metroLayer.setMap(map);
  aptLayer.setMap(map);

  metroLayer.setStyle({
    icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
  });


  // Set mouseover event for each feature.
  metroLayer.addListener('click', function(event) {
    document.getElementById('info-box').textContent =
    event.feature.getProperty('NAME');
  });

  // set destination
  document.getElementById('destination').addEventListener('click', function(){
    metroLayer.addListener('click', function(event){
      // xhr.open('GET', 'https://api.uber.com/v1/products?latitude=37.7759792&longitude=-122.41823');
      // xhr.setRequestHeader("Authorization", "Token FzWnNUf9-7mbIs-ntXotCvUt76bz47YgyYxOIKXS");
      var lat = event.feature.getGeometry().get().lat();
      var lng = event.feature.getGeometry().get().lng();
      destinationPosition = {lat: lat, lng: lng};
      document.getElementById('destination').value = event.feature.getProperty('NAME');
    });
  });
// set starting point

  document.getElementById('start').addEventListener('click', function(){
    aptLayer.addListener('click', function(event){
      var lat = event.feature.getGeometry().get().lat();
      var lng = event.feature.getGeometry().get().lng();

      startingPosition = {lat: lat, lng: lng};
      document.getElementById('start').value = event.feature.getProperty('name');
    });
  });

  // directions layer
  var directionsDisplay = new google.maps.DirectionsRenderer;
  var directionsService = new google.maps.DirectionsService;

  // add layer
  directionsDisplay.setMap(map);

  calculateAndDisplayRoute(directionsService, directionsDisplay);

  document.getElementById('direction').addEventListener('click', function() {
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  });

  function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    var selectedMode = document.getElementById('mode').value;


    directionsService.route({
      origin: startingPosition,  // Haight.
      destination: destinationPosition,  // Ocean Beach.
      // Note that Javascript allows us to access the constant
      // using square brackets and a string value as its
      // "property."
      travelMode: google.maps.TravelMode[selectedMode]
    }, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

}
