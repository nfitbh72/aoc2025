package main

import (
	"fmt"
	"strings"

	eulerlib "github.com/nfitbh72/aoc2025/solutions/lib"
)

type Problem struct {
	eulerlib.Problem
}

func (m *Problem) GetProblemName() string {
	return "Day 11, Part 1"
}

func (m *Problem) GetAnswer() string {
	return "688"
}

func (m *Problem) GenerateAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input.txt")))
}

func (m *Problem) GetShortAnswer() string {
	return "5"
}

func (m *Problem) GenerateShortAnswer() string {
	return eulerlib.IntToStr(m.Solve(eulerlib.GetFileInputTxt("input-test.txt")))
}

type TServer struct {
	devices map[string][]string
}

func (m *TServer) Init() {
	m.devices = make(map[string][]string, 0)
}

func (m *TServer) SetupNewDevice(label string) {
	a := make([]string, 0)
	m.devices[label] = a
}

func (m *TServer) LoadConnection(forDevice, toDevice string) {
	m.devices[forDevice] = append(m.devices[forDevice], toDevice)
}

func (m *Problem) ParseInput(lines []string) *TServer {
	s := TServer{}
	s.Init()
	for _, line := range lines {
		parts := strings.Split(line, ": ")
		label := parts[0]
		s.SetupNewDevice(label)
	}
	for _, line := range lines {
		parts := strings.Split(line, ": ")
		label := parts[0]
		connectionParts := strings.Split(parts[1], " ")
		for _, connection := range connectionParts {
			s.LoadConnection(label, connection)
		}
	}
	return &s
}

func (m *TServer) Display() {
	fmt.Println("Server:")
	for k, d := range m.devices {
		fmt.Println(k, d)
	}
}

func (m *TServer) getNumPaths(from string, to string) int {
	numPaths := 0
	for _, connection := range m.devices[from] {
		if connection == to {
			numPaths++
		} else {
			numPaths += m.getNumPaths(connection, to)
		}
	}
	return numPaths
}

func (m *TServer) GetNumPaths(fromStr, toStr string) int {
	if _, ok := m.devices[fromStr]; ok {
		return m.getNumPaths(fromStr, toStr)
	} else {
		panic("could not find device: " + fromStr)
	}
}

func (m *Problem) Solve(lines []string) int {
	server := m.ParseInput(lines)
	server.Display()
	return server.GetNumPaths("you", "out")
}

func main() {
	d := Problem{}
	answer := d.GenerateAnswer()
	fmt.Println(answer)
	fmt.Println("does it match?", d.GetAnswer() == answer)
}
