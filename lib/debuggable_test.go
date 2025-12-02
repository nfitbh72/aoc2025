package eulerlib

import (
	"bytes"
	"log"
	"os"
	"strings"
	"testing"
)

func TestGetGetDebugger(t *testing.T) {
	ResetDebugger()
	d1 := GetDebugger()
	if d1 == nil {
		t.Error("Expected debugger to be set")
	}

	debugger := GetDebugger()
	if debugger == nil {
		t.Error("Expected debugger to be initialized")
	}

	if debugger != d1 {
		t.Error("Expected GetDebugger to return the same debugger instance as SetDebugger")
	}
}

func TestSetGetDebugger(t *testing.T) {
	ResetDebugger()
	d1 := SetDebugger(true)
	if d1 == nil {
		t.Error("Expected debugger to be set")
	}

	debugger := GetDebugger()
	if debugger == nil {
		t.Error("Expected debugger to be initialized")
	}

	if debugger != d1 {
		t.Error("Expected GetDebugger to return the same debugger instance as SetDebugger")
	}

	debugger.SetDebug(true)
	if !debugger.IsDebug() {
		t.Error("Expected debugger to be in debug mode")
	}

	debugger.SetDebug(false)
	if debugger.IsDebug() {
		t.Error("Expected debugger to not be in debug mode")
	}
}

func TestDebuggerOutput(t *testing.T) {
	var bf bytes.Buffer
	log.SetOutput(&bf)
	t.Cleanup(func() {
		log.SetOutput(os.Stdout)
	})
	msg := "This is a test log message"
	//expected usage is to use the singleton
	SetDebugger(true)
	GetDebugger().Log(msg)

	if !strings.Contains(bf.String(), msg) {
		t.Errorf("Expected log output to contain '%s', got '%s'", msg, bf.String())
	}
}

func TestDebuggerNoOutput(t *testing.T) {
	var bf bytes.Buffer
	log.SetOutput(&bf)
	t.Cleanup(func() {
		log.SetOutput(os.Stdout)
	})
	msg := "This is a test log message"
	debugger := SetDebugger(false)
	debugger.Log(msg)

	if bf.String() != "" {
		t.Errorf("Expected no log output, got '%s'", bf.String())
	}
}
