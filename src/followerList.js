require('dotenv').config();
const {Client} = require('twitter-api-sdk');
const {createObjectCsvWriter} = require('csv-writer');

const client = new Client(process.env.BEARER_TOKEN);

const getUserByName = async (userName) => {
  const {data: user} = await client.users.findUserByUsername(userName);
  return user;
}

const getFollower = async (userId, nextToken) => {
  const res = await client.users.usersIdFollowers(userId, {
    max_results: 100, // 100が許容最大値
    pagination_token: nextToken
  });
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
    const res = await getFollower(user.id, nextToken);
    res.data.forEach((item) => {
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
    path: `./output/follower_list_${dateStr}.csv`,
    header: ['id', 'username', 'name']
  });
  await csvWriter.writeRecords(list).catch((err) => {
    console.dir(err);
  });

  console.log('success');
})();