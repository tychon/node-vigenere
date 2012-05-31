
/* the standard alphabet without any special characters */
exports.ALPHABET = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']

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

