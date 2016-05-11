'use strict';

beforeEach(function() {

  jasmine.addMatchers({
    toBeFunction: function() {
      return {
        compare: function(actual) {
          return {
            pass : typeof actual === 'function'
          }
        }
      };
    }
  });
});
