var git_push = require('./lib/git_push.js');

hexo.extend.deployer.register('source-git', function(args) {
  return git_push({
    path : this.base_dir,
    repository : args.repository,
    branch : args.branch
  });
});
