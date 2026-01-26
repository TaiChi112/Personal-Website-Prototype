# Command Pattern - Class Diagram

```mermaid
classDiagram
    class Command {
        +abstract execute() string
    }
    
    class ConcreteCommandA {
        -receiver: Receiver
        -a: string
        -b: string
        +execute() string
    }
    
    class ConcreteCommandB {
        -receiver: Receiver
        -a: string
        +execute() string
    }
    
    class Receiver {
        +action(a: string, b: string) string
    }
    
    class Invoker {
        -command: Command | null
        +setCommand(command: Command) void
        +execute() string
    }
    
    Command <|-- ConcreteCommandA
    Command <|-- ConcreteCommandB
    ConcreteCommandA --> Receiver
    ConcreteCommandB --> Receiver
    Invoker --> Command
    
    note for Command "Encapsulates request as object"
```

## Description
- **Command**: Interface ที่ define execute method
- **ConcreteCommands**: Encapsulate requests ด้วย receiver references
- **Receiver**: Object ที่ทำงาน
- **Invoker**: Class ที่เรียก commands
- Supports undo/redo, queuing, logging operations
