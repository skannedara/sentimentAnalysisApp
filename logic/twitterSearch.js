//includes
var util = require('util'),
  twitter = require('twitter'),
  sentimentAnalysis = require('./sentimentAnalysis'),
  db = require('diskdb');

db = db.connect('db', ['sentiments']);

//config
var config = {
  consumer_key: 'Fb5UiFEq11uXMWiodketTSDGl',
  consumer_secret: 'zFJrdQ5YuYiZnAQdsB3Q1GGVJbtxWTqw1onl3j2BfkCP5PxKD0',
  access_token_key: '140391840-HYmfGT9WAq06I1dNKXz1nzvMAJU6aK4JIHcEDQ1w',
  access_token_secret: 'jKK6dxMmQRcKsNACdBhCGJRUAyIJ39QycJBbNKa19Kv4z'
}

module.exports = function(text, callback) {
  var twitterClient = new twitter(config);
  var response = [], dbData = []; // to store the tweets and sentiment
  twitterClient.search(text, function(data) {
    for (var i = 0; i < data.statuses.length; i++) {
      var resp = {};
      resp.tweet = data.statuses[i];
      resp.sentiment = sentimentAnalysis(data.statuses[i].text);
      dbData.push({
        "tweet" : resp.tweet.text,
        "score" : resp.sentiment.score
      });
      response.push(resp);
    };
    db.sentiments.save(dbData);
    callback(response);
  });
}
