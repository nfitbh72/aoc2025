package eulerlib

import (
	"testing"
)

func TestDecryptUsingThreeLowerCaseKey(t *testing.T) {
	//some text
	str := "An extract taken from the introduction of one of Euler's most celebrated papers"
	asciiVals := []int{}
	for _, r := range str {
		asciiVals = append(asciiVals, int(r))
	}
	//encrypt it with {12, 14, 19}
	cryptStr := XORKey(asciiVals, []int{12, 14, 19})
	if cryptStr == str {
		t.Errorf("Expected %s, got %s", str, cryptStr)
	}
	cryptAsciiVals := []int{}
	for _, r := range cryptStr {
		cryptAsciiVals = append(cryptAsciiVals, int(r))
	}

	//decrypt it with every combination of three 1-26 numbers
	decryptStr := DecryptUsingThreeLowerCaseKey(cryptAsciiVals, []string{" and ", " the "})
	if decryptStr != str {
		t.Errorf("Expected %s, got %s", str, decryptStr)
	}

	//decrypt it with every combination of three 1-26 numbers
	decryptStr = DecryptUsingThreeLowerCaseKey(cryptAsciiVals, []string{" wibble ", " wobble "})
	if decryptStr != "" {
		t.Errorf("Expected %s, got %s", "\"\"", decryptStr)
	}
}
