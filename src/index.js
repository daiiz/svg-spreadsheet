const path = require('path')
const { unzip } = require('./unzip')

unzip({
  source: 'raw/raw.zip',
  targetDir: path.resolve('raw/html')
})
