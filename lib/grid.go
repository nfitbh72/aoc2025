package eulerlib

import (
	"errors"
	"fmt"
	"strings"

	"golang.org/x/exp/slices"
)

type TRow struct {
	Values []int
}

func (m *TRow) Init() {
	m.Values = []int{}
}

func (m *TRow) InitCount(count int) {
	m.Values = make([]int, count)
}

func (m *TRow) ParseRow(rowStr string, delimiter string) {
	for _, v := range strings.Split(rowStr, delimiter) {
		m.Values = append(m.Values, StrToInt(v))
	}
}

func (m *TRow) ParseSpaceDRow(rowStr string) {
	m.ParseRow(rowStr, " ")
}

func (m *TRow) Add(i int) {
	m.Values = append(m.Values, i)
}

func (m *TRow) Copy() TRow {
	r := TRow{}
	r.InitCount(len(m.Values))
	copy(r.Values, m.Values)
	return r
}

func (m *TRow) GetMaxValue() int {
	if m.Values == nil {
		return 0
	}
	return GetMaxValue(m.Values)
}

type TTable struct {
	Rows []TRow
}

func (m *TTable) Init() {
	m.Rows = make([]TRow, 0)
}

func (m *TTable) ParseTable(lines []string, columnDelimiter string) {
	for _, line := range lines {
		r := TRow{}
		r.Init()
		r.ParseRow(line, columnDelimiter)
		m.Rows = append(m.Rows, r)
	}

}

func (m *TTable) MergeAllRows() {
	for i := 1; i < len(m.Rows); i++ {
		m.Rows[0].Values = append(m.Rows[0].Values, m.Rows[i].Values...)
		m.Rows[i].Values = make([]int, 0)
	}
}

func (m *TTable) GetSumOfMaxOfEachRow() (total int) {
	for _, r := range m.Rows {
		total += r.GetMaxValue()
	}
	return total
}

type TDirection struct {
	X int
	Y int
}

var UpDirection = &TDirection{X: 0, Y: -1}
var DownDirection = &TDirection{X: 0, Y: 1}
var LeftDirection = &TDirection{X: -1, Y: 0}
var RightDirection = &TDirection{X: 1, Y: 0}
var FailDirection = &TDirection{X: -1, Y: -1}

var DirectionToStr = map[*TDirection]string{
	UpDirection:    "up",
	DownDirection:  "down",
	LeftDirection:  "left",
	RightDirection: "right",
}

var AllDirections = []*TDirection{
	UpDirection,
	RightDirection,
	DownDirection,
	LeftDirection,
}

var TurnRight = map[*TDirection]*TDirection{
	UpDirection:    RightDirection,
	RightDirection: DownDirection,
	DownDirection:  LeftDirection,
	LeftDirection:  UpDirection,
}

type TGrid struct {
	Values [][]any
	IsInt  bool
}

func (m *TGrid) Init() {
	m.Values = make([][]any, 0)
}

func (m *TGrid) GetIntRow(rowStr string) []any {
	rowAny := make([]any, len(rowStr))
	//fmt.Println(rowStr)
	for i, v := range rowStr {
		//if !(i == 0 && v == '0') {
		rowAny[i] = RuneToInt(v)
		//}
	}
	return rowAny
}

func (m *TGrid) GetStrRow(rowStr string) []any {
	rowAny := make([]any, len(rowStr))
	for i, v := range rowStr {
		rowAny[i] = v
	}
	return rowAny
}

func (m *TGrid) ParseSpaceDTable(lines []string, forceInt bool) {
	m.IsInt = forceInt
	m.Values = make([][]any, len(lines))
	for y, line := range lines {
		vals := strings.Split(line, " ")
		m.Values[y] = make([]any, len(vals))
		for x, val := range vals {
			if m.IsInt {
				m.Values[y][x] = StrToInt(val)
			} else {
				m.Values[y][x] = val
			}
		}

	}
}

func (m *TGrid) ParseTable(lines []string, forceInt bool) {
	m.IsInt = forceInt
	for _, line := range lines {
		if forceInt {
			m.Values = append(m.Values, m.GetIntRow(line))
		} else {
			m.Values = append(m.Values, m.GetStrRow(line))
		}
	}
}

func (m *TGrid) FindElement(element any) (int, int) {
	for y, row := range m.Values {
		for x := 0; x < len(row); x++ {
			if m.Values[y][x] == element {
				return x, y
			}
		}
	}
	return -1, -1
}

func (m *TGrid) PrintString() {
	for _, row := range m.Values {
		for _, val := range row {
			if m.IsInt {
				fmt.Print(val, " ")
			} else {
				fmt.Print(string(val.(rune)), " ")
			}
			//fmt.Print(" ")
		}
		fmt.Println()
	}
}

func (m *TGrid) CreateSpiralFromCenter(sizeX, sizeY int) {
	if IsEven(sizeX) || IsEven(sizeY) {
		panic("cannot create spiral from even size")
	}
	m.Values = make([][]any, sizeY)
	//make 2d array
	for i := range m.Values { //fill with 0
		m.Values[i] = make([]any, sizeX) //make 1d array
		for j := range m.Values[i] {
			m.Values[i][j] = 0
		}
	}

	p := TGridPosition{X: sizeX / 2, Y: sizeY / 2, direction: RightDirection}
	for i := range sizeX * sizeY {
		m.Values[p.Y][p.X] = i + 1
		p.Walk()

		//if we turn right is there still a zero?
		testDirection := TurnRight[p.direction]
		//fmt.Printf("testing direction %d, %d\n", testDirection.X, testDirection.Y)
		testY := p.Y + testDirection.Y
		testX := p.X + testDirection.X
		//fmt.Printf("[%d][%d] is %d\n", testX, testY, m.Values[testY][testX])
		if testX < 0 || testY < 0 || testX >= sizeX || testY >= sizeY || m.Values[testY][testX] == 0 {
			//fmt.Println("turning right")
			p.direction = testDirection
		}
	}
}

func (m *TGrid) FlipVertical() {
	//fmt.Println("flipping")
	for i := 0; i < len(m.Values)/2; i++ {
		m.Values[i], m.Values[len(m.Values)-1-i] = m.Values[len(m.Values)-1-i], m.Values[i]
	}
}

func (m *TGrid) CreateAnticlockwiseSpiralFromCenter(sizeX, sizeY int) {
	m.CreateSpiralFromCenter(sizeX, sizeY)
	m.FlipVertical()
}

func (m *TGrid) GetDiagonals() ([]int, []int) {
	diag1 := []int{}
	diag2 := []int{}
	for i := 0; i < len(m.Values); i++ {
		diag1 = append(diag1, m.Values[i][i].(int))
		diag2 = append(diag2, m.Values[i][len(m.Values)-1-i].(int))
	}
	return diag1, diag2

}

func (m *TGrid) GetUniqueDiagonals() []int {
	diag1, diag2 := m.GetDiagonals()
	//remove middle value from diag1
	diag1 = append(diag1[:len(diag1)/2], diag1[len(diag1)/2+1:]...)
	return append(diag1, diag2...)
}

func (m *TGrid) SumDiagonals() int {
	sum := 0
	for i := 0; i < len(m.Values); i++ {
		sum += m.Values[i][i].(int)
		sum += m.Values[len(m.Values)-1-i][i].(int)
	}
	sum -= m.Values[len(m.Values)/2][len(m.Values)/2].(int)
	return sum
}

type TValuePos struct {
	Locations [][]int
	Count     int
	Value     any
}

// WTF does this do?
func (m *TGrid) GetAllUniqueValues() map[any]*TValuePos {
	valuePositions := make(map[any]*TValuePos)
	for y, row := range m.Values {
		for x, value := range row {
			vp, ok := valuePositions[value]
			if !ok {
				newVp := &TValuePos{Locations: [][]int{{x, y}}, Count: 1, Value: value}
				valuePositions[value] = newVp
			} else {
				//fmt.Println("updating", value, "to map")
				vp.Count++
				vp.Locations = append(vp.Locations, []int{x, y})
			}
		}
	}
	return valuePositions
}

func (m *TGrid) WalkFromWithBlocker(gp *TGridPosition, blockingCharacter rune) (*TGridPosition, error) {
	currentGridPos := TGridPosition{}
	currentGridPos.X = gp.X
	currentGridPos.Y = gp.Y
	currentGridPos.direction = gp.direction
	err := m.WalkFrom(gp)
	//fmt.Println(gp)
	if err != nil {
		return &currentGridPos, err
	}
	//fmt.Println("comparing", m.GetValue(gp), blockingCharacter)
	if m.GetValue(gp) == blockingCharacter {
		return &currentGridPos, errors.New("blocked")
	}
	return gp, nil
}

func (m *TGrid) WalkFrom(gp *TGridPosition) error {
	gp.Walk()
	//fmt.Println("Y", gp.Y, len(m.Values))
	if gp.X < 0 || gp.Y < 0 || gp.Y >= len(m.Values) || gp.X >= len(m.Values[0]) {
		return errors.New("out of bounds of grid")
	}
	return nil
}

func (m *TGrid) GetValue(gp *TGridPosition) any {
	return m.Values[gp.Y][gp.X]
}

func (m *TGrid) SetValue(x, y int, v any) {
	m.Values[y][x] = v
}

func (m *TGrid) CountValues(v any) int {
	valueCount := 0
	for _, row := range m.Values {
		for _, val := range row {
			if val == v {
				valueCount++
			}
		}
	}
	return valueCount
}

func (m *TGrid) SearchHorizantal(s string) int {
	sReverse := ReverseString(s)
	numCount := 0
	for y := 0; y < len(m.Values); y++ {
		for x := len(s) - 1; x < len(m.Values[0]); x++ {
			found := ""
			minX := 10
			maxX := 0

			for i := -len(s) + 1; i <= 0; i++ {
				if x+i < minX {
					minX = x + i
				}
				if x+i > maxX {
					maxX = x + i
				}
				chr, _ := m.Values[y][x+i].(rune)
				//fmt.Print(i, chr)
				found = found + string(chr)
			}
			//fmt.Println("horiz min/max", minX, maxX)
			//fmt.Println()
			//fmt.Println(found)
			if found == s || found == sReverse {
				numCount++
			}
		}
	}
	return numCount
}

func (m *TGrid) SearchVertical(s string) int {
	sReverse := ReverseString(s)
	numCount := 0
	for x := 0; x < len(m.Values[0]); x++ {
		for y := len(s) - 1; y < len(m.Values); y++ {
			found := ""
			minX := 10
			maxX := 0
			for i := -len(s) + 1; i <= 0; i++ {
				if x < minX {
					minX = x
				}
				if x > maxX {
					maxX = x
				}

				chr, _ := m.Values[y+i][x].(rune)
				//fmt.Print(i, chr)
				found = found + string(chr)
			}
			//fmt.Println("vert min/max", minX, maxX)
			//fmt.Println()
			//fmt.Println(found)
			if found == s || found == sReverse {
				numCount++
			}
		}
	}
	return numCount
}

func (m *TGrid) SearchDiagonal(s string) int {
	sReverse := ReverseString(s)
	numCount := 0
	for x := len(s) - 1; x < len(m.Values[0]); x++ {
		for y := len(s) - 1; y < len(m.Values); y++ {
			found := ""
			minX := 10
			maxX := 0
			for i := -len(s) + 1; i <= 0; i++ {
				if y+i < minX {
					minX = y + i
				}
				if y+i > maxX {
					maxX = y + i
				}
				//fmt.Println("v1", y+i, x+i)
				//fmt.Print("v1 ", y+i, x+i, "  ")
				chr, _ := m.Values[y+i][x+i].(rune)
				//fmt.Print(i, chr)
				found = found + string(chr)
			}
			//fmt.Println("v1 min/max", minX, maxX)
			//fmt.Println()
			//fmt.Println(found)
			if found == s || found == sReverse {
				numCount++
			}
		}
	}
	//fmt.Println("search x from", len(m.Values[0])-1, "to", len(s)-1, "inclusive")
	//fmt.Println("search y from", len(s)-1, "to", len(m.Values))

	for x := len(m.Values[0]) - 1; x >= len(s)-1; x-- {
		for y := len(s) - 1; y < len(m.Values); y++ {
			found := ""
			minX := 10
			maxX := 0
			for i := -len(s) + 1; i <= 0; i++ {
				if y+i < minX {
					minX = y + i
				}
				if y+i > maxX {
					maxX = y + i
				}
				//fmt.Print("v2 ", y+i, len(m.Values[0])-(x+i)-1, "  ")
				chr, _ := m.Values[y+i][len(m.Values[0])-(x+i)-1].(rune)
				//fmt.Print(i, string(chr))
				found = found + string(chr)
			}
			//fmt.Println()
			//fmt.Println("v2 min/max", minX, maxX)

			if found == s || found == sReverse {
				//fmt.Println(found)
				numCount++
			}
		}
	}

	return numCount
}

func (m *TGrid) GetAllHorizontal(numLetters int) [][]any {
	allWords := make([][]any, 0)
	for y := 0; y < len(m.Values); y++ {
		for x := numLetters - 1; x < len(m.Values[0]); x++ {
			word := make([]any, numLetters)
			for i := 0; i < numLetters; i++ {
				//fmt.Println(x-(numLetters-i)+1, y, m.Values[y][x-(numLetters-i)+1])
				word[i] = m.Values[y][x-(numLetters-i)+1]
			}
			allWords = append(allWords, word)
			wordReverse := make([]any, numLetters)
			copy(wordReverse, word)
			slices.Reverse(wordReverse)
			allWords = append(allWords, wordReverse)
			//fmt.Println(word)
			//m.PrintString()

		}
	}
	return allWords
}

func (m *TGrid) GetAllVertical(numLetters int) [][]any {
	allWords := make([][]any, 0)
	for x := 0; x < len(m.Values[0]); x++ {
		for y := numLetters - 1; y < len(m.Values); y++ {
			word := make([]any, numLetters)
			for i := 0; i < numLetters; i++ {
				word[i] = m.Values[y-(numLetters-i)+1][x]
			}
			allWords = append(allWords, word)
			wordReverse := make([]any, numLetters)
			copy(wordReverse, word)
			slices.Reverse(wordReverse)
			allWords = append(allWords, wordReverse)

		}
	}
	return allWords
}

func (m *TGrid) GetAllDiagonal1(numLetters int) [][]any {
	allWords := make([][]any, 0)
	for x := numLetters - 1; x < len(m.Values[0]); x++ {
		for y := numLetters - 1; y < len(m.Values); y++ {
			word := make([]any, numLetters)
			for i := 0; i < numLetters; i++ {
				word[i] = m.Values[y-(numLetters-i)+1][x-(numLetters-i)+1]
			}
			allWords = append(allWords, word)
			wordReverse := make([]any, numLetters)
			copy(wordReverse, word)
			slices.Reverse(wordReverse)
			allWords = append(allWords, wordReverse)

		}
	}
	return allWords
}

func (m *TGrid) GetAllDiagonal2(numLetters int) [][]any {
	allWords := make([][]any, 0)
	for x := 0; x < len(m.Values[0])-numLetters+1; x++ {
		for y := len(m.Values); y > numLetters-1; y-- {
			//fmt.Println("x, y:", x, y)
			word := make([]any, numLetters)
			for i := 0; i < numLetters; i++ {
				word[i] = m.Values[y-(numLetters-i)][x+(numLetters-i)-1]
			}
			allWords = append(allWords, word)
			wordReverse := make([]any, numLetters)
			copy(wordReverse, word)
			slices.Reverse(wordReverse)
			allWords = append(allWords, wordReverse)
			//fmt.Println(word)
			//os.Exit(1)
		}
	}
	return allWords
}

func (m *TGrid) GetAllWords(numChrs int) [][]any {
	words := m.GetAllHorizontal(numChrs)
	words = append(words, m.GetAllVertical(numChrs)...)
	words = append(words, m.GetAllDiagonal1(numChrs)...)
	words = append(words, m.GetAllDiagonal2(numChrs)...)
	return words
}

type TGridPosition struct {
	X         int
	Y         int
	direction *TDirection
}

func (m *TGridPosition) ToString() string {
	return fmt.Sprintf("%d, %d: %s", m.X, m.Y, DirectionToStr[m.direction])
}

func (m *TGridPosition) Walk() {
	m.X += m.direction.X
	m.Y += m.direction.Y
}

func (m *TGridPosition) NextPos() (int, int) {
	return m.X + m.direction.X, m.Y + m.direction.Y
}

func (m *TGridPosition) ChangeDirection(direction *TDirection) {
	m.direction = direction
}
