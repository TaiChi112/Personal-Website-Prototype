# State Pattern - Class Diagram

```mermaid
classDiagram
    class State {
        +abstract handle(context: Context) void
    }
    
    class ConcreteStateA {
        +handle(context: Context) void
    }
    
    class ConcreteStateB {
        +handle(context: Context) void
    }
    
    class ConcreteStateC {
        +handle(context: Context) void
    }
    
    class Context {
        -state: State
        +constructor(state: State)
        +setState(state: State) void
        +request() void
    }
    
    State <|-- ConcreteStateA
    State <|-- ConcreteStateB
    State <|-- ConcreteStateC
    Context --> State: uses
    ConcreteStateA --|> ConcreteStateB: transitions to
    ConcreteStateB --|> ConcreteStateC: transitions to
    ConcreteStateC --|> ConcreteStateA: transitions to
    
    note for State "Encapsulates state-specific behavior"
```

## Description
- **State**: Interface ที่ define state operations
- **ConcreteStates**: Implement different states
- **Context**: Use state object และ delegate work ไปยัง state
- State transitions ถูกสำหรับแต่ละ concrete state
