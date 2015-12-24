var symbols = require('./symbols');
var getFortune404Message = require('./get-fortune-404-message');
var callNextTick = require('call-next-tick');
var createProbable = require('probable').createProbable;
var ngramChainToSentence = require('ngram-chain-to-sentence');

function createComposeMessage(opts) {
  var random;

  if (opts) {
    random = opts.random;
  }

  var probable = createProbable({
    random: random
  });

  function composeMessage(words, done) {
    // var message = '@' + originatingTweet.user.screen_name + ' ';
    var message;

    if (words.length < 2) {
      message = getFortune404Message();
    }
    else {
      message = ngramChainToSentence(words);
    }

    // message += (' ' + probable.pickFromArray(symbols.magickSymbols));

    callNextTick(done, null, message);
  }

  return composeMessage;
}

module.exports = createComposeMessage;
