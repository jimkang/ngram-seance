// Note: This is not connected with the main seed used in medium.js.
var probable = require('probable');

var dots = [
  '.',
  '·',
  '¨',
  '…',
  '...',
  ':',
  '•',
  '°',
  // '⁂',
  '˚',
  '˳',
  'ം',
  '़',
  'ﾟ',
  '◌',
  '܀',
  '܁',
  '܂',
  '܃',
  '܄',
  '܅',
  '܆',
  '܇',
  '܈',
  '܉',
  '݀',
  '݁',
  '݂',
  '݃',
  '݄',
  '݅ ',
  '݆'
];

function getDotChain(length) {
  var s = '';
  for (var i = 0; i < length; ++i) {
    s += probable.pickFromArray(dots);
  }
  return s + '\n';
}

module.exports = getDotChain;
