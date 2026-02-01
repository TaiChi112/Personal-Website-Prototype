// ==========================================
// 1. THE CONTRACT (Product Interface)
// ==========================================
interface ILayout {
    render(): void;
}

// Concrete Products (สินค้าจริง)
class ListLayout implements ILayout {
    render() { console.log("📋 [View] Rendering List..."); }
}

class GridLayout implements ILayout {
    render() { console.log("📊 [View] Rendering Grid..."); }
}

// ==========================================
// 2. THE CREATOR (Factory Method)
// ==========================================
abstract class LayoutFactory {
    // หัวใจสำคัญ: Factory Method
    abstract createLayout(): ILayout;
}

// Concrete Factories (โรงงานผลิตจริง)
class ListFactory extends LayoutFactory {
    createLayout() { return new ListLayout(); }
}

class GridFactory extends LayoutFactory {
    createLayout() { return new GridLayout(); }
}

// ==========================================
// 3. THE REGISTRY (Centralized Lookup)
// ==========================================
class LayoutRegistry {
    // เก็บ Factory ไว้ใน Map (ตัด Singleton boilerplate ออกเพื่อให้ Code อ่านง่าย)
    private static factories: Map<string, LayoutFactory> = new Map();

    static register(type: string, factory: LayoutFactory) {
        this.factories.set(type, factory);
    }

    static create(type: string): ILayout {
        const factory = this.factories.get(type);
        if (!factory) throw new Error(`❌ Layout '${type}' not registered!`);
        return factory.createLayout();
    }
}

// 🔧 Setup System (Config ครั้งเดียวจบ)
LayoutRegistry.register("list", new ListFactory());
LayoutRegistry.register("grid", new GridFactory());


// ==========================================
// 4. THE CLIENT (User & App)
// ==========================================
class Page {
    // Page ไม่ต้องรู้เรื่อง Factory เลย รู้แค่เรียกผ่าน Registry
    changeLayout(type: string) {
        console.log(`\n🔄 Switching to '${type}'...`);
        const layout = LayoutRegistry.create(type); // 1 บรรทัดจบ
        layout.render();
    }
}

class User {
    constructor(private name: string) { }

    clickChangeLayout(page: Page, type: string) {
        console.log(`👤 User ${this.name} clicked: ${type}`);
        try {
            page.changeLayout(type);
        } catch (e: unknown) {
            console.error(e);
        }
    }
}

// ==========================================
// 5. EXECUTION
// ==========================================
const myPage = new Page();
const alice = new User("Alice");

alice.clickChangeLayout(myPage, "list"); // ✅ Works
alice.clickChangeLayout(myPage, "grid"); // ✅ Works