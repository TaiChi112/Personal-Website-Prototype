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

    // Data Structure: 
    // Key = contentId
    // Value = Set ของ userId (Set ช่วยตัดคนซ้ำออกให้อัตโนมัติ)
    private readers: Map<string, Set<string>> = new Map(); // เก็บ contentId ที่อ่าน กับ set userId ที่อ่าน contentID นั้นๆ

    // เก็บชื่อ User ไว้ด้วย เพื่อเวลาดึง report จะได้เห็นชื่อคน (Map userId -> name)
    private userNames: Map<string, string> = new Map(); 

    private constructor() { console.log("⚡ [System] Manager Initialized."); }

    public static getInstance(): ContentActivityManager {
        if (!ContentActivityManager.instance) {
            ContentActivityManager.instance = new ContentActivityManager();
        }
        return ContentActivityManager.instance;
    }

    // ฟังก์ชันที่ User จะเรียกใช้ผ่าน user.read()
    public recordView(userId: string, userName: string, contentId: string): void {
        // 1. จำชื่อ User ไว้ (เผื่อเอาไปโชว์)
        this.userNames.set(userId, userName);

        // 2. ดึงสมุดรายชื่อของ Content นี้มา
        if (!this.readers.has(contentId)) { // ถ้าใน readers ยังไม่มี contentId ยังไม่มีคนอ่าน content จริงๆ ให้สร้าง Set ใหม่
            this.readers.set(contentId, new Set());
        }

        // 3. ลงชื่อคนอ่าน (ถ้าซ้ำ Set จะไม่เพิ่มให้)
        const readerSet = this.readers.get(contentId)!; // non-null assertion
        readerSet.add(userId);// เพิ่ม userId ลงใน Set

        console.log(`   📝 [Log] ${userName} (id:${userId}) read content '${contentId}'.`);
    }

    // ฟังก์ชันดูรายงาน (Report)
    public getReport(contentId: string): void {
        const readerSet = this.readers.get(contentId);
        if (!readerSet) {
            console.log(`\n📊 Report for '${contentId}': No readers yet.`);
            return;
        }

        const count = readerSet.size;
        // แปลง userId กลับเป็นชื่อคนเพื่อแสดงผล
        const names = Array.from(readerSet).map(id => this.userNames.get(id));

        console.log(`\n📊 Report for '${contentId}':`);
        console.log(`   - Total Unique Readers: ${count}`);
        console.log(`   - Who read it?: ${names.join(", ")}`);
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