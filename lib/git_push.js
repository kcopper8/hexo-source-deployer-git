'use strict';

var _ = require('lodash');
var util = require('hexo-util');
var fs = require('hexo-fs');
var pathFn = require('path');


/**
 * @param {object} params
 * @param {string} params.path
 * @param {string} params.branch
 * @param {string} params.repository
 */
module.exports = function git_push(params) {
  params = _.defaults(params, {
    'branch' : 'master'
  });

  function git() {
    var args = _.concat([], arguments);

    return util.spawn('git', args, {
      cwd : params.path,
      verbose : true
    });
  }


  // check git init
  return fs.exists(pathFn.join(params.path, '.git'))
    .then(function(exist) {
      if (exist) return;

      return git('init');
    }).then(function() {
      return git('add', '-A');
    }).then(function() {
      return git('commit', '-m', 'commit');
    }).catch(function() {
      console.log('nothing to commit. skip exception from commit.');
    }).then(function() {
      return git('push', '-u', params.repository, 'HEAD:' + params.branch);
    }).catch(function() {
      console.log('error', arguments);
    });
};
