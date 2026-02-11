```mermaid
classDiagram
    class WebPage {
        -parts string[]
        +add(part string) void
        +show() string
    }
    
    class IPageBuilder {
        <<interface>>
        +reset() IPageBuilder
        +setHeader(title string) IPageBuilder
        +addContent(content string) IPageBuilder
        +setFooter(text string) IPageBuilder
        +build() WebPage
    }
    
    class HTMLPageBuilder {
        -page WebPage
        +constructor()
        +reset() IPageBuilder
        +setHeader(title string) IPageBuilder
        +addContent(content string) IPageBuilder
        +setFooter(text string) IPageBuilder
        +build() WebPage
    }
    
    class PageDirector {
        +makeHomePage(builder IPageBuilder) void
        +makeAboutPage(builder IPageBuilder) void
        +makeMinimalPage(builder IPageBuilder, msg string) void
    }
    
    IPageBuilder <|.. HTMLPageBuilder : implements
    HTMLPageBuilder --> WebPage : creates
    PageDirector --> IPageBuilder : uses
```

## Builder Component
- Builder: IPageBuilder
- Concrete Builder: HTMLPageBuilder
- Product: WebPage
- Director: PageDirector

```ts

```
## Planning in the Future
- Scale เพิม concrete builders (e.g., MarkdownPageBuilder, PDFPageBuilder)
- เพิ่ม features ใน WebPage (e.g., CSS styling, JavaScript integration)