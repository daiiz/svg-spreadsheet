const fsPromises = require('fs').promises
const DomParser = require('dom-parser')
const puppeteer = require('puppeteer')
const { getHtmlDocument } = require('./svg')

const parser = new DomParser()

const fileOptions = { encoding: 'utf-8' }

const getTableSize = async ({ html, css }) => {
  const htmlStr = getHtmlDocument({ html, css })

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setContent(htmlStr)
  await page.waitFor('table')
  const size = await page.evaluate((selector, captionStr) => {
    const table = document.querySelector(selector)
    // const caption = document.createElement('caption')
    // caption.innerText = captionStr
    // table.appendChild(caption)
    const { width, height } = table.getBoundingClientRect()
    return { width, height }
  }, 'table', 'メニュー表')
  await browser.close()
  return size
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

  return {
    html: root.outerHTML,
    css: [
      ...resStyles,
      `.${rootClassName} {background-color: transparent;}`,
      'thead th.row-header {width: 0; border-right: 1px; width: 1px;}',
      'th.row-headers-background > div {width: 0;}',
      'thead th {height:0 !important; font-size: 0 !important;}', // XXX: 文字を消すべき
      '.waffle td {padding: 0 3px !important;}',
      'thead > tr > th:nth-child(2) {width: 1px !important;}',

      'tbody > tr {height: 0 !important;}',
      'tbody > tr:first-child th {height: 0 !important;}',
      'tbody > tr:first-child th div.row-header-wrapper {line-height: 0 !important;}',
      // 背景のborderを消す
      '.waffle td {border: 0;}',
      '.waffle th {border: solid 1px transparent; background: transparent;}'
    ]
  }
}

module.exports = {
  parseSpreadsheetHtml,
  getTableSize
}
