package eulerlib

import (
	"log"
	"sync"
)

type Debuggable interface {
	SetDebug(bool)
	IsDebug() bool
	Log(...any)
	Logf(string, ...any)
}

var (
	debugger     *Debugger
	debuggerOnce sync.Once
)

type Debugger struct {
	Debuggable
	debug bool
}

func ResetDebugger() {
	debuggerOnce = sync.Once{}
	debugger = nil
}

func (d *Debugger) SetDebug(debug bool) {
	d.debug = debug
}
func (d *Debugger) IsDebug() bool {
	return d.debug
}
func (d *Debugger) Log(args ...any) {
	if d.debug {
		log.Println(args...)
	}
}

func (d *Debugger) Logf(format string, args ...any) {
	if d.debug {
		log.Printf(format, args...)
	}
}

func initDebugger() *Debugger {
	return &Debugger{}
}

func SetDebugger(isDebug bool) *Debugger {
	debuggerOnce.Do(func() {
		debugger = initDebugger()
	})
	debugger.SetDebug(isDebug)
	return debugger
}

func GetDebugger() *Debugger {
	debuggerOnce.Do(func() {
		debugger = initDebugger()
	})
	return debugger
}
