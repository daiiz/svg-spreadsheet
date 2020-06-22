const createSvgImage = ({ htmlStr, styleStrs, width, height, left, top }) => {
  if (!left) left = 0
  if (!top) top = 0
  const styles = []
  for (const styleStr of styleStrs) {
    styles.push(`<style type="text/css">${styleStr}</style>`)
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="${width}" height="${height}" viewBox="${left} ${top} ${width} ${height}">
    <foreignObject x="0" y="0" width="${width}" height="${height}">
      <html xmlns="http://www.w3.org/1999/xhtml">
        <meta charset="utf-8" />
        ${styles.join('\n')}
        ${htmlStr}
      </html>
    </foreignObject>
  </svg>`
}

module.exports = {
  createSvgImage
}
