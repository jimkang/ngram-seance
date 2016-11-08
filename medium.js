#!/usr/bin/env node

/* global process __dirname */

var config = require('./config/config');
var callNextTick = require('call-next-tick');
var Twit = require('twit');
var async = require('async');
var createChronicler = require('basicset-chronicler').createChronicler;
var seedrandom = require('seedrandom');
var createProbable = require('probable').createProbable;
var createWordnok = require('wordnok').createWordnok;
var createComposeMessage = require('./compose-message');
var shouldReplyToTweet = require('./should-reply-to-tweet');
var GetWord2VecNeighbors = require('get-w2v-google-news-neighbors');
var nounfinder = require('nounfinder');
var getWorthwhileWordsFromText = require('./get-worthwhile-words-from-text');

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

var getWord2VecNeighbors = GetWord2VecNeighbors({
  gnewsWord2VecURL: config.gnewsWord2VecURL,
  nounfinder: nounfinder,
  probable: probable,
  wordnok: wordnok,
  nounLikePhrasesOnly: false,
  nounWordsOnly: false
});

var dryRun = false;
if (process.argv.length > 2) {
  dryRun = (process.argv[2].toLowerCase() == '--dry');
}

var chronicler = createChronicler({
  dbLocation: __dirname + '/data/seance-chronicler.db'
});

var twit = new Twit(config.twitter);
var streamOpts = {
  replies: 'all'
};
var stream = twit.stream('user', streamOpts);

stream.on('tweet', respondToTweet);

function respondToTweet(tweet) {
  async.waterfall(
    [
      checkIfWeShouldReply,
      getNeighborsForTweetWords,
      pickNeighbors,
      // runSeance,
      composeMessage,
      postTweet,
      recordThatReplyHappened
    ],
    wrapUp
  );

  function checkIfWeShouldReply(done) {
    var opts = {
      tweet: tweet,
      chronicler: chronicler
    };
    // console.log('Checking tweet from', tweet.user.screen_name);
    shouldReplyToTweet(opts, done);
  }

  function getNeighborsForTweetWords(done) {
    var words = getWorthwhileWordsFromText(tweet.text);
    // console.log('words', words);
    getWord2VecNeighbors(words, done);
  }

  function pickNeighbors(neighbors, done) {
    if (!neighbors || neighbors.length < 1) {
      callNextTick(done, new Error('No neighbors found.'));
    }
    else {
      var maxWords = probable.rollDie(neighbors.length);
      var picked = probable.shuffle(neighbors).slice(0, maxWords);
      callNextTick(done, null, picked);
    }
  }

  function postTweet(text, done) {
    text = '@' + tweet.user.screen_name + ' ' + text;

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
        status: text,
        in_reply_to_status_id: tweet.id_str
      };
      twit.post('statuses/update', body, done);
    }
  }

  // TODO: All of these async tasks should have just (opts, done) params.
  function recordThatReplyHappened(closingTweetData, response, done) {
    // TODO: recordThatUserWasRepliedTo should be async.
    chronicler.recordThatUserWasRepliedTo(tweet.user.id_str);
    callNextTick(done);
  }
}

function wrapUp(error, data) {
  if (error) {
    console.log(error, error.stack);

    if (data) {
      console.log('data:', data);
    }
  }
}
