'use strict';

/* jasmine specs for services go here */

describe('service', function() {
  beforeEach(module('stuffAppServices'));
  describe('ItemsData', function() {
    it('should get first product on list', inject(function(ItemsData) {
      var tlist = ItemsData.get();
      var item1= tlist[0].product;
      expect(item1).toEqual('banana');
    }));
  });
});
