package eulerlib

import (
	"reflect"
	"testing"
)

func TestDeckInit(t *testing.T) {
	//expecting to find A -> K hearts, A -> K diamonds, A -> K clubs, A -> K spades
	deck := Deck{}
	deck.InitNoJokers()
	if len(deck.cards) != 52 {
		t.Errorf("Expected 52 cards, got %d", len(deck.cards))
	}

	//spot check 4 cards
	tests := []TTest{
		{Name: "1st card", Input: 0, Expect: Card{suit: CardSuit(HEART), value: CardValue(ACE)}},
		{Name: "13th card", Input: 12, Expect: Card{suit: CardSuit(HEART), value: CardValue(KING)}},
		{Name: "26th card", Input: 25, Expect: Card{suit: CardSuit(DIAMOND), value: CardValue(KING)}},
		{Name: "52nd card", Input: 51, Expect: Card{suit: CardSuit(SPADE), value: CardValue(KING)}},
	}
	for _, test := range tests {
		CheckTest(t, "card.InitNoJokers", test, deck.cards[test.Input.(int)])
	}
}

func TestDeckShuffle(t *testing.T) {
	deck := Deck{}
	deck.InitNoJokers()
	nonShuffled := []Card{}
	copy(nonShuffled, deck.cards)
	deck.Shuffle()
	if len(deck.cards) != 52 {
		t.Errorf("Expected 52 cards, got %d", len(deck.cards))
	}

	//simple test that a shuffled deck has changed from the original new deck order
	//noting that there is a miniscule chance that a shuffled deck will actually be in new deck order
	if reflect.DeepEqual(nonShuffled, deck) {
		t.Errorf("Expected shuffled deck, got %v", deck)
	}
}

func TestCardCompare(t *testing.T) {
	//comparing 2 cards
	tests := []TTest{
		{
			Name:   "simple compare",
			Input:  []Card{Card{suit: CardSuit(HEART), value: CardValue(TEN)}, Card{suit: CardSuit(CLUB), value: CardValue(TWO)}},
			Expect: 1,
		},
		{
			Name:   "same value",
			Input:  []Card{Card{suit: CardSuit(HEART), value: CardValue(TEN)}, Card{suit: CardSuit(CLUB), value: CardValue(TEN)}},
			Expect: 0,
		},
		{
			Name:   "aces are special",
			Input:  []Card{Card{suit: CardSuit(HEART), value: CardValue(TEN)}, Card{suit: CardSuit(CLUB), value: CardValue(ACE)}},
			Expect: -1,
		},
		{
			Name:   "aces are special",
			Input:  []Card{Card{suit: CardSuit(HEART), value: CardValue(ACE)}, Card{suit: CardSuit(CLUB), value: CardValue(KING)}},
			Expect: 1,
		},
	}
	for _, test := range tests {
		CheckTest(t, "card.Compare", test, test.Input.([]Card)[0].Compare(test.Input.([]Card)[1]))
	}
}

func TestDeckDeal(t *testing.T) {
	deck := Deck{}
	deck.InitNoJokers()
	deck.Shuffle()
	hand := deck.Deal(5)
	if len(hand.cards) != 5 {
		t.Errorf("Expected 5 cards, got %d", len(hand.cards))
	}
	if len(deck.cards) != 47 {
		t.Errorf("Expected 47 cards, got %d", len(deck.cards))
	}
}

func TestIsFlush(t *testing.T) {
	//comparing 2 cards
	tests := []TTest{
		{
			Name:   "simple flush",
			Input:  &Hand{cards: []Card{Card{suit: CardSuit(HEART), value: CardValue(TEN)}, Card{suit: CardSuit(HEART), value: CardValue(TWO)}}},
			Expect: true,
		},
		{
			Name:   "not a flush",
			Input:  &Hand{cards: []Card{Card{suit: CardSuit(HEART), value: CardValue(TEN)}, Card{suit: CardSuit(CLUB), value: CardValue(TWO)}}},
			Expect: false,
		},
	}
	for _, test := range tests {
		CheckTest(t, "card.IsFlush", test, test.Input.(*Hand).IsFlush())
	}
}

func TestIsStraight(t *testing.T) {
	//comparing 2 cards
	tests := []TTest{
		{
			Name:   "simple straight",
			Input:  HandFromString("TH 9C 8C"),
			Expect: true,
		},
		{
			Name:   "not a straight",
			Input:  &Hand{cards: []Card{{suit: CardSuit(HEART), value: CardValue(TEN)}, {suit: CardSuit(CLUB), value: CardValue(TWO)}}},
			Expect: false,
		},
		{
			Name:   "aces are special",
			Input:  &Hand{cards: []Card{{suit: CardSuit(HEART), value: CardValue(TEN)}, {suit: CardSuit(CLUB), value: CardValue(ACE)}}},
			Expect: false,
		},
		{
			Name:   "low aces are special",
			Input:  HandFromString("AH 3H 2H"),
			Expect: false,
		},
		{
			Name:   "high aces are special",
			Input:  HandFromString("AH QH KH"),
			Expect: true,
		},
	}
	for _, test := range tests {
		test.Input.(*Hand).Sort()
		CheckTest(t, "card.IsStraight", test, test.Input.(*Hand).IsStraight())
	}
}

func TestIsStraightFlush(t *testing.T) {
	//comparing 2 cards
	tests := []TTest{
		{
			Name:   "simple straight flush",
			Input:  &Hand{cards: []Card{{suit: CardSuit(HEART), value: CardValue(TEN)}, {suit: CardSuit(HEART), value: CardValue(NINE)}}},
			Expect: true,
		},
		{
			Name:   "not a straight flush",
			Input:  &Hand{cards: []Card{{suit: CardSuit(HEART), value: CardValue(TEN)}, {suit: CardSuit(CLUB), value: CardValue(NINE)}}},
			Expect: false,
		},
		{
			Name:   "not a straight flush",
			Input:  &Hand{cards: []Card{{suit: CardSuit(HEART), value: CardValue(TEN)}, {suit: CardSuit(HEART), value: CardValue(EIGHT)}}},
			Expect: false,
		},
	}
	for _, test := range tests {
		test.Input.(*Hand).Sort()
		CheckTest(t, "card.IsStraightFlush", test, test.Input.(*Hand).IsStraightFlush())
	}
}

func TestGetCardFromString(t *testing.T) {
	//comparing 2 cards
	tests := []TTest{
		{
			Name:   "2 of Hearts",
			Input:  "2H",
			Expect: Card{suit: CardSuit(HEART), value: CardValue(TWO)},
		},
		{
			Name:   "Ten of Spades",
			Input:  "TS",
			Expect: Card{suit: CardSuit(SPADE), value: CardValue(TEN)},
		},
		{
			Name:   "Ace of Hearts",
			Input:  "AH",
			Expect: Card{suit: CardSuit(HEART), value: CardValue(ACE)},
		},
	}
	for _, test := range tests {
		//note: deference ptr to get the struct to compare
		CheckTest(t, "card.GetCardFromString", test, *GetCardFromString(test.Input.(string)))
	}

}

func TestGetBadCardFromString(t *testing.T) {
	//comparing 2 cards
	tests := []TTest{
		{
			Name:   "bad suit",
			Input:  "2X",
			Expect: nil,
		},
		{
			Name:   "bad value",
			Input:  "XH",
			Expect: nil,
		},
		{
			Name:   "bad value",
			Input:  "X",
			Expect: nil,
		},
		{
			Name:   "bad value",
			Input:  "XXX",
			Expect: nil,
		},
	}
	for _, test := range tests {
		if GetCardFromString(test.Input.(string)) != nil {
			ReportError(t, "card.GetCardFromString", test, GetCardFromString(test.Input.(string)))
		} else {
			ReportSuccess("card.GetCardFromString", test)
		}
	}
}

func TestPlayerSet(t *testing.T) {
	hand := Hand{cards: []Card{
		{suit: CardSuit(HEART), value: CardValue(TEN)}, {suit: CardSuit(CLUB), value: CardValue(NINE)},
	}}
	tests := []TTest{
		{
			Name:   "set hand",
			Input:  hand,
			Expect: hand,
		},
	}
	for _, test := range tests {
		player := Player{}
		player.SetHand(test.Input.(Hand))
		player.SetName("Player One")
		CheckTest(t, "player.SetHand", test, player.hand)
	}
}

func TestHandIsNOfKind(t *testing.T) {
	type TIsNOfKind struct {
		hand *Hand
		num  int
	}
	hand := Hand{cards: []Card{
		{suit: CardSuit(HEART), value: CardValue(TEN)},
		{suit: CardSuit(CLUB), value: CardValue(TEN)},
		{suit: CardSuit(DIAMOND), value: CardValue(TEN)},
		{suit: CardSuit(CLUB), value: CardValue(NINE)},
		{suit: CardSuit(SPADE), value: CardValue(NINE)},
	}}
	tests := []TTest{
		{
			Name:   "is 1 of a kind",
			Input:  TIsNOfKind{&hand, 1},
			Expect: false,
		},
		{
			Name:   "is 2 of a kind",
			Input:  TIsNOfKind{&hand, 2},
			Expect: true,
		},
		{
			Name:   "is 3 of a kind",
			Input:  TIsNOfKind{&hand, 3},
			Expect: true,
		},
		{
			Name:   "is 4 of a kind",
			Input:  TIsNOfKind{&hand, 4},
			Expect: false,
		},
	}
	for _, test := range tests {
		CheckTest(
			t,
			"hand.IsNOfKind",
			test,
			test.Input.(TIsNOfKind).hand.isNOfKind(test.Input.(TIsNOfKind).num),
		)
	}

	tests = []TTest{
		{
			Name:   "is two of a kind",
			Input:  TIsNOfKind{&hand, 1},
			Expect: true,
		},
	}
	for _, test := range tests {
		CheckTest(
			t,
			"hand.IsTwoOfKind",
			test,
			test.Input.(TIsNOfKind).hand.IsTwoOfKind(),
		)
	}
	tests = []TTest{
		{
			Name:   "is three of a kind",
			Input:  TIsNOfKind{&hand, 1},
			Expect: true,
		},
	}
	for _, test := range tests {
		CheckTest(
			t,
			"hand.IsNOfKind",
			test,
			test.Input.(TIsNOfKind).hand.IsThreeOfKind(),
		)
	}
	tests = []TTest{
		{
			Name:   "is full house",
			Input:  TIsNOfKind{&hand, 1},
			Expect: true,
		},
	}
	for _, test := range tests {
		CheckTest(
			t,
			"hand.IsNOfKind",
			test,
			test.Input.(TIsNOfKind).hand.IsFullHouse(),
		)
	}
	tests = []TTest{
		{
			Name:   "is four of kind",
			Input:  TIsNOfKind{&hand, 1},
			Expect: false,
		},
	}
	for _, test := range tests {
		CheckTest(
			t,
			"hand.IsNOfKind",
			test,
			test.Input.(TIsNOfKind).hand.IsFourOfKind(),
		)
	}
}

func TestHandCompare(t *testing.T) {
	hand1 := HandFromString("TH TC TD 9C 9S")
	hand2 := HandFromString("TH TC TD 9C 9S")
	hand3 := HandFromString("AH KH 2H JH TH")
	hand4 := HandFromString("TH TC TD 8C 8S")
	//fmt.Println(hand3.ToString())
	tests := []TTest{
		{
			Name:   "same hand",
			Input:  []*Hand{hand1, hand2},
			Expect: 0,
		},
		{
			Name:   "flush loses against full house",
			Input:  []*Hand{hand3, hand1},
			Expect: -1,
		},
		{
			Name:   "full house beats flush",
			Input:  []*Hand{hand1, hand3},
			Expect: 1,
		},
		{
			Name:   "both full house diff values",
			Input:  []*Hand{hand1, hand4},
			Expect: 1,
		},
	}
	for _, test := range tests {
		test.Input.([]*Hand)[0].Sort()
		test.Input.([]*Hand)[1].Sort()
		//fmt.Println(test.Input.([]*Hand)[0].ToString(), test.Input.([]*Hand)[1].ToString())
		CheckTest(
			t,
			"hand.Compare",
			test,
			test.Input.([]*Hand)[0].Compare(test.Input.([]*Hand)[1]),
		)

	}

}

func TestHandRank(t *testing.T) {
	tests := []TTest{
		{
			Name:   "royal flush",
			Input:  HandFromString("AH KH QH JH TH"),
			Expect: StraightFlush,
		},
		{
			Name:   "straight flush",
			Input:  HandFromString("TH 9H 8H 7H 6H"),
			Expect: StraightFlush,
		},
		{
			Name:   "four of a kind",
			Input:  HandFromString("TH TC TD TS 9S"),
			Expect: FourOfKind,
		},
		{
			Name:   "full house",
			Input:  HandFromString("TH TC TD 9C 9S"),
			Expect: FullHouse,
		},
		{
			Name:   "flush",
			Input:  HandFromString("TH KH 8H 7H 6H"),
			Expect: Flush,
		},
		{
			Name:   "straight",
			Input:  HandFromString("TH 9C 8C 7H 6H"),
			Expect: Straight,
		},
		{
			Name:   "three of a kind",
			Input:  HandFromString("TH TC TD 9C 8S"),
			Expect: ThreeOfKind,
		},
		{
			Name:   "two pair",
			Input:  HandFromString("TH TC 8D 9C 9S"),
			Expect: TwoPair,
		},
		{
			Name:   "one pair",
			Input:  HandFromString("TH TC KD 9C 8S"),
			Expect: OnePair,
		},
		{
			Name:   "high card",
			Input:  HandFromString("TH KC QD 2C 5S"),
			Expect: HighCard,
		},
	}
	for _, test := range tests {
		test.Input.(*Hand).Sort()
		CheckTest(
			t,
			"hand.GetRank",
			test,
			test.Input.(*Hand).GetRank(),
		)

	}
}

func TestHandToString(t *testing.T) {
	tests := []TTest{
		{
			Name:   "hand to string",
			Input:  HandFromString("TH TC TD 9C 9S"),
			Expect: "TH TC TD 9C 9S \tFH\t",
		},
		{
			Name:   "empty hand to string",
			Input:  &Hand{},
			Expect: "Empty Hand",
		},
	}
	for _, test := range tests {
		CheckTest(
			t,
			"hand.ToString",
			test,
			test.Input.(*Hand).ToString(),
		)

	}
}
