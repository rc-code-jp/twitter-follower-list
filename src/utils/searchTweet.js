const { twitterApiClient } = require('../libs/twitterApiClient')

const MAX_TWEET_COUNT = 1000

/**
 * ツイートを検索
 * @param {*} twitterApiClient
 * @param {*} userId
 * @returns
 */
module.exports.searchTweet = async (searchQuery) => {
  let nextToken
  const list = []

  while (true) {
    const res = await getTweets(searchQuery, nextToken)
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
    if (!nextToken || list.length >= MAX_TWEET_COUNT) {
      break
    }
  }

  return list
}

const getTweets = async (searchQuery, nextToken) => {
  const res = await twitterApiClient.tweets.tweetsFullarchiveSearch({
    max_results: 100, // 100が許容最大値
    query: searchQuery,
    sort_order: 'recency',
    expansions: ['attachments.media_keys'],
    'media.fields': ['media_key', 'url', 'type', 'width', 'alt_text', 'variants'],
    pagination_token: nextToken
  })
  return res
}
