const extract = require('extract-zip')
const fsPromises = require('fs').promises
const glob = require('glob')

const clearDir = async targetDir => {
  const files = [
    ...glob.sync('raw/html/*.html'),
    ...glob.sync('raw/html/*/*.css')
  ]
  for (const file of files) {
    await fsPromises.unlink(file)
  }
}

const unzip = async ({ source, targetDir }) => {
  await clearDir(targetDir)
  try {
    await extract(source, { dir: targetDir })
  } catch (err) {
    console.error(err)
  }
}

module.exports = {
  unzip
}
