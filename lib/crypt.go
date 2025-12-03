package eulerlib

import (
	"strings"
)

// XORKey applies a repeating XOR key (encoded as lowercase letter offsets) to
// the provided ASCII values and returns the decoded string.
func XORKey(lettersAscii []int, keys []int) string {
	out := ""
	i := 0
	for _, letterAscii := range lettersAscii {
		key := keys[i%len(keys)] + 97 // to get the character a-z
		decodeVal := letterAscii ^ key
		r := rune(decodeVal)
		out += string(r)
		i++
	}
	return out
}

// DecryptUsingThreeLowerCaseKey brute-forces all three-letter lowercase keys
// against the given ASCII values and returns the first decoded string that
// contains any of the supplied marker words.
func DecryptUsingThreeLowerCaseKey(asciiValues []int, wordsToCheck []string) string {
	for i := 0; i < 26; i++ {
		for j := 0; j < 26; j++ {
			for k := 0; k < 26; k++ {
				decrypted := XORKey(asciiValues, []int{i, j, k})

				for _, word := range wordsToCheck {
					if strings.Contains(decrypted, word) {
						//fmt.Println("decrypted", decrypted)
						return decrypted
					}
				}
			}
		}
	}
	return ""

}
