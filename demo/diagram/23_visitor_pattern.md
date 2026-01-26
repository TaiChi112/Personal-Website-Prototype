# Visitor Pattern - Class Diagram

```mermaid
classDiagram
    class Element {
        +abstract accept(visitor: Visitor) string
    }
    
    class ElementA {
        +accept(visitor: Visitor) string
        +operationA() string
    }
    
    class ElementB {
        +accept(visitor: Visitor) string
        +operationB() string
    }
    
    class Visitor {
        +abstract visitElementA(element: ElementA) string
        +abstract visitElementB(element: ElementB) string
    }
    
    class ConcreteVisitorA {
        +visitElementA(element: ElementA) string
        +visitElementB(element: ElementB) string
    }
    
    class ConcreteVisitorB {
        +visitElementA(element: ElementA) string
        +visitElementB(element: ElementB) string
    }
    
    Element <|-- ElementA
    Element <|-- ElementB
    Visitor <|-- ConcreteVisitorA
    Visitor <|-- ConcreteVisitorB
    ElementA --> Visitor: accepts
    ElementB --> Visitor: accepts
    
    note for Visitor "Adds operations without\nchanging element classes"
```

## Description
- **Element**: Interface ที่ define accept method
- **ConcreteElements**: Implement element interface
- **Visitor**: Interface ที่ define visit methods สำหรับแต่ละ element type
- **ConcreteVisitors**: Implement specific operations
- Elements accept visitors และ call appropriate visit method
- New operations ได้จาก visitor implementations โดยไม่แก้ elements
