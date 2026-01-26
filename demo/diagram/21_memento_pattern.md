# Memento Pattern - Class Diagram

```mermaid
classDiagram
    class Memento {
        -state: string
        +constructor(state: string)
        +getState() string
    }
    
    class Originator {
        -state: string
        +setState(state: string) void
        +getState() string
        +saveToMemento() Memento
        +restoreFromMemento(memento: Memento) void
    }
    
    class Caretaker {
        -mementos: Memento[]
        +saveMemento(memento: Memento) void
        +getMemento(index: number) Memento | null
    }
    
    Originator --> Memento: creates
    Caretaker --> Memento: manages
    
    note for Memento "Stores state snapshot\nwithout exposing internals"
```

## Description
- **Memento**: Stores snapshot ของ originator state
- **Originator**: Creates memento และ restore state จาก memento
- **Caretaker**: Manages collection ของ mementos
- Memento encapsulates state โดยไม่ให้ client เข้าถึง internals
- Supports undo/redo functionality
