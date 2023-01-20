/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require('path')

const COMMON_CONFIG = {
  packagerConfig: {
    name: 'Iron Fish Wallet',
    icon: resolve('./electron/app.ico'),
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
}
const ENV_CONFIGS = {
  dev: {
    plugins: [
      [
        '@electron-forge/plugin-webpack',
        {
          mainConfig: './webpack/dev/main.config.js',
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
