# hexo-source-deployer-git
[![Build Status](https://travis-ci.org/kcopper8/hexo-source-deployer-git.svg)](https://travis-ci.org/kcopper8/hexo-source-deployer-git)

This plugin deploys source of your [Hexo](hexo.io) site, not static files
 generated. Pushing your source to repository is difference with deploying.
So I don't recommand using this plugin for your Hexo site. This is just for
practice.


## Installation

```
$ npm install https://github.com/kcopper8/hexo-source-deployer-git --save
```
## Options
You can configure this plugin in `_config.yml`

```
deploy:
- type: source-git
  repository: <repository url>
  branch: [branch]
```

- **repository**: Repository URL
- **branch**: Git branch to deploy the source file to

## How it works
When you deploy your Hexo site, `hexo-source-deployer-git` add, commits and push
using [spawn](https://github.com/hexojs/hexo-util#user-content-spawncommand-args-options)
in [hexo-util](https://github.com/hexojs/hexo-util). All commands are invoked
on Hexo `base_dir`. You can see more information in the [Hexo API document](https://hexo.io/api/).
It is same as running the next commands on your `base_dir`.

```
$ git add -A
$ git commit --allow-empty-message -m ''
$ git push -u <repository url> branch
```

If your Hexo `base_dir` is not initialized by Git, `hexo-source-deployer-git`
will initialize your `base_dir`. It is same as next commands.

```
$ git init
```

## License
MIT
