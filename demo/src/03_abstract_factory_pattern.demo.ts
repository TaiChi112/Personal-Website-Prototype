// ==========================================
// 1. Abstract Products (สินค้าที่โรงงานต้องผลิต)
// ==========================================
interface ICard {
    render(): void;
}

interface IButton { // เพิ่มสินค้าใหม่: ปุ่มกด
    click(): void;
}

// ==========================================
// 2. Abstract Factory (แม่พิมพ์ของโรงงาน)
// ==========================================
// เปลี่ยนชื่อจาก StyleComponent เป็น ThemeFactory ให้สื่อความหมาย
interface ThemeFactory {
    createCard(): ICard;
    createButton(): IButton; // โรงงานต้องผลิตปุ่มได้ด้วย
}

// ==========================================
// 3. Concrete Products (สินค้าจริง)
// ==========================================

// --- Modern Family ---
class ModernCard implements ICard {
    render(): void { console.log("🎨 [Modern] Rendering Card with Rounded Corners"); }
}
class ModernButton implements IButton {
    click(): void { console.log("🎨 [Modern] Button Clicked (Ripple Effect)"); }
}

// --- Classic Family ---
class ClassicCard implements ICard {
    render(): void { console.log("📜 [Classic] Rendering Card with Border"); }
}
class ClassicButton implements IButton {
    click(): void { console.log("📜 [Classic] Button Clicked (Simple Click)"); }
}

// ==========================================
// 4. Concrete Factories (โรงงานผลิตจริง)
// ==========================================

class ModernThemeFactory implements ThemeFactory {
    createCard(): ICard { return new ModernCard(); }
    createButton(): IButton { return new ModernButton(); }
}

class ClassicThemeFactory implements ThemeFactory {
    createCard(): ICard { return new ClassicCard(); }
    createButton(): IButton { return new ClassicButton(); }
}

// ==========================================
// 5. Client / Application (ผู้ใช้งานโรงงาน)
// ==========================================

// User เก็บแค่ Data (SRP: ทำหน้าที่เก็บข้อมูลอย่างเดียว)
class User {
    id: string;
    name: string;
    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
}

// App หรือ Page ทำหน้าที่จัดการ UI (แยกออกจาก User)
class UserProfilePage {
    private factory: ThemeFactory;
    private user: User;

    constructor(user: User, factory: ThemeFactory) {
        this.user = user;
        this.factory = factory;
    }

    // ฟีเจอร์: เปลี่ยน Theme ได้ตลอดเวลา (Runtime Switching)
    public setTheme(factory: ThemeFactory) {
        this.factory = factory;
        console.log(`\n--- Switching Theme for ${this.user.name} ---`);
        this.renderPage(); // Re-render ทันทีเมื่อเปลี่ยน
    }

    public renderPage() {
        // Factory จะรับประกันว่า Card และ Button เป็น Theme เดียวกันเสมอ (Consistency)
        const card = this.factory.createCard();
        const button = this.factory.createButton();

        console.log(`Rendering Profile for: ${this.user.name}`);
        card.render();
        button.click();
    }
}

// ==========================================
// 6. Usage (การใช้งาน)
// ==========================================

const userAlice = new User("1", "Alice");

// เริ่มต้นด้วย Modern Theme
const app = new UserProfilePage(userAlice, new ModernThemeFactory());
app.renderPage();
// Output: 
// 🎨 [Modern] Rendering Card...
// 🎨 [Modern] Button Clicked...

// เปลี่ยนใจอยากใช้ Classic Theme
app.setTheme(new ClassicThemeFactory());
// Output:
// 📜 [Classic] Rendering Card...
// 📜 [Classic] Button Clicked...