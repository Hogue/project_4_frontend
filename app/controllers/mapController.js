(function mapControllerIIFE() {

var MapController = function($scope, $log, $timeout, uiGmapGoogleMapApi, $http) {

  // Define variables for our Map object
  var areaLat      = 44.2126995,
      areaLng      = -100.2471641,
      areaZoom     = 14;

  $scope.count = 1;



  var events = {
    places_changed: function (searchBox) {
      var query = searchBox.getPlaces()[0];
      // var bathroom = {};
      // bathroom.longitude = query.geometry.location.D;
      // bathroom.latitude = query.geometry.location.k;
      // $scope.count++;
      // bathroom.id = $scope.count;
      // bathroom.title = query.formatted_address;
      // bathroom.place_id = query.place_id;
      // $scope.bathrooms.push(bathroom);
      // console.log(query);
      // console.log(bathroom);
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

      // $http.post('http://localhost:3000/bathrooms', bathroom).
      // success(function(data) {

      // });
    }
  }

  // $scope.drawingManagerOptions = {
  //   drawingMode: google.maps.drawing.OverlayType.MARKER,
  //   drawingControl: true,
  //   drawingControlOptions: {
  //     position: google.maps.ControlPosition.Top_Center,
  //       drawingModes: [
  //         google.maps.drawing.OverlayType.MARKER
  //       ]
  //   }
  // };

  // $scope.drawingManagerControl = {};

  // $scope.events = {
  //   'markercomplete': function(gObject, gData) {
  //     console.log(gObject);
  //   }
  // };

  $scope.events = {
      'markercomplete': function(gObject, eventName, model, args) {
        var marker = args[0];
        console.log(marker);
      }
  }

  // $scope.google.maps.event.addListener(drawingManagerControl, 'markercomplete', function (marker) {
  //     console.log(marker);
  //   });

  $scope.searchbox = {template:'searchbox.tpl.html', events:events};
  if(!$scope.searchbox.options) {
    $scope.searchbox.options = {};
  }
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
