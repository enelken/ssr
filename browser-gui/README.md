Browser-based 3D GUI for the SSR
================================

All necessary files should be included in the official SSR releases.
The following steps are only needed if you want to re-build those files from
scratch.


Install Yarn: https://yarnpkg.com/en/docs/install
(Note that the official Debian/Ubuntu package is called `yarnpkg` and the
executable is also called `yarnpkg` and not `yarn` like it is used below!)

Install everything else:

    yarn install





Maintenance
-----------

Just for the record, the original `package.json` was:

```json
{
  "private": true,
  "scripts": {
    "serve": "webpack-dev-server --open",
    "build": "webpack"
  }
}
```

We don't intend to publish the SSR GUI as a package on https://www.npmjs.com/,
therefore we have used `"private": true` and we didn't have to specify most of
the fields a normal `npm` package has.
The only thing we needed to get started, are the settings for [webpack].

[webpack]: https://webpack.js.org/
