const DomParser = require('dom-parser')
const fsPromises = require('fs').promises

const parser = new DomParser()

const fileOptions = { encoding: 'utf-8' }

const sum = values => {
  return values.reduce((a, b) => a + b)
}

const calcTableSize = table => {
  const thead = table.getElementsByTagName('thead')[0]
  const thList = thead.getElementsByClassName('column-headers-background')

  const W = []
  for (const th of thList) {
    const style = th.getAttribute('style')
    if (!style) continue
    const [, width] = style.match(/width:\s*(\d+)px/i)
    if (!width) continue
    W.push(parseFloat(width))
  }

  const tbody = table.getElementsByTagName('tbody')[0]
  const trList = tbody.getElementsByTagName('tr')

  const H = []
  for (const tr of trList) {
    const style = tr.getAttribute('style')
    if (!style) continue
    const [, height] = style.match(/height:\s*(\d+)px/i)
    if (!height) continue
    H.push(parseFloat(height))
  }

  const borderW = 1
  return {
    width: sum(W) + borderW * (W.length + 1),
    height: sum(H) + borderW * (H.length + 1)
  }
}

const parseSpreadsheetHtml = async ({ dirPath, fileName, rootClassName }) => {
  const filePath = `${dirPath}/${fileName}`
  const data = await fsPromises.readFile(filePath, fileOptions)
  const dom = parser.parseFromString(data)

  // Styles
  const resStyles = []
  const links = dom.getElementsByTagName('link')
  for (const link of links) {
    if (link.getAttribute('rel').toLowerCase() !== 'stylesheet') continue
    // read external resources
    const href = link.getAttribute('href').replace(/^\./, '')
    const cssFilePath = `${dirPath}/${href}`
    const css = await fsPromises.readFile(cssFilePath, fileOptions)
    resStyles.push(css)
  }
  const styles = dom.getElementsByTagName('style')
  for (const style of styles) {
    resStyles.push(style.innerHTML.trim())
  }

  // Body
  const targets = dom.getElementsByClassName(rootClassName)
  if (targets.length === 0) throw new Error('Target element is not found.')
  const root = targets[0]

  // 表の大きさを算出する
  const table = root.getElementsByTagName('table')[0]
  const { width, height } = calcTableSize(table)

  //:first-child
  return {
    html: root.outerHTML,
    css: [
      ...resStyles,
      `.${rootClassName} {background-color: transparent;}`,
      'thead th.row-header {width: 0; border-right: 1px; width: 1px;}',
      'th.row-headers-background > div {width: 0;}',
      'thead th {height:0 !important; font-size: 0 !important;}', // XXX: 文字を消すべき
      '.waffle td {padding: 0 3px !important;}',
      'thead > tr > th:nth-child(2) {width: 1px !important;}', // .column-headers-background:first-child

      'tbody > tr {height: 0 !important;}',
      'tbody > tr:first-child th {height: 0 !important;}',
      'tbody > tr:first-child th div.row-header-wrapper {line-height: 0 !important;}',
      // borderを消したいとき
      '.waffle td {border: 0;}',
      '.waffle th {border: solid 1px transparent; background: transparent;}'
    ]
  }
}

module.exports = {
  parseSpreadsheetHtml
}
