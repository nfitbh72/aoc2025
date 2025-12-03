package eulerlib

import (
	"log"
	"sync"
)

// Debuggable describes a type that can emit debug logging conditionally.
// Implementations typically gate output on an internal debug flag.
type Debuggable interface {
	SetDebug(bool)
	IsDebug() bool
	Log(...any)
	Logf(string, ...any)
}

var (
	// debugger holds the singleton Debugger instance used throughout the
	// package for conditional logging.
	debugger *Debugger
	// debuggerOnce ensures the debugger singleton is initialised only once.
	debuggerOnce sync.Once
)

// Debugger provides a simple flag-controlled wrapper around the standard
// library logger for debug output.
type Debugger struct {
	Debuggable
	debug bool
}

// ResetDebugger clears the singleton debugger so it can be reinitialised.
// This is primarily intended for use in tests.
func ResetDebugger() {
	debuggerOnce = sync.Once{}
	debugger = nil
}

// SetDebug enables or disables debug logging for the Debugger.
func (d *Debugger) SetDebug(debug bool) {
	d.debug = debug
}

// IsDebug reports whether debug logging is currently enabled.
func (d *Debugger) IsDebug() bool {
	return d.debug
}

// Log writes the supplied arguments using log.Println when debug logging is
// enabled. When disabled, it performs no output.
func (d *Debugger) Log(args ...any) {
	if d.debug {
		log.Println(args...)
	}
}

// Logf formats and writes a message using log.Printf when debug logging is
// enabled. When disabled, it performs no output.
func (d *Debugger) Logf(format string, args ...any) {
	if d.debug {
		log.Printf(format, args...)
	}
}

// initDebugger constructs a new Debugger with debug output disabled.
func initDebugger() *Debugger {
	return &Debugger{}
}

// SetDebugger initialises (if necessary) and configures the global debugger
// singleton, returning the instance for further use.
func SetDebugger(isDebug bool) *Debugger {
	debuggerOnce.Do(func() {
		debugger = initDebugger()
	})
	debugger.SetDebug(isDebug)
	return debugger
}

// GetDebugger returns the global debugger singleton, initialising it on first
// use.
func GetDebugger() *Debugger {
	debuggerOnce.Do(func() {
		debugger = initDebugger()
	})
	return debugger
}
