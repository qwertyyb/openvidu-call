const path = require('path')
const fs = require('fs')
const { Readable } = require('stream')
const { finished } = require('stream/promises')

const CSS_FILE_PATH = path.join(__dirname, '../lib/openvidu-webcomponent-2.29.3.css')
const distPath = path.join(__dirname, '../fonts')

const parseUrl = (content) => {
  const arr = content.match(/https:\/\/[^)]+/g)
  return arr ? arr : []
}

const downloadUrl = async (url) => {
  const fileName = url.split('/').pop()
  const filePath = path.join(distPath, fileName)
  if(fs.existsSync(filePath)) {
    return filePath
  }
  const response = await fetch(url)
  const file = fs.createWriteStream(filePath, { flags: 'wx' })
  await finished(Readable.fromWeb(response.body).pipe(file))
  return filePath
}

const downloadUrls = (urls) => {
  return Promise.all(urls.map(async url => {
    const newUrl = await downloadUrl(url)
    return {
      oldUrl: url,
      newUrl: path.relative(path.join(__dirname, '../lib'), newUrl)
    }
  }))
}

const replaceUrl = (arr, content) => {
  arr.forEach(({ oldUrl, newUrl }) => {
    // content = content.replace(new RegExp(oldUrl, 'g'), newUrl)
    content = content.replaceAll(oldUrl, newUrl)
  })
  return content
}

const start = async () => {
  const content = fs.readFileSync(CSS_FILE_PATH, { encoding: 'utf-8' })
  const urls = parseUrl(content)
  const newUrls = await downloadUrls(urls)
  console.log(urls, newUrls)

  const newContent = replaceUrl(newUrls, content)
  fs.writeFileSync(CSS_FILE_PATH, newContent)
}

start()