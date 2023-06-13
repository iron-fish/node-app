module.exports = [
  {
    test: /@ironfish\/sdk\/build\/src\/migrations\/data\/.*\.js$/,
    loader: 'string-replace-loader',
    options: {
      search: '__filename',
      replace(match, p1, offset, string) {
        // Fixes migration files in the SDK relying on __filename to determine the ID and name of the migration.
        // The migration filename is currently only used to extract the ID and name of the migration, not to read the
        // actual file.
        // After bundling, __filename will resolve to the webpack-bundled file's name,
        // something like index.js, so we can avoid this by replacing __filename with the original filename.
        return `'${this.resource.toString()}'`
      },
      flags: 'g',
    },
  },
  // Add support for native node modules
  {
    // We're specifying native_modules in the test because the asset relocator loader generates a
    // "fake" .node file which is really a cjs file.
    test: /native_modules\/.+\.node$/,
    use: 'node-loader',
  },
  {
    test: /\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: '@vercel/webpack-asset-relocator-loader',
      options: {
        outputAssetBase: 'native_modules',
      },
    },
  },
  {
    test: /\.tsx?$/,
    exclude: /(node_modules|\.webpack)/,
    use: {
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
      },
    },
  },
  {
    test: /\.(woff(2)|ttf|eot|svg|gif|jpg|png)(\?[\s\S]+)?$/,
    use: 'file-loader',
  },
]
