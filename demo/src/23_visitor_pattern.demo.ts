// --- 1. The Visitor Interface (คนมาเยี่ยม) ---
// ต้องระบุชัดเจนว่า เยี่ยมใครได้บ้าง
interface IVisitor {
    visitArticle(article: Article): void;
    visitProject(project: Project): void;
}

// --- 2. The Element Interface (เจ้าบ้าน) ---
// ต้องมี method เพื่อ "ยอมรับ" ให้คนมาเยี่ยม
interface IVisitable {
    accept(visitor: IVisitor): void;
}

// --- 3. Concrete Elements (ข้อมูลของเรา) ---

class Article implements IVisitable {
    constructor(public title: string, public content: string) { }

    // หัวใจสำคัญ (Double Dispatch): 
    // ยื่น "ตัวเอง (this)" ส่งให้ visitor
    // เพื่อให้ visitor รู้ว่า "อ๋อ นี่คือ Article นะ"
    public accept(visitor: IVisitor): void {
        visitor.visitArticle(this);
    }
}

class Project implements IVisitable {
    constructor(public name: string, public repoUrl: string, public stars: number) { }

    public accept(visitor: IVisitor): void {
        visitor.visitProject(this);
    }
}

// --- 4. Concrete Visitors (ผู้เชี่ยวชาญด้านต่างๆ) ---

// ผู้เชี่ยวชาญด้าน HTML Export
class HtmlExportVisitor implements IVisitor {
    public visitArticle(element: Article): void {
        console.log(`<html><h1>${element.title}</h1><p>${element.content}</p></html>`);
    }

    public visitProject(element: Project): void {
        console.log(`<html><h2>Project: ${element.name}</h2><a href="${element.repoUrl}">Link</a></html>`);
    }
}

// ผู้เชี่ยวชาญด้าน JSON Export (อยากเพิ่ม format ใหม่ ก็แค่สร้าง Class นี้เพิ่ม)
class JsonExportVisitor implements IVisitor {
    public visitArticle(element: Article): void {
        console.log(JSON.stringify({ type: "article", ...element }));
    }

    public visitProject(element: Project): void {
        console.log(JSON.stringify({ type: "project", ...element }));
    }
}

// ผู้เชี่ยวชาญด้านการวิเคราะห์ (Analysis)
class WordCountVisitor implements IVisitor {
    private totalWords: number = 0;

    public visitArticle(element: Article): void {
        const count = element.content.split(" ").length;
        console.log(`   - Article '${element.title}': ${count} words`);
        this.totalWords += count;
    }

    public visitProject(element: Project): void {
        console.log(`   - Project '${element.name}': Metadata only (0 words)`);
    }

    public getTotal(): number {
        return this.totalWords;
    }
}

// --- Client Usage ---

// 1. สร้างข้อมูล (Object Structure)
const contentList: IVisitable[] = [
    new Article("Visitor Pattern", "It separates algorithm from object."),
    new Project("MyWebsite", "http://github.com/me/web", 500),
    new Article("TypeScript Tips", "Use strict types for safety.")
];

// 2. Scenario A: อยาก Export เป็น HTML
console.log("--- Exporting to HTML ---");
const htmlExporter = new HtmlExportVisitor();

// วนลูปให้ Visitor เข้าไปเยี่ยมทีละห้อง
contentList.forEach(item => item.accept(htmlExporter));

// 3. Scenario B: อยาก Export เป็น JSON
console.log("\n--- Exporting to JSON ---");
const jsonExporter = new JsonExportVisitor();
contentList.forEach(item => item.accept(jsonExporter));

// 4. Scenario C: อยากนับคำ (Analysis)
console.log("\n--- Analyzing Content ---");
const counter = new WordCountVisitor();
contentList.forEach(item => item.accept(counter));
console.log(`Total words across all content: ${counter.getTotal()}`);