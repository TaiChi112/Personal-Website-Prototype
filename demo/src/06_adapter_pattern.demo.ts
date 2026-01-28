// --- 1. The Target Interface (มาตรฐานกลางที่ UI ต้องการ) ---
// เรากำหนดสัญญาว่า ทุกอย่างที่จะมาแสดงผลต้องมีหน้าตาแบบนี้
interface IStandardContent {
    getTitle(): string;
    getBody(): string;
    getMetadata(): string;
    getAuthorInfo(): string;
    getCategory(): string;
    getPublishDate(): string;
    getRating(): number;
    getTags(): string[];
}

// --- 2. The Adaptees (ข้อมูลดิบที่มี Interface ต่างกัน) ---

// Case A: Article - COMPLEX (มีหลายแอตทริบิวต์ เพราะเป็น Professional Content)
class Article {
    public headline: string;
    public textBody: string;
    public author: string;
    public category: string;
    public publishDate: string;
    public rating: number;
    public comments: { user: string; text: string }[];
    public relatedTopics: string[];
    constructor(headline: string, textBody: string, author: string, category: string, publishDate: string, rating: number, comments: { user: string; text: string }[], relatedTopics: string[]) {
        this.headline = headline;
        this.textBody = textBody;
        this.author = author;
        this.category = category;
        this.publishDate = publishDate;
        this.rating = rating;
        this.comments = comments;
        this.relatedTopics = relatedTopics;
    }

    getCommentCount(): number {
        return this.comments.length;
    }

    getTopRating(): number {
        return this.rating;
    }
}

// Case B: Blog - SIMPLE (มีแอตทริบิวต์เบื้องต้น ใช้การแปลง ตรงไปตรงมา)
class Blog {
    public topic: string;
    public content: string;
    public tags: string[];
    constructor(topic: string, content: string, tags: string[]) {
        this.topic = topic;
        this.content = content;
        this.tags = tags;
    }
}

// --- 3. The Adapters (ตัวแปลง) ---
// หลักการ: Implement Target -> รับ Adaptee เข้ามา -> แปลงค่าส่งกลับไป

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

    getMetadata(): string {
        return `Comments: ${this.article.getCommentCount()} | Topics: ${this.article.relatedTopics.join(', ')}`;
    }

    getAuthorInfo(): string {
        return `Written by ${this.article.author}`;
    }

    getCategory(): string {
        return this.article.category;
    }

    getPublishDate(): string {
        return this.article.publishDate;
    }

    getRating(): number {
        return this.article.getTopRating();
    }

    getTags(): string[] {
        return this.article.relatedTopics;
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

    getMetadata(): string {
        return `Tags: ${this.blog.tags.join(', ')}`;
    }

    // Blog ไม่มี author แต่เราต้อง implement - จึงส่งค่า default
    getAuthorInfo(): string {
        return "Anonymous";
    }

    // Blog ไม่มี category - ใช้ default จาก tags
    getCategory(): string {
        return this.blog.tags[0] || "General";
    }

    // Blog ไม่มี publishDate - ส่งวันวันนี้
    getPublishDate(): string {
        return new Date().toLocaleDateString();
    }

    // Blog ไม่มี rating - ส่งค่า default
    getRating(): number {
        return 0;
    }

    getTags(): string[] {
        return this.blog.tags;
    }
}

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
            console.log("Author:", content.getAuthorInfo());
            console.log("Category:", content.getCategory());
            console.log("Published:", content.getPublishDate());
            console.log("Rating:", "⭐".repeat(Math.round(content.getRating())) || "No rating");
            console.log("Body:", content.getBody());
            console.log("Metadata:", content.getMetadata());
            console.log("Tags:", content.getTags().join(", "));
        });
    }
}


// Usage
// Case A: COMPLEX Article with many attributes
const myArticle = new Article(
    "Design Patterns 101: Adapter Pattern Explained",
    "The Adapter Pattern is a structural design pattern that lets you convert the interface of a class into another interface clients expect...",
    "Dev A (Senior Engineer)",
    "Technology",
    "2026-01-29",
    4,
    [
        { user: "User1", text: "Great explanation!" },
        { user: "User2", text: "Very helpful" },
        { user: "User3", text: "Could use more examples" }
    ],
    ["Design Patterns", "Software Architecture", "Best Practices"]
);

// Case B: SIMPLE Blog with minimal attributes
const myBlog = new Blog(
    "My Coding Journey Today",
    "Today I learned about the Adapter Pattern. It's amazing how we can make incompatible interfaces work together!",
    ["Diary", "Learning", "TypeScript"]
);

// Wrap ด้วย Adapter ก่อนส่งไปใช้งาน
const contentList: IStandardContent[] = [
    new ArticleAdapter(myArticle),
    new BlogAdapter(myBlog)
];

const constentlist1: IStandardContent = new BlogAdapter(myBlog);
const contentlist2: IStandardContent = new ArticleAdapter(myArticle);

const user1 = new User("u1", "Alice");
user1.getInfo(contentList);
const user2 = new User("u2", "Bob");
user2.getInfo([constentlist1, contentlist2]);