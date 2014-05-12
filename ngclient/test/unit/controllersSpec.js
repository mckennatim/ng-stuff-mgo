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
    describe('controller: IsregCtrl', function() {
    var ctrl, UserLS, $scope;
    beforeEach(module('stuffApp'));    
    beforeEach(inject(function($rootScope, $controller) {
      UserLS = {
        numUsers: function(key) {}
      };      
      spyOn(UserLS, 'numUsers').andReturn("2");      
      $scope = $rootScope.$new();      
      ctrl = $controller('IsregCtrl', {$scope: $scope , UserLS: UserLS });
    }));    
    it('Should call UserLS numUsers and get 2', function() {
      expect($scope.numUsers).toBe('2');
    });
  });
});
