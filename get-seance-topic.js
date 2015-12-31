var createIsCool = require('iscool');
var _ = require('lodash');
var callNextTick = require('call-next-tick');
var probable = require('probable');

var iscool = createIsCool();

function getSeanceTopic(opts, done) {
  var wordnok;
  var text;

  if (opts) {
    wordnok = opts.wordnok;
    text = opts.text;
  }

  var words = worthwhileWordsFromText(text).filter(iscool);

  if (words.length < 1) {
    wordnok.getTopic(done)
    return;
  }

  if (words.length === 1) {
    callNextTick(done, null, words[0]);
    return;
  }

  if (probable.roll(3) === 0) {
    callNextTick(done, null, probable.pickFromArray(words));
    return;
  }

  wordnok.getWordFrequencies(words, getRarest);

  function getRarest(error, frequencies) {
    if (error) {
      done(error);
    }
    else {
      var rarestFrequency = 1000000;
      var rarestWord;

      frequencies.forEach(saveRarest);

      function saveRarest(freq, i) {
        if (freq === 0) {
          freq = 99999;
        }

        if (freq < rarestFrequency) {
          rarestFrequency = freq;
          rarestWord = words[i];
        }
      }

      done(null, rarestWord);
    }
  }
}

function worthwhileWordsFromText(text) {
  var words = text.split(/[ ":.,;!?#]/);
  var filteredWords = [];
  words = _.uniq(_.compact(words));
  if (words.length > 0) {
    filteredWords = words.filter(wordDoesNotStartWithAtSymbol);
  }
  return filteredWords;
}

function wordDoesNotStartWithAtSymbol(word) {
  return word.indexOf('@') === -1;
}

module.exports = getSeanceTopic;
