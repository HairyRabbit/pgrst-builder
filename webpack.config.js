import path from 'path'
import {
  EnvironmentPlugin,
  BannerPlugin
} from 'webpack'

export default {
  mode: process.env.NODE_ENV,
  target: 'node',
  entry: ['isomorphic-fetch', path.resolve('src/index.js')],
  output: {
    path: path.resolve('lib'),
    filename: `index.js`,
    globalObject: 'this',
    library: 'PGRSTBuild',
    libraryTarget: 'umd'
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: 'babel-loader'
    }]
  },
  node: false,
  plugins: [
    new EnvironmentPlugin({
      NODE_ENV: false,
      DEBUG: false,
      PGRSTBUILD_PROTOCOL: 'http',
      PGRSTBUILD_USER: null,
      PGRSTBUILD_PASSWORD: null,
      PGRSTBUILD_HOSTNAME: 'localhost',
      PGRSTBUILD_PORT: null
    })
  ],
  externals: [
    '@rabbitcc/logger',
    'isomorphic-fetch',
    'json2csv'
  ]
}
