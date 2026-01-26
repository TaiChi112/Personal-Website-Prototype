# Mediator Pattern - Class Diagram

```mermaid
classDiagram
    class Mediator {
        +abstract send(message: string, colleague: Colleague) void
    }
    
    class ConcreteMediator {
        -colleagueA: ConcreteColleagueA | null
        -colleagueB: ConcreteColleagueB | null
        +setColleagueA(colleague: ConcreteColleagueA) void
        +setColleagueB(colleague: ConcreteColleagueB) void
        +send(message: string, colleague: Colleague) void
    }
    
    class Colleague {
        -mediator: Mediator
        +constructor(mediator: Mediator)
        +abstract send(message: string) void
        +abstract receive(message: string) void
    }
    
    class ConcreteColleagueA {
        +send(message: string) void
        +receive(message: string) void
    }
    
    class ConcreteColleagueB {
        +send(message: string) void
        +receive(message: string) void
    }
    
    Mediator <|-- ConcreteMediator
    Colleague <|-- ConcreteColleagueA
    Colleague <|-- ConcreteColleagueB
    ConcreteMediator --> ConcreteColleagueA
    ConcreteMediator --> ConcreteColleagueB
    ConcreteColleagueA --> Mediator
    ConcreteColleagueB --> Mediator
    
    note for ConcreteMediator "Routes communication\nbetween colleagues"
```

## Description
- **Mediator**: Interface ที่ define communication methods
- **ConcreteMediator**: Implement mediator logic ที่ route communications
- **Colleague**: Base class ของ objects ที่ interact
- **ConcreteColleagues**: Implement colleague interface
- Colleagues communicate ผ่าน mediator แทนที่จะ directly
