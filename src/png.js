const puppeteer = require('puppeteer')
const { getHtmlDocument } = require('./svg')

const captureAsPngImage = async (outPath, { html, css }) => {
  const htmlStr = getHtmlDocument({ html, css })

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setViewport({
    width: 10_000,
    height: 10_000,
    deviceScaleFactor: 2.0
  })
  await page.setContent(htmlStr)
  await page.waitFor('table')
  // 撮影範囲を取得する
  const tableSize = await page.evaluate(selector => {
    const table = document.querySelector(selector)
    const { left, top, right, bottom } = table.getBoundingClientRect()
    const width = right - left
    const height = bottom - top
    return { left, top, width, height }
  }, 'table')
  await page.screenshot({
    clip: {
      x: tableSize.left,
      y: tableSize.top,
      width: tableSize.width + 2,
      height: tableSize.height + 2
    },
    path: outPath
  })
  await browser.close()
  console.log(outPath)
}

module.exports = {
  captureAsPngImage
}
