const { createObjectCsvWriter } = require('csv-writer')

const { getUserByName } = require('./utils/getUserByName')
const { getAllFollower } = require('./utils/getAllFollower')

const userName = process.argv[2];

(async () => {
  if (!userName) {
    throw Error('arguments needed')
  }

  console.log('process')

  const user = await getUserByName(userName)

  const list = await getAllFollower(user.id)

  console.log(`List count: ${list.length}`)

  const date = new Date()
  const dateStr = date.getTime()

  // CSV
  const csvWriter = createObjectCsvWriter({
    path: `./out/follower_list_${dateStr}.csv`,
    header: ['id', 'username', 'name']
  })
  await csvWriter.writeRecords(list).catch((err) => {
    console.dir(err)
  })

  console.log('success')
})()
