# Iron Fish Wallet application

This repo is Electron-based application for managing Accounts in Iron Fish network using [Iron Fish modules](https://github.com/iron-fish/ironfish).

# Getting Started

## Environment preparations

The following steps should only be used to install if you are planning on contributing to the Wallet app codebase.

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
By default `demo` mode is used for crating package use `production` mode to create release version (`yarn package:production`).

# Releases

Releases are based on tags. In order to do a release:

Update package.json version, submit a PR and merge it to the master.

Run `git tag -a "vX.Y.Z" -m "vX.Y.Z"` where `X.Y.Z` is the major.minor.patch version.
(for demo version release use `demo-v` prefix instead of `v`)

Run `git push --tags`

