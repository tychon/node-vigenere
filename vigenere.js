
common = require('./common')

/* Does converting and encrypting in one step. */
encryptText = exports.encryptText = function (plaintext, key, alphabet, autokey) {
  plaintext = common.toNumbers(alphabet, plaintext)
  key = common.toNumbers(alphabet, key)
  var ciphertext = encrypt(plaintext, key, alphabet.length, autokey)
  return common.toString(alphabet, ciphertext)
}
/* Encrypt the given text (as number array) with the given key (as number array).
 * The overlapping index indicates the end of the alphabet.
 */
encrypt = exports.encrypt = function (numbers, key, overlappingIndex, autokey) {
  if (autokey) key = key.slice() // make a copy
  var keyIndex = 0
  var result = []
  for (var i = 0; i < numbers.length; i++) {
    var crypt = (numbers[i] + key[keyIndex]) % overlappingIndex
    result.push(crypt)
    if (autokey) key.push(numbers[i])
    
    keyIndex ++
    if (keyIndex == key.length) keyIndex = 0;
  }
  return result
}

/* Does converting and decrypting in one step. */
decryptText = exports.decryptText = function (ciphertext, key, alphabet, autokey) {
  ciphertext = common.toNumbers(alphabet, ciphertext)
  key = common.toNumbers(alphabet, key)
  var plaintext = decrypt(ciphertext, key, alphabet.length, autokey)
  return common.toString(alphabet, plaintext)
}
/* Decrypt the given text (as number array) with the given key (as number array).
 * The overlapping index indicates the end of the alphabet.
 */
decrypt = exports.decrypt = function (text, key, overlappingIndex, autokey) {
  if (autokey) key = key.slice() // make a copy
  var keyIndex = 0
  var result = []
  for (var i = 0; i < text.length; i++) {
    // the inverse function of modulo is ambiguous
    var plain = text[i] - key[keyIndex]
    while (plain < 0) plain += overlappingIndex
    result.push(plain)
    if (autokey) key.push(plain)
    
    keyIndex ++
    if (keyIndex == key.length) keyIndex = 0
  }
  return result
}

