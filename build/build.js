'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')
const fs = require('fs')

const spinner = ora('building for production...')
spinner.start()

function updateAssertPathInHtmlFile() {
  // const distDir = path.resolve(__dirname, '../dist')
  const indexFilePath = path.resolve(__dirname, '../dist/index.html')
  const confFilePath = path.resolve(__dirname, '../dist/views/confer.html')
  let fileData = fs.readFileSync(indexFilePath, { flag: 'r', encoding: 'utf8' })
  fileData = fileData.replace(/\/static/g, 'static')
  var w_data = new Buffer(fileData);
  fs.writeFile(indexFilePath, w_data, function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log('修改index.html中资源路径成功');
    }
  })

  let confFileData = fs.readFileSync(confFilePath, { flag: 'r', encoding: 'utf8' })
  confFileData = confFileData.replace(/\/static/g, '../static')
  var w_data = new Buffer(confFileData);
  fs.writeFile(confFilePath, w_data, function (err) {
    if (err) {
      console.error(err);
    } else {
      console.log('修改confer.html中资源路径成功');
    }
  })
}
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    // 修改index.html中的路径
    updateAssertPathInHtmlFile()

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
