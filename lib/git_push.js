'use strict';

var util = require('hexo-util');
var fs = require('hexo-fs');
var pathFn = require('path');

function setup(path) {
  return util.spawn('git', ['init'], {
    cwd : path
  });

}

/**
 * @param {object} params
 * @param {string} params.path
 * @param {string} params.repository
 */
module.exports = function git_push(params) {
  // check git init
  return fs.exists(pathFn.join(params.path, '.git'))
    .then(function(exist) {
      if (exist) return;

      return setup();
    }).then(function() {
      return util.spawn('git', ['add', '-A']);
    }).then(function() {
      return util.spawn('git', ['commit', '-m', 'commit'])
    }).then(function() {
      return util.spawn('git', ['push', '-u', params.repository, 'HEAD:master'])
    });
};
