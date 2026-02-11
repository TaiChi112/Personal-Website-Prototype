
// Memento
interface IMemento { }

// Originator
interface IOriginator {
    save(): IMemento;
    restore(memento: IMemento): void;
}

// Concrete Mementos
class CodeMemento implements IMemento {
    constructor(
        public readonly state: {
            filename: string;
            content: string;
            lines: number;
        }
    ) { }
}
// Concrete Mementos
class DocsMemento implements IMemento {
    constructor(
        public readonly state: {
            title: string;body: string;tags: string[];}
    ) { }
}

// Concrete Originators
class CodeOriginator implements IOriginator {
    constructor(
        private filename: string,
        private content: string = ""
    ) { }

    public writeCode(newCode: string): void {
        this.content += newCode + "\n";
        console.log(`💻 [Code] Writing to ${this.filename}...`);
    }

    public save(): IMemento {
        return new CodeMemento({
            filename: this.filename,
            content: this.content,
            lines: this.content.split('\n').length
        });
    }

    public restore(m: IMemento): void {
        if (!(m instanceof CodeMemento)) {
            console.error(`❌ Error: Invalid memento type for CodeOriginator!`);
            return;
        }
        this.filename = m.state.filename;
        this.content = m.state.content;
        console.log(`⏪ [Code] Reverted ${this.filename} (${m.state.lines} lines)`);
    }

    public showPreview(): void {
        console.log(`   📄 PREVIEW: ${this.filename}\n   --------------------------\n${this.content}   --------------------------`);
    }
}

// Concrete Originators
class DocsOriginator implements IOriginator {
    constructor(
        private title: string,
        private body: string,
        private tags: string[] = []
    ) { }

    public edit(text: string): void {
        this.body += text;
        console.log(`✍️ [Docs] Editing "${this.title}"...`);
    }

    public addTag(tag: string): void {
        this.tags.push(tag);
    }

    public save(): IMemento {
        return new DocsMemento({
            title: this.title,
            body: this.body,
            tags: [...this.tags]
        });
    }

    public restore(m: IMemento): void {
        if (!(m instanceof DocsMemento)) {
            console.error(`❌ Error: Invalid memento type for DocsOriginator!`);
            return;
        }
        this.title = m.state.title;
        this.body = m.state.body;
        this.tags = m.state.tags;
        console.log(`⏪ [Docs] Reverted "${this.title}"`);
    }

    public read(): void {
        console.log(`   📖 READ: ${this.title} [${this.tags.join(', ')}]\n      > ${this.body}`);
    }
}

// Caretaker (Universal VCS)
class VersionControl {
    private history: Map<string, IMemento> = new Map();
    private historyList: string[] = []; // เก็บ list ชื่อ version เพื่อแสดงผล

    // รับ Originator เข้ามาผูกตั้งเเต่ต้น (Dependency Injection)
    constructor(private originator: IOriginator, private name: string = "VCS") { }

    public commit(versionId: string): void {
        // Caretaker เป็นคนสั่ง Originator ให้ save เอง
        const memento = this.originator.save();

        this.history.set(versionId, memento);
        this.historyList.push(versionId);

        console.log(`💾 [${this.name}] Committed snapshot: "${versionId}"`);
    }

    public checkout(versionId: string): void {
        const memento = this.history.get(versionId);

        if (!memento) {
            console.error(`❌ [${this.name}] Error: Version "${versionId}" not found.`);
            return;
        }

        // Caretaker สั่ง Originator ให้ restore เอง (Encapsulation สมบูรณ์แบบ)
        this.originator.restore(memento);
    }

    public showHistory(): void {
        console.log(`\n📜 [${this.name}] History: ${this.historyList.join(" -> ")}`);
    }
}

// --- Scenario 1: Developer working on Code ---
const mainTs = new CodeOriginator("main.ts", "// Init\n");
const git = new VersionControl(mainTs, "GIT"); 

git.commit("1.1");

mainTs.writeCode("const pi = 3.14;");
git.commit("1.2");

mainTs.writeCode("function bug() { throw Error; }"); 
mainTs.showPreview();

console.log("\n🚨 Bug Detected! Rolling back...");
git.showHistory();

git.checkout("1.2"); 
mainTs.showPreview(); 

const wiki = new DocsOriginator("System Design", "Draft content...");
const cms = new VersionControl(wiki, "CMS"); // สร้าง VCS ตัวใหม่ ผูกกับ Docs

cms.commit("draft");

wiki.edit("\nUpdated section: Architecture");
wiki.addTag("technical");
cms.commit("v1.0-release");

wiki.edit("\nSome bad typos hree...");
wiki.read();

console.log("\n🔙 Reverting typo...");
cms.checkout("v1.0-release");
wiki.read(); // 