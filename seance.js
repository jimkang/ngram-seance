var WanderGoogleNgrams = require('wander-google-ngrams');
var config = require('./config/config');

var createWanderStream = WanderGoogleNgrams({
  wordnikAPIKey: config.wordnikAPIKey  
});

function conductSeance(opts, done) {
  var word;
  var direction;
  var characterLimit;
  var maxWordCount;

  if (opts) {
    word = opts.word;
    direction = opts.direction;
    characterLimit = opts.characterLimit;
    maxWordCount = opts.maxWordCount;
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
    maxWordCount: maxWordCount,
    forwardStages: [
      {
        name: 'start',
        needToProceed: ['noun', 'pronoun', 'noun-plural'],
        lookFor: '*_NOUN'
      },
      {
        name: 'pushedSubject',
        needToProceed: ['verb', 'verb-intransitive', 'auxiliary-verb'],
        lookFor: '*_VERB'
      },
      {
        name: 'pushedVerb',
        needToProceed: ['noun', 'pronoun', 'noun-plural', 'adjective'],
        disallowCommonBadExits: true,
        lookFor: '*_NOUN',
        posShouldBeUnambiguous: true
      },
      {
        name: 'done' // 'pushedObject'
      }
    ]
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
