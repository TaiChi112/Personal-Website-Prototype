// ==========================================
// 1. Product (ผลลัพธ์)
// ==========================================
class WebPage {
    // ใช้ Array เก็บ parts เพื่อความยืดหยุ่น (เผื่อมี Sidebar, Widget)
    private parts: string[] = [];

    public add(part: string): void {
        this.parts.push(part);
    }

    public show(): string {
        return this.parts.join('\n');
    }
}

// ==========================================
// 2. Builder Interface (สัญญาการก่อสร้าง)
// ==========================================
interface IPageBuilder {
    // ใช้ Fluent Interface (return this) เพื่อให้ Chain method ได้
    reset(): this;
    setHeader(title: string): this;
    addContent(content: string): this;
    setFooter(text: string): this;
    getResult(): WebPage;
}

// ==========================================
// 3. Concrete Builder (ช่างก่อสร้างตัวจริง)
// ==========================================
// สังเกต: เรายุบ HomePageBuilder, AboutBuilder เหลือตัวเดียวที่รับค่าได้
class HTMLPageBuilder implements IPageBuilder {
    private page: WebPage;

    constructor() {
        this.page = new WebPage();
    }

    reset(): this {
        this.page = new WebPage();
        return this;
    }

    setHeader(title: string): this {
        // Logic การห่อ HTML tag อยู่ที่นี่ (Encapsulation)
        this.page.add(`<header><h1>${title}</h1></header>`);
        return this;
    }

    addContent(content: string): this {
        this.page.add(`<main>${content}</main>`);
        return this;
    }

    setFooter(text: string): this {
        this.page.add(`<footer>${text}</footer>`);
        return this;
    }

    getResult(): WebPage {
        const result = this.page;
        this.reset(); // Reset พร้อมสำหรับงานต่อไปทันที
        return result;
    }
}

// ==========================================
// 4. Director (สมุดรวมสูตรมาตรฐาน)
// ==========================================
class PageDirector {
    // ไม่เก็บ state ของ builder แต่รับเข้ามาเป็น parameter ในแต่ละสูตรแทน
    // เพื่อให้ Director เป็น Stateless (Reusable สุดๆ)

    public makeHomePage(builder: IPageBuilder): void {
        builder.reset()
            .setHeader("Welcome Home")
            .addContent("This is the main lobby.")
            .setFooter("Copyright 2026");
    }

    public makeAboutPage(builder: IPageBuilder): void {
        builder.reset()
            .setHeader("About Us")
            .addContent("We are a CS student team.");
        // สังเกต: About Page สูตรนี้ไม่มี Footer ก็ทำได้!
    }

    public makeMinimalPage(builder: IPageBuilder, msg: string): void {
        builder.reset()
            .addContent(msg);
    }
}

// ==========================================
// 5. Client Usage (การใช้งาน)
// ==========================================

const builder = new HTMLPageBuilder();
const director = new PageDirector();

console.log("--- 1. Build Standard Home Page ---");
director.makeHomePage(builder);
console.log(builder.getResult().show());

console.log("\n--- 2. Build Custom About Page (No Footer) ---");
director.makeAboutPage(builder);
console.log(builder.getResult().show());

console.log("\n--- 3. Build Without Director (Manual / Custom) ---");
// Builder เก่งพอที่จะให้ User ใช้งานเองได้ (Flexible)
builder.reset()
    .setHeader("My Custom Landing")
    .addContent("Special Promotion!")
    .addContent("Click Here!");
console.log(builder.getResult().show());