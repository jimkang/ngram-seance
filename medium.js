var config = require('./config/config');
var callNextTick = require('call-next-tick');
var Twit = require('twit');
var betterKnowATweet = require('better-know-a-tweet');
var async = require('async');
var createChronicler = require('basicset-chronicler').createChronicler;
var behavior = require('./behavior');
var conductSeance = require('./seance');
var seedrandom = require('seedrandom');
var createProbable = require('probable').createProbable;
var createWordnok = require('wordnok').createWordnok;
var getSeanceTopic = require('./get-seance-topic');
var createComposeMessage = require('./compose-message');

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

var username = 'cleromancer';
var originatingTweet;
var topicUsed;

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
  if (tweet.user.screen_name === username) {
    return;
  }

  var usernames = betterKnowATweet.whosInTheTweet(tweet);
  if (!usernames || usernames.indexOf(username) === -1 ||
    isRetweetOfUser(username)) {

    return;
  }

  async.waterfall(
    [
      goFindLastReplyDate,
      replyDateWasNotTooRecent,
      pickWord,
      runSeance,
      composeMessage,
      postTweet,
      recordThatReplyHappened
    ],
    wrapUp
  );

  function goFindLastReplyDate(done) {
    findLastReplyDateForUser(tweet, done);
  }
}

function findLastReplyDateForUser(tweet, done) {
  chronicler.whenWasUserLastRepliedTo(
    tweet.user.id.toString(), passLastReplyDate
  );

  function passLastReplyDate(error, date) {
    // Don't pass on the error – `whenWasUserLastRepliedTo` can't find a
    // key, it returns a NotFoundError. For us, that's expected.
    if (error && error.type === 'NotFoundError') {
      error = null;
      date = new Date(0);
    }
    done(error, tweet, date);
  }
}

function replyDateWasNotTooRecent(tweet, date, done) {
  originatingTweet = tweet;

  if (typeof date !== 'object') {
    date = new Date(date);
  }
  var hoursElapsed = (Date.now() - date.getTime()) / (60 * 60 * 1000);

  if (hoursElapsed > behavior.hoursToWaitBetweenRepliesToSameUser) {
    originatingTweet = tweet;
    done();
  }
  else {
    done(new Error(
      `Replied ${hoursElapsed} hours ago to ${tweet.user.screen_name}.
      Need at least ${behavior.hoursToWaitBetweenRepliesToSameUser} to pass.`
    ));
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
  topicUsed = word;

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
