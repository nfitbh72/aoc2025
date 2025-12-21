package eulerlib

type Stack struct {
	stack []any
}

func NewStack() *Stack {
	return &Stack{
		stack: make([]any, 0),
	}
}

func (s *Stack) Push(v any) {
	s.stack = append(s.stack, v)
}

func (s *Stack) Pop() any {
	v := s.stack[len(s.stack)-1]
	s.stack = s.stack[:len(s.stack)-1]
	return v
}

func (s *Stack) Peek() any {
	return s.stack[len(s.stack)-1]
}

func (s *Stack) IsEmpty() bool {
	return len(s.stack) == 0
}

func (s *Stack) GetSize() int {
	return len(s.stack)
}

func (s *Stack) GetFirstN(n int) []any {
	return s.stack[:n]
}

func (s *Stack) GetItemAt(pos int) any {
	return s.stack[pos]
}
