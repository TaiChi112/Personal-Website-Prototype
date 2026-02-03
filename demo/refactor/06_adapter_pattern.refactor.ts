// Target
interface IStandardContent {
    getTitle(): string;
    getBody(): string;
    getAuthor(): string;
    getSummary(): string;
    getTags(): string[];
    getMetadata(): string;
}
// Adaptee
class Article {
    public headline: string;
    public textBody: string;
    public author: string;
    public publishedAt: Date;
    public comments: { user: string; text: string }[];
    public relatedTopics: string[];

    constructor(headline: string, textBody: string, author: string, publishedAt: Date, comments: { user: string; text: string }[], relatedTopics: string[]) {
        this.headline = headline;
        this.textBody = textBody;
        this.author = author;
        this.publishedAt = publishedAt;
        this.comments = comments;
        this.relatedTopics = relatedTopics;
    }

    getCommentCount(): number {
        return this.comments.length;
    }
}

class Blog {
    public topic: string;
    public content: string;
    public author: string;
    public publishedAt: Date;
    public tags: string[];

    constructor(topic: string, content: string, author: string, publishedAt: Date, tags: string[]) {
        this.topic = topic;
        this.content = content;
        this.author = author;
        this.publishedAt = publishedAt;
        this.tags = tags;
    }
}
// Adapter
class ArticleAdapter implements IStandardContent {
    private article: Article;

    constructor(article: Article) {
        this.article = article;
    }

    getTitle(): string {
        return this.article.headline;
    }

    getBody(): string {
        return this.article.textBody;
    }

    getAuthor(): string {
        return this.article.author;
    }

    getSummary(): string {
        return this.article.textBody.slice(0, 80).trim() + "...";
    }

    getTags(): string[] {
        return this.article.relatedTopics;
    }

    getMetadata(): string {
        return `Comments: ${this.article.getCommentCount()} | Published: ${this.article.publishedAt.toDateString()}`;
    }
}

class BlogAdapter implements IStandardContent {
    private blog: Blog;

    constructor(blog: Blog) {
        this.blog = blog;
    }

    getTitle(): string {
        return this.blog.topic;
    }

    getBody(): string {
        return this.blog.content;
    }

    getAuthor(): string {
        return this.blog.author;
    }

    getSummary(): string {
        return this.blog.content.slice(0, 80).trim() + "...";
    }

    getTags(): string[] {
        return this.blog.tags;
    }

    getMetadata(): string {
        return `Published: ${this.blog.publishedAt.toDateString()} | Tags: ${this.blog.tags.join(", ")}`;
    }
}

// Client
class User {
    id: string;
    name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    getInfo(contents: IStandardContent[]): void {
        contents.forEach((content, index) => {
            console.log("\n================================");
            console.log(`[Content ${index + 1}]`);
            console.log("================================");
            console.log("Title:", content.getTitle());
            console.log("Body:", content.getBody());
            console.log("Author:", content.getAuthor());
            console.log("Summary:", content.getSummary());
            console.log("Tags:", content.getTags().join(", "));
            console.log("Metadata:", content.getMetadata());
        });
    }
}

// Case A: Article (complex)
const myArticle = new Article(
    "Design Patterns 101: Adapter Pattern Explained",
    "The Adapter Pattern is a structural design pattern that lets you convert the interface of a class into another interface clients expect...",
    "John Doe",
    new Date("2025-07-20"),
    [
        { user: "User1", text: "Great explanation!" },
        { user: "User2", text: "Very helpful" },
        { user: "User3", text: "Could use more examples" }
    ],
    ["Design Patterns", "Software Architecture", "Best Practices"]
);

// Case B: Blog (simple)
const myBlog = new Blog(
    "My Coding Journey Today",
    "Today I learned about the Adapter Pattern. It's amazing how we can make incompatible interfaces work together!",
    "Alice",
    new Date("2025-08-01"),
    ["Diary", "Learning", "TypeScript"]
);

// Wrap ด้วย Adapter ก่อนส่งไปใช้งาน
const contentList: IStandardContent[] = [
    new ArticleAdapter(myArticle),
    new BlogAdapter(myBlog)
];

const user1 = new User("u1", "Alice");
user1.getInfo(contentList);

/*
    target: IStandardContent
    adaptee: Article, Blog
    adapter: ArticleAdapter, BlogAdapter
    client: User
*/