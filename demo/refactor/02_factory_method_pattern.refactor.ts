// ==========================================
// 1. Product Interface
// ==========================================
interface ILayout {
    render(): void;
}

class ListLayout implements ILayout {
    render(): void {
        console.log("   📋 Rendering in List Layout");
        console.log("   - Item 1")
        console.log("   - Item 2")
        console.log("   - Item 3")
    }
}

class GridLayout implements ILayout {
    render(): void {
        console.log("   📊 Rendering in Grid Layout");
        console.log("   [Item 1] [Item 2] [Item 3] ");
        console.log("   [Item 4] [Item 5] [Item 6] ");
        console.log("   [Item 7] [Item 8] [Item 9] ");
    }
}

// ==========================================
// 2. Factory Method Pattern (Creator)
// ==========================================
abstract class LayoutFactory {
    abstract createLayout(): ILayout;
}

class ListLayoutFactory extends LayoutFactory {
    createLayout(): ILayout {
        return new ListLayout();
    }
}

class GridLayoutFactory extends LayoutFactory {
    createLayout(): ILayout {
        return new GridLayout();
    }
}

// ==========================================
// 5. User (Interaction Only)
// ==========================================
class User {
    id: string;
    name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
    // User ใช้ Factory โดยตรง
    useLayout(factory: LayoutFactory): void {
        console.log(`👤 ${this.name} uses layout`);
        const layout = factory.createLayout();
        layout.render();
    }
}

// Usage
const alice = new User("1", "Alice");
alice.useLayout(new ListLayoutFactory());   
alice.useLayout(new GridLayoutFactory());;   