```mermaid
classDiagram
    %% Flyweight
    class ITag {
        <<interface>>
        +render(contentTitle string) void
    }
    %% Concrete Flyweight
    class SystemTag {
        -name: string
        -color: string
        -type: "Category" | "Type"
        +constructor(name string, color string, type "Category" | "Type")
        +render(contentTitle string) void
    }
    %% Flyweight Factory
    class TagFactory {
        -cache: Map~string, ITag~
        +getTag(name string, color string, type "Category" | "Type") ITag
        +getCacheSize() number
    }
    %% Context
    class Content {
        -title: string
        -content: string
        -tags: ITag[]
        +constructor(title string, content string)
        +addTag(factory TagFactory, tagName string, color string, type "Category" | "Type") void
        +show() void
        +summaryTags() void
    }
    
    ITag <|.. SystemTag : implements
    TagFactory --> ITag : creates & caches
    TagFactory ..> SystemTag : instantiates
    Content --> TagFactory : uses
    Content o-- ITag : has many
```

## Part of code is crucial
```ts
 public addTag(factory: TagFactory, tagName: string, color: string, type: "Category" | "Type") {
        const tag = factory.getTag(tagName, color, type);
        this.tags.push(tag);
    }
```

```ts
public getTag(name: string, color: string, type: "Category" | "Type"): ITag {
        const key = `${name}-${type}`;

        if (this.cache.has(key)) {
            return this.cache.get(key)!;
        }

        const newTag = new SystemTag(name, color, type);
        this.cache.set(key, newTag);
        console.log(`✨ Create new tag -> [${name}]`);
        return newTag;
    }
```

## Flyweight Component
- **Flyweight Interface**: `ITag`
- **Concrete Flyweight**: `SystemTag`
- **Flyweight Factory**: `TagFactory`
- **Client**: `Content`

## Planning Scale in The Future

## Problem

## Solution with Flyweight Pattern

```mermaid
classDiagram
    class IContent{
        <<interface>>
        +getTitle() string
        +getBody() string
    }
    class Article{
        -id UUID
        -title string
        -slug string
        -summary string
        -content string
        -status ENUM
        -coverImageURL string
        -authorId UUID
        -publishedAt Date
        -tags string[]
    }
    class Project{
        -id UUID
        -title string
        -descrition string
        -techStack string[]
        -repositoryURL string
        -demoURL string
        -galleryImages string[]
        -startedAt Date
        -completedAt Date
        -difficulty ENUM
        -role string
    }
    class Docs{
        -parentId UUID
        -orderIndex number
        -version string
        -isDeprecated boolean
        -codeSnippets string
        -relatedDocs UUID[]
    }
    class AdapterArticle{
        -article: Article
        +constructor(article Article)
        +getTitle() string
        +getBody() string
    }
```

![Alt text](./asset/flyweight.png "Flyweight Pattern")
