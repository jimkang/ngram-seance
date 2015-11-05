var config = require('./config/config');
var callNextTick = require('call-next-tick');
var Twit = require('twit');
var async = require('async');
var conductSeance = require('./seance');
var seedrandom = require('seedrandom');
var createComposeMessage = require('./compose-message');
var createWordnok = require('wordnok').createWordnok;
var createProbable = require('probable').createProbable;


var dryRun = false;
if (process.argv.length > 2) {
  dryRun = (process.argv[2].toLowerCase() == '--dry');
}

var seed = (new Date()).toISOString();
console.log('seed:', seed);

var random = seedrandom(seed);

var probable = createProbable({
  random: random
});

var composeMessage = createComposeMessage({
  random: random
});

var wordnok = createWordnok({
  apiKey: config.wordnikAPIKey
});

var twit = new Twit(config.twitter);

async.waterfall(
  [
    getTopics,
    pickFirst,
    runSeance,
    composeMessage,
    postTweet,
  ],
  wrapUp
);

function getTopics(done) {
  var opts = {
    customParams: {
      minCorpusCount: 1000,
      limit: 1
    }
  };
  wordnok.getRandomWords(opts, done);  
}

function pickFirst(words, done) {
  if (words.length < 1) {
    callNextTick(done, new Error('No topics found.'));
  }
  else {
    callNextTick(done, null, words[0]);
  }
}

function runSeance(topic, done) {
  var seanceOpts = {
    word: topic,
    direction: probable.roll(3) === 0 ? 'backward' : 'forward'
  };

  conductSeance(seanceOpts, done);
}

function postTweet(text, done) {
  // TODO: Some sort of message preface.

  if (dryRun) {
    console.log('Would have tweeted:', text);
    var mockTweetData = {
      user: {
        id_str: 'mockuser',        
      }
    };
    callNextTick(done, null, mockTweetData);
  }
  else {
    var body = {
      status: text
    };
    twit.post('statuses/update', body, done);
  }
}

function wrapUp(error, data) {
  if (error) {
    console.log(error, error.stack);

    if (data) {
      console.log('data:', data);
    }
  }
  console.log('tweet-seance complete.');
}
