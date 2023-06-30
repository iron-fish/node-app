/* eslint-disable @typescript-eslint/no-var-requires */
const spawn = require('cross-spawn')
require('dotenv').config()
const { exec } = require('child_process')

async function manuallySignExe(packagePath) {
  return new Promise((resolve, reject) => {
    const cmd = `AzureSignTool sign -kvu "${process.env.AZURE_KEY_VAULT_URI}" -kvi "${process.env.AZURE_CLIENT_ID}" -kvt "${process.env.AZURE_TENANT_ID}" -kvs "${process.env.AZURE_CLIENT_SECRET}" -kvc "${process.env.AZURE_CERT_NAME}" -tr http://timestamp.digicert.com -v "${packagePath}"`

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.log(`Manual Sign exe Error: ${error}`)
        return reject(error)
      }
      if (stderr) {
        console.log(`Manual Sign exe Stderr: ${stderr}`)
        return reject(new Error(stderr))
      }

      console.log(`Manual Sign exe Stdout: ${stdout}`)
      resolve(stdout)
    })
  })
}

const COMMON_CONFIG = {
  packagerConfig: {
    name: 'Iron Fish Node App',
    executableName: 'node-app',
    icon: 'electron/icons/icon',
    asar: os.platform() !== 'win32',
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
      name: '@electron-forge/maker-dmg',
      platforms: ['darwin'],
      config: {
        icon: './electron/icons/icon.icns',
        background: './electron/icons/background.png',
        format: 'ULFO',
        window: {
          size: {
            width: 645,
            height: 493,
          },
        },
      },
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
    postMake: async (forgeConfig, makeResults) => {
      // makeResults is an array of { artifacts: string[] }
      for (const result of makeResults) {
        for (const artifactPath of result.artifacts) {
          console.log(artifactPath)
          if (artifactPath.endsWith('.exe')) {
            try {
              await manuallySignExe(artifactPath)
              console.log(`Successfully signed ${artifactPath}`)
            } catch (error) {
              console.error(`Failed to sign ${artifactPath}: ${error}`)
              throw error // Rethrow the error to stop the process
            }
          }
        }
      }
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
