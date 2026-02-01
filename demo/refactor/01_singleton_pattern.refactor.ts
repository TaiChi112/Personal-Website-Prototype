// ==========================================
// 1. The Content (บทความ)
// ==========================================
class Article {
    id: string;
    title: string;
    constructor(id: string, title: string) {
        this.id = id;
        this.title = title;
    }
}

// ==========================================
// 2. The Singleton (ระบบจดบันทึก)
// ==========================================
class ContentActivityManager {
    private static instance: ContentActivityManager;

    private readingRecords: Array<{
        userId: string;
        userName: string;
        contentId: string;
    }> = [];

    private constructor() { console.log("⚡ [System] Manager Initialized."); }

    public static getInstance(): ContentActivityManager {
        if (!ContentActivityManager.instance) {
            ContentActivityManager.instance = new ContentActivityManager();
        }
        return ContentActivityManager.instance;
    }

    // ฟังก์ชันที่ User จะเรียกใช้ผ่าน user.read()
    public recordView(userId: string, userName: string, contentId: string): void {
        // เพียงแค่บันทึกลง Array
        this.readingRecords.push({
            userId,
            userName,
            contentId
        });

        console.log(`   📝 ${userName} read content '${contentId}'`);
    }

    // ฟังก์ชันดูรายงาน (Report)
    public getReport(contentId: string): void {
        // Filter เอาแค่ contentId นี้
        const records = this.readingRecords.filter(r => r.contentId === contentId);

        if (records.length === 0) {
            console.log(`\n📊 No readers yet`);
            return;
        }

        // นับคนอ่านจำนวนครั้ง
        const totalReads = records.length;

        // นับคนอ่านที่ไม่ซ้ำ (unique)
        const uniqueUserIds = new Set(records.map(r => r.userId));
        const uniqueCount = uniqueUserIds.size;

        // ได้ชื่อคนจาก records (ไม่ต้องไปค้นหา)
        const names = Array.from(uniqueUserIds).map(userId =>
            records.find(r => r.userId === userId)?.userName
        );

        console.log(`\n📊 Report for '${contentId}':`);
        console.log(`   - Total Reads: ${totalReads}`);
        console.log(`   - Unique Readers: ${uniqueCount}`);
        console.log(`   - Who: ${names.join(", ")}`);
    }
}

// ==========================================
// 3. The User (ผู้ใช้งานจริง)
// ==========================================
class User {
    id: string;
    name: string;
    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    // Action ของ User
    public read(content: Article): void {
        console.log(`👤 ${this.name} clicks on "${content.title}"`);

        // --- จุดเชื่อมต่อ (Integration Point) ---
        // User ไม่ต้องเก็บข้อมูลเอง แต่ส่งไปให้ Singleton จัดการ
        const manager = ContentActivityManager.getInstance();
        manager.recordView(this.id, this.name, content.id);
    }
}

// ==========================================
// 4. Usage Simulation (จำลองสถานการณ์)
// ==========================================

// Setup
const article1 = new Article("art_101", "Design Pattern Singleton");
const manager = ContentActivityManager.getInstance();

const alice = new User("u_001", "Alice");
const bob = new User("u_002", "Bob");

// --- Scene 1: Alice อ่านครั้งแรก ---
alice.read(article1);

// --- Scene 2: Bob อ่านบ้าง ---
bob.read(article1);

// --- Scene 3: Alice กลับมาอ่านซ้ำ (User เดิม) ---
console.log("\n--- Alice comes back ---");
alice.read(article1);
// สังเกตว่าใน Log จะมีการบันทึก แต่ใน Report จะไม่นับเพิ่ม

// --- Scene 4: ดูผลลัพธ์จาก Singleton ---
manager.getReport(article1.id);
