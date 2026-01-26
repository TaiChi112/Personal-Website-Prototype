# Observer Pattern - Class Diagram

```mermaid
classDiagram
    class Observer {
        +abstract update(subject: Subject) void
    }
    
    class ConcreteObserverA {
        +update(subject: Subject) void
    }
    
    class ConcreteObserverB {
        +update(subject: Subject) void
    }
    
    class Subject {
        +abstract attach(observer: Observer) void
        +abstract detach(observer: Observer) void
        +abstract notify() void
    }
    
    class ConcreteSubject {
        -state: string
        -observers: Observer[]
        +getState() string
        +setState(state: string) void
        +attach(observer: Observer) void
        +detach(observer: Observer) void
        +notify() void
    }
    
    Observer <|-- ConcreteObserverA
    Observer <|-- ConcreteObserverB
    Subject <|-- ConcreteSubject
    ConcreteSubject --> Observer: notifies
    
    note for ConcreteSubject "Notifies observers when state changes"
```

## Description
- **Observer**: Interface ที่ define update method
- **ConcreteObservers**: Implement observer interface
- **Subject**: Interface ที่ manage observers
- **ConcreteSubject**: Maintain state และ notify observers when it changes
- Loose coupling between subject และ observers
