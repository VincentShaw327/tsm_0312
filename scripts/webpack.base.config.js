const {existsSync}=require('fs')

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

function resolve(relatedPath) {
  return path.join(__dirname, relatedPath)
}
const theme = require('../theme')
/****************/
const webpackConfigBase = {
  entry: {
    client: resolve('../app/client.js'),
  },
  output: {
    path: resolve('../dist'),
    filename: '[name].[hash:4].js',
    chunkFilename: 'chunks/[name].[hash:4].js',
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      components: path.join(__dirname, '/../app/components'),
      actions: path.join(__dirname, '/../app/actions'),
      api: path.join(__dirname, '/../app/api'),
      reducers: path.join(__dirname, '/../app/reducers'),
      utils: path.join(__dirname, '/../app/utils'),
      controllers: path.join(__dirname, '/../app/controllers'),
      style: path.join(__dirname, '/../app/style'),
      images: path.join(__dirname, '/../app/images'),
      base: path.join(__dirname, '/../app/base'),
    },
  },
  resolveLoader: {
    moduleExtensions: ['-loader']
  },
  module: {
    rules: [
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        loader: 'babel',
      },
      {
        test: /\.css/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style',
          use: [
            { loader: 'css', options: {sourceMap: true,modules:false } }
          ]
        }),
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style',
          use: [
              { loader: 'css', options: {sourceMap: true,modules:false } },
              { loader: 'less', options: { sourceMap: true } },
          ]
        }),
      },
      /*{
            test: /\.less$/,
            use: [
              'style-loader',
                { loader: 'css-loader', options: { importLoaders: 1 } },
              'less-loader'
            ]
      },*/
      /*{
          test: /\.less$/,
          use: [
            {
                loader: "style-loader" // creates style nodes from JS strings
            },
            {
                loader: "css-loader" ,options: {sourceMap: true,modules:true }// translates CSS into CommonJS
            },
            {
                loader: "less-loader",options: { sourceMap: true } // compiles Less to CSS
            },
         ]
      },*/
      /*{
        // test: /\.less$/,
        test: /.less$/,
        loader: "style-loader!css-loader!less-loader?modules"
      },*/
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url',
        options: {
          limit: 8192,
          name: 'img/[name].[hash:4].[ext]'
        }
      },
      {
        test: /\.(woff|eot|ttf|svg|gif)$/,
        loader: 'url',
        options: {
          limit: 8192,
          name: 'font/[name].[hash:4].[ext]'
        }
      },
    ],

    // noParse: /index.less/
  },
  plugins: [
    // 提取css
    new ExtractTextPlugin('style.[hash:4].css'),
    // 将打包后的资源注入到html文件内
    new HtmlWebpackPlugin({
      template: resolve('../app/index.html'),
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'client', // 入口文件名
      filename: 'common.bundle.js', // 打包后的文件名
      minChunks: function (module, count) {
        return module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(resolve('../node_modules')) === 0
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      async: 'async-common',
      minChunks: 3,
    }),
  ]
}

module.exports = webpackConfigBase
