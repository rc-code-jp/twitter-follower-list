const fs = require('fs')
const fetch = require('node-fetch')

const { getUserByName } = require('./utils/getUserByName')
const { getAllTweeByUserId } = require('./utils/getAllTweeByUserId')

const userName = process.argv[2];

(async () => {
  if (!userName) {
    throw Error('arguments needed')
  }

  console.log('process')

  const user = await getUserByName(userName)

  const list = await getAllTweeByUserId(user.id)

  console.log(`List count: ${list.length}`)

  // 画像付きツイートのみ抽出
  const imageUrlList = []
  list.forEach((item) => {
    item.media.forEach((media) => {
      if (media.type === 'photo') {
        imageUrlList.push(media.url)
      }
    })
  })

  console.log(`Image URL count: ${imageUrlList.length}`)

  const date = new Date()
  const dateStr = date.getTime()

  // 画像保存用ディレクトリ作成
  const dir = `./out/images/${userName}_${dateStr}`
  fs.mkdirSync(dir, { recursive: true })

  // 画像をダウンロード
  for (let i = 0; i < imageUrlList.length; i++) {
    const imageUrl = imageUrlList[i]
    console.dir(imageUrl)
    const res = await fetch(`${imageUrl}?name=orig`)
    const blob = await res.blob()
    const buffer = await blob.arrayBuffer()
    fs.writeFileSync(`${dir}/${i}.jpg`, Buffer.from(buffer))
  }

  console.log('success')
})()
