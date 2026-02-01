// 1. Component Interface (สัญญาหลัก)
// ทุกอย่างทั้ง Content จริง และ Decorator ต้องมี method นี้
interface IContentDisplay {
    render(): string;
    getPrice(): number; // สมมติว่า Content มีราคา (Sponsor อาจแพงขึ้น)
}

// 2. Concrete Component (เนื้อหาหลักของเรา)
class SimpleArticle implements IContentDisplay {
    constructor(private title: string, private price: number) { }

    render(): string {
        return `Article: ${this.title}`;
    }

    getPrice(): number {
        return this.price;
    }
}

// 3. Base Decorator (ตัวห่อหุ้มพื้นฐาน)
// หัวใจสำคัญ: มันต้อง Implement Interface เดียวกับตัวแม่ และ "ถือ" ตัวแม่ไว้ข้างใน
abstract class ContentDecorator implements IContentDisplay {
    protected component: IContentDisplay;

    constructor(component: IContentDisplay) {
        this.component = component;
    }

    render(): string {
        return this.component.render();
    }

    getPrice(): number {
        return this.component.getPrice();
    }
}

// 4. Concrete Decorators (ตัวเพิ่ม Feature จริงๆ)

// ตัวแปะป้าย NEW
class NewBadgeDecorator extends ContentDecorator {
    render(): string {
        // เพิ่มพฤติกรรม: ใส่ [NEW] ไว้ข้างหน้า แล้วค่อยเรียกของเดิม
        return `[NEW!] ${super.render()}`;
    }
}

// ตัวแปะป้าย SPONSORED
class SponsoredDecorator extends ContentDecorator {
    render(): string {
        // เพิ่มพฤติกรรม: ใส่สี หรือ ข้อความต่อท้าย
        return `[SPONSORED] ${super.render()} (Sponsored by AI Corp)`;
    }

    // เพิ่มพฤติกรรม: ถ้าเป็น Sponsor ราคาโฆษณาอาจจะเพิ่มขึ้น
    getPrice(): number {
        return super.getPrice() + 100;
    }
}

let myPost: IContentDisplay = new SimpleArticle("Design Patterns 101", 50);
console.log(myPost.render());

// Wrap ด้วย Decorators
myPost = new NewBadgeDecorator(myPost);
console.log(myPost.render());

myPost = new SponsoredDecorator(myPost);
console.log(myPost.render());

console.log(`Total Value: ${myPost.getPrice()}`);