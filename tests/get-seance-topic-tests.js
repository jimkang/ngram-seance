var test = require('tape');
var getSeanceTopic = require('../get-seance-topic');
var callNextTick = require('call-next-tick');
var _ = require('lodash');

function createMockWordnok(frequencies) {
  // return createWordnok({
  //   apiKey: config.wordnikAPIKey
  // });

  return {
    getWordFrequencies: function mockgetWordFrequencies(words, done) {
      callNextTick(done, null, frequencies);
    },
    getTopic: function mockGetTopic(done) {
      callNextTick(done, null, 'backup');
    }
  };
}

var testCases = [
  {
    opts: {
      text: 'The quick brown fox jumped over the Lord of All Dogs.'
    },
    mockFrequencies: [1000, 500, 600, 600, 700, 500, 1000, 300, 0, 600],
    expectError: false,
    expected: 'Lord'
  },
  {
    opts: {
      text: ''
    },
    mockFrequencies: [],
    expectError: false,
    expected: 'backup'
  },
  {
    opts: {
      text: 'shoe'
    },
    mockFrequencies: [],
    expectError: false,
    expected: 'shoe'
  }
];

testCases.forEach(runTest);

function runTest(testCase) {
  test('Basic test', function basicTest(t) {
    var opts = _.clone(testCase.opts);
    opts.wordnok = createMockWordnok(testCase.mockFrequencies);
    getSeanceTopic(opts, checkTopic);

    function checkTopic(error, topic) {
      if (testCase.expectError) {
        t.ok(error, 'Error is passed back.');
      } else {
        t.ok(!error, 'No error while getting topic.');
        t.equal(topic, testCase.expected, 'Topic is correctly chosen.');
      }
      t.end();
    }
  });
}
