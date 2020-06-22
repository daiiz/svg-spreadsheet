const fsPromises = require('fs').promises
const { spawn } = require('child_process')
require('dotenv').config({ path: '.env' })

const downloadSpreadsheet = async ({ sheetId }) => {
  const { API_KEY } = process.env
  const url = `https://www.googleapis.com/drive/v3/files/${sheetId}/export?mimeType=application%2Fzip&key=${API_KEY}`
  try {
    const outPath = 'raw/raw.zip'
    await execPromise('curl', [
      url,
      "--header", "'Accept:", "application/json'",
      '--compressed',
      '--output', outPath
    ])
    console.log(outPath)
  } catch (err) {
    console.error(err)
  }
}

function execPromise (command, args) {
  return new Promise((resolve, reject) => {
    const ps = spawn(command, args)
    ps.on('close', (code) => {
      resolve(code)
    })
  })
}

module.exports = {
  downloadSpreadsheet
}
