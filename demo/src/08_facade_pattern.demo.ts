// --- 1. The Complex Subsystems (ระบบหลังบ้านที่ยุ่งเหยิง) ---

interface Article {
    title: string;
    content: string;
    authorId: string;
    tags?: string[];
    coverImage?: string;
}

// Subsystem 1: Authentication
class AuthService {
    isAuthenticated(userId: string): boolean {
        console.log(`[Auth] Checking user ${userId}...`);
        return true;
    }

    getUserPermission(userId: string): string {
        console.log(`[Auth] Verifying publish permission for ${userId}...`);
        return "granted";
    }
}

// Subsystem 2: Content Validation
class ContentValidator {
    hasBadWords(content: string): boolean {
        console.log("[Validator] Scanning for bad words...");
        return false;
    }

    checkContentLength(content: string): boolean {
        console.log(`[Validator] Checking content length (${content.length} chars)...`);
        return content.length > 50;
    }
}

// Subsystem 3: Image Processing
class ImageService {
    optimizeCoverImage(imageUrl?: string): string {
        if (!imageUrl) {
            console.log("[Image] Using default cover image...");
            return "default-cover.jpg";
        }
        console.log(`[Image] Optimizing cover image: ${imageUrl}...`);
        return `optimized-${imageUrl}`;
    }
}

// Subsystem 5: Database
class DatabaseService {
    save(article: Article): void {
        console.log("[DB] Saving article to database...");
        console.log(`[DB] Article ID: ${Math.random().toString(36).substring(7)}`);
    }
}

// Subsystem 7: Notification
class NotificationService {
    notifySubscribers(title: string): void {
        console.log(`[Email] Sending alert to subscribers...`);
        console.log(`[Email] Subject: New article '${title}' is out!`);
    }

    notifySlack(authorId: string, title: string): void {
        console.log(`[Slack] Posting to team channel: @${authorId} published '${title}'`);
    }
}


// --- 2. The Facade (พระเอกของเรา) ---
// หน้าที่: รวบรวม 8 Subsystems ที่ซับซ้อนมาจัดการใน Method เดียว!

class ArticlePublishingFacade {
    private auth: AuthService;
    private validator: ContentValidator;
    private imageService: ImageService;
    private db: DatabaseService;
    private notify: NotificationService;

    constructor() {
        this.auth = new AuthService();
        this.validator = new ContentValidator();
        this.imageService = new ImageService();
        this.db = new DatabaseService();
        this.notify = new NotificationService();
    }

    // 🎯 Client เรียกแค่ method นี้บรรทัดเดียว จบ!
    // ภายในจัดการ 8 subsystems ให้อัตโนมัติ
    public publishArticle(article: Article): void {
        console.log(`Publishing Article: "${article.title}"`);
        console.log()
        // Step 1: Authentication & Authorization
        if (!this.auth.isAuthenticated(article.authorId)) {
            throw new Error("❌ Unauthorized!");
        }
        this.auth.getUserPermission(article.authorId);

        // Step 2: Content Validation
        if (this.validator.hasBadWords(article.content)) {
            throw new Error("❌ Content contains inappropriate words.");
        }
        if (!this.validator.checkContentLength(article.content)) {
            throw new Error("❌ Content too short!");
        }

        // Step 3: Image Processing
        const optimizedImage = this.imageService.optimizeCoverImage(article.coverImage);
        article.coverImage = optimizedImage;

        // Step 5: Save to Database
        this.db.save(article);

        // Step 7: Send Notifications
        this.notify.notifySubscribers(article.title);
        this.notify.notifySlack(article.authorId, article.title);

        console.log("\n=== ✅ Publishing Complete ===");
        console.log()
    }
}

// --- 3. User Class (ผู้ใช้งานที่มี Article) ---

class User {
    id: string;
    name: string;
    articles: Article[];

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
        this.articles = [];
    }

    // User เพิ่ม article ใหม่
    createArticle(title: string, content: string, tags?: string[], coverImage?: string): Article {
        const article: Article = {
            title,
            content,
            authorId: this.id,
            tags,
            coverImage
        };
        this.articles.push(article);
        console.log(`📝 ${this.name} created article: "${title}"`);
        return article;
    }

    // 🎯 User ใช้ Facade เพื่อ publish article (ไม่ต้องกังวลเรื่องซับซ้อน)
    publishArticle(article: Article, facade: ArticlePublishingFacade): void {
        console.log(`\n👤 ${this.name} is publishing...`);
        facade.publishArticle(article);
    }
}

// --- 4. Client Code (ผู้ใช้งานจริง) ---

// 🎭 Without Facade (ถ้าไม่มี Facade ชีวิตจะลำบากแบบนี้):
// const auth = new AuthService();
// const validator = new ContentValidator();
// const imageService = new ImageService();
// const seo = new SEOService();
// ... ต้องจัดการทุก subsystem เอง 😱

// ✨ With Facade (ชีวิตง่ายขึ้นทันที - เรียกแค่บรรทัดเดียว!):

// สร้าง Facade ตัวเดียวที่จัดการทุกอย่าง
const publishingSystem = new ArticlePublishingFacade();

// สร้าง User และ Articles
const alice = new User("user_alice", "Alice");
const bob = new User("user_bob", "Bob");

// Alice สร้าง article ที่มี cover image และ tags
const article1 = alice.createArticle(
    "Mastering the Facade Pattern",
    "The Facade Pattern is a structural design pattern that provides a simplified interface to a complex subsystem. It hides the complexity and makes the system easier to use.",
    ["Design Patterns", "Architecture", "Best Practices"],
    "facade-cover.jpg"
);

// Bob สร้าง article แบบง่าย (ไม่มี cover, ไม่มี tags)
const article2 = bob.createArticle(
    "Quick Tips for TypeScript",
    "Here are some quick tips to improve your TypeScript code and make it more maintainable and type-safe."
);

// 🚀 User ใช้ Facade publish (เรียกง่ายมาก ไม่ต้องจัดการ subsystems เอง)
alice.publishArticle(article1, publishingSystem);
bob.publishArticle(article2, publishingSystem);

console.log("📊 Summary:");
console.log(`- Alice has ${alice.articles.length} article(s)`);
console.log(`- Bob has ${bob.articles.length} article(s)`);

// 💡 Key Point: User ไม่ต้องรู้ว่า Facade ทำอะไรข้างใน
//    แค่เรียก publishArticle() เดียว ก็ได้ผลลัพธ์ครบทุกอย่าง!