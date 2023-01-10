require('dotenv').config();
const {Client} = require('twitter-api-sdk');
const {createObjectCsvWriter} = require('csv-writer');

const client = new Client(process.env.BEARER_TOKEN);

const getFollower = async (userName, nextToken) => {
  const {data: user} = await client.users.findUserByUsername(userName);
  const res = await client.users.usersIdFollowers(user.id, {
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
  const followerList = [];

  while(true) {
    const res = await getFollower(process.argv[2], nextToken);
    res.data.forEach((user) => {
      followerList.push(user);
    });
    nextToken = res.meta.next_token;
    if (!nextToken) {
      break;
    }
  }

  // CSV
  const csvWriter = createObjectCsvWriter({
    path: `./output/followers_${Date.now()}.csv`,
    header: ['id', 'username', 'name']
  });
  await csvWriter.writeRecords(followerList).catch((err) => {
    console.dir(err);
  });

  console.log('success');
})();