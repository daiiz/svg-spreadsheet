const path = require('path')
const fsPromises = require('fs').promises
const { unzip } = require('./unzip')
const { parseSpreadsheetHtml } = require('./html')
const { createSvgImage } = require('./svg')

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

  const svg = createSvgImage({
    htmlStr: html,
    styleStrs: css,
    width: 248 - 45,
    height: 192 - 23
  })

  const outPath = 'out/out.svg'
  await fsPromises.writeFile(outPath, svg, { encoding: 'utf-8' })
  console.log(outPath)
}


main()
