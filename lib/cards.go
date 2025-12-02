package eulerlib

import (
	"math/rand"
	"slices"
	"sort"
	"strings"
)

type CardValue int
type CardSuit int

const (
	ACE CardValue = iota
	TWO
	THREE
	FOUR
	FIVE
	SIX
	SEVEN
	EIGHT
	NINE
	TEN
	JACK
	QUEEN
	KING
)

const (
	HEART CardSuit = iota
	DIAMOND
	CLUB
	SPADE
)

type Card struct {
	suit  CardSuit
	value CardValue
}

func (m *Card) AceHighValue() int {
	if m.value == ACE {
		return int(KING) + 1
	} else {
		return int(m.value)
	}
}

func (m *Card) Compare(other Card) int {
	myCardValue := m.AceHighValue()
	otherCardValue := other.AceHighValue()
	if myCardValue == otherCardValue {
		return 0
	} else if myCardValue > otherCardValue {
		return 1
	} else {
		return -1
	}
}

type HandRank int

const (
	HighCard HandRank = iota
	OnePair
	TwoPair
	ThreeOfKind
	Straight
	Flush
	FullHouse
	FourOfKind
	StraightFlush
)

type Hand struct {
	cards []Card
}

func (m *Hand) AddCard(card Card) {
	m.cards = append(m.cards, card)

}

func (m *Hand) GetRank() HandRank {
	if m.IsStraightFlush() {
		return StraightFlush
	}
	if m.IsFourOfKind() {
		return FourOfKind
	}
	if m.IsFullHouse() {
		return FullHouse
	}
	if m.IsFlush() {
		return Flush
	}
	if m.IsStraight() {
		return Straight
	}
	if m.IsThreeOfKind() {
		return ThreeOfKind
	}
	if m.IsTwoPair() {
		return TwoPair
	}
	if m.IsTwoOfKind() {
		return OnePair
	}
	return HighCard
}

func (m *Hand) Compare(other *Hand) int {
	// Sort both hands
	m.Sort()
	other.Sort()

	// Compare hand ranks
	myRank := m.GetRank()
	otherRank := other.GetRank()

	if myRank > otherRank {
		return 1
	}
	if myRank < otherRank {
		return -1
	}
	// If ranks are equal, compare individual cards
	return m.compareCards(other)
}

func (m *Hand) compareCards(other *Hand) int {
	for i := 0; i < len(m.cards); i++ {
		if result := m.cards[i].Compare(other.cards[i]); result != 0 {
			return result
		}
	}
	return 0
}

func (m *Hand) IsFlush() bool {
	// all cards have the same suit
	suit := m.cards[0].suit
	for _, card := range m.cards {
		if card.suit != suit {
			return false
		}
	}
	return true
}

func (m *Hand) IsStraight() bool {
	//fmt.Println(m.ToString())
	// cards are in order desc
	isStraight := true
	for i := 1; i < len(m.cards); i++ {
		if m.cards[i-1].AceHighValue() != m.cards[i].AceHighValue()+1 {
			isStraight = false
			break
		}
	}
	if isStraight {
		return true
	}
	//now try with Ace Low
	isStraight = true
	for i := 1; i < len(m.cards); i++ {
		if m.cards[i-1].value != m.cards[i].value+1 {
			isStraight = false
			break
		}
	}
	//fmt.Println("isStraight2", isStraight)
	return isStraight
}

func (m *Hand) IsStraightFlush() bool {
	// all cards have the same suit and are in order
	return m.IsFlush() && m.IsStraight()
}

func (m *Hand) getCounts() []int {
	counts := []int{}
	count := 1
	for i := 1; i < len(m.cards); i++ {
		if m.cards[i].value == m.cards[i-1].value {
			count++
		} else {
			counts = append(counts, count)
			count = 1
		}
	}
	counts = append(counts, count)
	return counts
}

func (m *Hand) popAllCardsOfValue(cards []Card, value CardValue) ([]Card, []Card, int) {
	count := 0
	poppedCards := []Card{}
	newCards := []Card{}
	for i := 0; i < len(cards); i++ {
		if cards[i].value == value {
			count++
			poppedCards = append(poppedCards, cards[i])
		} else {
			newCards = append(newCards, cards[i])
		}
	}
	return newCards, poppedCards, count

}

func (m *Hand) isNOfKind(n int) bool {
	return slices.Contains(m.getCounts(), n)
}

func (m *Hand) IsFourOfKind() bool {
	return m.isNOfKind(4)
}

func (m *Hand) IsThreeOfKind() bool {
	return m.isNOfKind(3)
}

func (m *Hand) IsTwoPair() bool {
	counts := m.getCounts()
	numPairs := 0
	for _, c := range counts {
		if c == 2 {
			numPairs++
		}
	}
	return numPairs == 2
}

func (m *Hand) IsTwoOfKind() bool {
	return m.isNOfKind(2)
}

func (m *Hand) IsFullHouse() bool {
	return m.isNOfKind(3) && m.isNOfKind(2)
}

// Sort arranges the cards in descending order based on their rank.
// The challenge is that 3 of a kind of tens beats 3 of a kind of eights, regardless of high cards
// e.g. if the high card of the three tens hand is King and the high card of the three eights hand is Jack.
// three tens beats three eights regardless of the other high cards
// This applies to 1P, 2P, 3K, 4K
// But what about full house of AATTT and KKKJJ? The KKKJJ hand wins. Because 3 kings beats 3 tens
// So we have to sort the cards with the most num consecutive cards first - e.g. AATTT becomes TTTAA
// but full house rules might be a distraction
// real algo:
//   - most 5 card combos are fine, highest value first card is winner when the rank is the same
//   - so we sort by card value and then return if straight flush, flush, straight or high card (not full house)
//   - then we get the counts of card values - if there are no 2x 3x or 4x then return
//   - the more of a kind come to the start of the hand, the less later.
//   - e.g. 4x comes before 1x even if the 1x has a higher card value
//   - e.g. 3x comes before 1x or 2x
//   - e.g. 2x comes before 1x
//   - then a special case of 2 pair where the highest value pair comes first
//
// all of this is to deal with HandRanks that are the same, but their makeup of the most significant
// part of their hand is the most important
// what about two straight flushes of same card values but different suits?
//   - nah, it is actually a draw for the same full straight that has the same card values regardless of suit

func (h *Hand) Sort() {
	sort.Slice(h.cards, func(i, j int) bool {
		return h.cards[i].Compare(h.cards[j]) > 0
	})
	//now that the are in value order, see if they have some ranks where no more processing is needed
	if h.GetRank() == StraightFlush || h.GetRank() == Flush || h.GetRank() == Straight || h.GetRank() == HighCard {
		return
	}

	//to sort by most consecutive values first, we have a notion of a partial hand
	type PartialHand struct {
		value CardValue
		count int
		cards []Card
	}

	copyCards := make([]Card, len(h.cards))
	copy(copyCards, h.cards)

	//fmt.Println(copyCards)
	partialHands := []PartialHand{}
	for ok := true; ok; ok = len(copyCards) > 0 {
		var valueCards []Card
		count := 0
		copyCards, valueCards, count = h.popAllCardsOfValue(copyCards, CardValue(copyCards[0].value))
		//fmt.Print(valueCards, count, " ")
		partialHands = append(
			partialHands,
			PartialHand{value: CardValue(valueCards[0].AceHighValue()), count: count, cards: valueCards},
		)
	}

	//then sort the partial hands by the count as priority, then by value
	sort.Slice(partialHands, func(i, j int) bool {
		if partialHands[i].count == partialHands[j].count {
			return partialHands[i].value > partialHands[j].value
		}
		return partialHands[i].count > partialHands[j].count
	})

	/*
		if h.GetRank() == OnePair {
			for _, ph := range partialHands {
				fmt.Print(ph.value, " * ", ph.count, "\t")
			}
			fmt.Println()
		}
	*/

	newCards := []Card{}
	for _, ph := range partialHands {
		newCards = append(newCards, ph.cards...)
	}
	h.cards = newCards
}

/*
	func (h *Hand) Sort() {
		// First sort by card value
		sort.Slice(h.cards, func(i, j int) bool {
			return h.cards[i].Compare(h.cards[j]) > 0
		})

		// If it's a hand type that only relies on value order, we're done
		rank := h.GetRank()
		if rank == StraightFlush || rank == Flush || rank == Straight || rank == HighCard {
			return
		}

		// Group cards by value and count
		valueGroups := make(map[CardValue][]Card)
		valueCounts := make(map[CardValue]int)

		// Build groups and counts
		for _, card := range h.cards {
			valueGroups[card.value] = append(valueGroups[card.value], card)
			valueCounts[card.value]++
		}

		// Convert to slice for sorting
		type GroupInfo struct {
			value CardValue
			count int
			cards []Card
		}

		groups := make([]GroupInfo, 0, len(valueGroups))
		for value, cards := range valueGroups {
			groups = append(groups, GroupInfo{
				value: value,
				count: valueCounts[value],
				cards: cards,
			})
		}

		// Sort groups by count (descending) and then by value (descending)
		sort.Slice(groups, func(i, j int) bool {
			if groups[i].count == groups[j].count {
				return groups[i].value > groups[j].value
			}
			return groups[i].count > groups[j].count
		})

		// Rebuild the hand
		newCards := make([]Card, 0, len(h.cards))
		for _, group := range groups {
			newCards = append(newCards, group.cards...)
		}
		h.cards = newCards
	}
*/
func CardValueMap() map[CardValue]string {
	return map[CardValue]string{
		ACE:   "A",
		TWO:   "2",
		THREE: "3",
		FOUR:  "4",
		FIVE:  "5",
		SIX:   "6",
		SEVEN: "7",
		EIGHT: "8",
		NINE:  "9",
		TEN:   "T",
		JACK:  "J",
		QUEEN: "Q",
		KING:  "K",
	}
}

func ReverseCardValueMap() map[string]CardValue {
	m := map[string]CardValue{}
	for k, v := range CardValueMap() {
		m[v] = k
	}
	return m
}

func ReverseCardSuitMap() map[string]CardSuit {
	m := map[string]CardSuit{}
	for k, v := range CardSuitMap() {
		m[v] = k
	}
	return m
}

func CardSuitMap() map[CardSuit]string {
	return map[CardSuit]string{
		HEART:   "H",
		DIAMOND: "D",
		CLUB:    "C",
		SPADE:   "S",
	}
}
func (m *Hand) ToString() string {
	if len(m.cards) == 0 {
		return "Empty Hand"
	}
	str := ""
	for _, card := range m.cards {
		str += CardValueMap()[card.value] + CardSuitMap()[card.suit] + " "
	}
	rank := m.GetRank()
	rankTxt := map[HandRank]string{
		HighCard:      "HC",
		OnePair:       "1P",
		TwoPair:       "2P",
		ThreeOfKind:   "3K",
		Straight:      "ST",
		Flush:         "FL",
		FullHouse:     "FH",
		FourOfKind:    "4K",
		StraightFlush: "SF",
	}
	str += "\t" + rankTxt[rank] + "\t"
	return str
}

func HandFromString(str string) *Hand {
	hand := &Hand{}
	strs := strings.Split(str, " ")
	for _, s := range strs {
		card := GetCardFromString(s)
		if card != nil {
			hand.AddCard(*card)
		}
	}
	return hand
}

type Player struct {
	name string
	hand Hand
}

func (m *Player) SetHand(hand Hand) {
	m.hand = hand
}

func (m *Player) SetName(name string) {
	m.name = name
}

type Deck struct {
	cards []Card
}

func (m *Deck) InitNoJokers() {
	// 52 cards, no jokers
	for i := HEART; i <= SPADE; i++ {
		for j := ACE; j <= KING; j++ {
			m.cards = append(m.cards, Card{CardSuit(i), CardValue(j)})
		}
	}
}

func (m *Deck) Deal(numCards int) Hand {
	hand := Hand{}
	for i := 0; i < numCards; i++ {
		hand.AddCard(m.cards[0])
		m.cards = m.cards[1:]
	}
	return hand
}

func (m *Deck) Shuffle() {
	// Fisher-Yates shuffle
	for i := len(m.cards) - 1; i > 0; i-- {
		j := rand.Intn(i)
		m.cards[i], m.cards[j] = m.cards[j], m.cards[i]
	}
}

func GetCardFromString(str string) *Card {
	if len(str) != 2 {
		return nil
	}

	value, okValue := ReverseCardValueMap()[string(str[0])]
	suit, okSuit := ReverseCardSuitMap()[string(str[1])]

	if !okValue || !okSuit {
		return nil
	}

	card := &Card{
		suit:  suit,
		value: value,
	}
	return card
}
