/**
  * @file mock文件
  * @author dva<gjeunney@163.com>
  */
const fs = require('fs');
const path = require('path');
var BowerWebpackPlugin = require("bower-webpack-plugin");

module.exports = function (webpackConfig, env) {
    webpackConfig.babel.plugins.push('transform-runtime');

    // 支持热部署
    if (env === 'development') {
        webpackConfig.devtool = '#eval';
        webpackConfig.babel.plugins.push(['dva-hmr', {
            entries: [
                // './src/index.js'
                './app/client.js'
            ],
            output:{
                publicPath: 'http://demo.mes.top-link.me'
            }
        }])
    } else {
        webpackConfig.babel.plugins.push('dev-expression')
    }

    webpackConfig.resolve.alias = {
        components: `${__dirname}/src/components`,
        feature: `${__dirname}/src/components/feature`,
        common: `${__dirname}/src/components/common`,
        // components: `${__dirname}/src/components`,
        // utils: `${__dirname}/src/utils`,
        // config: `${__dirname}/src/utils/config`,
        // enums: `${__dirname}/src/utils/enums`,
        // services: `${__dirname}/src/services`,
        // models: `${__dirname}/src/models`,
        // routes: `${__dirname}/src/routes`,
        // themes: `${__dirname}/src/themes`,
    }
    return webpackConfig;
}
