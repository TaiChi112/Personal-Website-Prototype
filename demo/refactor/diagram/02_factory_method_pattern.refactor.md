```mermaid
classDiagram
    class ILayout {
        <<interface>>
        +render() void
    }
    
    class ListLayout {
        +render() void
    }
    
    class GridLayout {
        +render() void
    }
    
    class LayoutFactory {
        <<abstract>>
        +createLayout() ILayout*
    }
    
    class ListLayoutFactory {
        +createLayout() ILayout
    }
    
    class GridLayoutFactory {
        +createLayout() ILayout
    }
    
    class User {
        -id string
        -name string
        +constructor(id string, name string)
        +useLayout(factory LayoutFactory) void
    }
    
    ILayout <|.. ListLayout : implements
    ILayout <|.. GridLayout : implements
    LayoutFactory <|-- ListLayoutFactory : extends
    LayoutFactory <|-- GridLayoutFactory : extends
    LayoutFactory ..> ILayout : creates
    User --> LayoutFactory : uses
```
## Crucial Part of Code

- จะได้ Layout อะไรขึ้นอยู่กับว่าเราใช้ Factory อะไรในการสร้าง เพื่อใช้คุณสมบัติเเบบ Polymorphism
```ts
    createLayout(): ILayout {
        return new SomeLayout();
    }
```

- หลังจากสร้าง Factory เเล้ว Client ก็สามารถใช้ Factory นั้นเพื่อสร้าง Layout เเละเรียกใช้เมธอด render จะได้ Layout อะไรก็ขึ้นอยู่กับ Factory ที่ส่งเข้าไป เช่น new ListLayoutFactory() หรือ new GridLayoutFactory() จะได้ List หรือ Grid ก็ขึ้อยู่กับตรงนี้ ได้เเล้ว create เเล้ว render สุดท้ายจะเป็น layout แบบไหนก็ขึ้อยู่กับ Factory ที่ส่งเข้าไป
```ts
    useLayout(factory: LayoutFactory): void {
        console.log(`👤 ${this.name} uses layout`);
        const layout = factory.createLayout();
        layout.render();
    }
```

## Factory Method Pattern Components
- Client:User
- Creator:LayoutFactory
- Concrete Creators:ListLayoutFactory, GridLayoutFactory
- Product:ILayout
- Concrete Products:ListLayout, GridLayout

## Planning in the future scale
- ตอนนี้เรามี Layout เเค่ 2 แบบ List กับ Grid เเต่ถ้าในอนาคต เราอยากเพิ่ม Layout ใหม่ เช่น Masonry Layout หรือ Carousel Layout เราเเค่สร้าง Concrete Creator เเละ Concrete Product ใหม่ โดยไม่ต้องไปยุ่งกับโค้ดเดิมของ Client หรือ Creator อื่นๆ
- เอา content ต่างๆ มา render เเละต้องเป็น content ที่ผ่านการใช้ adapter pattern มาเเล้วทำให้ factory method ไม่ต้องสนใจว่า content จริงๆ เป็นอะไร เเค่สร้าง layout เเล้ว render content ที่ได้มา


