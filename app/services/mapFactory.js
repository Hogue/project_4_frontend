(function mapFactoryIIFE(){

  app.controller("mapController", function( uiGmapGoogleMapApi) {

  // Define variables for our Map object
  var areaLat      = 44.2126995,
      areaLng      = -100.2471641,
      areaZoom     = 3;

  uiGmapGoogleMapApi.then(function(maps) {
    this.map     = { center: { latitude: areaLat, longitude: areaLng }, zoom: areaZoom };
    this.options = { scrollwheel: false };
  });

});

  angular.module('mapApp').factory('mapFactory', mapFactory);
})();
