ALPHABET = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']

// wikipedia
TOP_10_OF_MOST_COMMON_GERMAN_WORDS = ['DER', 'DIE', 'UND', 'IN', 'DEN', 'VON', 'ZU', 'DAS', 'MIT', 'SICH']
TOP_10_OF_MOST_COMMON_ENGLISH_WORDS = ['THE', 'BE', 'TO', 'OF', 'AND', 'A', 'IN', 'THAT', 'HAVE', 'I']

RELATIVE_FREQUENCIES_OF_LETTERS_IN_THE_GERMAN_LANGUAGE = [
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
RELATIVE_FREQUENCIES_OF_LETTERS_IN_THE_ENGLISH_LANGUAGE = [
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

function cryptText (text, key, overlappingIndex, autokey) {
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
function decryptText (text, key, overlappingIndex, autokey) {
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

function toNumbers(alphabet, text) {
  var result = []
  for (var i = 0; i < text.length; i++) result.push(alphabet.indexOf(text[i]))
  return result
}
function toString(alphabet, numbers) {
  var result = ''
  for (var i = 0; i < numbers.length; i++) result += alphabet[numbers[i]]
  return result
}

function bruteForce(text, keyLength, alphabet, autokey, keywords) {
  var key = []
  for (var i = 0; i < keyLength; i++) key.push(0)
  var possibilities = []
  
  while (true) {
    var plain = decryptText(text, key, alphabet.length, autokey)
    
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

function calcLetterFrequencies(combinations, frequencyTable) {
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
 */
function sortByLetterFrequencies(combinations) {
  combinations.sort(function(one, two) {
    return two.frequencyDivergance - one.frequencyDivergance
  })
}
function printCombinationsWithFrequencyTable(combinations) {
  for (var i = 0; i < combinations.length; i++) {
    var combination = combinations[i]
    console.log(combination.key+" : "+combination.plaintext)
    console.log(combination.frequencyDiverganceSum+" -> "+combination.frequencyDivergance)
    //console.log(combination.frequencyTable)
    var out = ''
    for (var j = 0; j < combination.frequencyTable.length; j++) {
      out += combination.frequencyTable[j].letter
        +": "+Math.round(combination.frequencyTable[j].probability*1000)/1000+"% "
    }
    console.log(out)
  }
}

plaintext = 'wmydwaydzetpkxzlapgslfbtetpntpgaabmrxtlnksxqyfiwgina'.toUpperCase()
plainnumbers = toNumbers(ALPHABET, plaintext)
keylength = 3

table = bruteForce(plainnumbers, keylength, ALPHABET, false, TOP_10_OF_MOST_COMMON_GERMAN_WORDS)
calcLetterFrequencies(table, RELATIVE_FREQUENCIES_OF_LETTERS_IN_THE_GERMAN_LANGUAGE)
sortByLetterFrequencies(table)
printCombinationsWithFrequencyTable(table)
