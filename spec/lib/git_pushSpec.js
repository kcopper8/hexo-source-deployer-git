'use strict';

//var git_push = require('../../lib/git_push');
var pathFn = require('path');
var fs = require('hexo-fs');
var util = require('hexo-util');

describe('git_push', function() {
  var baseDir = pathFn.join(__dirname, 'publish_test');
  var publicDir = pathFn.join(baseDir, 'public');
  var fakeRemote = pathFn.join(baseDir, 'remote');
  var validateDir = pathFn.join(baseDir, 'validate');
  var branch = 'master';

  function makePublicDir() {
    var filePath = pathFn.join(publicDir, 'foo.txt');

    return fs.writeFile(filePath, 'foo').then(function() {
      console.log('file write success', arguments);
    }, function() {
      console.error('file write failure', arguments);
    });
  }

  function makeFakeRemoteRepository() {
    return fs.mkdirs(fakeRemote).then(function() {
      return util.spawn('git', ['init', '--bare', fakeRemote]);
    });
  }

  function clearBaseDir() {
    return fs.rmdir(baseDir);
  }

  function cloneFromRemoteRepository() {
    return util.spawn('git', ['clone', fakeRemote, validateDir, '--branch', branch]);
  }


  beforeEach(function(done) {
    makePublicDir()
      .then(makeFakeRemoteRepository)
      .then(done, done);
  });

  afterEach(function(done) {
    //clearBaseDir().then(done, done);
    done();
  });


  // test's test
  describe('git_push test', function() {
    it('has fakeRemote and baseDir for all Test', function(done) {
      fs.exists(fakeRemote).then(function(result) {
        expect(result).toBe(true);
      }).then(function() {
        return fs.exists(baseDir);
      }).then(function(result) {
        expect(result).toBe(true);
      }).then(done, done);
    });
  });

  it('', function() {


  });
});
