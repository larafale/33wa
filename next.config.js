require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const webpack = require('webpack')
const withPlugins = require('next-compose-plugins')
const withCSS = require('@zeit/next-css')
// const purgecss = require('next-purgecss')


const nextConfig = {
  webpack(config, { dev }) {

    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV||''),
        'process.env.APP_URL': JSON.stringify(process.env.APP_URL||''),
        'process.env.API_MAINNET': JSON.stringify(process.env.API_MAINNET||''),
        'process.env.API_TESTNET': JSON.stringify(process.env.API_TESTNET||''),
      })
    )
    
    // config.plugins.push(new webpack.optimize.DedupePlugin()) //dedupe similar code 
    // config.plugins.push(new webpack.optimize.UglifyJsPlugin()) //minify everything
    // config.plugins.push(new webpack.optimize.AggressiveMergingPlugin()) //Merge chunks

    return config;
  }
}

const plugins = [
    [withCSS, { /* config */ }]
  // , [purgecss, { /* config */ }]
]

module.exports = withPlugins(plugins, nextConfig);
