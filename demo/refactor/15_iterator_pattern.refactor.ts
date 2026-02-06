// Iterator 
interface IIterator<T> {
    current(): T | null;
    next(): T | null;
    hasNext(): boolean;
}

// Collection
interface IAggregate {
    createIterator(): IIterator<string>;
}

// Concrete Collection
class ArticleList implements IAggregate {
    private articles: string[] = [];

    add(title: string) { this.articles.push(title); }

    public getLength(): number { return this.articles.length; }
    public getItem(index: number): string { return this.articles[index]; }

    createIterator(): IIterator<string> {
        return new ArticleIterator(this);
    }
}

class ArticleIterator implements IIterator<string> {
    private collection: ArticleList;
    private index: number = 0;

    constructor(collection: ArticleList) {
        this.collection = collection;
    }

    current(): string | null {
        if (!this.hasNext()) return null;
        return this.collection.getItem(this.index);
    }

    next(): string | null {
        const item = this.current();
        this.index++;
        return item;
    }

    hasNext(): boolean {
        return this.index < this.collection.getLength();
    }
}

class ProjectNode {
    constructor(public name: string, public children: ProjectNode[] = []) { }
}

class ProjectTree implements IAggregate {
    public root: ProjectNode;

    constructor(root: ProjectNode) {
        this.root = root;
    }

    createIterator(): IIterator<string> {
        return new TreeIterator(this.root);
    }
}

// Concrete Iterator
class TreeIterator implements IIterator<string> {
    private stack: ProjectNode[] = []; // ใช้ Stack ช่วยจำทาง
    private currentResult: string | null = null;

    constructor(root: ProjectNode) {
        this.stack.push(root);
    }

    current(): string | null {
        return this.currentResult;
    }

    hasNext(): boolean {
        return this.stack.length > 0;
    }

    next(): string | null {
        if (!this.hasNext()) return null;

        const node = this.stack.pop()!;
        this.currentResult = node.name;

        for (let i = node.children.length - 1; i >= 0; i--) {
            this.stack.push(node.children[i]);
        }

        return this.currentResult;
    }
}

// Client

const myArticles = new ArticleList();
myArticles.add("Article 1: Intro");
myArticles.add("Article 2: Deep Dive");
myArticles.add("Article 3: Summary");

const subProject = new ProjectNode("Sub-Task A", [
    new ProjectNode("Micro-Task A.1"),
    new ProjectNode("Micro-Task A.2")
]);
const mainProject = new ProjectNode("Main Project", [
    subProject,
    new ProjectNode("Sub-Task B")
]);
const myProjects = new ProjectTree(mainProject);

function printFeed(label: string, iterator: IIterator<string>) {
    console.log(`\n--- ${label} ---`);
    while (iterator.hasNext()) {
        console.log(iterator.next());
    }
}

printFeed("Article Feed (Run 1)", myArticles.createIterator());
printFeed("Article Feed (Run 2)", myArticles.createIterator());

printFeed("Project Feed (Run 1)", myProjects.createIterator());
printFeed("Project Feed (Run 2)", myProjects.createIterator());

class User {
    constructor(public id: string, public name: string) { }
    read(iterator: IIterator<string>) {
        console.log(`\n👤 ${this.name} reads:`);
        while (iterator.hasNext()) {
            console.log(`- ${iterator.next()}`);
        }
    }
}

const alice = new User("u1", "Alice");
const bob = new User("u2", "Bob");

alice.read(myArticles.createIterator());
bob.read(myProjects.createIterator());