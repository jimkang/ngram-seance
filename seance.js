var WanderGoogleNgrams = require('wander-google-ngrams');
var createWanderStream = WanderGoogleNgrams();
var _ = require('lodash');
var emojisource = require('emojisource');

function conductSeance(opts, done) {
  var word;
  var direction;

  if (opts) {
    word = opts.word;
    direction = opts.direction;
  }

  if (!direction) {
    direction = 'forward';
  }

  var words = [];

  var wanderStream = createWanderStream({
    word: word,
    direction: direction,
    repeatLimit: 2,
    tryReducingNgramSizeAtDeadEnds: true
  });

  wanderStream.on('error', saveErrorAndStop);
  wanderStream.on('data', saveWord);
  wanderStream.on('end', passBackWords);

  function saveWord(word) {
    words.push(word);
  }

  function saveErrorAndStop(error) {
    done(error);
  }

  function passBackWords() {
    done(null, words);
  }
}

module.exports = conductSeance;
