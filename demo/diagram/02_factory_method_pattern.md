# Factory Method Pattern - Class Diagram

```mermaid
classDiagram
    class Product {
        +getName() string
    }
    
    class ConcreteProductA {
        +getName() string
    }
    
    class ConcreteProductB {
        +getName() string
    }
    
    class Creator {
        +abstract createProduct() Product
        +someOperation() void
    }
    
    class ConcreteCreatorA {
        +createProduct() Product
    }
    
    class ConcreteCreatorB {
        +createProduct() Product
    }
    
    Product <|-- ConcreteProductB
    Product <|-- ConcreteProductA
    Creator <|-- ConcreteCreatorA
    Creator <|-- ConcreteCreatorB
    Creator <|-- Product
    
    note for Creator "Abstract factory method\nSubclasses decide product type"
```

## Description
- **Product**: Interface/Abstract class ที่ define contract สำหรับ products
- **ConcreteProducts**: Classes ที่ implement product interface
- **Creator**: Abstract class ที่มี abstract factory method
- **ConcreteCreators**: Classes ที่ implement factory method สำหรับแต่ละ product type

```ts
createProduct(): Product {
    return new ConcreteProductA(); 
}
someOperation(): void {
    const product: Product = this.createProduct();
    product.getName();
}
```