'use strict';

/* Controlrs */
var stuffAppControllers = angular.module('stuffAppControllers', []);

stuffAppControllers.controller('ItemsCtrl', function ($scope) {
  $scope.dog = 'mutt';
});

stuffAppControllers.controller('TimeCtrl', function ($scope, UsersData) {
  $scope.timestamp=Date.now();
  console.log($scope.timestamp);
  $scope.addUser = function(){
    console.log('in addUser');
    UsersData.post().then(function(d){
      console.log(d);
    });
  };
});

stuffAppControllers.controller('InpCtrl', function ($scope, ItemsData, $filter) {
  var list;
  ItemsData.get().then(function(d){
    console.log(d);
    list= $scope.list = d.data;
    $scope.$watch('list', function(newValue, oldValue){
      console.log(list);
      $scope.cnt = $filter('filter')(list, {done:false}).length;
      if (newValue !== oldValue) { // This prevents unneeded calls to the local storage
        ItemsData.put(list);
      }
    }, true);
  });
  $scope.query='';
  $scope.rubmit = function(){
    if ($scope.query) {
      $scope.list.push({lid:26, product:this.query, done:false});
      $scope.query = '';
     }
  };
  $scope.clearTbox = function(){$scope.query = '';};
  $scope.remove= function(item){
    console.log(item.product);
    var idx = $scope.list.indexOf(item);
    $scope.list.splice(idx,1);
    console.log(idx);
  };
});

stuffAppControllers.controller('RegisterCtrl', function ($scope) {
  $scope.dog = 'butler';
});

stuffAppControllers.controller('IsregCtrl', function ($scope, $location) {
  $scope.dog = 'rusty';
  var ret = JSON.parse(localStorage.getItem('s2g_user'));
  if(!ret){$location.path('/register')} ;
  //$location.path('/items') ;
  console.log(!ret);
});