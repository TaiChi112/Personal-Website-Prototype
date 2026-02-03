// context
class Article {
    id: string;
    title: string;
    constructor(id: string, title: string) {
        this.id = id;
        this.title = title;
    }
}
// reading record detail
interface ReadingRecord {
    userId: string;
    userName: string;
    contentId: string;
}

// singleton pattern
class ContentActivityManager {
    private static instance: ContentActivityManager;

    private readingRecords: Array<ReadingRecord> = [];
    private constructor() { console.log("⚡ [System] Manager Initialized."); }

    public static getInstance(): ContentActivityManager {
        if (!ContentActivityManager.instance) {
            ContentActivityManager.instance = new ContentActivityManager();
        }
        return ContentActivityManager.instance;
    }
    public recordView(userId: string, userName: string, contentId: string): void {
        this.readingRecords.push({
            userId,
            userName,
            contentId
        });
        console.log(`   📝 ${userName} read content '${contentId}'`);
    }
    public getReport(contentId: string): void {
        // filter records by contentId
        const records = this.readingRecords.filter(r => r.contentId === contentId);
        if (records.length === 0) {
            console.log(`\n📊 No readers yet`);
            return;
        }
        const totalReads = records.length;
        const uniqueUserIds = new Set(records.map(r => r.userId));
        const uniqueCount = uniqueUserIds.size;
        const names = Array.from(uniqueUserIds).map(userId =>
            records.find(r => r.userId === userId)?.userName
        );
        console.log(`\n📊 Report for '${contentId}':`);
        console.log(`   - Total Reads: ${totalReads}`);
        console.log(`   - Unique Readers: ${uniqueCount}`);
        console.log(`   - Who: ${names.join(", ")}`);
    }
}
// client
class User {
    id: string;
    name: string;
    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    public read(content: Article): void {
        console.log(`👤 ${this.name} clicks on "${content.title}"`);
        const manager = ContentActivityManager.getInstance();
        manager.recordView(this.id, this.name, content.id);
    }
}

const article1 = new Article("art_101", "Design Pattern Singleton");
const manager = ContentActivityManager.getInstance();

const alice = new User("u_001", "Alice");
const bob = new User("u_002", "Bob");

alice.read(article1);

bob.read(article1);

console.log("\n--- Alice comes back ---");
alice.read(article1);

manager.getReport(article1.id);

/* 
    สร้าง article -> สร้าง manager (singleton) -> สร้าง user Alice -> Alice อ่าน article -> 
    สร้าง user Bob -> Bob อ่าน article -> Alice อ่าน article ซ้ำ -> 
    manager สรุปรายงาน
*/