(function mapControllerIIFE() {

var MapController = function($scope, $log, $timeout, uiGmapGoogleMapApi, $http) {

  // Define variables for our Map object
  var areaLat      = 44.2126995,
      areaLng      = -100.2471641,
      areaZoom     = 3;

  $scope.count = 1;



  var events = {
    places_changed: function (searchBox) {
      var query = searchBox.getPlaces()[0];
      var bathroom = {};
      bathroom.longitude = query.geometry.location.D;
      bathroom.latitude = query.geometry.location.k;
      $scope.count++;
      bathroom.id = $scope.count;
      bathroom.title = query.formatted_address;
      bathroom.place_id = query.place_id;
      $scope.bathrooms.push(bathroom);
      console.log(query);
      console.log(bathroom);
      // Simple POST request example (passing data) :
      $http.post('http://localhost:3000/bathrooms', bathroom).
      success(function(data) {

      });
    }
  }

  $scope.searchbox = { template:'searchbox.tpl.html', events:events};
  $scope.bathrooms = [];
  $scope.currentLocation = [];


  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
          id: 0,
          title: "current location"
        };
        console.log(pos);
        $scope.currentLocation.push(pos);

      uiGmapGoogleMapApi.then(function(maps) {
        $scope.map     = {
          center: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
          zoom: areaZoom
        };
        $scope.options = { scrollwheel: false };
      });
    }, function(error){
      console.error(error);
    }, {
      maximumAge: 0
    });

    }

  };

 // MapController.$inject = ['mapFactory', 'appSettings'];

 // The Controller is part of the module.
 angular.module('mapApp').controller('mapController', MapController);

})();
