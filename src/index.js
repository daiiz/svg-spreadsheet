const path = require('path')
const { unzip } = require('./unzip')

const main = async () => {
  await unzip({
    source: 'raw/raw.zip',
    targetDir: path.resolve('raw/html')
  })
}


main()
