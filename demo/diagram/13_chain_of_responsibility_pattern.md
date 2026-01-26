# Chain of Responsibility Pattern - Class Diagram

```mermaid
classDiagram
    class Handler {
        -successor: Handler | null
        +setSuccessor(successor: Handler) Handler
        +abstract handle(request: string) string
    }
    
    class ConcreteHandlerA {
        +handle(request: string) string
    }
    
    class ConcreteHandlerB {
        +handle(request: string) string
    }
    
    class ConcreteHandlerC {
        +handle(request: string) string
    }
    
    Handler <|-- ConcreteHandlerA
    Handler <|-- ConcreteHandlerB
    Handler <|-- ConcreteHandlerC
    Handler --> Handler: successor
    
    note for Handler "Each handler decides:\nhandle or pass to next"
```

## Description
- **Handler**: Abstract class ที่ define handling method และ successor
- **ConcreteHandlers**: Classes ที่ handle request หรือส่งต่อให้ successor
- Handlers สร้าง chain ที่ requests ส่งผ่าน
- ถ้า handler ไม่สามารถจัดการได้ มันจะส่งให้ successor
