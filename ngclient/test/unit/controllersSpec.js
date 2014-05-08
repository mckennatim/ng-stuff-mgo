'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function(){
  beforeEach(function(){
    this.addMatchers({
      toEqualData: function(expected) {
        return angular.equals(this.actual, expected);
      }
    });
  });  
  beforeEach(module('stuffApp'));
  beforeEach(module('stuffAppServices'));

  describe('ItemsCtrl', function(){
    var myScope, ctrl;
    beforeEach(inject(function($controller, $rootScope) {
      myScope = $rootScope.$new();
      ctrl = $controller('ItemsCtrl', {
          $scope: myScope
      });
    }));
    it('In the scope, the initial value for dog=mutt', function() {
      expect(myScope.dog).toBe('mutt');
    });
//In other words, you don’t test the controller; you test the scope that the controller has created.    
  });
  describe('IsregCtrl', function(){
    var $scope, ctrl, $rootScope, $location, UserLS, createController;
    beforeEach(inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $scope = $rootScope.$new();
      $location = $injector.get('$location');
      UserLS = $injector.get('UserLS')
      var $controller = $injector.get('$controller');
      createController = function() {
        return $controller('IsregCtrl', {
          '$scope': $scope
        });
      };
    })); 
    it('obtains the number of users', function(){
      var controller = createController();
      //console.log($scope.dog)
      $location.path('/items');
      expect($location.path()).toEqual('/items')
      //console.log(UserLS.numUsers())
      //console.log(UserLS.getAll())
    });
  });
});
