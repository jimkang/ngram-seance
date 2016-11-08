var callNextTick = require('call-next-tick');
var createProbable = require('probable').createProbable;
var symbols = require('./symbols');

function createComposeMessage(opts) {
  var random;

  if (opts) {
    random = opts.random;
  }

  var probable = createProbable({
    random: random
  });

  var punctuationTable = probable.createTableFromDef({
    '0-11': '.',
    '12': '…',
    '13-16': '!',
    '17-18': '?',
    '19': '?!'
  });

  function composeMessage(words, done) {
    // var message = '@' + originatingTweet.user.screen_name + ' ';
    var joinStr = ' ';
    if (probable.roll(10) === 0) {
      var symbolsKey = probable.pickFromArray(Object.keys(symbols));
      joinStr = ' ' + probable.pickFromArray(symbols[symbolsKey]) + ' ';
    }
    var message = words.join(joinStr);
    message = message.slice(0, 1).toUpperCase() + message.slice(1);
    message += punctuationTable.roll();

    callNextTick(done, null, message);
  }

  return composeMessage;
}

module.exports = createComposeMessage;
