const webpack = require('webpack');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const path = require('path');
const env = require('./env');

const raw = Object.keys(env).reduce(function (memo, key) {
  memo[key] = JSON.stringify(env[key]);
  return memo;
}, {});

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  context: path.resolve(__dirname, '../'),
  entry: [path.resolve('src/index')],
  output: {
    path: path.resolve('dist'),
    publicPath: '/',
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    modules: [path.resolve('node_modules')],
    alias: {
      '@': path.resolve('src/'),
    },
  },
  optimization: {
    minimize: false,
    splitChunks: {
      chunks: 'all',
      minChunks: 2,
      name: 'vendor',
      automaticNameDelimiter: '~',
      maxSize: 1000000,
      minSize: 25000,
      minRemainingSize: 25000,
      maxInitialRequests: 30,
      maxAsyncRequests: 30,
      enforceSizeThreshold: 1000000,
    },
    runtimeChunk: true,
  },
  cache: true,
  module: {
    rules: [{
      oneOf: [{
          test: /\.(ts|tsx|js|jsx)$/,
          loader: require.resolve('babel-loader'),
          include: path.resolve('src'),
          options: {
            cacheDirectory: true,
            cacheCompression: false,
            compact: false,
            configFile: true,
            babelrc: false,
          }
        },
        {
          test: /\.(jpg|jpeg|png|gif)$/,
          include: path.resolve('src'),
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 10000,
            }
          },
          generator: {
            emit: true,
            filename: 'static/images/[name].[hash:8][ext]',
            publicPath: env.PUBLIC_PATH,
          }
        },
        {
          test: /\.(woff|woff2|ttf|eof)$/,
          include: path.resolve('src'),
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 10000,
            }
          },
          generator: {
            emit: true,
            filename: 'static/font/[name].[hash:8][ext]',
            publicPath: env.PUBLIC_PATH,
          }
        },
        {
          test: /\.svg$/,
          include: path.resolve('src'),
          loader: require.resolve('@svgr/webpack'),
        },
        {
          test: /\.module\.css$/,
          include: path.resolve('src'),
          use: [
            require.resolve('style-loader'),
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1,
                url: true,
                import: true,
                modules: {
                  auto: true,
                  localIdentName: '[path][name]-[local]-[hash:base64:5]',
                  mode: 'local',
                },
              },
            },
            require.resolve('postcss-loader'),
          ]
        },
        {
          test: /\.css$/,
          exclude: /\.module\.css$/,
          use: [
            require.resolve('style-loader'),
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1,
                url: true,
                import: true,
                modules: false,
              },
            },
            require.resolve('postcss-loader'),
          ]
        },
        {
          test: /\.module\.less$/,
          include: path.resolve('src'),
          use: [
            require.resolve('style-loader'),
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 2,
                url: true,
                import: true,
                modules: {
                  auto: true,
                  localIdentName: '[path][name]-[local]-[hash:base64:5]',
                  mode: 'local',
                },
              },
            },
            require.resolve('postcss-loader'),
            require.resolve('less-loader'),
          ]
        },
        {
          test: /\.less$/,
          include: path.resolve('src'),
          exclude: /\.module\.less$/,
          use: [
            require.resolve('style-loader'),
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 2,
                url: true,
                import: true,
                modules: false,
              },
            },
            require.resolve('postcss-loader'),
            require.resolve('less-loader'),
          ]
        },
      ]
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: '艾特课堂小程序配置中心',
      filename: 'index.html',
      template: path.resolve('public/index.html'),
      scriptLoading: 'blocking',
      enject: true,
    }),
    new webpack.DefinePlugin({
      'process.env': raw
    }),
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, env),
    new CaseSensitivePathsPlugin(),
    new ReactRefreshWebpackPlugin(),
  ],
  devServer: {
    client: {
      logging: 'none',
      overlay: {
        errors: true,
        warnings: false
      },
      progress: true,
    },
    hot: true,
    // host: 'localhost',
    host: 'aitweb.com',
    port: 3000,
    historyApiFallback: true,
    compress: true,
    open: ['/'],
    proxy: {
      '/api': {
        target: 'https://aitweb.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
}
