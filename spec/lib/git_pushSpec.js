'use strict';

var git_push = require('../../lib/git_push');
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
    return fs.writeFile(filePath, 'foo');
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

  function validateClonedDirectory() {
    return fs.readFile(pathFn.join(validateDir, '.git', 'HEAD'))
      .then(function(content) {
        expect(content.trim()).toBe('ref: refs/heads/' + branch);
      })
      .then(function() {
        return fs.readFile(pathFn.join(validateDir, 'foo.txt'));
      })
      .then(function(content) {
        expect(content).toBe('foo');
      });
  }

  function validate() {
    return cloneFromRemoteRepository()
      .then(validateClonedDirectory);
  }

  beforeEach(function(done) {
    clearBaseDir()
      .then(makePublicDir, makePublicDir)
      .then(makeFakeRemoteRepository)
      .then(done, done.fail);
      // done();
  });

  afterEach(function(done) {
    clearBaseDir().then(done, done.fail);
    // done();
  });


  // test's test
  xdescribe('git_push test', function() {
    it('has fakeRemote and baseDir for all Test', function(done) {
      return fs.exists(fakeRemote).then(function(result) {
        expect(result).toBe(true);
      }).then(function() {
        return fs.exists(baseDir);
      }).then(function(result) {
        expect(result).toBe(true);
      }).then(done, done.fail);
    });
  });

  it('run', function(done) {
    return git_push({
      path : publicDir,
      repository : fakeRemote
    })
      .then(validate)
      .then(done, done.fail);
  });
});
