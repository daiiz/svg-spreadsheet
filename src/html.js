const DomParser = require('dom-parser')
const fsPromises = require('fs').promises

const parser = new DomParser()

const fileOptions = { encoding: 'utf-8' }

const parseHtml = async ({ dirPath, fileName }) => {
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

}

module.exports = {
  parseHtml
}

parseHtml({ dirPath: 'raw/html', fileName: 'シート1.html' })
