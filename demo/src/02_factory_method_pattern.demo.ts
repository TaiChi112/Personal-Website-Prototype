interface ILayout {
    render(): void;
}
class ListLayout implements ILayout {
    render(): void {
        console.log("Rendering in List Layout");
    }
}
class GridLayout implements ILayout {
    render(): void {
        console.log("Rendering in Grid Layout");
    }
}

abstract class Layout {
    abstract createLayout(): ILayout;
    renderLayout(): void {
        const layout = this.createLayout();
        layout.render();
    }
}
class CreateListLayout extends Layout {
    createLayout(): ILayout {
        return new ListLayout();
    }
}
class CreateGridLayout extends Layout {
    createLayout(): ILayout {
        return new GridLayout();
    }
}

class User {
    id: string;
    name: string;
    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
    changeLayout(layout: Layout): Layout {
        const newLayout = layout;
        return newLayout;
    }
}

// CLIENT CODE - การใช้งาน Factory Method

const user1 = new User("1", "Alice");

const listLayoutCreator: Layout = new CreateListLayout();
listLayoutCreator.renderLayout();

const gridLayoutCreator: Layout = new CreateGridLayout();
user1.changeLayout(gridLayoutCreator);
gridLayoutCreator.renderLayout();