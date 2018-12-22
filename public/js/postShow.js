mapboxgl.accessToken = mapBoxToken;

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v9',
    center: services.geometry.coordinates,
    zoom: 5
  });
  
  // create a HTML element for our post location/marker
  var el = document.createElement('div');
  el.className = 'marker';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v9',
    center: services.geometry.coordinates,
    zoom: 11
});
 // create a HTML element for service location
new mapboxgl.Marker(el)
.setLngLat(services.geometry.coordinates)
.setPopup(new mapboxgl.Popup({offset: 25})
.setHTML('<h3>' + services.name +'</h3>' + services.location + '</p>'))
.addTo(map);

