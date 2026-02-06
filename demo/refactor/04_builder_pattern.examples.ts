// สิ่งที่ Frontend (React/Vue) จะได้รับไป Render
export interface PageNode {
    type: 'section' | 'item'; // section = กล่อง, item = เนื้อหา
    layout?: 'grid' | 'list' | 'timeline'; // บอก Frontend ว่าจะวางลูกๆ ยังไง
    title?: string;
    data?: unknown; // เก็บข้อมูลดิบ เช่น text, image url, date
    children?: PageNode[]; // ลูกๆ (ถ้ามี)
}

export class PageBuilder {
    private root: PageNode;
    private currentContainer: PageNode;
    private stack: PageNode[] = []; // Stack ช่วยจำว่าตอนนี้เรา "อยู่ในกล่องไหน"

    constructor(rootTitle: string) {
        // สร้าง Root Container เริ่มต้น
        this.root = {
            type: 'section',
            layout: 'list', // default เป็นแนวตั้ง
            title: rootTitle,
            children: []
        };
        this.currentContainer = this.root;
        this.stack.push(this.root);
    }

    // 1. เปิด Section ใหม่ (เช่น Experience, Skills)
    public section(title: string, layout: 'grid' | 'list' | 'timeline' = 'list'): this {
        const newSection: PageNode = {
            type: 'section',
            title,
            layout,
            children: []
        };

        // ใส่ Section ใหม่ลงในกล่องปัจจุบัน
        this.currentContainer.children?.push(newSection);

        // ย้าย "Focus" เข้าไปในกล่องใหม่ (Push ลง Stack)
        this.stack.push(newSection);
        this.currentContainer = newSection;

        return this;
    }

    // 2. ใส่เนื้อหา (Item)
    public item(data: Record<string, unknown>): this {
        const leaf: PageNode = {
            type: 'item',
            data: data
        };
        this.currentContainer.children?.push(leaf);
        return this;
    }

    // 3. ปิด Section ปัจจุบัน (ถอยออกมา 1 ขั้น)
    public end(): this {
        if (this.stack.length > 1) {
            this.stack.pop(); // เอาตัวบนสุดออก
            this.currentContainer = this.stack[this.stack.length - 1]; // กลับไป focus ตัวก่อนหน้า
        }
        return this;
    }

    // 4. ส่งงาน
    public build(): PageNode {
        return this.root;
    }
}

const myResumePage = new PageBuilder("My Resume")

    // --- Section 1: Header ---
    .section("Profile Header", "list")
    .item({ name: "FumadProff", role: "Software Engineer", img: "profile.jpg" })
    .end() // จบ Header

    // --- Section 2: Experience (Timeline Layout) ---
    .section("Work Experience", "timeline")

    // Job 1
    .section("Senior Dev @ Tech Corp") // Section ซ้อน Section ได้!
    .item({ text: "Led a team of 5 developers", year: "2024" })
    .item({ text: "Optimized backend performance by 20%", year: "2024" })
    .end()

    // Job 2
    .section("Junior Dev @ Startup")
    .item({ text: "Built landing pages with Next.js", year: "2022" })
    .end()

    .end() // จบ Experience

    // --- Section 3: Skills (Grid Layout) ---
    .section("Technical Skills", "grid")
    .item({ icon: "TS", name: "TypeScript" })
    .item({ icon: "React", name: "React" })
    .item({ icon: "Go", name: "Golang" })
    .item({ icon: "Docker", name: "Docker" })
    .end()

    .build();

// ลองดูผลลัพธ์
console.log(myResumePage);