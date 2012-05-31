var test = require('tap').test
  , common = require('..').common

test("test number conversion", function (t) {
  numbers = common.toNumbers(common.ALPHABET, "ABCZ");
  t.equivalent(numbers, [0, 1, 2, 25]);
  
  string = common.toString(common.ALPHABET, numbers);
  t.equal(string, 'ABCZ');
  
  t.end();
})
