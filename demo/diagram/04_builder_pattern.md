# Builder Pattern - Class Diagram

```mermaid
classDiagram
    class Product {
        -parts: string[]
        +addPart(part: string) void
    }
    
    class Builder {
        -product: Product
        +abstract buildPartA() void
        +abstract buildPartB() void
        +abstract buildPartC() void
        +getProduct() Product
        +reset() void
    }
    
    class ConcreteBuilder1 {
        +buildPartA() void
        +buildPartB() void
        +buildPartC() void
    }
    
    class ConcreteBuilder2 {
        +buildPartA() void
        +buildPartB() void
        +buildPartC() void
    }
    
    class Director {
        -builder: Builder
        +constructor(builder: Builder)
        +setBuilder(builder: Builder) void
        +construct() Product
    }
    
    Builder <|-- ConcreteBuilder1
    Builder <|-- ConcreteBuilder2
    Builder --> Product: creates
    Director --> Builder: uses
    Director --> Product: returns
    
    note for Builder "Separates construction\nlogic from representation"
```

## Description
- **Product**: Object ที่ต้องสร้างขึ้น
- **Builder**: Abstract class ที่ define step-by-step building methods
- **ConcreteBuilders**: Implementations ของ Builder ที่สร้าง products ด้วยวิธีต่างกัน
- **Director**: Orchestrates building process ในลำดับที่ถูกต้อง
