package eulerlib

import (
	"fmt"
	"math"
	"testing"
)

// ============================================================================
// ThreedCoord Tests
// ============================================================================

func TestThreedCoord_EuclideanDistance(t *testing.T) {
	tests := []struct {
		name     string
		coord1   ThreedCoord
		coord2   ThreedCoord
		expected float64
	}{
		{
			name:     "same point",
			coord1:   ThreedCoord{X: 0, Y: 0, Z: 0},
			coord2:   ThreedCoord{X: 0, Y: 0, Z: 0},
			expected: 0,
		},
		{
			name:     "unit distance on X axis",
			coord1:   ThreedCoord{X: 0, Y: 0, Z: 0},
			coord2:   ThreedCoord{X: 1, Y: 0, Z: 0},
			expected: 1,
		},
		{
			name:     "unit distance on Y axis",
			coord1:   ThreedCoord{X: 0, Y: 0, Z: 0},
			coord2:   ThreedCoord{X: 0, Y: 1, Z: 0},
			expected: 1,
		},
		{
			name:     "unit distance on Z axis",
			coord1:   ThreedCoord{X: 0, Y: 0, Z: 0},
			coord2:   ThreedCoord{X: 0, Y: 0, Z: 1},
			expected: 1,
		},
		{
			name:     "3D diagonal - simple",
			coord1:   ThreedCoord{X: 0, Y: 0, Z: 0},
			coord2:   ThreedCoord{X: 1, Y: 1, Z: 1},
			expected: math.Sqrt(3),
		},
		{
			name:     "3D diagonal - complex",
			coord1:   ThreedCoord{X: 1, Y: 2, Z: 3},
			coord2:   ThreedCoord{X: 4, Y: 6, Z: 8},
			expected: math.Sqrt(9 + 16 + 25), // sqrt(50)
		},
		{
			name:     "negative coordinates",
			coord1:   ThreedCoord{X: -5, Y: -3, Z: -1},
			coord2:   ThreedCoord{X: 5, Y: 3, Z: 1},
			expected: math.Sqrt(100 + 36 + 4), // sqrt(140)
		},
		{
			name:     "large coordinates",
			coord1:   ThreedCoord{X: 216, Y: 146, Z: 977},
			coord2:   ThreedCoord{X: 117, Y: 168, Z: 530},
			expected: math.Sqrt(9801 + 484 + 199809), // sqrt(210094)
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := tt.coord1.EuclideanDistance(&tt.coord2)
			if math.Abs(result-tt.expected) > 0.0001 {
				t.Errorf("EuclideanDistance() = %v, want %v", result, tt.expected)
			}
		})
	}
}

func TestThreedCoord_IsEqual(t *testing.T) {
	tests := []struct {
		name     string
		coord1   *ThreedCoord
		coord2   *ThreedCoord
		expected bool
	}{
		{
			name:     "equal coordinates",
			coord1:   &ThreedCoord{X: 1, Y: 2, Z: 3},
			coord2:   &ThreedCoord{X: 1, Y: 2, Z: 3},
			expected: true,
		},
		{
			name:     "different X",
			coord1:   &ThreedCoord{X: 1, Y: 2, Z: 3},
			coord2:   &ThreedCoord{X: 2, Y: 2, Z: 3},
			expected: false,
		},
		{
			name:     "different Y",
			coord1:   &ThreedCoord{X: 1, Y: 2, Z: 3},
			coord2:   &ThreedCoord{X: 1, Y: 3, Z: 3},
			expected: false,
		},
		{
			name:     "different Z",
			coord1:   &ThreedCoord{X: 1, Y: 2, Z: 3},
			coord2:   &ThreedCoord{X: 1, Y: 2, Z: 4},
			expected: false,
		},
		{
			name:     "nil first coordinate",
			coord1:   nil,
			coord2:   &ThreedCoord{X: 1, Y: 2, Z: 3},
			expected: false,
		},
		{
			name:     "nil second coordinate",
			coord1:   &ThreedCoord{X: 1, Y: 2, Z: 3},
			coord2:   nil,
			expected: false,
		},
		{
			name:     "both nil",
			coord1:   nil,
			coord2:   nil,
			expected: false,
		},
		{
			name:     "negative coordinates equal",
			coord1:   &ThreedCoord{X: -5, Y: -10, Z: -15},
			coord2:   &ThreedCoord{X: -5, Y: -10, Z: -15},
			expected: true,
		},
		{
			name:     "zero coordinates",
			coord1:   &ThreedCoord{X: 0, Y: 0, Z: 0},
			coord2:   &ThreedCoord{X: 0, Y: 0, Z: 0},
			expected: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := tt.coord1.IsEqual(tt.coord2)
			if result != tt.expected {
				t.Errorf("IsEqual() = %v, want %v", result, tt.expected)
			}
		})
	}
}

// ============================================================================
// ThreedCoords Tests
// ============================================================================

func TestThreedCoords_GetAllDistances(t *testing.T) {
	tests := []struct {
		name          string
		coords        ThreedCoords
		expectedCount int
		checkFirst    bool
		firstFrom     ThreedCoord
		firstTo       ThreedCoord
	}{
		{
			name:          "empty coords",
			coords:        ThreedCoords{},
			expectedCount: 0,
		},
		{
			name:          "single coord",
			coords:        ThreedCoords{{X: 0, Y: 0, Z: 0}},
			expectedCount: 0,
		},
		{
			name: "two coords",
			coords: ThreedCoords{
				{X: 0, Y: 0, Z: 0},
				{X: 1, Y: 0, Z: 0},
			},
			expectedCount: 2, // both directions
			checkFirst:    true,
			firstFrom:     ThreedCoord{X: 0, Y: 0, Z: 0},
			firstTo:       ThreedCoord{X: 1, Y: 0, Z: 0},
		},
		{
			name: "three coords",
			coords: ThreedCoords{
				{X: 0, Y: 0, Z: 0},
				{X: 1, Y: 0, Z: 0},
				{X: 0, Y: 1, Z: 0},
			},
			expectedCount: 6, // 3 * 2 = 6 (all pairs, both directions)
		},
		{
			name: "four coords",
			coords: ThreedCoords{
				{X: 0, Y: 0, Z: 0},
				{X: 1, Y: 0, Z: 0},
				{X: 0, Y: 1, Z: 0},
				{X: 0, Y: 0, Z: 1},
			},
			expectedCount: 12, // 4 * 3 = 12
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := tt.coords.GetAllDistances()
			if len(result) != tt.expectedCount {
				t.Errorf("GetAllDistances() returned %d distances, want %d", len(result), tt.expectedCount)
			}

			if tt.checkFirst && len(result) > 0 {
				if !result[0].From.IsEqual(&tt.firstFrom) {
					t.Errorf("First distance From = %v, want %v", result[0].From, tt.firstFrom)
				}
				if !result[0].To.IsEqual(&tt.firstTo) {
					t.Errorf("First distance To = %v, want %v", result[0].To, tt.firstTo)
				}
			}

			// verify no self-distances
			for i, d := range result {
				if d.From.IsEqual(d.To) {
					t.Errorf("Distance %d is a self-distance: %v", i, d)
				}
			}
		})
	}
}

func TestThreedCoords_GetUniqueDistances(t *testing.T) {
	tests := []struct {
		name          string
		coords        ThreedCoords
		expectedCount int
	}{
		{
			name:          "empty coords",
			coords:        ThreedCoords{},
			expectedCount: 0,
		},
		{
			name:          "single coord",
			coords:        ThreedCoords{{X: 0, Y: 0, Z: 0}},
			expectedCount: 0,
		},
		{
			name: "two coords",
			coords: ThreedCoords{
				{X: 0, Y: 0, Z: 0},
				{X: 1, Y: 0, Z: 0},
			},
			expectedCount: 1, // only one direction
		},
		{
			name: "three coords",
			coords: ThreedCoords{
				{X: 0, Y: 0, Z: 0},
				{X: 1, Y: 0, Z: 0},
				{X: 0, Y: 1, Z: 0},
			},
			expectedCount: 3, // 3 choose 2 = 3
		},
		{
			name: "four coords",
			coords: ThreedCoords{
				{X: 0, Y: 0, Z: 0},
				{X: 1, Y: 0, Z: 0},
				{X: 0, Y: 1, Z: 0},
				{X: 0, Y: 0, Z: 1},
			},
			expectedCount: 6, // 4 choose 2 = 6
		},
		{
			name: "five coords",
			coords: ThreedCoords{
				{X: 0, Y: 0, Z: 0},
				{X: 1, Y: 0, Z: 0},
				{X: 0, Y: 1, Z: 0},
				{X: 0, Y: 0, Z: 1},
				{X: 1, Y: 1, Z: 1},
			},
			expectedCount: 10, // 5 choose 2 = 10
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := tt.coords.GetUniqueDistances()
			if len(result) != tt.expectedCount {
				t.Errorf("GetUniqueDistances() returned %d distances, want %d", len(result), tt.expectedCount)
			}

			// verify no duplicates (no reverse pairs)
			seen := make(map[string]bool)
			for _, d := range result {
				// create a normalized key
				key1 := coordKey(d.From, d.To)
				key2 := coordKey(d.To, d.From)

				if seen[key1] || seen[key2] {
					t.Errorf("Found duplicate pair: %v <-> %v", d.From, d.To)
				}
				seen[key1] = true
				seen[key2] = true
			}

			// verify no self-distances
			for i, d := range result {
				if d.From.IsEqual(d.To) {
					t.Errorf("Distance %d is a self-distance: %v", i, d)
				}
			}
		})
	}
}

// helper function for testing
func coordKey(c1, c2 *ThreedCoord) string {
	return fmt.Sprintf("%d,%d,%d-%d,%d,%d", c1.X, c1.Y, c1.Z, c2.X, c2.Y, c2.Z)
}

// ============================================================================
// ThreedDistances Tests
// ============================================================================

func TestThreedDistances_SortByDistance(t *testing.T) {
	tests := []struct {
		name      string
		distances ThreedDistances
		wantOrder []float64
	}{
		{
			name:      "empty",
			distances: ThreedDistances{},
			wantOrder: []float64{},
		},
		{
			name: "already sorted",
			distances: ThreedDistances{
				{From: &ThreedCoord{X: 0, Y: 0, Z: 0}, To: &ThreedCoord{X: 1, Y: 0, Z: 0}, Distance: 1.0},
				{From: &ThreedCoord{X: 0, Y: 0, Z: 0}, To: &ThreedCoord{X: 2, Y: 0, Z: 0}, Distance: 2.0},
				{From: &ThreedCoord{X: 0, Y: 0, Z: 0}, To: &ThreedCoord{X: 3, Y: 0, Z: 0}, Distance: 3.0},
			},
			wantOrder: []float64{1.0, 2.0, 3.0},
		},
		{
			name: "reverse sorted",
			distances: ThreedDistances{
				{From: &ThreedCoord{X: 0, Y: 0, Z: 0}, To: &ThreedCoord{X: 3, Y: 0, Z: 0}, Distance: 3.0},
				{From: &ThreedCoord{X: 0, Y: 0, Z: 0}, To: &ThreedCoord{X: 2, Y: 0, Z: 0}, Distance: 2.0},
				{From: &ThreedCoord{X: 0, Y: 0, Z: 0}, To: &ThreedCoord{X: 1, Y: 0, Z: 0}, Distance: 1.0},
			},
			wantOrder: []float64{1.0, 2.0, 3.0},
		},
		{
			name: "random order",
			distances: ThreedDistances{
				{From: &ThreedCoord{X: 0, Y: 0, Z: 0}, To: &ThreedCoord{X: 2, Y: 0, Z: 0}, Distance: 2.0},
				{From: &ThreedCoord{X: 0, Y: 0, Z: 0}, To: &ThreedCoord{X: 5, Y: 0, Z: 0}, Distance: 5.0},
				{From: &ThreedCoord{X: 0, Y: 0, Z: 0}, To: &ThreedCoord{X: 1, Y: 0, Z: 0}, Distance: 1.0},
				{From: &ThreedCoord{X: 0, Y: 0, Z: 0}, To: &ThreedCoord{X: 3, Y: 0, Z: 0}, Distance: 3.0},
			},
			wantOrder: []float64{1.0, 2.0, 3.0, 5.0},
		},
		{
			name: "with duplicates",
			distances: ThreedDistances{
				{From: &ThreedCoord{X: 0, Y: 0, Z: 0}, To: &ThreedCoord{X: 2, Y: 0, Z: 0}, Distance: 2.0},
				{From: &ThreedCoord{X: 0, Y: 0, Z: 0}, To: &ThreedCoord{X: 1, Y: 0, Z: 0}, Distance: 1.0},
				{From: &ThreedCoord{X: 0, Y: 0, Z: 0}, To: &ThreedCoord{X: 2, Y: 0, Z: 0}, Distance: 2.0},
				{From: &ThreedCoord{X: 0, Y: 0, Z: 0}, To: &ThreedCoord{X: 1, Y: 0, Z: 0}, Distance: 1.0},
			},
			wantOrder: []float64{1.0, 1.0, 2.0, 2.0},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := tt.distances.SortByDistance()
			if len(*result) != len(tt.wantOrder) {
				t.Errorf("SortByDistance() returned %d distances, want %d", len(*result), len(tt.wantOrder))
			}

			for i, want := range tt.wantOrder {
				if (*result)[i].Distance != want {
					t.Errorf("Distance[%d] = %v, want %v", i, (*result)[i].Distance, want)
				}
			}
		})
	}
}

// ============================================================================
// ThreedCircuit Tests
// ============================================================================

func TestThreedCircuit_Add(t *testing.T) {
	tests := []struct {
		name           string
		initialCoord   ThreedCoord
		coordsToAdd    []ThreedCoord
		expectedLength int
	}{
		{
			name:           "add one coord",
			initialCoord:   ThreedCoord{X: 0, Y: 0, Z: 0},
			coordsToAdd:    []ThreedCoord{{X: 1, Y: 0, Z: 0}},
			expectedLength: 2,
		},
		{
			name:         "add multiple coords",
			initialCoord: ThreedCoord{X: 0, Y: 0, Z: 0},
			coordsToAdd: []ThreedCoord{
				{X: 1, Y: 0, Z: 0},
				{X: 2, Y: 0, Z: 0},
				{X: 3, Y: 0, Z: 0},
			},
			expectedLength: 4,
		},
		{
			name:           "add no coords",
			initialCoord:   ThreedCoord{X: 0, Y: 0, Z: 0},
			coordsToAdd:    []ThreedCoord{},
			expectedLength: 1,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			circuit := ThreedCircuit{Start: &tt.initialCoord}
			for _, coord := range tt.coordsToAdd {
				c := coord // create a copy
				circuit.Add(&c)
			}

			length := circuit.GetLength()
			if length != tt.expectedLength {
				t.Errorf("Circuit length = %d, want %d", length, tt.expectedLength)
			}
		})
	}
}

func TestThreedCircuit_IsInCircuit(t *testing.T) {
	coord1 := ThreedCoord{X: 0, Y: 0, Z: 0}
	coord2 := ThreedCoord{X: 1, Y: 0, Z: 0}
	coord3 := ThreedCoord{X: 2, Y: 0, Z: 0}
	coord4 := ThreedCoord{X: 3, Y: 0, Z: 0}

	circuit := ThreedCircuit{Start: &coord1}
	circuit.Add(&coord2)
	circuit.Add(&coord3)

	tests := []struct {
		name     string
		coord    *ThreedCoord
		expected bool
	}{
		{
			name:     "first coord in circuit",
			coord:    &coord1,
			expected: true,
		},
		{
			name:     "middle coord in circuit",
			coord:    &coord2,
			expected: true,
		},
		{
			name:     "last coord in circuit",
			coord:    &coord3,
			expected: true,
		},
		{
			name:     "coord not in circuit",
			coord:    &coord4,
			expected: false,
		},
		{
			name:     "nil coord",
			coord:    nil,
			expected: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := circuit.IsInCircuit(tt.coord)
			if result != tt.expected {
				t.Errorf("IsInCircuit() = %v, want %v", result, tt.expected)
			}
		})
	}
}

func TestThreedCircuit_GetLength(t *testing.T) {
	tests := []struct {
		name           string
		initialCoord   ThreedCoord
		coordsToAdd    []ThreedCoord
		expectedLength int
	}{
		{
			name:           "single node",
			initialCoord:   ThreedCoord{X: 0, Y: 0, Z: 0},
			coordsToAdd:    []ThreedCoord{},
			expectedLength: 1,
		},
		{
			name:           "two nodes",
			initialCoord:   ThreedCoord{X: 0, Y: 0, Z: 0},
			coordsToAdd:    []ThreedCoord{{X: 1, Y: 0, Z: 0}},
			expectedLength: 2,
		},
		{
			name:         "five nodes",
			initialCoord: ThreedCoord{X: 0, Y: 0, Z: 0},
			coordsToAdd: []ThreedCoord{
				{X: 1, Y: 0, Z: 0},
				{X: 2, Y: 0, Z: 0},
				{X: 3, Y: 0, Z: 0},
				{X: 4, Y: 0, Z: 0},
			},
			expectedLength: 5,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			circuit := ThreedCircuit{Start: &tt.initialCoord}
			for _, coord := range tt.coordsToAdd {
				c := coord
				circuit.Add(&c)
			}

			length := circuit.GetLength()
			if length != tt.expectedLength {
				t.Errorf("GetLength() = %d, want %d", length, tt.expectedLength)
			}
		})
	}
}

// ============================================================================
// ThreedCircuits Tests
// ============================================================================

func TestThreedCircuits_SortByLengthDesc(t *testing.T) {
	coord1 := ThreedCoord{X: 1, Y: 0, Z: 0}
	coord2 := ThreedCoord{X: 2, Y: 0, Z: 0}
	coord3 := ThreedCoord{X: 3, Y: 0, Z: 0}
	coord4 := ThreedCoord{X: 4, Y: 0, Z: 0}

	// circuit with 1 node
	circuit1 := &ThreedCircuit{Start: &coord1}

	// circuit with 2 nodes
	circuit2 := &ThreedCircuit{Start: &coord2}
	circuit2.Add(&coord1)

	// circuit with 3 nodes
	circuit3 := &ThreedCircuit{Start: &coord3}
	circuit3.Add(&coord2)
	circuit3.Add(&coord1)

	// circuit with 4 nodes
	circuit4 := &ThreedCircuit{Start: &coord4}
	circuit4.Add(&coord3)
	circuit4.Add(&coord2)
	circuit4.Add(&coord1)

	tests := []struct {
		name      string
		circuits  ThreedCircuits
		wantOrder []int
	}{
		{
			name:      "empty",
			circuits:  ThreedCircuits{},
			wantOrder: []int{},
		},
		{
			name:      "already sorted descending",
			circuits:  ThreedCircuits{circuit4, circuit3, circuit2, circuit1},
			wantOrder: []int{4, 3, 2, 1},
		},
		{
			name:      "sorted ascending (needs reversal)",
			circuits:  ThreedCircuits{circuit1, circuit2, circuit3, circuit4},
			wantOrder: []int{4, 3, 2, 1},
		},
		{
			name:      "random order",
			circuits:  ThreedCircuits{circuit2, circuit4, circuit1, circuit3},
			wantOrder: []int{4, 3, 2, 1},
		},
		{
			name:      "single circuit",
			circuits:  ThreedCircuits{circuit2},
			wantOrder: []int{2},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := tt.circuits.SortByLengthDesc()
			if len(*result) != len(tt.wantOrder) {
				t.Errorf("SortByLengthDesc() returned %d circuits, want %d", len(*result), len(tt.wantOrder))
			}

			for i, wantLength := range tt.wantOrder {
				gotLength := (*result)[i].GetLength()
				if gotLength != wantLength {
					t.Errorf("Circuit[%d] length = %d, want %d", i, gotLength, wantLength)
				}
			}
		})
	}
}

func TestThreedCircuits_Get(t *testing.T) {
	coord1 := ThreedCoord{X: 1, Y: 0, Z: 0}
	coord2 := ThreedCoord{X: 2, Y: 0, Z: 0}

	circuit1 := &ThreedCircuit{Start: &coord1}
	circuit2 := &ThreedCircuit{Start: &coord2}

	circuits := ThreedCircuits{circuit1, circuit2}

	tests := []struct {
		name     string
		index    int
		expected *ThreedCircuit
	}{
		{
			name:     "get first",
			index:    0,
			expected: circuit1,
		},
		{
			name:     "get second",
			index:    1,
			expected: circuit2,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := circuits.Get(tt.index)
			if result != tt.expected {
				t.Errorf("Get(%d) = %v, want %v", tt.index, result, tt.expected)
			}
		})
	}
}

func TestThreedCircuits_GetAll(t *testing.T) {
	coord1 := ThreedCoord{X: 1, Y: 0, Z: 0}
	coord2 := ThreedCoord{X: 2, Y: 0, Z: 0}

	circuit1 := &ThreedCircuit{Start: &coord1}
	circuit2 := &ThreedCircuit{Start: &coord2}

	circuits := ThreedCircuits{circuit1, circuit2}

	result := circuits.GetAll()
	if len(result) != 2 {
		t.Errorf("GetAll() returned %d circuits, want 2", len(result))
	}
	if result[0] != circuit1 {
		t.Errorf("GetAll()[0] = %v, want %v", result[0], circuit1)
	}
	if result[1] != circuit2 {
		t.Errorf("GetAll()[1] = %v, want %v", result[1], circuit2)
	}
}

// ============================================================================
// Integration Tests
// ============================================================================

func TestIntegration_DistanceCalculationAndSorting(t *testing.T) {
	coords := ThreedCoords{
		{X: 0, Y: 0, Z: 0},
		{X: 3, Y: 0, Z: 0},
		{X: 0, Y: 4, Z: 0},
		{X: 0, Y: 0, Z: 5},
	}

	// get unique distances
	distances := coords.GetUniqueDistances()

	// should have 6 unique pairs (4 choose 2)
	if len(distances) != 6 {
		t.Errorf("Expected 6 unique distances, got %d", len(distances))
	}

	// sort by distance
	sorted := distances.SortByDistance()

	// verify sorted order (should be ascending)
	for i := 0; i < len(*sorted)-1; i++ {
		if (*sorted)[i].Distance > (*sorted)[i+1].Distance {
			t.Errorf("Distances not sorted: [%d]=%.2f > [%d]=%.2f",
				i, (*sorted)[i].Distance, i+1, (*sorted)[i+1].Distance)
		}
	}

	// verify first distance is 3.0 (0,0,0 to 3,0,0)
	if math.Abs((*sorted)[0].Distance-3.0) > 0.0001 {
		t.Errorf("First distance = %.2f, want 3.0", (*sorted)[0].Distance)
	}
}

func TestIntegration_CircuitBuilding(t *testing.T) {
	coord1 := ThreedCoord{X: 0, Y: 0, Z: 0}
	coord2 := ThreedCoord{X: 1, Y: 0, Z: 0}
	coord3 := ThreedCoord{X: 2, Y: 0, Z: 0}
	coord4 := ThreedCoord{X: 3, Y: 0, Z: 0}

	// build a circuit
	circuit := ThreedCircuit{Start: &coord1}
	circuit.Add(&coord2)
	circuit.Add(&coord3)
	circuit.Add(&coord4)

	// verify length
	if circuit.GetLength() != 4 {
		t.Errorf("Circuit length = %d, want 4", circuit.GetLength())
	}

	// verify all coords are in circuit
	if !circuit.IsInCircuit(&coord1) {
		t.Error("coord1 should be in circuit")
	}
	if !circuit.IsInCircuit(&coord2) {
		t.Error("coord2 should be in circuit")
	}
	if !circuit.IsInCircuit(&coord3) {
		t.Error("coord3 should be in circuit")
	}
	if !circuit.IsInCircuit(&coord4) {
		t.Error("coord4 should be in circuit")
	}

	// verify a coord not added is not in circuit
	coord5 := ThreedCoord{X: 4, Y: 0, Z: 0}
	if circuit.IsInCircuit(&coord5) {
		t.Error("coord5 should not be in circuit")
	}
}

func TestIntegration_MultipleCircuitsSorting(t *testing.T) {
	// create circuits of different lengths
	coord1 := ThreedCoord{X: 1, Y: 0, Z: 0}
	coord2 := ThreedCoord{X: 2, Y: 0, Z: 0}
	coord3 := ThreedCoord{X: 3, Y: 0, Z: 0}

	smallCircuit := &ThreedCircuit{Start: &coord1}

	mediumCircuit := &ThreedCircuit{Start: &coord2}
	c2 := coord1
	mediumCircuit.Add(&c2)

	largeCircuit := &ThreedCircuit{Start: &coord3}
	c3a := coord2
	c3b := coord1
	largeCircuit.Add(&c3a)
	largeCircuit.Add(&c3b)

	circuits := ThreedCircuits{smallCircuit, mediumCircuit, largeCircuit}
	sorted := circuits.SortByLengthDesc()

	// verify descending order
	if (*sorted)[0].GetLength() != 3 {
		t.Errorf("First circuit length = %d, want 3", (*sorted)[0].GetLength())
	}
	if (*sorted)[1].GetLength() != 2 {
		t.Errorf("Second circuit length = %d, want 2", (*sorted)[1].GetLength())
	}
	if (*sorted)[2].GetLength() != 1 {
		t.Errorf("Third circuit length = %d, want 1", (*sorted)[2].GetLength())
	}
}

// ============================================================================
// ToString Tests
// ============================================================================

func TestThreedDistances_ToString(t *testing.T) {
	coord1 := ThreedCoord{X: 0, Y: 0, Z: 0}
	coord2 := ThreedCoord{X: 1, Y: 0, Z: 0}
	coord3 := ThreedCoord{X: 2, Y: 0, Z: 0}

	tests := []struct {
		name           string
		distances      ThreedDistances
		expectedOutput string
	}{
		{
			name:           "empty distances",
			distances:      ThreedDistances{},
			expectedOutput: "",
		},
		{
			name: "single distance",
			distances: ThreedDistances{
				{From: &coord1, To: &coord2, Distance: 1.0},
			},
			expectedOutput: "&{0 0 0} -> &{1 0 0} = 1\n",
		},
		{
			name: "multiple distances",
			distances: ThreedDistances{
				{From: &coord1, To: &coord2, Distance: 1.0},
				{From: &coord2, To: &coord3, Distance: 1.0},
			},
			expectedOutput: "&{0 0 0} -> &{1 0 0} = 1\n&{1 0 0} -> &{2 0 0} = 1\n",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := tt.distances.ToString()
			if result != tt.expectedOutput {
				t.Errorf("ToString() = %q, want %q", result, tt.expectedOutput)
			}
		})
	}
}

func TestThreedCircuit_ToString(t *testing.T) {
	coord1 := ThreedCoord{X: 0, Y: 0, Z: 0}
	coord2 := ThreedCoord{X: 1, Y: 0, Z: 0}
	coord3 := ThreedCoord{X: 2, Y: 0, Z: 0}

	tests := []struct {
		name           string
		circuit        *ThreedCircuit
		expectedOutput string
	}{
		{
			name:           "single node circuit",
			circuit:        &ThreedCircuit{Start: &coord1},
			expectedOutput: "&{0 0 0}\n\n",
		},
		{
			name: "two node circuit",
			circuit: func() *ThreedCircuit {
				c := &ThreedCircuit{Start: &coord1}
				c.Add(&coord2)
				return c
			}(),
			expectedOutput: "&{0 0 0}\n&{1 0 0}\n\n",
		},
		{
			name: "three node circuit",
			circuit: func() *ThreedCircuit {
				c := &ThreedCircuit{Start: &coord1}
				c.Add(&coord2)
				c.Add(&coord3)
				return c
			}(),
			expectedOutput: "&{0 0 0}\n&{2 0 0}\n&{1 0 0}\n\n",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := tt.circuit.ToString()
			if result != tt.expectedOutput {
				t.Errorf("ToString() = %q, want %q", result, tt.expectedOutput)
			}
		})
	}
}

func TestThreedCircuits_ToString(t *testing.T) {
	coord1 := ThreedCoord{X: 0, Y: 0, Z: 0}
	coord2 := ThreedCoord{X: 1, Y: 0, Z: 0}
	coord3 := ThreedCoord{X: 2, Y: 0, Z: 0}

	tests := []struct {
		name           string
		circuits       ThreedCircuits
		expectedOutput string
	}{
		{
			name:           "empty circuits",
			circuits:       ThreedCircuits{},
			expectedOutput: "",
		},
		{
			name: "single circuit",
			circuits: ThreedCircuits{
				&ThreedCircuit{Start: &coord1},
			},
			expectedOutput: "circuit has length 1:\n&{0 0 0}\n\n",
		},
		{
			name: "multiple circuits",
			circuits: func() ThreedCircuits {
				c1 := &ThreedCircuit{Start: &coord1}

				c2 := &ThreedCircuit{Start: &coord2}
				c2Copy := coord1
				c2.Add(&c2Copy)

				return ThreedCircuits{c1, c2}
			}(),
			expectedOutput: "circuit has length 1:\n&{0 0 0}\n\ncircuit has length 2:\n&{1 0 0}\n&{0 0 0}\n\n",
		},
		{
			name: "circuits with different lengths",
			circuits: func() ThreedCircuits {
				c1 := &ThreedCircuit{Start: &coord1}

				c2 := &ThreedCircuit{Start: &coord2}
				c2a := coord1
				c2.Add(&c2a)

				c3 := &ThreedCircuit{Start: &coord3}
				c3a := coord2
				c3b := coord1
				c3.Add(&c3a)
				c3.Add(&c3b)

				return ThreedCircuits{c1, c2, c3}
			}(),
			// Note: Add() inserts nodes after the head, so c3 will be: coord3 -> coord1 -> coord2
			expectedOutput: "circuit has length 1:\n&{0 0 0}\n\ncircuit has length 2:\n&{1 0 0}\n&{0 0 0}\n\ncircuit has length 3:\n&{2 0 0}\n&{0 0 0}\n&{1 0 0}\n\n",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := tt.circuits.ToString()
			if result != tt.expectedOutput {
				t.Errorf("ToString() = %q, want %q", result, tt.expectedOutput)
			}
		})
	}
}

func TestToString_Integration(t *testing.T) {
	// create a complete scenario with distances and circuits
	coords := ThreedCoords{
		{X: 0, Y: 0, Z: 0},
		{X: 1, Y: 0, Z: 0},
		{X: 2, Y: 0, Z: 0},
	}

	// get distances
	distances := coords.GetUniqueDistances()
	distStr := distances.ToString()

	// verify distances string is not empty
	if distStr == "" {
		t.Error("ToString() for distances should not be empty")
	}

	// verify it contains expected elements
	if !contains(distStr, "->") {
		t.Error("ToString() should contain '->' separator")
	}
	if !contains(distStr, "=") {
		t.Error("ToString() should contain '=' separator")
	}

	// create a circuit
	circuit := &ThreedCircuit{Start: &coords[0]}
	circuit.Add(&coords[1])
	circuit.Add(&coords[2])

	circuitStr := circuit.ToString()
	if circuitStr == "" {
		t.Error("ToString() for circuit should not be empty")
	}

	// create circuits collection
	circuits := ThreedCircuits{circuit}
	circuitsStr := circuits.ToString()

	if circuitsStr == "" {
		t.Error("ToString() for circuits should not be empty")
	}
	if !contains(circuitsStr, "circuit has length") {
		t.Error("ToString() should contain 'circuit has length' text")
	}
}

// helper function for string contains check
func contains(s, substr string) bool {
	return len(s) >= len(substr) && (s == substr || len(s) > len(substr) && hasSubstring(s, substr))
}

func hasSubstring(s, substr string) bool {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}
