require('dotenv').config()
const { Client } = require('twitter-api-sdk')
module.exports.twitterApiClient = new Client(process.env.BEARER_TOKEN)
