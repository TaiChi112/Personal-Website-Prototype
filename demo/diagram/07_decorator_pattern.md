# Decorator Pattern - Class Diagram

```mermaid
classDiagram
    class Component {
        +abstract operation() string
    }
    
    class ConcreteComponent {
        +operation() string
    }
    
    class Decorator {
        -component: Component
        +operation() string
    }
    
    class ConcreteDecoratorA {
        +operation() string
    }
    
    class ConcreteDecoratorB {
        +operation() string
    }
    
    Component <|-- ConcreteComponent
    Component <|-- Decorator
    Decorator <|-- ConcreteDecoratorA
    Decorator <|-- ConcreteDecoratorB
    Decorator --> Component: wraps
    
    note for Decorator "Adds functionality\nto component dynamically"
```

## Description
- **Component**: Interface ของ objects ที่สามารถ decorate ได้
- **ConcreteComponent**: Object ที่จะถูก decorate
- **Decorator**: Abstract class ที่ implement component interface และ wrap component
- **ConcreteDecorators**: Classes ที่เพิ่มความสามารถให้กับ component
