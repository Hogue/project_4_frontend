(function mapControllerIIFE() {

var MapController = function($scope, $log, $timeout, uiGmapGoogleMapApi) {

  // Define variables for our Map object
  var areaLat      = 44.2126995,
      areaLng      = -100.2471641,
      areaZoom     = 3;

  $scope.count = 0;

  var events = {
    places_changed: function (searchBox) {
      var query = searchBox.getPlaces()[0];
      var bathroom = {};
      bathroom.latitude = query.geometry.location.k;
      bathroom.longitude = query.geometry.location.D;
      $scope.count++;
      bathroom.id = $scope.count;
      bathroom.title = location.formatted_address;
      $scope.bathrooms.push(bathroom);
      console.log(query);
    }
  }

  $scope.searchbox = { template:'searchbox.tpl.html', events:events};
  $scope.bathrooms = [];

  uiGmapGoogleMapApi.then(function(maps) {
    $scope.map     = { center: { latitude: areaLat, longitude: areaLng }, zoom: areaZoom};
    $scope.options = { scrollwheel: false };

  });

 };

 // MapController.$inject = ['mapFactory', 'appSettings'];

 // The Controller is part of the module.
 angular.module('mapApp').controller('mapController', MapController);

})();
