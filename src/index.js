const path = require('path')
const { unzip } = require('./unzip')
const { parseSpreadsheetHtml } = require('./html')

const main = async () => {
  await unzip({
    source: 'raw/raw.zip',
    targetDir: path.resolve('raw/html')
  })

  const { html, css } = await parseSpreadsheetHtml({
    dirPath: 'raw/html',
    fileName: 'シート1.html',
    rootClassName: 'grid-container'
  })

  console.log(html)
}


main()
