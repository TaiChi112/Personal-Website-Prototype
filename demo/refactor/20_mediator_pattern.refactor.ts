// Mediator
interface IMediator {
    notify(sender: object, event: string): void;
}

// Base Component
class BaseComponent {
    protected mediator?: IMediator;

    constructor(mediator?: IMediator) {
        this.mediator = mediator;
    }

    public setMediator(mediator: IMediator): void {
        this.mediator = mediator;
    }

    protected notify(event: string): void {
        if (!this.mediator) {
            console.log("⚠️ No mediator set.");
            return;
        }
        this.mediator.notify(this, event);
    }
}

// Concrete Component
class TitleInput extends BaseComponent {
    public text: string = "";

    public type(content: string) {
        this.text = content;
        console.log(`📝 Title typed: "${this.text}"`);
        this.notify("keypress");
    }

    public clear() {
        this.text = "";
        console.log("📝 Title cleared.");
        this.notify("clear");
    }
}

class SaveButton extends BaseComponent {
    private enabled: boolean = false;

    public click() {
        if (this.enabled) {
            console.log("💾 Save Button Clicked: Data Saved!");
            this.notify("click");
        } else {
            console.log("🚫 Save Button is Disabled.");
        }
    }

    public setEnabled(status: boolean) {
        this.enabled = status;
        console.log(`   (Button is now ${status ? "Enabled" : "Disabled"})`);
    }
}

class AutoSaveCheckbox extends BaseComponent {
    private checked: boolean = false;

    public check() {
        this.checked = !this.checked;
        console.log(`✅ AutoSave is now ${this.checked}`);
        this.notify("check");
    }

    public isChecked(): boolean {
        return this.checked;
    }
}

// Concrete Mediator
class ArticleEditorMediator implements IMediator {
    constructor(
        private title: TitleInput,
        private saveBtn: SaveButton,
        private autoSave: AutoSaveCheckbox
    ) {
        this.title.setMediator(this);
        this.saveBtn.setMediator(this);
        this.autoSave.setMediator(this);
    }

    public notify(sender: object, event: string): void {
        if (event === "keypress") {
            if (this.title.text.length > 0 && !this.autoSave.isChecked()) {
                this.saveBtn.setEnabled(true);
            } else {
                this.saveBtn.setEnabled(false);
            }
        }

        if (event === "check") {
            if (this.autoSave.isChecked()) {
                console.log("   (Mediator: AutoSave ON → Disable manual save)");
                this.saveBtn.setEnabled(false);
            } else {
                if (this.title.text.length > 0) {
                    this.saveBtn.setEnabled(true);
                }
            }
        }

        if (event === "click") {
            console.log("   (Mediator: Saving complete → Clearing form)");
            this.title.clear();
            this.saveBtn.setEnabled(false);
        }

        if (event === "clear") {
            this.saveBtn.setEnabled(false);
        }
    }
}


// Client
const titleInput = new TitleInput();
const saveButton = new SaveButton();
const autoSaveBox = new AutoSaveCheckbox();
const editor = new ArticleEditorMediator(titleInput, saveButton, autoSaveBox);

console.log("\n--- SCENE 1: พิมพ์แล้วกด Save ได้ ---");
titleInput.type("Hello Mediator");
saveButton.click();

console.log("\n--- SCENE 2: เปิด AutoSave → Save ถูกปิด ---");
titleInput.type("Draft 1");
autoSaveBox.check();
saveButton.click();

console.log("\n--- SCENE 3: ปิด AutoSave → Save กลับมา ---");
autoSaveBox.check();
titleInput.type("Draft 2");
saveButton.click();