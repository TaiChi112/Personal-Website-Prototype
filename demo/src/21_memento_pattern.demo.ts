// --- 1. The Memento (กล่องความทรงจำ) ---
// หน้าที่: เก็บ State แบบ Immutable (แก้ไม่ได้)
class ArticleMemento {
    // เก็บสถานะ ณ เวลานั้นๆ
    constructor(
        private readonly title: string,
        private readonly content: string,
        private readonly timestamp: Date
    ) { }

    // Getter (ให้ Originator อ่านได้คนเดียวในทางทฤษฎี)
    public getState() {
        return {
            title: this.title,
            content: this.content,
            date: this.timestamp
        };
    }

    public getName(): string {
        return `${this.timestamp.toLocaleTimeString()} / ${this.title.substring(0, 10)}...`;
    }
}

// --- 2. The Originator (ตัวต้นเรื่อง: Editor) ---
// หน้าที่: ทำงานปกติ และสามารถ "คาย" Memento ออกมา หรือ "กิน" Memento กลับเข้าไป
class ArticleEditor {
    private title: string;
    private content: string;

    constructor(title: string, content: string) {
        this.title = title;
        this.content = content;
    }

    // แก้ไขข้อมูล (จำลองการพิมพ์งาน)
    public type(newContent: string): void {
        this.content = newContent;
        console.log(`✏️ Typing: "${this.content}"`);
    }

    public changeTitle(newTitle: string): void {
        this.title = newTitle;
        console.log(`🏷️ Renamed to: "${this.title}"`);
    }

    public showCurrent(): void {
        console.log(`📄 CURRENT: [${this.title}] - ${this.content}`);
    }

    // --- Memento Logic ---

    // Save: สร้าง Snapshot ส่งออกไป
    public save(): ArticleMemento {
        console.log("💾 Saving snapshot...");
        return new ArticleMemento(this.title, this.content, new Date());
    }

    // Restore: รับ Snapshot เข้ามา แล้วทับข้อมูลตัวเอง
    public restore(memento: ArticleMemento): void {
        const state = memento.getState();
        this.title = state.title;
        this.content = state.content;
        console.log(`⏪ Restored to version: ${state.date.toLocaleTimeString()}`);
    }
}

// --- 3. The Caretaker (ผู้ดูแลประวัติ) ---
// หน้าที่: เก็บ Memento ไว้ในกล่อง (History Array)
class HistoryKeeper {
    private mementos: ArticleMemento[] = [];
    private editor: ArticleEditor;

    constructor(editor: ArticleEditor) {
        this.editor = editor;
    }

    // สั่งให้ Editor เซฟ แล้วเก็บเข้าคลัง
    public backup(): void {
        this.mementos.push(this.editor.save());
    }

    // สั่งให้ Undo (เอาตัวล่าสุดออกมา แล้วยัดกลับใส่ Editor)
    public undo(): void {
        if (this.mementos.length === 0) {
            console.log("❌ No history to undo!");
            return;
        }

        const memento = this.mementos.pop(); // ดึงตัวล่าสุดออก
        if (memento) {
            this.editor.restore(memento);
        }
    }

    public showHistory(): void {
        console.log("\n📜 History List:");
        this.mementos.forEach(m => console.log(` - ${m.getName()}`));
    }
}

// --- Client Usage ---

const editor = new ArticleEditor("My Blog", "");
const history = new HistoryKeeper(editor);

// 1. เขียนครั้งแรก
editor.type("Hello World");
history.backup(); // Save Version 1

// 2. เขียนต่อ
editor.type("Hello World and Design Patterns");
editor.changeTitle("Advanced Blog");
history.backup(); // Save Version 2

// 3. เขียนพลาด (เผลอลบข้อมูล)
editor.type("Opps deleted everything...");
editor.showCurrent();
// Output: 📄 CURRENT: [Advanced Blog] - Opps deleted everything...

// 4. อยากย้อนกลับ (Undo ครั้งที่ 1)
console.log("\n--- Executing Undo ---");
history.undo(); // ย้อนกลับไป Version 2
editor.showCurrent();
// Output: 📄 CURRENT: [Advanced Blog] - Hello World and Design Patterns

// 5. อยากย้อนกลับอีก (Undo ครั้งที่ 2)
console.log("\n--- Executing Undo Again ---");
history.undo(); // ย้อนกลับไป Version 1
editor.showCurrent();
// Output: 📄 CURRENT: [My Blog] - Hello World