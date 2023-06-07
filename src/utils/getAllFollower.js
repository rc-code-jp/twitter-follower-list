const { twitterApiClient } = require('../libs/twitterApiClient')

/**
 * すべてのフォロワーを取得する
 * @param {*} userId
 * @returns Array
 */
module.exports.getAllFollower = async (userId) => {
  let nextToken
  const list = []

  while (true) {
    const res = await getFollower(userId, nextToken)
    res.data.forEach((item) => {
      // 追加
      list.push(item)
    })
    nextToken = res.meta.next_token
    if (!nextToken) {
      break
    }
  }

  return list
}

const getFollower = async (userId, nextToken) => {
  const res = await twitterApiClient.users.usersIdFollowers(userId, {
    max_results: 100, // 100が許容最大値
    pagination_token: nextToken
  })
  return res
}
