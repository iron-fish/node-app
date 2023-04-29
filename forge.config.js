/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require('path')
const spawn = require('cross-spawn')

const COMMON_CONFIG = {
  packagerConfig: {
    name: 'Iron Fish Node App',
    executableName: 'node-app',
    icon: resolve('./electron/icons/icon'),
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        // An URL to an ICO file to use as the application icon (displayed in Control Panel > Programs and Features).
        // iconUrl: 'https://url/to/icon.ico',
        setupIcon: resolve('./electron/icons/icon.ico'),
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
          icon: resolve('./electron/icons/icon.png'),
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
      [
        '@electron-forge/plugin-webpack',
        {
          mainConfig: './webpack/dev/main.config.js',
          devContentSecurityPolicy:
            "connect-src 'self' https://cdn.jsdelivr.net/gh/umidbekk/react-flag-kit@1/assets/* 'unsave-eval'",
          renderer: {
            config: './webpack/common/renderer.config.js',
            entryPoints: [
              {
                html: './public/index.html',
                js: './electron/dev/renderer.ts',
                name: 'wallet',
                preload: {
                  js: './electron/dev/preload.ts',
                },
              },
            ],
          },
        },
      ],
    ],
  },
  demo: {
    plugins: [
      [
        '@electron-forge/plugin-webpack',
        {
          mainConfig: './webpack/demo/main.config.js',
          devContentSecurityPolicy:
            "connect-src 'self' https://cdn.jsdelivr.net/gh/umidbekk/react-flag-kit@1/assets/* 'unsave-eval'",
          renderer: {
            config: './webpack/common/renderer.config.js',
            entryPoints: [
              {
                html: './public/index.html',
                js: './electron/demo/renderer.ts',
                name: 'wallet',
                preload: {
                  js: './electron/demo/preload.ts',
                },
              },
            ],
          },
        },
      ],
    ],
    publishers: [
      {
        name: '@electron-forge/publisher-github',
        config: {
          repository: {
            owner: 'iron-fish',
            name: 'wallet-app',
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
      [
        '@electron-forge/plugin-webpack',
        {
          mainConfig: './webpack/prod/main.config.js',
          devContentSecurityPolicy:
            "connect-src 'self' https://cdn.jsdelivr.net/gh/umidbekk/react-flag-kit@1/assets/* 'unsave-eval'",
          renderer: {
            config: './webpack/common/renderer.config.js',
            entryPoints: [
              {
                html: './public/index.html',
                js: './electron/prod/renderer.ts',
                name: 'wallet',
                preload: {
                  js: './electron/prod/preload.ts',
                },
              },
            ],
          },
        },
      ],
    ],
    publishers: [
      {
        name: '@electron-forge/publisher-github',
        config: {
          repository: {
            owner: 'iron-fish',
            name: 'wallet-app',
            draft: true,
          },
          prerelease: true,
          tagPrefix: 'v',
        },
      },
    ],
  },
}

module.exports = {
  ...COMMON_CONFIG,
  ...ENV_CONFIGS[process.env['MODE'] || 'dev'],
}
