const path = require('path');
const cpy = require('cpy');

module.exports = {
  packagerConfig: {
    name: 'Iron_Fish_Wallet',
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
  plugins: [
    [
      '@electron-forge/plugin-webpack',
      {
        mainConfig: './webpack/webpack.main.config.js',
        renderer: {
          config: './webpack/webpack.renderer.config.js',
          entryPoints: [
            {
              html: './public/index.html',
              js: './electron/renderer.ts',
              name: 'wallet',
              preload: {
                js: './electron/preload.ts',
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
}
