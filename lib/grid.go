package eulerlib

import (
	"errors"
	"fmt"
	"strings"

	"golang.org/x/exp/slices"
)

// TRow represents a single row of integer values in a table.
type TRow struct {
	Values []int
}

// Init clears the row and prepares it for use.
func (m *TRow) Init() {
	m.Values = []int{}
}

// InitCount initialises the row with a fixed number of zero values.
func (m *TRow) InitCount(count int) {
	m.Values = make([]int, count)
}

// ParseRow splits the input string on delimiter and appends the parsed ints to
// the row.
func (m *TRow) ParseRow(rowStr string, delimiter string) {
	for _, v := range strings.Split(rowStr, delimiter) {
		m.Values = append(m.Values, StrToInt(v))
	}
}

// ParseSpaceDRow parses a space-delimited row of integers.
func (m *TRow) ParseSpaceDRow(rowStr string) {
	m.ParseRow(rowStr, " ")
}

// Add appends a single integer value to the row.
func (m *TRow) Add(i int) {
	m.Values = append(m.Values, i)
}

// Copy returns a deep copy of the row.
func (m *TRow) Copy() TRow {
	r := TRow{}
	r.InitCount(len(m.Values))
	copy(r.Values, m.Values)
	return r
}

// GetMaxValue returns the largest value in the row, or 0 if the row is empty
// or uninitialised.
func (m *TRow) GetMaxValue() int {
	if m.Values == nil {
		return 0
	}
	return GetMaxValue(m.Values)
}

// TTable represents a simple table of integer rows.
type TTable struct {
	Rows []TRow
}

// Init clears the table and prepares it for use.
func (m *TTable) Init() {
	m.Rows = make([]TRow, 0)
}

// ParseTable converts lines of delimited integers into table rows.
func (m *TTable) ParseTable(lines []string, columnDelimiter string) {
	for _, line := range lines {
		r := TRow{}
		r.Init()
		r.ParseRow(line, columnDelimiter)
		m.Rows = append(m.Rows, r)
	}

}

// MergeAllRows concatenates all rows into the first row and clears the rest.
func (m *TTable) MergeAllRows() {
	for i := 1; i < len(m.Rows); i++ {
		m.Rows[0].Values = append(m.Rows[0].Values, m.Rows[i].Values...)
		m.Rows[i].Values = make([]int, 0)
	}
}

// GetSumOfMaxOfEachRow returns the sum of the maximum value from each row.
func (m *TTable) GetSumOfMaxOfEachRow() (total int) {
	for _, r := range m.Rows {
		total += r.GetMaxValue()
	}
	return total
}

// TDirection represents a unit step in grid coordinates.
type TDirection struct {
	X int
	Y int
}

var UpDirection = &TDirection{X: 0, Y: -1}
var DownDirection = &TDirection{X: 0, Y: 1}
var LeftDirection = &TDirection{X: -1, Y: 0}
var RightDirection = &TDirection{X: 1, Y: 0}
var FailDirection = &TDirection{X: -1, Y: -1}

// DirectionToStr maps the canonical direction pointers to human-readable
// labels.
var DirectionToStr = map[*TDirection]string{
	UpDirection:    "up",
	DownDirection:  "down",
	LeftDirection:  "left",
	RightDirection: "right",
}

// AllDirections lists the four cardinal directions in clockwise order.
var AllDirections = []*TDirection{
	UpDirection,
	RightDirection,
	DownDirection,
	LeftDirection,
}

// TurnRight provides a right-turn mapping for the four canonical directions.
var TurnRight = map[*TDirection]*TDirection{
	UpDirection:    RightDirection,
	RightDirection: DownDirection,
	DownDirection:  LeftDirection,
	LeftDirection:  UpDirection,
}

// TGrid represents a 2D grid of values, optionally tagged as integer data.
type TGrid struct {
	Values [][]any
	IsInt  bool
}

// Init clears the grid and prepares it for use.
func (m *TGrid) Init() {
	m.Values = make([][]any, 0)
}

// GetIntRow converts a string of digit runes into a row of integer values.
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

// GetStrRow converts a string into a row of rune values.
func (m *TGrid) GetStrRow(rowStr string) []any {
	rowAny := make([]any, len(rowStr))
	for i, v := range rowStr {
		rowAny[i] = v
	}
	return rowAny
}

// ParseSpaceDTable parses space-delimited values into the grid, optionally as
// ints when forceInt is true.
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

// ParseTable parses each input line as either raw runes or digits, depending
// on forceInt.
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

// FindElement scans the grid and returns the coordinates of the first cell
// equal to element, or (-1, -1) if not found.
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

// ToString renders the grid as a human-readable multi-line string.
func (m *TGrid) ToString() string {
	var sb strings.Builder
	for _, row := range m.Values {
		for _, val := range row {
			if m.IsInt {
				fmt.Fprintf(&sb, "%v ", val)
			} else {
				sb.WriteRune(val.(rune))
				sb.WriteByte(' ')
			}
			//fmt.Print(" ")
		}
		sb.WriteByte('\n')
	}
	return sb.String()
}

// CreateSpiralFromCenter builds a clockwise spiral of integers starting at 1 in
// the center of an odd-sized grid and walking outward until all cells are
// filled.
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

	p := TGridPosition{X: sizeX / 2, Y: sizeY / 2, Direction: RightDirection}
	for i := range sizeX * sizeY {
		m.Values[p.Y][p.X] = i + 1
		p.Walk()

		//if we turn right is there still a zero?
		testDirection := TurnRight[p.Direction]
		//fmt.Printf("testing direction %d, %d\n", testDirection.X, testDirection.Y)
		testY := p.Y + testDirection.Y
		testX := p.X + testDirection.X
		//fmt.Printf("[%d][%d] is %d\n", testX, testY, m.Values[testY][testX])
		if testX < 0 || testY < 0 || testX >= sizeX || testY >= sizeY || m.Values[testY][testX] == 0 {
			//fmt.Println("turning right")
			p.Direction = testDirection
		}
	}
}

// FlipVertical reverses the order of rows in the grid, mirroring it
// vertically.
func (m *TGrid) FlipVertical() {
	//fmt.Println("flipping")
	for i := 0; i < len(m.Values)/2; i++ {
		m.Values[i], m.Values[len(m.Values)-1-i] = m.Values[len(m.Values)-1-i], m.Values[i]
	}
}

// CreateAnticlockwiseSpiralFromCenter creates a spiral like
// CreateSpiralFromCenter, then vertically flips the grid so the spiral winds
// in the opposite (anticlockwise) direction when viewed from the top-left.
func (m *TGrid) CreateAnticlockwiseSpiralFromCenter(sizeX, sizeY int) {
	m.CreateSpiralFromCenter(sizeX, sizeY)
	m.FlipVertical()
}

// GetDiagonals returns the primary (top-left to bottom-right) and secondary
// (top-right to bottom-left) diagonals from a square integer grid.
func (m *TGrid) GetDiagonals() ([]int, []int) {
	diag1 := []int{}
	diag2 := []int{}
	for i := 0; i < len(m.Values); i++ {
		diag1 = append(diag1, m.Values[i][i].(int))
		diag2 = append(diag2, m.Values[i][len(m.Values)-1-i].(int))
	}
	return diag1, diag2

}

// GetUniqueDiagonals returns all diagonal values without double-counting the
// center element by removing it from the primary diagonal before combining.
func (m *TGrid) GetUniqueDiagonals() []int {
	diag1, diag2 := m.GetDiagonals()
	//remove middle value from diag1
	diag1 = append(diag1[:len(diag1)/2], diag1[len(diag1)/2+1:]...)
	return append(diag1, diag2...)
}

// SumDiagonals returns the sum of both diagonals of a square integer grid,
// subtracting the middle element once so it is not double-counted.
func (m *TGrid) SumDiagonals() int {
	sum := 0
	for i := 0; i < len(m.Values); i++ {
		sum += m.Values[i][i].(int)
		sum += m.Values[len(m.Values)-1-i][i].(int)
	}
	sum -= m.Values[len(m.Values)/2][len(m.Values)/2].(int)
	return sum
}

// TValuePos stores value occurrence metadata: how many times a value appears
// in the grid and at which coordinates.
type TValuePos struct {
	Locations [][]int
	Count     int
	Value     any
}

// GetAllUniqueValues scans the grid and returns a map from each distinct value
// to its TValuePos, which contains the total count and all (x, y) locations
// where that value appears.
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

// WalkFromWithBlocker moves one step from the given grid position and checks
// for a blocking character. It returns either the updated position or, if the
// move goes out of bounds or hits the blocking character, the last valid
// position along with a non-nil error.
func (m *TGrid) WalkFromWithBlocker(gp *TGridPosition, blockingCharacter rune) (*TGridPosition, error) {
	currentGridPos := TGridPosition{}
	currentGridPos.X = gp.X
	currentGridPos.Y = gp.Y
	currentGridPos.Direction = gp.Direction
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

// WalkFrom advances the grid position one step in its current direction and
// returns an error if the new position lies outside the grid bounds.
func (m *TGrid) WalkFrom(gp *TGridPosition) error {
	gp.Walk()
	//fmt.Println("Y", gp.Y, len(m.Values))
	if gp.X < 0 || gp.Y < 0 || gp.Y >= len(m.Values) || gp.X >= len(m.Values[0]) {
		return errors.New("out of bounds of grid")
	}
	return nil
}

// GetValue returns the value at the specified grid position.
func (m *TGrid) GetValue(gp *TGridPosition) any {
	return m.Values[gp.Y][gp.X]
}

// SetValue assigns a value at the given coordinates in the grid.
func (m *TGrid) SetValue(x, y int, v any) {
	m.Values[y][x] = v
}

// CountValues counts how many grid cells are equal to v.
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

// GetAdjacentCount counts how many of the (up to) 8 surrounding cells at
// position (x, y) contain the specified character.
func (m *TGrid) GetAdjacentCount(x, y int, char rune) int {
	count := 0
	// Define the 8 adjacent directions: up, down, left, right, and 4 diagonals
	directions := [][]int{
		{-1, -1}, {0, -1}, {1, -1}, // top-left, top, top-right
		{-1, 0}, {1, 0}, // left, right
		{-1, 1}, {0, 1}, {1, 1}, // bottom-left, bottom, bottom-right
	}

	for _, dir := range directions {
		newX := x + dir[0]
		newY := y + dir[1]
		// Check bounds
		if newX >= 0 && newX < len(m.Values[0]) && newY >= 0 && newY < len(m.Values) {
			if val, ok := m.Values[newY][newX].(rune); ok && val == char {
				count++
			}
		}
	}
	return count
}

// GetAdjacentList returns the coordinates [x, y] of all (up to) 8 surrounding
// cells at position (x, y) that contain the specified character.
func (m *TGrid) GetAdjacentList(x, y int, char rune) [][]int {
	matches := [][]int{}
	// Define the 8 adjacent directions: up, down, left, right, and 4 diagonals
	directions := [][]int{
		{-1, -1}, {0, -1}, {1, -1}, // top-left, top, top-right
		{-1, 0}, {1, 0}, // left, right
		{-1, 1}, {0, 1}, {1, 1}, // bottom-left, bottom, bottom-right
	}

	for _, dir := range directions {
		newX := x + dir[0]
		newY := y + dir[1]
		// Check bounds
		if newX >= 0 && newX < len(m.Values[0]) && newY >= 0 && newY < len(m.Values) {
			if val, ok := m.Values[newY][newX].(rune); ok && val == char {
				matches = append(matches, []int{newX, newY})
			}
		}
	}
	return matches
}

// SearchHorizantal counts how many times the given string appears left-to-right
// or right-to-left in any row of the grid.
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

// SearchVertical counts how many times the given string appears top-to-bottom
// or bottom-to-top in any column of the grid.
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

// SearchDiagonal counts how many times the given string appears along any
// diagonal in the grid, scanning both diagonal directions and allowing
// forward or reversed matches.
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

// GetAllHorizontal returns every contiguous horizontal slice of length
// numLetters in the grid, plus the reversed version of each slice.
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

// GetAllVertical returns every contiguous vertical slice of length numLetters
// in the grid, plus the reversed version of each slice.
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

// GetAllDiagonal1 returns all contiguous diagonal slices of length numLetters
// running top-left to bottom-right, plus the reversed version of each slice.
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

// GetAllDiagonal2 returns all contiguous diagonal slices of length numLetters
// running top-right to bottom-left, plus the reversed version of each slice.
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

// GetAllWords aggregates all horizontal, vertical, and diagonal slices of a
// fixed length numChrs so callers can search across every direction at once.
func (m *TGrid) GetAllWords(numChrs int) [][]any {
	words := m.GetAllHorizontal(numChrs)
	words = append(words, m.GetAllVertical(numChrs)...)
	words = append(words, m.GetAllDiagonal1(numChrs)...)
	words = append(words, m.GetAllDiagonal2(numChrs)...)
	return words
}

// TGridPosition represents a location and direction within a grid.
type TGridPosition struct {
	X         int
	Y         int
	Direction *TDirection
}

// ToString returns a human-readable representation of the grid position and
// direction.
func (m *TGridPosition) ToString() string {
	return fmt.Sprintf("%d, %d: %s", m.X, m.Y, DirectionToStr[m.Direction])
}

// Walk advances the position by one step in its current direction.
func (m *TGridPosition) Walk() {
	m.X += m.Direction.X
	m.Y += m.Direction.Y
}

// NextPos returns the coordinates of the cell one step ahead in the current
// direction.
func (m *TGridPosition) NextPos() (int, int) {
	return m.X + m.Direction.X, m.Y + m.Direction.Y
}

// ChangeDirection updates the direction of travel for the grid position.
func (m *TGridPosition) ChangeDirection(direction *TDirection) {
	m.Direction = direction
}
