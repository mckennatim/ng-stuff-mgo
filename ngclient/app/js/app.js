'use strict';


// Declare app level module which depends on filters, and services
angular.module('stuffApp', [
  'ngRoute',
  'stuffAppServices',
  'stuffAppControllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/list', {templateUrl: 'partials/list.html', controller: 'ListCtrl'});
  $routeProvider.when('/lists', {templateUrl: 'partials/lists.html', controller: 'ListsCtrl'});
  $routeProvider.when('/user', {templateUrl: 'partials/user.html', controller: 'UserCtrl'});
  $routeProvider.when('/shops', {templateUrl: 'partials/shops.html', controller: 'ShopsCtrl'});
  $routeProvider.when('/config', {templateUrl: 'partials/config.html', controller: 'ConfigCtrl'});
  $routeProvider.when('/', {templateUrl: 'partials/shownothing.html', controller: 'IsregCtrl'});
  $routeProvider.when('/register', {templateUrl: 'partials/register.html', controller: 'RegisterCtrl'});
  $routeProvider.otherwise({redirectTo: '/items'});
}],
  ['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }
]);
