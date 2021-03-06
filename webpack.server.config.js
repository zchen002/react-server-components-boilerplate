const path = require('path');

const nodeExternals = require('webpack-node-externals');
const ReloadServerPlugin = require('./webpack/ReloadServerPlugin');
const webpack = require('webpack');

const cwd = process.cwd();

const filename = 'api.js';

module.exports = {
  context: cwd,
  mode: 'development',
  devtool: false,
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.mjs'],
  },
  entry: {
    server: ['./src/reactServer.ts'],
  },
  output: {
    // libraryTarget: 'commonjs2',
    path: path.resolve('build'),
    filename,
    futureEmitAssets: true,
  },
  watch: true,
  target: 'node',
  externals: [
    nodeExternals({
      allowlist: [],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.mjs$/,
        type: 'javascript/auto',
      },
      {
        test: /\.client.(js|jsx|ts|tsx)?$/,
        use: [
          {
            loader: require.resolve('./plugin/ReactFlightWebpackLoader'),
          },
          {
            loader: 'babel-loader?cacheDirectory',
          },
        ],
        exclude: [
          /node_modules/,
          path.resolve(__dirname, '.serverless'),
          path.resolve(__dirname, '.webpack'),
        ],
      },
      {
        test: /\.(js|jsx|ts|tsx)?$/,
        use: {
          loader: 'babel-loader?cacheDirectory',
        },
        exclude: [
          /node_modules/,
          path.resolve(__dirname, '.serverless'),
          path.resolve(__dirname, '.webpack'),
        ],
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ReloadServerPlugin({
      script: path.resolve('build', filename),
    }),
  ],
  node: {
    __dirname: false,
    __filename: false,
    fs: 'empty',
  },
};
