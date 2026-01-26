# Interpreter Pattern - Class Diagram

```mermaid
classDiagram
    class Expression {
        +abstract interpret(context: string) boolean
    }
    
    class TerminalExpression {
        -data: string
        +constructor(data: string)
        +interpret(context: string) boolean
    }
    
    class OrExpression {
        -expr1: Expression
        -expr2: Expression
        +constructor(expr1: Expression, expr2: Expression)
        +interpret(context: string) boolean
    }
    
    class AndExpression {
        -expr1: Expression
        -expr2: Expression
        +constructor(expr1: Expression, expr2: Expression)
        +interpret(context: string) boolean
    }
    
    Expression <|-- TerminalExpression
    Expression <|-- OrExpression
    Expression <|-- AndExpression
    OrExpression --> Expression: contains
    AndExpression --> Expression: contains
    
    note for Expression "Terminal: leaf nodes\nNon-Terminal: composite expressions"
```

## Description
- **Expression**: Interface ที่ define interpret method
- **TerminalExpression**: Implement interpret สำหรับ terminal symbols
- **Non-TerminalExpressions**: Implement interpret สำหรับ grammar rules (OR, AND)
- Builds expression tree ที่ represent grammar
- Client interprets sentences ผ่าน expression tree
