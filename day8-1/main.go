package main

import (
	"fmt"
	"slices"
	"strings"

	eulerlib "github.com/nfitbh72/aoc2025/lib"
)

type Problem struct {
	eulerlib.Problem
}

func (m *Problem) GetProblemName() string {
	return "Day 8, Part 1"
}

func (m *Problem) GetAnswer() string {
	return "123420"
}

func (m *Problem) GenerateAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input.txt"), 1000))
}

func (m *Problem) GetShortAnswer() string {
	return "40"
}

func (m *Problem) GenerateShortAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input-test.txt"), 10))
}

func (m *Problem) parseBoxes(lines []string) eulerlib.ThreedCoords {
	boxes := eulerlib.ThreedCoords{}
	for _, line := range lines {
		box := eulerlib.ThreedCoord{}
		vals := strings.Split(line, ",")
		box.X = eulerlib.StrToInt(vals[0])
		box.Y = eulerlib.StrToInt(vals[1])
		box.Z = eulerlib.StrToInt(vals[2])
		boxes = append(boxes, box)
	}
	return boxes
}

func (m *Problem) getCircuits(distances eulerlib.ThreedDistances) eulerlib.ThreedCircuits {
	circuits := eulerlib.ThreedCircuits{}
	for _, d := range distances {
		var fromCircuit *eulerlib.ThreedCircuit
		var toCircuit *eulerlib.ThreedCircuit
		fromCircuitIdx := -1
		toCircuitIdx := -1

		// find which circuits contain From and To
		for i, c := range circuits {
			if c.IsInCircuit(d.From) {
				fromCircuit = c
				fromCircuitIdx = i
			}
			if c.IsInCircuit(d.To) {
				toCircuit = c
				toCircuitIdx = i
			}
		}

		// both in same circuit - do nothing
		if fromCircuit != nil && toCircuit != nil && fromCircuitIdx == toCircuitIdx {
			fmt.Println("both found in same circuit, doing nothing")
			fmt.Print(fromCircuit.ToString())
			continue
		}

		// both in different circuits - merge them
		if fromCircuit != nil && toCircuit != nil && fromCircuitIdx != toCircuitIdx {
			fmt.Println("merging two circuits!")
			fmt.Print(fromCircuit.ToString())
			fmt.Print(toCircuit.ToString())

			// add all nodes from toCircuit to fromCircuit
			for node := toCircuit; node != nil; node = node.Next {
				if !fromCircuit.IsInCircuit(node.Start) {
					fromCircuit.Add(node.Start)
				}
			}

			// remove toCircuit from the list
			circuits = slices.Delete(circuits, toCircuitIdx, toCircuitIdx+1)
			fmt.Println("merged circuit:")
			fmt.Print(fromCircuit.ToString())
			continue
		}

		// only From found - add To to that circuit
		if fromCircuit != nil && toCircuit == nil {
			fromCircuit.Add(d.To)
			fmt.Println("found from, adding", d.To, "to circuit")
			fmt.Print(fromCircuit.ToString())
			continue
		}

		// only To found - add From to that circuit
		if toCircuit != nil && fromCircuit == nil {
			toCircuit.Add(d.From)
			fmt.Println("found to, adding", d.From, "to circuit")
			fmt.Print(toCircuit.ToString())
			continue
		}

		// neither found - create new circuit
		newCircuit := eulerlib.ThreedCircuit{Start: d.From}
		newCircuit.Add(d.To)
		circuits = append(circuits, &newCircuit)
		fmt.Println("added new circuit")
		fmt.Print(newCircuit.ToString())
	}
	return circuits
}

func (m *Problem) Solve(lines []string, numIterations int) int {
	boxes := m.parseBoxes(lines)
	distances := boxes.GetUniqueDistances()
	distances = *distances.SortByDistance()
	if len(distances) > numIterations {
		distances = distances[:numIterations]
	}
	fmt.Println("we have", len(distances), "distances")
	fmt.Print(distances.ToString())
	fmt.Println()
	circuits := m.getCircuits(distances)
	fmt.Print(circuits.ToString())

	circuits = *circuits.SortByLengthDesc()
	counter := 1
	if len(circuits) < 3 {
		fmt.Println("Not enough circuits!")
		return 0
	}
	fmt.Println("have circuits:", len(circuits))
	for _, c := range circuits[0:3] {
		fmt.Println("multiplying by", c.GetLength())
		counter = counter * c.GetLength()
	}
	fmt.Println("longest circuits:")
	//fmt.Print(circuits.ToString())
	return counter

}

func main() {
	d := Problem{}
	answer := d.GenerateAnswer()
	fmt.Println(answer)
	fmt.Println("does it match?", d.GetAnswer() == answer)
}
