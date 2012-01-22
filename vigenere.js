// see the readme of this project for more detailed information

/* the standard alphabet without any special characters */
exports.ALPHABET = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']

/* Some things to analyse your plaintext.
 */
// source: Wikipedia (Jan 2011)
exports.TOP_10_OF_MOST_COMMON_GERMAN_WORDS = ['DER', 'DIE', 'UND', 'IN', 'DEN', 'VON', 'ZU', 'DAS', 'MIT', 'SICH']
exports.TOP_10_OF_MOST_COMMON_ENGLISH_WORDS = ['THE', 'BE', 'TO', 'OF', 'AND', 'A', 'IN', 'THAT', 'HAVE', 'I']

exports.RELATIVE_FREQUENCIES_OF_LETTERS_IN_THE_GERMAN_LANGUAGE = [
  {letter: 'E', probability: 0.1740},
  {letter: 'N', probability: 0.0978},
  {letter: 'I', probability: 0.0755},
  {letter: 'S', probability: 0.0727},
  {letter: 'R', probability: 0.0700},
  {letter: 'A', probability: 0.0651},
  {letter: 'T', probability: 0.0615},
  {letter: 'D', probability: 0.0508},
  {letter: 'H', probability: 0.0476},
  {letter: 'U', probability: 0.0435},
  {letter: 'L', probability: 0.0344},
  {letter: 'C', probability: 0.0306},
  {letter: 'G', probability: 0.0301},
  {letter: 'M', probability: 0.0253},
  {letter: 'O', probability: 0.0251},
  {letter: 'B', probability: 0.0189},
  {letter: 'W', probability: 0.0189},
  {letter: 'F', probability: 0.0166},
  {letter: 'K', probability: 0.0121},
  {letter: 'Z', probability: 0.0113},
  {letter: 'P', probability: 0.0097},
  {letter: 'V', probability: 0.0067},
  {letter: 'J', probability: 0.0027},
  {letter: 'Y', probability: 0.0004},
  {letter: 'X', probability: 0.0003},
  {letter: 'Q', probability: 0.0002}
]
exports.RELATIVE_FREQUENCIES_OF_LETTERS_IN_THE_ENGLISH_LANGUAGE = [
  {letter: 'E', probability: 0.12702},
  {letter: 'T', probability: 0.09056},
  {letter: 'A', probability: 0.08167},
  {letter: 'O', probability: 0.07507},
  {letter: 'I', probability: 0.06966},
  {letter: 'N', probability: 0.06749},
  {letter: 'S', probability: 0.06327},
  {letter: 'H', probability: 0.06094},
  {letter: 'R', probability: 0.05987},
  {letter: 'D', probability: 0.04253},
  {letter: 'L', probability: 0.04025},
  {letter: 'C', probability: 0.02782},
  {letter: 'U', probability: 0.02758},
  {letter: 'M', probability: 0.02406},
  {letter: 'W', probability: 0.02306},
  {letter: 'F', probability: 0.02228},
  {letter: 'G', probability: 0.02015},
  {letter: 'Y', probability: 0.01974},
  {letter: 'P', probability: 0.01929},
  {letter: 'B', probability: 0.01492},
  {letter: 'V', probability: 0.00978},
  {letter: 'K', probability: 0.00772},
  {letter: 'J', probability: 0.00153},
  {letter: 'X', probability: 0.00150},
  {letter: 'Q', probability: 0.00095},
  {letter: 'Z', probability: 0.00074}
]

/* Convert a text to an array of numbers based on the alphabet.
 * Letters that are not contained in the alphabet will apper as -1 in the result.
 */
toNumbers = exports.toNumbers = function (alphabet, text) {
  var result = []
  for (var i = 0; i < text.length; i++) result.push(alphabet.indexOf(text[i]))
  return result
}
/* Convert a number array back to a string.
 * You should use the same alphabet :-) .
 */
toString = exports.toString = function (alphabet, numbers) {
  var result = ''
  for (var i = 0; i < numbers.length; i++) result += alphabet[numbers[i]]
  return result
}

/* Does converting and encrypting in one step. */
ecryptText = exports.encryptText = function (plaintext, key, alphabet, autokey) {
  plaintext = toNumbers(alphabet, plaintext)
  key = toNumbers(alphabet, key)
  var ciphertext = encrypt(plaintext, key, alphabet.length, autokey)
  return toString(alphabet, ciphertext)
}
/* Encrypt the given text (as number array) with the given key (as number array).
 * The overlapping index indicates the end of the alphabet.
 */
encrypt = exports.encrypt = function (text, key, overlappingIndex, autokey) {
  if (autokey) key = key.slice() // make a copy
  var keyIndex = 0
  var result = []
  for (var i = 0; i < text.length; i++) {
    var crypt = (text[i] + key[keyIndex]) % overlappingIndex
    result.push(crypt)
    if (autokey) key.push(text[i])
    
    keyIndex ++
    if (keyIndex == key.length) keyIndex = 0;
  }
  return result
}

/* Does converting and decrypting in one step. */
decryptText = exports.decryptText = function (ciphertext, key, alphabet, autokey) {
  ciphertext = toNumbers(alphabet, ciphertext)
  key = toNumbers(alphabet, key)
  var plaintext = decrypt(ciphertext, key, alphabet.length, autokey)
  return toString(alphabet, plaintext)
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

/* Try all combinations of the fixed-size-key.
 * You can give keywords (as regular expressions) to filter the output. If
 * `keywords` is undefined, all combinations will show up in the result.
 */
bruteForce = exports.bruteForce = function (text, keyLength, alphabet, autokey, keywords) {
  var key = []
  for (var i = 0; i < keyLength; i++) key.push(0)
  var possibilities = []
  
  while (true) {
    var plain = decrypt(text, key, alphabet.length, autokey)
    
    if (keywords) {
      for (var i = 0; i < keywords.length; i++) {
        var plaintext = toString(alphabet, plain)
        if (plaintext.match(keywords[i])) {
          possibilities.push({
            key: toString(alphabet, key),
            plaintext: plaintext
          })
          break
        }
      }
    } else {
      possibilities.push({
        key: toString(alphabet, key),
        plaintext: toString(alphabet, plain)
      })
    }
    
    // next key
    var carry = false
    key[0] ++
    if (key[0] == alphabet.length) {
      carry = true
      key[0] = 0
    }
    for (var i = 1; i < key.length; i++) {
      if (carry) {
        key[i] ++
      if (key[i] == alphabet.length) {
        carry = true
        key[i] = 0
      } else carry = false
      } else break
    }
    if (carry) break
  }
  
  return possibilities
}

/* Calculate the letter frequencies in the plaintexts and compare them
 * to the given frequency table. Only letters in the frequency table will be
 * considered.
 * The frequencyDiverganceSum is the sum of the difference between the letter
 * frequency in the plaintext and the listed relative frequency in the table for
 * every letter.
 * The frequencyDivergance is this result scaled to fit the range from 0 to 1.
 * The closer frequencyDivergance is to 1 the smaller is the divergance.
 */
calcLetterFrequencies = exports.calcLetterFrequencies = function (combinations, frequencyTable) {
  for (var i = 0; i < combinations.length; i++) {
    var combination = combinations[i]
    
    // letter frequencies in combination
    combination.frequencyTable = []
    combination.frequencyDiverganceSum = 0
    for (var j = 0; j < frequencyTable.length; j++) {
      var count = 0.0
      for (var k = 0; k < combination.plaintext.length; k++) {
        if (combination.plaintext[k] == frequencyTable[j].letter) count ++
      }
      probability = count / combination.plaintext.length
      combination.frequencyTable.push({letter: frequencyTable[j].letter, probability: probability})
      
      combination.frequencyDiverganceSum += Math.abs(probability - frequencyTable[j].probability)
    }
    combination.frequencyDivergance = 1 - combination.frequencyDiverganceSum / frequencyTable.length
  }
}

/*
 * Sort the given combination array by the letter frequency divergance.
 * The best fit will appear at the top of the array.
 * not ascending: best fit at the bottom
 * ascending: best fit at the top
 */
sortByLetterFrequencies = exports.sortByLetterFrequencies = function (combinations, ascending) {
  combinations.sort(function(one, two) {
    if (ascending) return two.frequencyDivergance - one.frequencyDivergance
    else return one.frequencyDivergance - two.frequencyDivergance
  })
}

printCombinationsWithFrequencyTable = exports.printCombinationsWithFrequencyTable = function (combinations) {
  for (var i = 0; i < combinations.length; i++) {
    var combination = combinations[i]
    console.log(combination.key+" : "+combination.plaintext)
    console.log("fit: "+combination.frequencyDivergance)
    //console.log(combination.frequencyTable)
    var out = ''
    for (var j = 0; j < combination.frequencyTable.length; j++) {
      out += combination.frequencyTable[j].letter
        +": "+Math.round(combination.frequencyTable[j].probability*1000)/1000+"% "
    }
    console.log(out)
  }
}

