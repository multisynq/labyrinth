const path = require('path');

module.exports = {
  entry: './labyrinth.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  experiments: {
    topLevelAwait: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: {
                  esmodules: true,
                },
                modules: false
              }]
            ],
            plugins: ['@babel/plugin-syntax-dynamic-import']
          }
        }
      }
    ]
  },
  externals: {
    'three': 'THREE',
    '@croquet/worldcore': 'Worldcore'
  },
  resolve: {
    alias: {
      '#glsl': path.resolve(__dirname, 'src/shaders'),
    },
    fallback: {
      "crypto": false
    }
  }
};