var callNextTick = require('call-next-tick');
var probable = require('probable');
var getWorthwhileWordsFromText = require('./get-worthwhile-words-from-text');

function getSeanceTopic(opts, done) {
  var wordnok;
  var text;

  if (opts) {
    wordnok = opts.wordnok;
    text = opts.text;
  }

  var words = getWorthwhileWordsFromText(text);

  if (words.length < 1) {
    wordnok.getTopic(done);
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
    var rarestFrequency = 1000000;
    var rarestWord;

    if (error) {
      done(error);
    } else {
      frequencies.forEach(saveRarest);
      done(null, rarestWord);
    }

    function saveRarest(freq, i) {
      if (freq === 0) {
        freq = 99999;
      }

      if (freq < rarestFrequency) {
        rarestFrequency = freq;
        rarestWord = words[i];
      }
    }
  }
}

module.exports = getSeanceTopic;
