(function mapControllerIIFE() {

var MapController = function($scope, $log, $timeout, uiGmapGoogleMapApi, $http) {

  // Define variables for our Map object
  var areaLat      = 44.2126995,
      areaLng      = -100.2471641,
      areaZoom     = 14;

  var events = {
    places_changed: function (searchBox) {
      var query = searchBox.getPlaces()[0];
      $scope.searchbox.options.location = {lat: query.geometry.location.k, lng: query.geometry.location.D}
      uiGmapGoogleMapApi.then(function(maps) {
        $scope.map     = {
          center: {
            latitude: query.geometry.location.k,
            longitude: query.geometry.location.D
          },
          zoom: areaZoom
        };
        $scope.options = { scrollwheel: false };

        });
    }
  }

  $scope.count = 0;

  $scope.events = {
      'markercomplete': function(gObject, eventName, model, args) {
        var marker = args[0];
        console.log(marker);
        console.log();
        var bathroom = {};
        bathroom.longitude = marker.position.D;
        console.log(bathroom.longitude);
        bathroom.latitude = marker.position.k;
        console.log(bathroom.latitude);
        $scope.count++;
        bathroom.id = $scope.count;
        // bathroom.title = query.formatted_address;
        // bathroom.place_id = query.place_id;
        console.log(bathroom);
        var geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(bathroom.latitude, bathroom.longitude);

        geocoder.geocode({'location': latlng }, function(results, status) {
          bathroom.title = results[1].formatted_address;
          bathroom.place_id = results[1].place_id;
          $scope.bathrooms.push(bathroom);
          console.log($scope.bathrooms);
          $http.post('http://localhost:3000/bathrooms', bathroom).
            success(function(data) {
              console.log("success!");
            });

        });

      }

  };

  $scope.bathrooms = [];

  $scope.searchbox = {template:'searchbox.tpl.html', events:events};
  if(!$scope.searchbox.options) {
    $scope.searchbox.options = {};
  }
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
        // $scope.currentLocation.push(pos);
        $scope.searchbox.options.location = {lat: position.coords.latitude, lng: position.coords.longitude}

      uiGmapGoogleMapApi.then(function(maps) {
        $scope.map     = {
          center: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
          zoom: areaZoom
        };
        $scope.options = { scrollwheel: false };

        $scope.drawingManagerOptions = {
          drawingMode: google.maps.drawing.OverlayType.MARKER,
          drawingControl: true,
          drawingControlOptions: {
            position: google.maps.ControlPosition.Top_Center,
              drawingModes: [
                google.maps.drawing.OverlayType.MARKER
              ]
          }
        };

        $scope.drawingManagerControl = {};

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
