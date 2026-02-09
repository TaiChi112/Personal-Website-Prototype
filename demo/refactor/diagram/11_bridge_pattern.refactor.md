```mermaid
classDiagram
    class IBackgroundStorage {
        <<interface>>
        +upload(fileName string, data string) string
        +getFileUrl(fileName string) string
    }
    
    class LocalDiskStorage {
        +upload(fileName string, data string) string
        +getFileUrl(fileName string) string
    }
    
    class AmazonS3Storage {
        +upload(fileName string, data string) string
        +getFileUrl(fileName string) string
    }
    
    class MediaAttachment {
        <<abstract>>
        #storage IBackgroundStorage
        +constructor(storage IBackgroundStorage)
        +save(fileName string, data string) void
        +display() void
    }
    
    class ImageAttachment {
        -url string
        +save(fileName string, data string) void
        +display() void
    }
    
    class PDFDocument {
        -downloadLink string
        +save(fileName string, data string) void
        +display() void
    }
    
    class User {
        -id string
        -name string
        +constructor(id string, name string)
        +uploadContent(attachment MediaAttachment, fileName string, data string) void
    }
    
    IBackgroundStorage <|.. LocalDiskStorage : implements
    IBackgroundStorage <|.. AmazonS3Storage : implements
    MediaAttachment <|-- ImageAttachment : extends
    MediaAttachment <|-- PDFDocument : extends
    MediaAttachment --> IBackgroundStorage : uses
    User --> MediaAttachment : uses
```
## Part of code is crucial
```ts
    save(fileName: string, data: string): void {
        console.log("Processing Image (Resizing/Compressing)...");
        this.url = this.storage.upload(fileName, data);
    }
    
```
```ts
    uploadContent(attachment: MediaAttachment, fileName: string, data: string) {
        attachment.save(fileName, data);
        attachment.display();
    }
```

## Bridge Component
- Implementor: `IBackgroundStorage`
- Concrete Implementor: `LocalDiskStorage`, `AmazonS3Storage`
- Abstraction: `MediaAttachment`, `ImageAttachment`, `PDFDocument`
- Client: `User`



## Planing Scale in the Future
- เพิ่มที่จัดเก็บ storage เเบบอื่นๆ `IBackgroundStorage` implementations (e.g., `GoogleCloudStorage`, `AzureBlobStorage`)
- เพิ่มประเภท content เเบบอื่นๆ `MediaAttachment` อื่นๆ (e.g., `VideoAttachment`, `AudioAttachment`)

![Alt text](./asset/bridge.png "Bridge Pattern")
