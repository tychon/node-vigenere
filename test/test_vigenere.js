var test = require('tap').test
  , common = require('..').common
  , vigenere = require('..').vigenere

test("test normal cipher", function (t) {
  cipher = vigenere.encryptText('THISISASECRET', 'AKEY', common.ALPHABET, false)
  t.equal(cipher, 'TRMQICEQEMVCT')
  
  plaintext = vigenere.decryptText(cipher, 'AKEY', common.ALPHABET, false)
  t.equals(plaintext, 'THISISASECRET')
  
  t.end()
})

test("test autokey cipher", function (t) {
  cipher = vigenere.encryptText('THISISASECRET', 'AKEY', common.ALPHABET, true)
  t.equal(cipher, 'TRMQBZIKMURWX')
  
  plaintext = vigenere.decryptText(cipher, 'AKEY', common.ALPHABET, true)
  t.equals(plaintext, 'THISISASECRET')
  
  t.end()
})

