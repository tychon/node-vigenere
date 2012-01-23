
This module should be a little helper if you found an exercise sheet instructing
the reader to solve a short paragraph of vigenere encoded text.

It provides encryption and decryption of texts with normal vigenere and the
autokey cipher. You may also use the brute force search if you know the key
size. After doing that you can sort the results by analysing the relative letter
frequency.

Concept
-------
The strings are converted to number arrays before calculation. So the offsets
can be applied more efficiently.

Furthermore belongs to every text an alphabet that defines the positions of
the characters and the `overlappingIndex` that indicates where the end of the
alphabet is glued to the beginning.

Supported Functions
===================
Encryption and Decryption
-------------------------
Texts can be encrypted and decrypted in the normal mode with the repeating key
or in the autokey mode with the plaintext appended to the initial key.

Brute Force
-----------
You may try a brute force attack on a ciphertext if you know or guessed the
key length. The result can be filtered by keywords.

Lexicographic Analysis
----------------------
The combinations resulted from the brute force attack can be analysed for the
frequency of letters and compared to a given table of relative frequencies.
For this method you have to try every combination so the complexity is
(key-length ^ alphabet-length) .

An other way is to split the text up into blocks with the same length as the key:
For example `TRMQICEQEMVCT` with the given key length 4 is splitted up into

    TRMQ
    ICEQ
    EMVC
    T

Then the lexicographic analysis can be executed over the characters in one
column because each column was encrypted with the same key. This method results
in a smaller correctness because the actual analysed text is shorter, but it has
only the complexity of (key-length * alphabet-length) .

