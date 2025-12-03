# aoc2025
 
Advent of Code 2025 solutions written in Go.
 
This repository is a Go module (`github.com/nfitbh72/aoc2025`) with:
 
- **`lib/`** – shared utility library (`eulerlib`) and tests.
- **`dayX-Y/`** – per-day solution packages (for example `day1-2`, `day2-1`, `day2-2`) each with:
  - `main.go` – entrypoint for that part.
  - `main_test.go` – test harness for that part.
  - `input.txt` / `input-test.txt` – puzzle input and sample input.
 
## Requirements
 
- Go **1.21+** (the module declares `go 1.24.5`; any recent Go toolchain should work).
 
## Setup
 
Clone the repo and download dependencies:
 
```bash
git clone https://github.com/nfitbh72/aoc2025.git
cd aoc2025
go mod tidy
```
 
## Running solutions
 
Each day/part is a separate `main` package. E.g. from the repo root:
 
```bash
cd day1-2
go run .
```
 
Each program reads `input.txt` (or `input-test.txt` for the short answer) from the current directory and prints the computed answer.
 
## Running tests
 
Run tests for a single package, for example:
 
```bash
go test ./lib/
go test ./day1-2/
go test ./day2-1/
go test ./day2-2/
```
 
Or run **all tests** in the module (includes the lib package):
 
```bash
./testall.sh
```
 
or run `go test ./...` to only test the day-by-day folders.

## Using `eulerlib.Problem`

### Benefits

- **Consistent interface** – every day exposes the same methods (`GetProblemName`, `GenerateAnswer`, etc.), which keeps `main.go` and tests uniform across the repo.
- **Shared I/O helpers** – you can rely on `eulerlib.GetFileInputTxt`, `StrToInt`, `IntToStr`, and other utilities instead of re‑writing parsing code.
- **Standardised testing** – the `lib/tests.go` helpers (`TestProblem`, `testShortProblem`, `testLongProblem`) work with any type that implements `Problem`, so adding tests for a new day is straightforward.
- **Support for “short” answers** – for expensive problems, you can implement the short-answer methods to allow fast verification on small inputs while still having a full solution for the real input.

### Solving a new `eulerlib.Problem`

Each day/part typically defines a `Day` struct that implements `eulerlib.Problem`. A minimal pattern is:

```go
package main

import (
    "fmt"

    eulerlib "github.com/nfitbh72/aoc2025/lib"
)

type Day struct {
    eulerlib.Problem
}

func (d *Day) GetProblemName() string      { return "Day X, Part Y" }
func (d *Day) GetAnswer() string           { return "<known-correct-answer>" }
func (d *Day) GetShortAnswer() string      { return "<known-correct-sample-answer>" } // optional
func (d *Day) GenerateAnswer() string      { return eulerlib.IntToStr(d.Solve(eulerlib.GetFileInputTxt("input.txt"))) }
func (d *Day) GenerateShortAnswer() string { return eulerlib.IntToStr(d.Solve(eulerlib.GetFileInputTxt("input-test.txt"))) }

func (d *Day) Solve(lines []string) int {
    // TODO: implement solution logic
    return 0
}

func main() {
    day := Day{}
    fmt.Println(day.GenerateAnswer())
}
```

### Testing a new `eulerlib.Problem`

For a new folder like `day3-1/`, you can add a minimal `main_test.go`:

```go
package main

import (
    "testing"

    eulerlib "github.com/nfitbh72/aoc2025/lib"
)

func TestDay(t *testing.T) {
    d := &Day{}
    eulerlib.TestProblem(d, t)
}
```

`TestProblem` will automatically choose between the short and long answer based on whether `GetShortAnswer` returns an empty string, so you get consistent verification across all days with one small test file.

