const { twitterApiClient } = require('./twitterApiClient')

/**
 * user name から user を取得する
 * @param {*} twitterApiClient
 * @param {*} userName
 * @returns
 */
module.exports.getUserByName = async (userName) => {
  const { data: user } = await twitterApiClient.users.findUserByUsername(userName)
  return user
}
