# Twitter Tools

## Set up

```bash
yarn install
```

```bash
cp env/.env.example .env
```

Edit `.env` file

## 1. Follower list to CSV

Doc: https://developer.twitter.com/ja/docs/twitter-api/rate-limits#v2-limits

> 15count/15min

```bash
yarn run begin:f username
```

## 2. Tweets list to CSV

TODO: https://developer.twitter.com/en/docs/twitter-api/tweets/timelines/api-reference/get-users-id-tweets

```bash
yarn run begin:t username
```

## 3. Searched Tweets list to CSV

```bash
yarn run begin:s searchQueryHere
```

## 4. Image Download

```bash
yarn run begin:i username
```

