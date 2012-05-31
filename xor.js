
common = require('./common')

/* XOR cipher */
encryptText = exports.encryptText = function (plaintext, key, alphabet) {
  plaintext = toNumbers(alphabet, plaintext);
  key = toNumbers(alphabet, key);
  var keyIndex = 0
  var result = "";
  for (var i = 0; i < plaintext.length; i++) {
    result += (plaintext[i] ^ key[keyIndex]).toString(2) + ";"
    keyIndex ++
    if (keyIndex == key.length) keyIndex = 0;
  }
  return result
}

