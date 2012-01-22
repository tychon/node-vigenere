var test = require('tap').test
  , vigenere = require('..')

test("test vigenere in normal mode", function (t) {
  cipher = vigenere.encryptText('THISISASECRET', 'AKEY', vigenere.ALPHABET, false)
  t.equal(cipher, 'TRMQICEQEMVCT')
  
  plaintext = vigenere.decryptText(cipher, 'AKEY', vigenere.ALPHABET, false)
  t.equals(plaintext, 'THISISASECRET')
  
  t.end()
})

test("test vigenere in autokey mode", function (t) {
  cipher = vigenere.encryptText('THISISASECRET', 'AKEY', vigenere.ALPHABET, true)
  t.equal(cipher, 'TRMQBZIKMURWX')
  
  plaintext = vigenere.decryptText(cipher, 'AKEY', vigenere.ALPHABET, true)
  t.equals(plaintext, 'THISISASECRET')
  
  t.end()
})

