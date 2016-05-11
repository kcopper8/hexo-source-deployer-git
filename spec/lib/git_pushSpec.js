'use strict';

var git_push = require('../../lib/git_push');
var pathFn = require('path');
var fs = require('hexo-fs');
var util = require('hexo-util');
var dircompare = require('dir-compare');

describe('git_push', function() {
  var baseDir = pathFn.join(__dirname, 'publish_test');
  var publicDir = pathFn.join(baseDir, 'public');
  var fakeRemote = pathFn.join(baseDir, 'remote');
  var validateDir = pathFn.join(baseDir, 'validate');

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

  function cloneFromRemoteRepository(branch) {
    return util.spawn('git', ['clone', fakeRemote, validateDir, '--branch', branch], { verbose : true });
  }

  function validateClonedDirectory(branch) {
    return fs.readFile(pathFn.join(validateDir, '.git', 'HEAD'))
      .then(function(content) {
        expect(content.trim()).toBe('ref: refs/heads/' + branch);
      })
      .then(function() {
        return dircompare.compare(publicDir, validateDir, {
          noDiffSet: true,
          excludeFilter : '.git'
        });
      })
      .then(function(res) {
        expect(res.same).toBe(true);
      });
  }

  function validate(branch) {
    return cloneFromRemoteRepository(branch)
      .then(function() {
        return validateClonedDirectory(branch);
      });
  }

  beforeEach(function(done) {
    clearBaseDir()
      .then(makePublicDir, makePublicDir)
      .then(makeFakeRemoteRepository)
      .then(done, done.fail);
  });

  afterEach(function(done) {
    clearBaseDir().then(done, done.fail);
    // done();
  });

  it('can pushes directory that is not initialized', function(done) {
    return git_push({
      path : publicDir,
      repository : fakeRemote,
      branch : 'master'
    }).then(function() {
      return validate('master');
    }).then(done, done.fail);
  });

  it('can pushes directory that is already initialized', function(done){
    return git_push({
      path : publicDir,
      repository : fakeRemote,
      branch : 'master'
    }).then(function() {
      // write any files
      var filePath = pathFn.join(publicDir, 'foo2.txt');
      return fs.writeFile(filePath, 'foo2');
    }).then(function() {
      // second push
      return git_push({
        path : publicDir,
        repository : fakeRemote,
        branch : 'master'
      });
    }).then(function() {
      return validate('master');
    }).then(done, done.fail);
  });

  it('can pushes directory to branch where is not \'master\'', function(done) {
    return git_push({
      path : publicDir,
      repository : fakeRemote,
      branch : 'source'
    }).then(function() {
      return validate('source');
    }).then(done, done.fail);
  });
});
