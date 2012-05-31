
common = require('./common')
vigenere = require('./vigenere')

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

/* Splits up ciphernums into blocks of characters, that were encrypted with the
 * same character. Then we try to decrypt the block with every single character
 * in the alphabet and analyse the divergence of letter frequencies to the given
 * frequencyTable.
 * Returns an object with two fields:
 *   - key - The best key determined by the letter frequencies.
 *   - possibilities - An array with all possibilities tried,
 *                     represented as objects like this one:
 *     - key_index - The index of the char in the key that encrypted this block
 *     - alphabet_index - The index of the char that was tried for decryption in this possibility
 *     - cipher - All characters that were encrypted with the same character
 *     - plain - The plain text result from decryption
 *     - key - The character that is at frequencyTable[alphabet_index]
 *     - freq_analysis - object returned by letterFrequencies(...) for `plain`
 */
kerckhoff_variant = exports.kerckhoff_variant = function (ciphernums, keyLength, alphabet, frequencyTable, autokey) {
  // split up ciphernums
  var blocks = [], index = 0
  for (var i = 0; i < ciphernums.length; i++) {
    if (!blocks[index]) blocks[index] = []
    blocks[index].push(ciphernums[i])
    index ++
    if (index == keyLength) index = 0
  }
  
  var possibilities = [], key = []
  for (var i = 0; i < blocks.length; i++) {
    // analyse column
    best = {letter: null, freq_div: -1} // this is worse than every result
    for (var j = 0; j < alphabet.length; j++) {
      var plainnumbers = vigenere.decrypt(blocks[i], j, alphabet.length, autokey)
      var plaintext = common.toString(alphabet, plain)
      var res = letterFrequencies(plaintext, frequencyTable)
      possibilities.push({
        key_index: i,
        alphabet_index: j,
        cipher: blocks[i],
        plain: plaintext,
        key: alphabet[j],
        freq_analysis: res
      })
      if (best.ferq_div == -1 || res.divergence < best.freq_div) {
        best.freq_div = res.divergence
        best.letter = alphabet[j]
      }
    }
    key.push(best.letter)
  }
  
  return {
    possibilities: possibilities,
    key: key
  }
}

/* Calculates the letter frequencies in the text and compares them
 * to the given frequency table. Only letters in the frequency table will be
 * considered. This function works with the proper characters and not their
 * numbers.
 * Returns object having four attributes:
 *   - text - The input text (as proper character string)
 *   - freq_table - The input table
 *   - table - An array of the same length as frequencyTable
 *   - divergence - Standard deviation of freqs relative to given freqs in table.
 * The array contains objects with two attributes:
 *   - letter - A letter
 *   - freq - Frequency of the letter relative to text.length
 */
letterFrequencies = exports.letterFrequencies = function (text, frequencyTable) {
  var output = {
    text: text,
    freq_table: frequencyTable,
    table: [],
    divergence: 0 // divergence of probabilities to frequency table
  }
  for (var i = 0; i < frequencyTable.length; i++) {
    // count occurrences of letter
    var count = 0
    for (var j = 0; j < text.length; j++)
      if (text[j] == frequencyTable[i].letter) count ++
    
    freq = count / text.length // relativize them
    output.table.push({
      letter: frequencyTable[j].letter,
      freq: freq
    })
    output.divergence = Math.pow(2, freq - frequencyTable[j].probability)
  }
  output.divergence = Math.sqrt(output.divergence / frequencyTable.length);
  return output
}

