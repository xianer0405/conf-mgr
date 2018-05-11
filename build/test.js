const path = require('path')
const fs = require('fs')

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

updateAssertPathInHtmlFile()