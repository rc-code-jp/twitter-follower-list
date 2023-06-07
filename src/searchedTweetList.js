const { createObjectCsvWriter } = require('csv-writer')

const { searchTweet } = require('./utils/searchTweet')

const searchQuery = process.argv[2]

;(async () => {
  if (!searchQuery) {
    throw Error('arguments needed')
  }

  console.log('process')

  const list = await searchTweet(searchQuery)

  console.log(`List count: ${list.length}`)

  const date = new Date()
  const dateStr = date.getTime()

  // CSV
  const csvWriter = createObjectCsvWriter({
    path: `./out/searched_tweet_list_${dateStr}.csv`,
    header: ['id', 'text']
  })
  await csvWriter.writeRecords(list).catch((err) => {
    console.dir(err)
  })

  console.log('success')
})()
