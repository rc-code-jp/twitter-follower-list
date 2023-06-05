const { twitterApiClient } = require('./twitterApiClient')

/**
 * ユーザーIDからツイートを全件取得する
 * @param {*} twitterApiClient
 * @param {*} userId
 * @returns
 */
module.exports.getAllTweeByUserId = async (userId) => {
  let nextToken
  const list = []

  while (true) {
    const res = await getTweets(userId, nextToken)
    res.data.forEach((item) => {
      item.media = []
      // 画像付き
      if (item.attachments && item.attachments.media_keys) {
        item.attachments.media_keys.forEach((mediaKey) => {
          const media = res.includes.media.find((media) => {
            return media.media_key === mediaKey
          })
          item.media.push({
            media_key: media.media_key,
            type: media.type,
            url: media.url,
            width: media.width,
            alt_text: media.alt_text,
            variants: media.variants
          })
        })
      }
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

const getTweets = async (userId, nextToken) => {
  const res = await twitterApiClient.tweets.usersIdTweets(userId, {
    max_results: 100, // 100が許容最大値
    exclude: ['retweets', 'replies'],
    expansions: ['attachments.media_keys'],
    'media.fields': ['media_key', 'url', 'type', 'width', 'alt_text', 'variants'],
    pagination_token: nextToken
  })
  return res
}
