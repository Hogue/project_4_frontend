(function mapAppIIFE(){

var app = angular.module('mapApp', ['uiGmapgoogle-maps','ngRoute'])
  app.config(['$routeProvider', 'uiGmapGoogleMapApiProvider', function($routeProvider, uiGmapGoogleMapApiProvider) {

  uiGmapGoogleMapApiProvider.configure({
    key: 'AIzaSyAbME82hk_QRyyPWR8-zG3nUlvEDvAK3C4',
    v: '3.17',
    libraries: 'weather,geometry,visualization,places,drawing'
  });

  $routeProvider
      .when('/',
        {
          controller: 'mapController as mapController',
          templateUrl: 'app/views/map.html'
        }
      )
  }]);


})();
