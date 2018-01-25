// Note: This is not connected with the main seed used in medium.js.
var probable = require('probable');

var gatePrefaces = ['⥥⟱ ⟱⥥\n', '⊹  ⊹  · ✵ ⊹  ✧✷   ✫  .\n'];

function getGateOpenMessage() {
  return probable.pickFromArray(gatePrefaces);
}

module.exports = getGateOpenMessage;
