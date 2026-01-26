# Prototype Pattern - Class Diagram

```mermaid
classDiagram
    class Cloneable {
        +abstract clone() Cloneable
    }
    
    class ConcretePrototype {
        -data: string
        +clone() Cloneable
        +getData() string
        +setData(data: string) void
    }
    
    class PrototypeRegistry {
        -prototypes: Map<string, Cloneable>
        +register(name: string, prototype: Cloneable) void
        +clone(name: string) Cloneable
    }
    
    Cloneable <|-- ConcretePrototype
    PrototypeRegistry --> Cloneable: manages
    PrototypeRegistry --> Cloneable: clones
    
    note for ConcretePrototype "Implements clone()\nto create copies\nwithout using constructor"
```

## Description
- **Cloneable**: Interface ที่ define clone() method
- **ConcretePrototype**: Class ที่ implement clone() เพื่อสร้าง copies ของตัวเอง
- **PrototypeRegistry**: Optional class ที่จัดการและเรียกใช้ prototypes
- **clone()**: สร้าง independent copy ของ object
