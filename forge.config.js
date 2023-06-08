/* eslint-disable @typescript-eslint/no-var-requires */
const spawn = require('cross-spawn')
require('dotenv').config()

const COMMON_CONFIG = {
  packagerConfig: {
    name: 'Iron Fish Node App',
    executableName: 'node-app',
    icon: 'electron/icons/icon',
    osxSign: process.env.APPLE_API_KEY ? {} : undefined,
    osxNotarize: process.env.APPLE_API_KEY
      ? {
          tool: 'notarytool',
          appleApiKey: process.env.APPLE_API_KEY,
          appleApiKeyId: process.env.APPLE_API_KEY_ID,
          appleApiIssuer: process.env.APPLE_API_ISSUER,
        }
      : undefined,
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        // An URL to an ICO file to use as the application icon (displayed in Control Panel > Programs and Features).
        iconUrl:
          'https://github.com/iron-fish/node-app/raw/master/electron/icons/icon.ico',
        setupIcon: './electron/icons/icon.ico',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          icon: './electron/icons/icon.png',
        },
      },
    },
  ],
  hooks: {
    readPackageJson: async (forgeConfig, packageJson) => {
      // only copy deps if there isn't any
      if (Object.keys(packageJson.dependencies).length === 0) {
        const originalPackageJson = require('./package.json')
        const webpackConfigJs = require('./webpack/common/main.config.js')
        Object.keys(webpackConfigJs.externals).forEach(package => {
          packageJson.dependencies[package] =
            originalPackageJson.dependencies[package]
        })
      }
      return packageJson
    },
    packageAfterPrune: (forgeConfig, buildPath) => {
      try {
        spawn.sync('npm', ['install'], {
          cwd: buildPath,
          stdio: 'inherit',
        })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e)
      }
    },
  },
}
const ENV_CONFIGS = {
  dev: {
    plugins: [
      {
        name: '@electron-forge/plugin-webpack',
        config: {
          mainConfig: './webpack/dev/main.config.js',
          devContentSecurityPolicy:
            "connect-src 'self' https://cdn.jsdelivr.net/gh/umidbekk/react-flag-kit@1/assets/* 'unsave-eval'",
          renderer: {
            config: './webpack/common/renderer.config.js',
            entryPoints: [
              {
                html: './public/index.html',
                js: './electron/dev/renderer.ts',
                name: 'node',
                preload: {
                  js: './electron/dev/preload.ts',
                },
              },
            ],
          },
        },
      },
    ],
  },
  demo: {
    plugins: [
      {
        name: '@electron-forge/plugin-webpack',
        config: {
          mainConfig: './webpack/demo/main.config.js',
          devContentSecurityPolicy:
            "connect-src 'self' https://cdn.jsdelivr.net/gh/umidbekk/react-flag-kit@1/assets/* 'unsave-eval'",
          renderer: {
            config: './webpack/common/renderer.config.js',
            entryPoints: [
              {
                html: './public/index.html',
                js: './electron/demo/renderer.ts',
                name: 'node',
                preload: {
                  js: './electron/demo/preload.ts',
                },
              },
            ],
          },
        },
      },
    ],
    publishers: [
      {
        name: '@electron-forge/publisher-github',
        config: {
          repository: {
            owner: 'iron-fish',
            name: 'node-app',
            draft: true,
          },
          prerelease: true,
          tagPrefix: 'demo-v',
        },
      },
    ],
  },
  production: {
    plugins: [
      {
        name: '@electron-forge/plugin-webpack',
        config: {
          mainConfig: './webpack/prod/main.config.js',
          devContentSecurityPolicy:
            "connect-src 'self' https://cdn.jsdelivr.net/gh/umidbekk/react-flag-kit@1/assets/* 'unsave-eval'",
          renderer: {
            config: './webpack/common/renderer.config.js',
            entryPoints: [
              {
                html: './public/index.html',
                js: './electron/prod/renderer.ts',
                name: 'node',
                preload: {
                  js: './electron/prod/preload.ts',
                },
              },
            ],
          },
        },
      },
    ],
    publishers: [
      {
        name: '@electron-forge/publisher-github',
        config: {
          repository: {
            owner: 'iron-fish',
            name: 'node-app',
            draft: true,
          },
          prerelease: true,
          tagPrefix: 'v',
        },
      },
    ],
  },
}

const config = {
  ...COMMON_CONFIG,
  ...ENV_CONFIGS[process.env['MODE'] || 'dev'],
}

module.exports = config
