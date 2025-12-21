package eulerlib

import "testing"

func TestNewStack_IsEmpty(t *testing.T) {
	s := NewStack()
	if !s.IsEmpty() {
		t.Fatalf("expected new stack to be empty")
	}
	if got := s.GetSize(); got != 0 {
		t.Fatalf("expected size 0 for new stack, got %d", got)
	}
}

func TestStack_PushPopOrder(t *testing.T) {
	s := NewStack()
	values := []any{1, "two", byte('3')}
	for _, v := range values {
		s.Push(v)
	}

	// Pop should return in reverse order (LIFO)
	for i := len(values) - 1; i >= 0; i-- {
		got := s.Pop()
		if got != values[i] {
			t.Fatalf("pop[%d]: expected %v, got %v", i, values[i], got)
		}
	}

	if !s.IsEmpty() {
		t.Fatalf("expected stack to be empty after popping all elements")
	}
}

func TestStack_PeekDoesNotRemove(t *testing.T) {
	s := NewStack()
	s.Push(10)
	s.Push(20)

	if got := s.Peek(); got != 20 {
		t.Fatalf("peek: expected 20, got %v", got)
	}

	// Size should remain the same and subsequent pop should yield the same value
	if size := s.GetSize(); size != 2 {
		t.Fatalf("expected size 2 after peek, got %d", size)
	}

	if got := s.Pop(); got != 20 {
		t.Fatalf("pop after peek: expected 20, got %v", got)
	}
}

func TestStack_GetFirstN(t *testing.T) {
	s := NewStack()
	values := []any{"a", "b", "c", "d"}
	for _, v := range values {
		s.Push(v)
	}

	// underlying order is insertion order in slice
	first3 := s.GetFirstN(3)
	expect := []any{"a", "b", "c"}
	if len(first3) != len(expect) {
		t.Fatalf("GetFirstN length: expected %d, got %d", len(expect), len(first3))
	}
	for i := range expect {
		if first3[i] != expect[i] {
			t.Fatalf("GetFirstN[%d]: expected %v, got %v", i, expect[i], first3[i])
		}
	}
}

func TestStack_GetItemAt(t *testing.T) {
	s := NewStack()
	values := []any{byte('x'), byte('y'), byte('z')}
	for _, v := range values {
		s.Push(v)
	}

	for i, expect := range values {
		got := s.GetItemAt(i)
		if got != expect {
			t.Fatalf("GetItemAt(%d): expected %v, got %v", i, expect, got)
		}
	}
}
