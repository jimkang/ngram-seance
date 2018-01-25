// Note: These are not connected with the main seed used in medium.js.
var probable = require('probable');

var table = probable.createTableFromDef({
  '0-9': {
    '0-0': 'reply hazy try again',
    '1-1': 'ask again later',
    '2-2': 'better not tell you now',
    '3-3': 'cannot predict now',
    '4-4': 'concentrate and ask again'
  },
  '10-24': {
    '0-0': 'general protection fault',
    '1-1': 'illegal operation',
    '2-2': '[object object]',
    '3-3': 'segmentation fault',
    '4-4': 'undefined is not a function',
    '5-9': '404 not found',
    '10-10': '500 internal server error',
    '11-11': 'EXC_BAD_ACCESS',
    '12-12':
      'please turn off your computer, then turn it back on and try again',
    '13-13': 'cache miss'
  },
  '25-39': {
    '0-0': 'cannot enter the Dimension at this time',
    '1-1': 'the stars are not right',
    '2-2': 'the spirits of the Dimension are Not Home',
    '3-3': 'i seem to have forgotten change for the Tollgate of the Continuum',
    '4-4': 'astral projection somehow got stuck in the Seas Below All Seas',
    '5-5':
      "forgot my id; Dennis isn't letting me through to the Dimension even though it totally knows who i am",
    '6-6': 'blast force psychic winds distorting view to the Dimension',
    '7-7':
      'messages from the Dimension have all these "%20"s on them today. too hard to read',
    '8-8': 'the spirits of the Dimension do not like your attitude. ¯_(ツ)_/¯'
  },
  '40-49': {
    '0-0':
      "sorry. just don't feel like going to the Dimension today. gonna stay in the tub",
    '1-1': 'have to get the crystal ball cleaned. bbl',
    '2-2':
      'harry houdini just came in and yelled at me and kicked my crystal ball. he\'s "debunking"',
    '3-3':
      'cat is on me right now. will open channel to the Dimension when it gets up',
    '4-4':
      'sorry, Dennis is at the Gate right now. Waiting for its shift to end',
    '5-5':
      'what? oh sorry missed the message from the Dimension while watching this animated gif'
  }
});

module.exports = table.roll;
