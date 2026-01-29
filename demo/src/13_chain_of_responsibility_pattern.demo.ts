// --- 1. The Handler Interface (สัญญามาตรฐาน) ---
interface IHandler {
    setNext(handler: IHandler): IHandler; // กำหนดคนถัดไป
    handle(article: Article): string | null; // ตรวจสอบ (Return null = ผ่าน / string = Error)
}

// Model
class Article {
    constructor(public title: string, public content: string, public isOriginal: boolean) { }
}

// --- 2. The Abstract Handler (ตัวจัดการพื้นฐาน) ---
// ช่วยเขียน Logic การ "ส่งต่อ" ให้ (จะได้ไม่ต้องเขียนซ้ำทุก Class)
abstract class AbstractHandler implements IHandler {
    private nextHandler: IHandler | null = null;

    public setNext(handler: IHandler): IHandler {
        this.nextHandler = handler;
        return handler; // Return handler เพื่อให้เขียน Chain แบบ fluent ได้ (a.setNext(b).setNext(c))
    }

    public handle(article: Article): string | null {
        // ถ้ามีคนถัดไป -> ส่งต่อให้คนถัดไป
        if (this.nextHandler) {
            return this.nextHandler.handle(article);
        }
        // ถ้าไม่มีใครต่อแล้ว -> แปลว่าผ่านการตรวจสอบทั้งหมด (Success)
        return null;
    }
}

// --- 3. Concrete Handlers (ด่านตรวจต่างๆ) ---

// ด่านที่ 1: ตรวจว่าหัวข้อว่างไหม?
class EmptyTitleHandler extends AbstractHandler {
    public handle(article: Article): string | null {
        if (!article.title || article.title.trim() === "") {
            return "❌ Validation Failed: Title cannot be empty.";
        }
        console.log("   ✅ EmptyTitleHandler: Passed.");
        return super.handle(article); // ส่งต่อให้คนถัดไป
    }
}

// ด่านที่ 2: ตรวจคำหยาบ (Content Policy)
class ProfanityHandler extends AbstractHandler {
    public handle(article: Article): string | null {
        if (article.content.includes("damn")) { // สมมติคำหยาบ
            return "❌ Validation Failed: Content contains profanity.";
        }
        console.log("   ✅ ProfanityHandler: Passed.");
        return super.handle(article);
    }
}

// ด่านที่ 3: ตรวจลิขสิทธิ์ (Legal)
class CopyrightHandler extends AbstractHandler {
    public handle(article: Article): string | null {
        if (!article.isOriginal) {
            return "❌ Validation Failed: Content violates copyright.";
        }
        console.log("   ✅ CopyrightHandler: Passed.");
        return super.handle(article);
    }
}

// --- Client Usage ---

// 1. Setup the Chain (สร้างสายการผลิต)
const titleCheck = new EmptyTitleHandler();
const profanityCheck = new ProfanityHandler();
const copyrightCheck = new CopyrightHandler();

// เชื่อมต่อกัน: Title -> Profanity -> Copyright
titleCheck.setNext(profanityCheck).setNext(copyrightCheck);

// 2. Test Cases

console.log("--- Test 1: Good Article ---");
const goodArticle = new Article("Design Patterns", "They are useful.", true);
const result1 = titleCheck.handle(goodArticle);
if (result1) console.log(result1);
else console.log("🎉 Publish Successful!");

console.log("\n--- Test 2: Article with Profanity ---");
const badArticle = new Article("Rant", "This is damn hard.", true);
const result2 = titleCheck.handle(badArticle);
if (result2) console.log(result2); // จะหยุดที่ด่าน 2 และแสดง Error
else console.log("🎉 Publish Successful!");

console.log("\n--- Test 3: Empty Title ---");
const emptyArticle = new Article("", "Content", true);
const result3 = titleCheck.handle(emptyArticle);
if (result3) console.log(result3); // จะหยุดตั้งแต่ด่านแรก