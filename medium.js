var config = require('./config/config');
var callNextTick = require('call-next-tick');
var Twit = require('twit');
var async = require('async');
var createChronicler = require('basicset-chronicler').createChronicler;
var conductSeance = require('./seance');
var seedrandom = require('seedrandom');
var createProbable = require('probable').createProbable;
var createWordnok = require('wordnok').createWordnok;
var getSeanceTopic = require('./get-seance-topic');
var createComposeMessage = require('./compose-message');
var shouldReplyToTweet = require('./should-reply-to-tweet');

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

var dryRun = false;
if (process.argv.length > 2) {
  dryRun = (process.argv[2].toLowerCase() == '--dry');
}

var originatingTweet;

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
  originatingTweet = tweet;

  async.waterfall(
    [
      checkIfWeShouldReply,
      pickWord,
      runSeance,
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
    shouldReplyToTweet(opts, done);
  }
}

function postTweet(text, done) {
  text = '@' + originatingTweet.user.screen_name + ' ' + text;

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
      in_reply_to_status_id: originatingTweet.id_str
    };
    twit.post('statuses/update', body, done);
  }
}

function pickWord(done) {
  var topicOpts = {
    wordnok: wordnok,
    text: originatingTweet.text
  };
  getSeanceTopic(topicOpts, done);
}

function runSeance(word, done) {
  var seanceOpts = {
    word: word,
    direction: probable.roll(3) === 0 ? 'backward' : 'forward'
  };

  conductSeance(seanceOpts, done);
}

// TODO: All of these async tasks should have just (opts, done) params.
function recordThatReplyHappened(closingTweetData, response, done) {
  // TODO: recordThatUserWasRepliedTo should be async.
  chronicler.recordThatUserWasRepliedTo(originatingTweet.user.id_str);
  callNextTick(done);
}

function wrapUp(error, data) {
  if (error) {
    console.log(error, error.stack);

    if (data) {
      console.log('data:', data);
    }
  }
}
