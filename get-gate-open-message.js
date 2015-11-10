// Note: These are not connected with the main seed used in medium.js.
var probable = require('probable');

var gatePrefaces = [
  'THE GATE IS OPEN!\n',
  'THE DIMENSION SCREAMS: ',
  'THE SPIRITS WHISPER: ',
  '⥥⟱ WORDS SPILL FROM THE DIMENSION ⟱⥥\n',
  'PRANCE TO THESE HYMNS OF TRUTH:\n',
  'SCORCH THE EARTH WITH THESE WORDS: ',
  'IA! IA! ',
  'THE GATE LETS OUT A WHISPER: ',
  'PINK LIGHT BEAMS TO YOUR BRAIN: ',
  '⊹  ⊹  · ✵ ⊹  ✧✷   ✫  .\n'
];

function getGateOpenMessage() {
  return probable.pickFromArray(gatePrefaces);
}

module.exports = getGateOpenMessage;
