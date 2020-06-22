const path = require('path')
const fsPromises = require('fs').promises
const { unzip } = require('./unzip')
const { parseSpreadsheetHtml, getTableSize } = require('./parse-html')
const { downloadSpreadsheet } = require('./fetch-spreadsheet')
const { createSvgImage } = require('./svg')

const main = async ({ sheetId, sheetName }) => {
  if (!sheetId || !sheetName) {
    throw new Error('`sheetId` and `sheetName` are required.')
  }

  console.log('#### Download spreadsheet')
  await downloadSpreadsheet({ sheetId })

  await unzip({
    source: 'raw/raw.zip',
    targetDir: path.resolve('raw/html')
  })

  console.log('#### Parse spreadsheet HTML')
  const { html, css } = await parseSpreadsheetHtml({
    dirPath: 'raw/html',
    fileName: `${sheetName}.html`,
    rootClassName: 'grid-container'
  })

  const { width, height } = await getTableSize({ html, css })

  console.log('#### Create SVG image')
  const svg = createSvgImage({
    htmlStr: html,
    styleStrs: css,
    width: width + 2,
    height: height + 2
  })

  const outPath = 'out/out.svg'
  await fsPromises.writeFile(outPath, svg, { encoding: 'utf-8' })
  console.log(outPath)
}


const sheetId = process.argv[2]
const sheetName = process.argv[3]
main({ sheetId, sheetName })
