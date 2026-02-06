/**
 * 🏗️ PERSONAL WEBSITE CONTENT BUILDER (PROTOTYPE)
 * ------------------------------------------------
 * Pattern: Recursive Builder (Stack-based)
 * Purpose: สร้างโครงสร้างข้อมูลหน้าเว็บ (Tree Structure) โดยไม่อิงกับ Framework (React/Vue)
 * Output:  JSON Tree ที่พร้อมส่งไป Render หน้าบ้าน
 */

// ==========================================
// 1. Data Models (Schema)
// ==========================================

// ประเภทของ Layout ที่รองรับ
type LayoutType = 'list' | 'grid' | 'timeline' | 'card-row';

// Node คือชิ้นส่วนพื้นฐานของหน้าเว็บ (เป็นได้ทั้งกล่องใส่ของ หรือเนื้อหา)
interface PageNode {
    id: string;
    type: 'page' | 'section' | 'item';
    title?: string;
    layout?: LayoutType;      // เฉพาะ section
    data?: Record<string, any>; // เก็บข้อมูลดิบ (Text, Image URL, Date)
    children?: PageNode[];    // ลูกๆ ที่อยู่ข้างใน
}

// ==========================================
// 2. The Builder (Core Logic)
// ==========================================

class ContentBuilder {
    private root: PageNode;
    private currentContainer: PageNode;
    private stack: PageNode[] = []; // Stack ช่วยจำว่า "ตอนนี้เราทำงานอยู่ในกล่องใบไหน"

    constructor(pageTitle: string) {
        // สร้าง Root Page เตรียมไว้
        this.root = {
            id: 'root',
            type: 'page',
            title: pageTitle,
            children: []
        };
        this.currentContainer = this.root;
        this.stack.push(this.root);
    }

    /**
     * เปิดกล่อง Section ใหม่ (เช่น Projects, Experience)
     * @param title หัวข้อของ Section
     * @param layout การจัดวาง (Grid/List/Timeline)
     */
    public startSection(title: string, layout: LayoutType = 'list'): this {
        const newSection: PageNode = {
            id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            type: 'section',
            title: title,
            layout: layout,
            children: []
        };

        this.addNodeToCurrent(newSection);

        // ⬇️ ดำดิ่ง: ย้าย Focus เข้าไปใน Section ใหม่ (เพื่อใส่ของข้างใน)
        this.stack.push(newSection);
        this.currentContainer = newSection;

        return this;
    }

    /**
     * ใส่ชิ้นเนื้อหา (Item) ลงในกล่องปัจจุบัน
     * @param data ข้อมูลดิบ (JSON Object)
     */
    public addItem(data: Record<string, any>): this {
        const newItem: PageNode = {
            id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            type: 'item',
            data: data
        };
        this.addNodeToCurrent(newItem);
        return this;
    }

    /**
     * ⬆️ ถอยกลับ: ปิด Section ปัจจุบัน แล้วกลับไปที่กล่องแม่
     */
    public endSection(): this {
        if (this.stack.length > 1) {
            this.stack.pop(); // เอาตัวบนสุดออก
            this.currentContainer = this.stack[this.stack.length - 1]; // กลับไปหาตัวก่อนหน้า
        }
        return this;
    }

    /**
     * สร้างเสร็จแล้ว! ขอของหน่อย
     */
    public build(): PageNode {
        return this.root;
    }

    // Helper: ใส่ของเข้ากล่องปัจจุบัน
    private addNodeToCurrent(node: PageNode) {
        if (!this.currentContainer.children) {
            this.currentContainer.children = [];
        }
        this.currentContainer.children.push(node);
    }
}

// ==========================================
// 3. Visualization Helper (เพื่อความสวยงาม)
// ==========================================

class PageRenderer {
    static render(node: PageNode, indent: string = "", isLast: boolean = true): void {
        // เลือกไอคอนตามประเภท
        let icon = "📄"; // Page
        if (node.type === 'section') icon = "📦";
        if (node.type === 'item') icon = "🔹";

        // เส้นกิ่งไม้ (Tree structure chars)
        const branch = isLast ? "└─" : "├─";
        const prefix = indent + branch;

        // สร้างข้อความแสดงผล
        let display = `${prefix} ${icon} `;

        if (node.type === 'page') {
            display += `[PAGE] ${node.title}`;
        } else if (node.type === 'section') {
            display += `[${node.title}] (Layout: ${node.layout})`;
        } else if (node.type === 'item') {
            // ดึงข้อมูลเด่นๆ มาโชว์ (เช่น name หรือ title)
            const label = node.data?.title || node.data?.name || node.data?.role || "Content";
            const details = node.data?.tech ? `[${node.data.tech}]` : "";
            display += `${label} ${details}`;
        }

        console.log(display);

        // Recursive: วนลูปแสดงลูกๆ (ถ้ามี)
        if (node.children) {
            const nextIndent = indent + (isLast ? "   " : "│  ");
            node.children.forEach((child, index) => {
                const isLastChild = index === node.children!.length - 1;
                this.render(child, nextIndent, isLastChild);
            });
        }
    }
}

// ==========================================
// 4. Usage Scenario (การนำไปใช้จริง)
// ==========================================

// สร้างข้อมูลหน้า Profile ของคุณ
const myProfilePage = new ContentBuilder("FumadProff's Portfolio")

    // 1. Header Section
    .startSection("Hero Header", "card-row")
    .addItem({ name: "FumadProff", role: "CS Student & Developer", bio: "Learning via Patterns" })
    .endSection()

    // 2. Projects Section (Grid)
    .startSection("Featured Projects", "grid")
    .addItem({ title: "Smart Home App", tech: "IoT, Flutter", status: "Completed" })
    .addItem({ title: "Personal CMS", tech: "TypeScript, Builder Pattern", status: "In Progress" })
    .addItem({ title: "E-Commerce API", tech: "Go, Fiber", status: "Planned" })
    .endSection()

    // 3. Experience Section (Timeline - Nested Structure!)
    .startSection("Experience Journey", "timeline")

    // งานที่ 1 (Nested Section เพื่อกลุ่มข้อมูลย่อย)
    .startSection("Internship 2025", "list")
    .addItem({ title: "Backend Developer", company: "Tech Co.", desc: "Built REST APIs" })
    .addItem({ title: "Achievement", desc: "Optimized DB queries by 40%" })
    .endSection()

    // งานที่ 2
    .startSection("Freelance 2024", "list")
    .addItem({ title: "Web Developer", client: "Local Business", desc: "WordPress to Next.js migration" })
    .endSection()

    .endSection() // ปิด Experience

    // 4. Contact
    .startSection("Contact Me", "list")
    .addItem({ platform: "GitHub", url: "github.com/..." })
    .addItem({ platform: "Email", url: "contact@..." })
    .endSection()

    .build();

// ==========================================
// 5. Display Output
// ==========================================

console.log("\n✨ VISUALIZING WEBSITE STRUCTURE ✨");
console.log("===================================");
PageRenderer.render(myProfilePage);
console.log("===================================");