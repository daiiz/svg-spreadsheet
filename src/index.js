const path = require('path')
const fsPromises = require('fs').promises
const { unzip } = require('./unzip')
const { parseSpreadsheetHtml } = require('./html')
const { createSvgImage } = require('./svg')

const main = async () => {
  // await unzip({
  //   source: 'raw/raw.zip',
  //   targetDir: path.resolve('raw/html')
  // })

  const { html, css } = await parseSpreadsheetHtml({
    dirPath: 'raw/html',
    fileName: '値段表.html',
    rootClassName: 'grid-container'
  })

  const svg = createSvgImage({
    htmlStr: html,
    styleStrs: css,
    width: 500,
    height: 120
  })

  const outPath = 'out/out.svg'
  await fsPromises.writeFile(outPath, svg, { encoding: 'utf-8' })
  console.log(outPath)
}


main()
