var symbols = require('./symbols');
var getFortune404Message = require('./get-fortune-404-message');
var callNextTick = require('call-next-tick');
var createProbable = require('probable').createProbable;
var ngramChainToSentence = require('ngram-chain-to-sentence');
var probable = require('probable');

var punctuationTable = probable.createTableFromDef({
  '0-11': '.',
  '12': '…',
  '13-16': '!',
  '17-18': '?',
  '19': '?!'
});

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

    message += punctuationTable.roll();

    callNextTick(done, null, message);
  }

  return composeMessage;
}

module.exports = createComposeMessage;
