var WanderGoogleNgrams = require('wander-google-ngrams');
var createWanderStream = WanderGoogleNgrams();
var _ = require('lodash');
var Writable = require('stream').Writable;
var emojisource = require('emojisource');

function conductSeance(opts, done) {
  var word;
  var direction;
  var originatingTweet;
  var twit;
  var lastError;
  
  if (opts) {
    word = opts.word,
    direction = opts.direction;
    originatingTweet = opts.originatingTweet;
    twit = opts.twit;
  }

  if (!direction) {
    direction = 'forward';
  }

  var writableTweetStream = Writable({
    decodeStrings: false
  });
  writableTweetStream._write = writeToTweet;
  writableTweetStream.on('error', saveErrorAndStop);

  var wanderStream = createWanderStream(_.pick(opts, 'word', 'direction'));
  wanderStream.on('error', saveErrorAndStop);
  wanderStream.on('end', passBackLastError);

  wanderStream.pipe(writableTweetStream);

  function writeToTweet(word, enc, next) {
    var tweetOpts = {
      status: '@' + originatingTweet.user.screen_name + ' ' + word + ' ' +
        emojisource.getRandomTopicEmoji(),
      in_reply_to_status_id: originatingTweet.id_str
    };

    twit.post('statuses/update', tweetOpts, checkResult);

    function checkResult(error, data, response) {
      if (error) {
        if (data) {
          console.log('data:', data);
        }
        saveErrorAndStop(error);
      }
      else {
        next();
      }
    }
  }

  function saveErrorAndStop(error) {
    lastError = error;
    wanderStream.end();
    writableTweetStream.end();
  }

  function passBackLastError() {
    done(lastError);
  }
}

module.exports = conductSeance;

