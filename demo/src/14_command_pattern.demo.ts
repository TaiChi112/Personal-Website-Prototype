// --- 1. The Receiver (พ่อครัว / คนทำงานจริง) ---
// Class นี้รู้ business logic ของการจัดการข้อความ
class TextEditorService {
    private clipboard: string = "";
    public content: string = "";

    copy(text: string) {
        this.clipboard = text;
        console.log(`[Receiver] Copied to clipboard: "${this.clipboard}"`);
    }

    paste(): string {
        console.log(`[Receiver] Pasting: "${this.clipboard}"`);
        return this.clipboard;
    }

    // ฟังก์ชันช่วยสำหรับการ Undo (ลบข้อความที่เพิ่งแปะไป)
    deleteLastPart(length: number) {
        this.content = this.content.slice(0, -length);
        console.log(`[Receiver] Content after undo: "${this.content}"`);
    }

    addContent(text: string) {
        this.content += text;
        console.log(`[Receiver] Current Content: "${this.content}"`);
    }
}

// --- 2. The Command Interface (ใบออเดอร์มาตรฐาน) ---
interface ICommand {
    execute(): void; // สั่งทำ
    undo(): void;    // สั่งยกเลิก
}

// --- 3. Concrete Commands (เมนูอาหารต่างๆ) ---

// คำสั่ง Copy (อันนี้ Undo ไม่ได้ เพราะแค่ก๊อปปี้ ไม่ได้แก้เนื้อหา)
class CopyCommand implements ICommand {
    constructor(private service: TextEditorService, private textToCopy: string) { }

    execute(): void {
        this.service.copy(this.textToCopy);
    }

    undo(): void {
        console.log("[Command] Copy cannot be undone (and no need to).");
    }
}

// คำสั่ง Paste (อันนี้ Undo ได้ คือต้องลบสิ่งที่แปะออก)
class PasteCommand implements ICommand {
    private pastedLength: number = 0; // จำไว้ว่าแปะไปกี่ตัวอักษร (State)

    constructor(private service: TextEditorService) { }

    execute(): void {
        const text = this.service.paste();
        this.service.addContent(text);
        this.pastedLength = text.length; // เก็บ State ไว้เพื่อ undo
    }

    undo(): void {
        console.log("Create Undo action for Paste...");
        this.service.deleteLastPart(this.pastedLength);
    }
}

// --- 4. The Invoker (พนักงานเสิร์ฟ / Toolbar / Remote) ---
// หน้าที่: รับคำสั่ง -> เก็บประวัติ -> สั่งทำงาน
class EditorToolbar {
    private history: ICommand[] = []; // Stack เก็บประวัติการกดปุ่ม

    // รับคำสั่งเข้ามา แล้วสั่ง execute ทันที พร้อมเก็บลงประวัติ
    public clickButton(command: ICommand) {
        command.execute();
        this.history.push(command); // เก็บเข้า Stack
    }

    // ฟีเจอร์เด็ด: กด Ctrl+Z
    public pressUndo() {
        const lastCommand = this.history.pop(); // ดึงคำสั่งล่าสุดออกมา
        if (lastCommand) {
            lastCommand.undo(); // สั่งย้อนกลับ
        } else {
            console.log("Nothing to undo.");
        }
    }
}
class User {
    id: string;
    name: string
    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
    call(invoker: EditorToolbar, command: ICommand) {
        invoker.clickButton(command);
    }
}
// --- Client Usage (การใช้งานจริง) ---

// 1. Setup ระบบ
const myEditor = new TextEditorService(); // Receiver
const toolbar = new EditorToolbar(); // Invoker

console.log("--- 1. User copies 'Hello' ---");
const user1 = new User("u1", "Alice");
user1.call(toolbar, new CopyCommand(myEditor, "Hello "));

const copyCmd = new CopyCommand(myEditor, "Hello ");
toolbar.clickButton(copyCmd);

console.log("\n--- 2. User pastes it (Action 1) ---");
const user2 = new User("u2", "Bob");
user2.call(toolbar, new PasteCommand(myEditor));

const pasteCmd1 = new PasteCommand(myEditor);
toolbar.clickButton(pasteCmd1);
// Content: "Hello "

console.log("\n--- 3. User pastes it again (Action 2) ---");
const user3 = new User("u3", "Charlie");
user3.call(toolbar, new PasteCommand(myEditor));

const pasteCmd2 = new PasteCommand(myEditor); // New instance for new action
toolbar.clickButton(pasteCmd2);
// Content: "Hello Hello "

console.log("\n--- 4. User realizes mistake -> Press Undo (Ctrl+Z) ---");
user1.call(toolbar, pasteCmd2);
toolbar.pressUndo();
// มันจะไปเรียก pasteCmd2.undo() -> ลบ "Hello " หลังออก
// Content: "Hello "

console.log("\n--- 5. User Press Undo Again (Ctrl+Z) ---");
user2.call(toolbar, pasteCmd1);
toolbar.pressUndo();
// มันจะไปเรียก pasteCmd1.undo() -> ลบ "Hello " แรกออก
// Content: ""

// plan idea สำหรับ copy ใช้ prototype ร่วมเเล้วสามารถ undo ได้โดยการเก็บ state เก่าไว้