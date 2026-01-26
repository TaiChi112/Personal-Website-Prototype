# Singleton Pattern - Class Diagram

```mermaid
classDiagram
    class Singleton {
        -static instance: Singleton
        -constructor()
        +static getInstance() Singleton
    }
    
    note for Singleton "Private constructor\nensures single instance\nStatic getInstance()\nreturns shared instance"
```

## Description
- **Single Instance**: `Singleton` class มี private static instance ที่เก็บ object เพียงตัวเดียว
- **Private Constructor**: ป้องกันการสร้าง instance จากภายนอก
- **getInstance()**: Static method ที่คืนค่า instance เดียวกันเสมอ
