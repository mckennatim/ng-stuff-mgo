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
});
