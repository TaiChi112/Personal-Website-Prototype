// // Visitor
// interface IVisitor {
//     visitArticle(article: Article): void;
//     visitProject(project: Project): void;
// }

// // Element
// interface IVisitable {
//     accept(visitor: IVisitor): void;
// }

// // Concrete Element
// class Article implements IVisitable {
//     constructor(public title: string, public content: string) { }

//     public accept(visitor: IVisitor): void {
//         visitor.visitArticle(this);
//     }
// }

// class Project implements IVisitable {
//     constructor(public name: string, public repoUrl: string, public stars: number) { }

//     public accept(visitor: IVisitor): void {
//         visitor.visitProject(this);
//     }
// }

// // Concrete Visitor
// class HtmlExportVisitor implements IVisitor {
//     public visitArticle(element: Article): void {
//         console.log(`<html><h1>${element.title}</h1><p>${element.content}</p></html>`);
//     }

//     public visitProject(element: Project): void {
//         console.log(`<html><h2>Project: ${element.name}</h2><a href="${element.repoUrl}">Link</a></html>`);
//     }
// }

// class JsonExportVisitor implements IVisitor {
//     public visitArticle(element: Article): void {
//         console.log(JSON.stringify({ type: "article", ...element }));
//     }

//     public visitProject(element: Project): void {
//         console.log(JSON.stringify({ type: "project", ...element }));
//     }
// }

// class WordCountVisitor implements IVisitor {
//     private totalWords: number = 0;

//     public visitArticle(element: Article): void {
//         const count = element.content.split(" ").length;
//         console.log(`   - Article '${element.title}': ${count} words`);
//         this.totalWords += count;
//     }

//     public visitProject(element: Project): void {
//         console.log(`   - Project '${element.name}': Metadata only (0 words)`);
//     }

//     public getTotal(): number {
//         return this.totalWords;
//     }
// }

// // Client
// const contentList: IVisitable[] = [
//     new Article("Visitor Pattern", "It separates algorithm from object."),
//     new Project("MyWebsite", "http://github.com/me/web", 500),
//     new Article("TypeScript Tips", "Use strict types for safety.")
// ];

// console.log("--- Exporting to HTML ---");
// const htmlExporter = new HtmlExportVisitor();

// contentList.forEach(item => item.accept(htmlExporter));

// console.log("\n--- Exporting to JSON ---");
// const jsonExporter = new JsonExportVisitor();
// contentList.forEach(item => item.accept(jsonExporter));

// console.log("\n--- Analyzing Content ---");
// const counter = new WordCountVisitor();
// contentList.forEach(item => item.accept(counter));
// console.log(`Total words across all content: ${counter.getTotal()}`);


// ==========================================
// 1. The Visitor Interface
// ==========================================
// ประกาศว่า Visitor ต้องรู้วิธีจัดการกับ Concrete Element ทุกแบบ
interface Visitor {
    visitArticle(article: SingleArticle): void;
    visitCategory(category: TopicCategory): void;
}

// ==========================================
// 2. The Element Interfaces (Component)
// ==========================================
interface SubContentUnit {
    accept(visitor: Visitor): void; // Method รับแขก
    // สังเกตว่าเราเอา getDuration, getStructureString ออกไปแล้ว
}

// ==========================================
// 3. Concrete Elements
// ==========================================

// Leaf
class SingleArticle implements SubContentUnit {
    constructor(private title: string, private minutes: number) { }

    // Getters สำหรับให้ Visitor ดึงข้อมูลไปใช้
    getTitle(): string { return this.title; }
    getDuration(): number { return this.minutes; }

    accept(visitor: Visitor): void {
        visitor.visitArticle(this); // Double Dispatch
    }
}

// Composite
class TopicCategory implements SubContentUnit {
    private children: SubContentUnit[] = [];
    constructor(private title: string) { }

    add(unit: SubContentUnit): void {
        this.children.push(unit);
    }

    getTitle(): string { return this.title; }

    // เปิดช่องให้ Visitor เข้าถึงลูกๆ ได้ (เพื่อให้ Visitor ตัดสินใจเรื่อง Traversal เอง)
    getChildren(): SubContentUnit[] { return this.children; }

    accept(visitor: Visitor): void {
        visitor.visitCategory(this);
    }
}

// ==========================================
// 4. Concrete Visitors (The Logic)
// ==========================================

// Visitor 1: คำนวณเวลา (แทน getDuration เดิม)
class DurationVisitor implements Visitor {
    private totalDuration: number = 0;

    visitArticle(article: SingleArticle): void {
        this.totalDuration += article.getDuration();
    }

    visitCategory(category: TopicCategory): void {
        // Traversal Logic: วนลูปลูกๆ แล้วให้ลูก accept visitor ตัวเดิม
        for (const child of category.getChildren()) {
            child.accept(this);
        }
    }

    getResult(): number {
        return this.totalDuration;
    }
}

// Visitor 2: สร้าง Report String (แทน getStructureString เดิม)
class ReportVisitor implements Visitor {
    private output: string = "";
    private indentLevel: number = 0;

    private getIndent(): string {
        return "  ".repeat(this.indentLevel);
    }

    visitArticle(article: SingleArticle): void {
        this.output += `${this.getIndent()}- 📄 [Article] ${article.getTitle()} (${article.getDuration()} mins)\n`;
    }

    visitCategory(category: TopicCategory): void {
        // เราอาจต้องคำนวณ Duration เฉพาะกลุ่ม เพื่อโชว์ในหัวข้อ
        // ตรงนี้โชว์ความยืดหยุ่น: เราเรียกใช้ Logic ของ Visitor อื่นได้ผสมกัน
        const calc = new DurationVisitor();
        // Hack: เราต้องรัน calc กับลูกๆ ของ category นี้เท่านั้น (ในตัวอย่างนี้ทำเเบบง่ายไปก่อน)
        // เพื่อความง่าย เราจะแค่โชว์ชื่อ Category ก่อน

        this.output += `${this.getIndent()}+ 📂 [Category] ${category.getTitle()}\n`;

        this.indentLevel++; // เพิ่ม Indent ก่อนลงไปหาลูก
        for (const child of category.getChildren()) {
            child.accept(this);
        }
        this.indentLevel--; // ลด Indent เมื่อทำเสร็จ
    }

    getResult(): string {
        return this.output;
    }
}

// Visitor 3 (New Feature!): Export เป็น JSON (เพิ่มได้โดยไม่ต้องแก้ Class เดิม)
class JsonExportVisitor implements Visitor {
    private result: any = {};

    visitArticle(article: SingleArticle): void {
        this.result = {
            type: "Article",
            title: article.getTitle(),
            minutes: article.getDuration()
        };
    }

    visitCategory(category: TopicCategory): void {
        this.result = {
            type: "Category",
            title: category.getTitle(),
            children: category.getChildren().map(child => {
                const childVisitor = new JsonExportVisitor();
                child.accept(childVisitor);
                return childVisitor.getJson();
            })
        };
    }

    getJson(): any {
        return this.result;
    }
}

// ==========================================
// 5. Client Code
// ==========================================

class User {
    constructor(public id: string, public name: string, private learningPath: TopicCategory) { }

    addContent(content: SubContentUnit): void {
        this.learningPath.add(content);
    }

    showUserReport(): void {
        // 1. ใช้ Visitor คำนวณเวลา
        const timeCalc = new DurationVisitor();
        this.learningPath.accept(timeCalc);
        const totalTime = timeCalc.getResult();

        // 2. ใช้ Visitor สร้างกราฟิก Text
        const reportGen = new ReportVisitor();
        this.learningPath.accept(reportGen);
        const historyGraph = reportGen.getResult();

        console.log(`\n${'='.repeat(40)}`);
        console.log(`👤 User Report: ${this.name}`);
        console.log(`⏱️  Total Duration: ${totalTime} mins`);
        console.log(`${'='.repeat(40)}`);
        console.log(historyGraph);
        console.log(`${'='.repeat(40)}\n`);
    }

    exportData(): void {
        const jsonExp = new JsonExportVisitor();
        this.learningPath.accept(jsonExp);
        console.log("💾 Export JSON:", JSON.stringify(jsonExp.getJson(), null, 2));
    }
}

// ==========================================
// Usage
// ==========================================
const myLearningPath = new TopicCategory("Bob's 2024 Goals");
const bob = new User("u002", "Bob", myLearningPath);

const pythonCourse = new TopicCategory("Python Foundation");
pythonCourse.add(new SingleArticle("Syntax", 40));
pythonCourse.add(new SingleArticle("OOP", 55));

bob.addContent(pythonCourse);
bob.addContent(new SingleArticle("Clean Code Book", 120));

bob.showUserReport();
bob.exportData();
