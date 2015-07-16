(function mapControllerIIFE() {

var MapController = function($scope, $log, $timeout, uiGmapGoogleMapApi, $http) {

  // Define variables for our Map object
  var areaLat      = 44.2126995,
      areaLng      = -100.2471641,
      areaZoom     = 14;

  var events = {
    places_changed: function (searchBox) {
      var query = searchBox.getPlaces()[0];
      $scope.searchbox.options.location = {lat: query.geometry.location.k, lng: query.geometry.location.D};
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
  };

  $scope.count = 0;

  $scope.events = {
      'markercomplete': function(gObject, eventName, model, args) {
        var marker = args[0];
        var bathroom = {};
        bathroom.longitude = marker.position.D;
        bathroom.latitude = marker.position.k;
        $scope.count++;
        bathroom.id = $scope.count;
        // bathroom.title = query.formatted_address;
        // bathroom.place_id = query.place_id;
        var geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(bathroom.latitude, bathroom.longitude);

        geocoder.geocode({'location': latlng }, function(results, status) {
          bathroom.title = results[1].formatted_address;
          console.log(bathroom.title);
          bathroom.place_id = results[1].place_id;
          $scope.bathrooms.push(bathroom);
          $http.post('http://localhost:3000/bathrooms', bathroom).
            success(function(data) {
              console.log("success!");
            });

        });

      }

  };
  $scope.bathroomIcon = "http://i.imgur.com/DnEEuJo.png";
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
        // $scope.currentLocation.push(pos);
        $scope.searchbox.options.location = {lat: position.coords.latitude, lng: position.coords.longitude};

      uiGmapGoogleMapApi.then(function(maps) {
        $scope.map     = {
          center: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
          zoom: areaZoom
        };
        $scope.options = { scrollwheel: false };

        angular.element("#actionBar").append(angular.element("#searchBox").detach());

        var searchBox = $("#searchBox");

        var bar = $("#actionBar");

        $.parseHTML(searchBox);

        console.log(searchBox);
        console.log(actionBar);


        // $("#searchBox").detach().appendTo("#actionBar");
        //   console.log('got passed tits');


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

        $http.get('http://localhost:3000/bathrooms').success(function(data) {
            console.log(data);
            $scope.bathrooms = data;
          });


      //   $scope.bathrooms.onClick = function() {
      //   console.log("Clicked!", bathroom.show);
      //   $scope.bathrooms.selected.show = false;
      //   $scope.bathrooms.selected = bathroom;
      //   $scope.bathrooms.selected.show = !$scope.selected.show;
      //   bathroom.show = $scope.selected.show;
      // };
      //   $scope.bathrooms.onCloseClick = function() {
      //   $scope.selected.show = false;
      //   bathroom.show = false;
      //   console.log("CloseClicked", bathroom);
      //   $scope.$apply();
      // };

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
