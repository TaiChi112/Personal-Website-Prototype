// Context
interface Article {
    title: string;
    content: string;
    authorId: string;
    tags?: string[];
}

// Subsystem 
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

class DatabaseService {
    save(article: Article): void {
        console.log("[DB] Saving article to database...");
        console.log(`[DB] Article ID: ${Math.random().toString(36).substring(7)}`);
    }
}

class NotificationService {
    notifySubscribers(title: string): void {
        console.log(`[Email] Sending alert to subscribers...`);
        console.log(`[Email] Subject: New article '${title}' is out!`);
    }

    notifySlack(authorId: string, title: string): void {
        console.log(`[Slack] Posting to team channel: @${authorId} published '${title}'`);
    }
}
// Facade
class ArticlePublishingFacade {
    private auth: AuthService;
    private validator: ContentValidator;
    private db: DatabaseService;
    private notify: NotificationService;

    constructor() {
        this.auth = new AuthService();
        this.validator = new ContentValidator();
        this.db = new DatabaseService();
        this.notify = new NotificationService();
    }

    public publishArticle(article: Article): void {
        console.log(`Publishing Article: "${article.title}"`);
        console.log()
        // Authentication & Authorization
        if (!this.auth.isAuthenticated(article.authorId)) {
            throw new Error("❌ Unauthorized!");
        }
        this.auth.getUserPermission(article.authorId);

        // Content Validation
        if (this.validator.hasBadWords(article.content)) {
            throw new Error("❌ Content contains inappropriate words.");
        }
        if (!this.validator.checkContentLength(article.content)) {
            throw new Error("❌ Content too short!");
        }

        // Save to Database
        this.db.save(article);

        // Send Notifications
        this.notify.notifySubscribers(article.title);
        this.notify.notifySlack(article.authorId, article.title);

        console.log("\n=== ✅ Publishing Complete ===");
        console.log()
    }
}
// Client
class User {
    id: string;
    name: string;
    articles: Article[];

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
        this.articles = [];
    }

    createArticle(title: string, content: string, tags?: string[]): Article {
        const article: Article = {
            title,
            content,
            authorId: this.id,
            tags,
        };
        this.articles.push(article);
        console.log(`📝 ${this.name} created article: "${title}"`);
        return article;
    }

    published(article: Article, facade: ArticlePublishingFacade): void {
        console.log(`\n👤 ${this.name} is publishing...`);
        facade.publishArticle(article);
    }
}

const publishingSystem = new ArticlePublishingFacade();

const Admain = new User("user_admin", "Admin");

const article1 = Admain.createArticle(
    "Mastering the Facade Pattern",
    "The Facade Pattern is a structural design pattern that provides a simplified interface to a complex subsystem. It hides the complexity and makes the system easier to use.",
    ["Design Patterns", "Architecture", "Best Practices"],
);

Admain.published(article1, publishingSystem);

console.log("📊 Summary:");
console.log(`- Admain has ${Admain.articles.length} article(s)`);