// --- 1. The Observer Interface (สัญญามาตรฐานของผู้รับข่าว) ---
// ทุกคนที่อยากรู้ข่าว ต้องมี method นี้
interface IObserver {
    update(articleTitle: string): void;
}

// --- 2. The Subject Interface (สัญญามาตรฐานของผู้ส่งข่าว) ---
interface ISubject {
    attach(observer: IObserver): void; // รับสมัครสมาชิก
    detach(observer: IObserver): void; // ยกเลิกสมาชิก
    notify(): void; // แจ้งข่าว
}

// --- 3. Concrete Subject (สำนักพิมพ์ / ตัวต้นเรื่อง) ---
class ArticlePublisher implements ISubject {
    private observers: IObserver[] = []; // สมุดรายชื่อคนติดตาม
    private latestArticleTitle: string = "";

    // ลงทะเบียนคนติดตาม
    public attach(observer: IObserver): void {
        const isExist = this.observers.includes(observer);
        if (isExist) {
            return console.log('Subject: Observer has been attached already.');
        }
        console.log('Subject: Attached an observer.');
        this.observers.push(observer);
    }

    // ยกเลิกคนติดตาม
    public detach(observer: IObserver): void {
        const observerIndex = this.observers.indexOf(observer);
        if (observerIndex === -1) {
            return console.log('Subject: Nonexistent observer.');
        }
        this.observers.splice(observerIndex, 1);
        console.log('Subject: Detached an observer.');
    }

    // หัวใจสำคัญ: วนลูปแจ้งข่าวทุกคน
    public notify(): void {
        console.log('Subject: Notifying observers...');
        for (const observer of this.observers) {
            observer.update(this.latestArticleTitle);
        }
    }

    // Business Logic: เมื่อมีการ Publish บทความใหม่
    public publishNewArticle(title: string): void {
        console.log(`\n--- 📢 Action: Publishing "${title}" ---`);
        this.latestArticleTitle = title;
        // พอทำงานเสร็จ ก็ตะโกนบอกทุกคนทันที
        this.notify();
    }
}

// --- 4. Concrete Observers (ระบบย่อยที่รอฟังข่าว) ---

// ระบบส่งอีเมล
class EmailSubscriber implements IObserver {
    private email: string;

    constructor(email: string) {
        this.email = email;
    }

    update(articleTitle: string): void {
        console.log(`   📧 [Email] To ${this.email}: New article "${articleTitle}" is live!`);
    }
}

// ระบบเก็บ Log (Audit)
class LoggingService implements IObserver {
    update(articleTitle: string): void {
        console.log(`   💾 [Log] System record: Article "${articleTitle}" was published at ${new Date().toLocaleTimeString()}`);
    }
}

// ระบบ Social Media Auto-Post
class FacebookAutoPost implements IObserver {
    update(articleTitle: string): void {
        console.log(`   📱 [Facebook] Posting: "Check out our new article: ${articleTitle}"`);
    }
}

// --- Client Usage (การใช้งานจริง) ---

// 1. สร้างสำนักพิมพ์ (Subject)
const publisher = new ArticlePublisher();

// 2. สร้างผู้ติดตาม (Observers)
const user1 = new EmailSubscriber("john@example.com");
const logger = new LoggingService();
const fbPage = new FacebookAutoPost();

// 3. ลงทะเบียน (Subscribe)
publisher.attach(user1);
publisher.attach(logger);
publisher.attach(fbPage);

// 4. เริ่ม Publish บทความ! (ทุกอย่างจะทำงานเองอัตโนมัติ)
publisher.publishNewArticle("Observer Pattern Explained");

// Output:
// --- 📢 Action: Publishing "Observer Pattern Explained" ---
// Subject: Notifying observers...
//    📧 [Email] To john@example.com: New article "Observer Pattern Explained" is live!
//    💾 [Log] System record: Article "Observer Pattern Explained" was published...
//    📱 [Facebook] Posting: "Check out our new article..."

// 5. ลองยกเลิก Facebook แล้ว Publish ใหม่
console.log("\n[Action] Unsubscribing Facebook...");
publisher.detach(fbPage);

publisher.publishNewArticle("Advanced TypeScript");
// Output: (Facebook จะหายไป ไม่ทำงานแล้ว)