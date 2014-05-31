'use strict';

var httpLoc = 'http://10.0.1.24:3000/api/';

/* Controlrs */
var stuffAppControllers = angular.module('stuffAppControllers', []);

stuffAppControllers.controller('RootController', function($scope, $state) {
  $scope.$state = $state;
});

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

stuffAppControllers.controller('RegisterCtrl', function ($scope, $http, AuthService) {
  $scope.dog = 'butler';
  $scope.nameValid =/^\s*\w*\s*$/
  $scope.username=''
  $scope.email=''
  $scope.apikey=''
  $scope.user={};
  $scope.isuUser='';
  $scope.isMatch='';
  $scope.userNameIs=''
  $scope.state='Register';
  var ret = JSON.parse(localStorage.getItem('s2g_user'));
  if(ret){
    console.log('ls exists')
    if(ret.user){$scope.user=ret.user}
    if(ret.email){$scope.user=ret.email}
    $scope.doesNameExist()  
  };
  $scope.submit = function(){
    $scope.user = {username: $scope.username, email: $scope.email, lists:[]}
    console.log($scope.user)
    if ($scope.state=='Register'){
      console.log('new user to LS & db & get apikey sent')
      AuthService.isMatch($scope.username, $scope.email).then(function(data){
        console.log(data);
      },function(data){
        console.log(data)
      })
    }else if ($scope.state = 'Get your key'){
      console.log('new user to LS and get apikey sent')
    } else if($scope.state = 'Enter your apikey'){
      console.log('entering key in user record')
    }
  } 
  $scope.doesNameExist= function(){
    console.log($scope.username+' changed')
    AuthService.isUser($scope.username).then(function(data){
      console.log(data)
      $scope.userNameIs=data.message;
    },function(data){
      console.log(data)
      $scope.userNameIs=data.message;
    });
    console.log('still alive')
  } 
});

stuffAppControllers.controller('IsregCtrl', function ($scope, $state, UserLS) {
  $scope.numUsers = UserLS.numUsers('s2g_users');
  console.log('in isRegCtrl # of users = ' + $scope.numUsers);
  if ($scope.numUsers==0){
    $state.go('register');
  } else if($scope.numUsers==1){

  }
  console.log($scope.numUsers);
});

stuffAppControllers.controller('ListCtrl', function ($scope) {
  $scope.dog = 'boots';
});
stuffAppControllers.controller('ListsCtrl', function ($scope) {
  $scope.dog = 'dusty';

});
stuffAppControllers.controller('UserCtrl', function ($scope) {
  $scope.dog = 'petey';

});
stuffAppControllers.controller('ShopsCtrl', function ($scope) {
  $scope.dog = 'fritz';

});
stuffAppControllers.controller('ConfigCtrl', function ($scope) {
  $scope.dog = 'kazzy';

});
