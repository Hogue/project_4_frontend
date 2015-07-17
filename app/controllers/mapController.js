(function mapControllerIIFE() {

// needed: $scope, uiGmapGoogleMapApi, $http
var MapController = function($scope, uiGmapGoogleMapApi, $http) {

  // Define variables for our Map object
  var areaZoom = 16;

  // Geolocation Model — holds users current location object
  $scope.currentLocation = [];

  // Find Geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        longitude: position.coords.longitude,
        latitude: position.coords.latitude,
        id: 0,
        title: "current location"
        };
        // $scope.currentLocation.push(pos);
        $scope.searchbox.options.location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      // Map Load
      uiGmapGoogleMapApi.then(function(maps) {
        $scope.map = {
          center: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
          zoom: areaZoom
        };
        $scope.options = {
          scrollwheel: false
        };

        // Drawing Manager Settings
        $scope.drawingManagerOptions = {
          drawingMode: null,
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

  // Get Request For Makers
  $http.get('http://localhost:3000/bathrooms').success(function(data) {
    console.log(data);
    $scope.bathrooms = data;
  });

  // model property for custom icon
  $scope.bathroomIcon = {
    url: "http://i.imgur.com/DnEEuJo.png"
  }
  // bathrooms array to hold markers
  $scope.bathrooms = [];

  // Marker Generation
  $scope.events = {
    'markercomplete': function(gObject, eventName, model, args) {
      var marker = args[0];
      var bathroom = {};

      bathroom.longitude = marker.position.D;
      bathroom.latitude = marker.position.k;
      bathroom.id = Date.now();

      var geocoder = new google.maps.Geocoder();
      var latlng = new google.maps.LatLng(bathroom.latitude, bathroom.longitude);

      geocoder.geocode({'location': latlng }, function(results, status) {
        bathroom.title = results[1].formatted_address;
        bathroom.place_id = results[1].place_id;
        $scope.bathrooms.push(bathroom);
        // console.log($scope.bathrooms);
        $http.post('http://localhost:3000/bathrooms', bathroom).success(function(data) {
            console.log("success!");
        });
      });
    }
  };

  // Search Bar — Location Change
  var events = {
    places_changed: function (searchBox) {
      var query = searchBox.getPlaces()[0];
      $scope.searchbox.options.location = {
        lat: query.geometry.location.k,
        lng: query.geometry.location.D
      };
      uiGmapGoogleMapApi.then(function(maps) {
        $scope.map = {
          center: {
            latitude: query.geometry.location.k,
            longitude: query.geometry.location.D
          },
          zoom: areaZoom
        };
        $scope.options = {
          scrollwheel: false
        };

      });
    }
  };

  // Properties of the searchbox model
  $scope.searchbox = {
    template:'searchbox.tpl.html',
    events:events,
    parentdiv: 'actionBar'
  };

  if(!$scope.searchbox.options) {
    $scope.searchbox.options = {};
  }

};

 // MapController.$inject = ['mapFactory', 'appSettings'];


 angular.module('mapApp').controller('mapController', MapController);

})();
