# Iron Fish Node App

![Build](https://github.com/iron-fish/node-app/actions/workflows/build.yaml/badge.svg)

# Installation

👉 Install the released Iron Fish Node App by getting started [here](https://ironfish.network/use/node-app). Direct download links are available on [Github](https://github.com/iron-fish/node-app/releases/latest).

## Troubleshooting

### Windows

**Q: The app crashes on launch with `A JavaScript error occurred in the main process. Error: The specified module could not be found`**

**A:** Install the Visual C++ Redistributable: https://aka.ms/vs/17/release/vc_redist.x64.exe

# Contributing

These instructions are for setting up the Node App in the case that you want to contribute to it.

## Environment preparations

The following steps should only be used to install if you are planning on contributing to the Node app codebase.

1. Install [Node.js 18.x](https://nodejs.org/en/download/)
1. Install [Yarn](https://classic.yarnpkg.com/en/docs/install).
1. Windows:

   1. Install the current version of Python from the [Microsoft Store package](https://www.microsoft.com/en-us/p/python-310/9pjpw5ldxlz5) or [Python website](https://www.python.org/ftp/python/3.11.1/python-3.11.1-amd64.exe).
   1. Install Visual C++ Build Environment: [Visual Studio Build Tools](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=BuildTools)
      (using "Visual C++ build tools" or "Desktop development with C++" workload)

   If the above steps didn't work for you, please visit [Microsoft's Node.js Guidelines for Windows](https://github.com/Microsoft/nodejs-guidelines/blob/master/windows-environment.md#compiling-native-addon-modules) for additional tips.

1. Run `yarn install` from the root directory to install packages.

 #### Other platform might require additional actions see [Iron Fish Developer Install section](https://github.com/iron-fish/ironfish#developer-install)

### Usage

Once your environment is set up its possible to run app:

Use `yarn start` or `yarn start:<mode>` to run app.
By default `dev` mode is used, also `demo` and `production` modes are available.

To test build use `yarn build`, there is also 3 mode for build `demo`, `dev`, `production`, `dev` is default.

# Create application

Just run `yarn package` and executable files will be builded into `./out` folder.

On macOS, the packaged .app file won't run without codesigning, but you can codesign it by running `codesign --force --deep -s - ./out/Iron Fish Node App.app`.

By default `demo` mode is used for crating package use `production` mode to create release version (`yarn package:production`).

# Releases

Releases are based on tags. In order to do a release:

Update package.json version, submit a PR and merge it to the master.

Run `git tag -a "vX.Y.Z" -m "vX.Y.Z"` where `X.Y.Z` is the major.minor.patch version.
(for demo version release use `demo-v` prefix instead of `v`)

Run `git push --tags`

