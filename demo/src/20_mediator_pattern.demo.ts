// --- 1. The Mediator Interface (สัญญาระหว่างหอคอยกับเครื่องบิน) ---
interface IMediator {
    notify(sender: object, event: string): void;
}

// --- 2. The Base Component (Colleague) ---
// เครื่องบินทุกลำต้องรู้ว่าหอคอยคือใคร
class BaseComponent {
    protected mediator: IMediator;

    constructor(mediator?: IMediator) {
        this.mediator = mediator!;
    }

    public setMediator(mediator: IMediator): void {
        this.mediator = mediator;
    }
}

// --- 3. Concrete Components (เครื่องบินลำต่างๆ) ---
// สังเกตว่า Component พวกนี้ "โง่" มาก (Dumb Components)
// มันไม่รู้ Logic อะไรเลย แค่รู้ว่าถ้ามีการเปลี่ยนแปลง ให้ตะโกนบอก Mediator

class TitleInput extends BaseComponent {
    public text: string = "";

    public type(content: string) {
        this.text = content;
        console.log(`📝 Title typed: "${this.text}"`);
        // ตะโกนบอกหอคอย: "ฉันเปลี่ยนค่าแล้วนะ!"
        this.mediator.notify(this, "keypress");
    }

    public clear() {
        this.text = "";
        console.log("📝 Title cleared.");
        this.mediator.notify(this, "clear");
    }
}

class SaveButton extends BaseComponent {
    private enabled: boolean = false;

    public click() {
        if (this.enabled) {
            console.log("💾 Save Button Clicked: Data Saved!");
            this.mediator.notify(this, "click");
        } else {
            console.log("🚫 Save Button is Disabled.");
        }
    }

    public setEnabled(status: boolean) {
        this.enabled = status;
        console.log(`   (Button is now ${status ? 'Enabled' : 'Disabled'})`);
    }
}

class AutoSaveCheckbox extends BaseComponent {
    private checked: boolean = false;

    public check() {
        this.checked = !this.checked;
        console.log(`✅ AutoSave is now ${this.checked}`);
        this.mediator.notify(this, "check");
    }

    public isChecked(): boolean {
        return this.checked;
    }
}

// --- 4. Concrete Mediator (หอคอยตัวจริง: Editor Dialog) ---
// Logic ความสัมพันธ์ที่ซับซ้อน จะมากองรวมกันที่นี่ที่เดียว!!

class ArticleEditorMediator implements IMediator {
    // Mediator ต้องรู้จัก Component ทุกตัว
    constructor(
        private title: TitleInput,
        private saveBtn: SaveButton,
        private autoSave: AutoSaveCheckbox
    ) {
        // ลงทะเบียนตัวเองให้ Component รู้จัก
        this.title.setMediator(this);
        this.saveBtn.setMediator(this);
        this.autoSave.setMediator(this);
    }

    // Method เดียวที่ควบคุมทุกอย่าง
    public notify(sender: object, event: string): void {
        // Logic 1: ถ้า Title มีข้อความ -> ให้เปิดปุ่ม Save
        if (event === "keypress") {
            if (this.title.text.length > 0) {
                this.saveBtn.setEnabled(true);
            } else {
                this.saveBtn.setEnabled(false);
            }
        }

        // Logic 2: ถ้าติ๊ก AutoSave -> ให้ปิดปุ่ม Save (เพราะมันจะเซฟเอง)
        if (event === "check") {
            if (this.autoSave.isChecked()) {
                console.log("   (Mediator: AutoSave on -> Disabling manual save)");
                this.saveBtn.setEnabled(false);
            } else {
                // ต้องเช็คกลับว่า Title มีค่าไหม
                if (this.title.text.length > 0) {
                    this.saveBtn.setEnabled(true);
                }
            }
        }

        // Logic 3: ถ้ากด Save เสร็จ -> ให้เคลียร์ Title ทิ้ง
        if (event === "click") {
            console.log("   (Mediator: Saving complete -> Clearing form)");
            this.title.clear();
            this.saveBtn.setEnabled(false);
        }
    }
}

// --- Client Usage ---

// 1. สร้าง Component เปล่าๆ
const titleInput = new TitleInput();
const saveButton = new SaveButton();
const autoSaveBox = new AutoSaveCheckbox();

// 2. สร้าง Mediator มาคุม Component เหล่านั้น (จับมันมาเชื่อมกัน)
const editor = new ArticleEditorMediator(titleInput, saveButton, autoSaveBox);

console.log("--- Scenario 1: Typing text ---");
titleInput.type("Hello Mediator");
// Output: Button is now Enabled

console.log("\n--- Scenario 2: Clicking Save ---");
saveButton.click();
// Output: Data Saved! -> Clearing form -> Button is now Disabled

console.log("\n--- Scenario 3: Using AutoSave ---");
titleInput.type("My Draft"); // Button Enabled
autoSaveBox.check(); // Check AutoSave
// Output: AutoSave is now true -> (Mediator) Disabling manual save -> Button Disabled