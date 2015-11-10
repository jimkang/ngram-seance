var WanderGoogleNgrams = require('wander-google-ngrams');
var createWanderStream = WanderGoogleNgrams();
var _ = require('lodash');
var emojisource = require('emojisource');

function conductSeance(opts, done) {
  var word;
  var direction;
  var characterLimit;

  if (opts) {
    word = opts.word;
    direction = opts.direction;
    characterLimit = opts.characterLimit;
  }

  if (!direction) {
    direction = 'forward';
  }

  var words = [];

  var wanderStream = createWanderStream({
    word: word,
    direction: direction,
    repeatLimit: 1,
    tryReducingNgramSizeAtDeadEnds: true,
    shootForASentence: true,
    maxWordCount: 25
  });

  wanderStream.on('error', saveErrorAndStop);
  wanderStream.on('data', saveWord);
  wanderStream.on('end', passBackWords);

  function saveWord(word) {
    if (characterLimit === undefined) {
      words.push(word);
    }
    else {
      if (words.join(' ').length + word.length + 1 <= characterLimit) {
        words.push(word);
      }
      else {
        console.log('hit char limit with word', word);
        wanderStream.end();
      }
    }
  }

  function saveErrorAndStop(error) {
    done(error);
  }

  function passBackWords() {
    done(null, words);
  }
}

module.exports = conductSeance;
