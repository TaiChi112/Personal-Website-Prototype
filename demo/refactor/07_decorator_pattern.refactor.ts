// Component
interface IContentDisplay {
    render(): string;
}

// Concrete Component
class SimpleArticle implements IContentDisplay {
    constructor(private title: string) { }

    render(): string {
        return `Article: ${this.title}`;
    }
}
class SimpleBlog implements IContentDisplay {
    constructor(private title: string) { }
    render(): string {
        return `Blog Post: ${this.title}`;
    }
}
// Decorator
abstract class ContentDecorator implements IContentDisplay {
    private content: IContentDisplay;

    constructor(content: IContentDisplay) {
        this.content = content;
    }

    render(): string {
        return this.content.render();
    }
}

// Concrete Decorator
class NewBadgeDecorator extends ContentDecorator {
    render(): string {
        return `[NEW]! ${super.render()}`;
    }
}
class SponsoredDecorator extends ContentDecorator {
    render(): string {
        return `[SPONSORED] ${super.render()} (Sponsored by AI Corp)`;
    }
}
class PopularDecorator extends ContentDecorator {
    render(): string {
        return `[🔥 Popular Post!] ${super.render()}`;
    }
}

// Client
let myPost: IContentDisplay = new SimpleArticle("Design Patterns 101");
console.log(myPost.render());

// Wrap ด้วย Decorators
myPost = new NewBadgeDecorator(myPost);
console.log(myPost.render());
myPost = new SponsoredDecorator(myPost);
console.log(myPost.render());   
myPost = new PopularDecorator(myPost);
console.log(myPost.render());

let myBlog: IContentDisplay = new SimpleBlog("Understanding Decorators in TypeScript");
console.log(myBlog.render());
myBlog = new SponsoredDecorator(myBlog);
console.log(myBlog.render());
myBlog = new NewBadgeDecorator(myBlog);
console.log(myBlog.render());


console.log()
console.log()
console.log()

const SimpleArticle1:IContentDisplay = new SimpleArticle("Something Aritcle")
console.log(SimpleArticle1.render())

const NewSimpleArticle1 = new NewBadgeDecorator(SimpleArticle1)
console.log(NewSimpleArticle1.render())

const SponsoredNewArticle1 = new SponsoredDecorator(NewSimpleArticle1)
console.log(SponsoredNewArticle1.render())

const PopularNewSimpleArticle1 = new PopularDecorator(NewSimpleArticle1)
console.log(PopularNewSimpleArticle1.render())