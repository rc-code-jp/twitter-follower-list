require('dotenv').config();
const {Client} = require('twitter-api-sdk');
const {createObjectCsvWriter} = require('csv-writer');

const client = new Client(process.env.BEARER_TOKEN);

const getUserByName = async (userName) => {
  const {data: user} = await client.users.findUserByUsername(userName);
  return user;
}

const getTweets = async (userId, nextToken) => {
  const res = await client.tweets.usersIdTweets(userId, {
    max_results: 100, // 100が許容最大値
    exclude: ['retweets', 'replies'],
    expansions: ['attachments.media_keys'],
    'media.fields': ['url', 'type'],
    pagination_token: nextToken,
  })
  return res;
}

(async () => {
  if (!process.argv[2]) {
    throw Error('arguments needed');
  }

  console.log('process');

  let nextToken = undefined;
  const list = [];

  const user = await getUserByName(process.argv[2]);

  while(true) {
    const res = await getTweets(user.id, nextToken);
    res.data.forEach((item) => {
      item.media = [];
      // 画像付き
      if (item.attachments && item.attachments.media_keys) {
        item.attachments.media_keys.forEach((mediaKey) => {
          const media = res.includes.media.find((media) => {
            return media.media_key === mediaKey;
          });
          item.media.push({
            type: media.type,
            url: media.url,
          });
        });
      }
      // 追加
      list.push(item);
    });
    nextToken = res.meta.next_token;
    if (!nextToken) {
      break;
    }
  }

  console.log(`List count: ${list.length}`);

  const date = new Date();
  const dateStr = date.getTime()

  // CSV
  const csvWriter = createObjectCsvWriter({
    path: `./output/tweet_list_${dateStr}.csv`,
    header: ['id', 'text']
  });
  await csvWriter.writeRecords(list).catch((err) => {
    console.dir(err);
  });

  console.log('success');
})();