# Template Method Pattern - Class Diagram

```mermaid
classDiagram
    class AbstractClass {
        +templateMethod() string
        +abstract step1() string
        +abstract step2() string
        +abstract step3() string
    }
    
    class ConcreteClassA {
        +step1() string
        +step2() string
        +step3() string
    }
    
    class ConcreteClassB {
        +step1() string
        +step2() string
        +step3() string
    }
    
    AbstractClass <|-- ConcreteClassA
    AbstractClass <|-- ConcreteClassB
    
    note for AbstractClass "templateMethod() defines algorithm skeleton\nConcreteClasses implement specific steps"
```

## Description
- **AbstractClass**: Define template method ที่ define algorithm skeleton
- **Concrete Classes**: Implement abstract methods ที่ override specific steps
- Template method ควบคุมลำดับขั้นตอน
- Subclasses เติมรายละเอียด โดยไม่เปลี่ยน algorithm structure
