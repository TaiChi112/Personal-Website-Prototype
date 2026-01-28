// --- 1. The Target Interface (มาตรฐานกลางที่ UI ต้องการ) ---
// เรากำหนดสัญญาว่า ทุกอย่างที่จะมาแสดงผลต้องมีหน้าตาแบบนี้
interface IStandardContent {
    getTitle(): string;
    getBody(): string;
    getMetadata(): string;
}

// --- 2. The Adaptees (ข้อมูลดิบที่มี Interface ต่างกัน) ---

// Case A: Article ใช้คำว่า headline, textBody, author
class LegacyArticle {
    constructor(
        public headline: string,
        public textBody: string,
        public author: string
    ) { }
}

// Case B: Blog ใช้คำว่า topic, content, tags
class ExternalBlog {
    constructor(
        public topic: string,
        public content: string,
        public tags: string[]
    ) { }
}

// --- 3. The Adapters (ตัวแปลง) ---
// หลักการ: Implement Target -> รับ Adaptee เข้ามา -> แปลงค่าส่งกลับไป

class ArticleAdapter implements IStandardContent {
    private article: LegacyArticle;

    constructor(article: LegacyArticle) {
        this.article = article;
    }

    // Mapping: headline -> title
    getTitle(): string {
        return this.article.headline;
    }

    // Mapping: textBody -> body
    getBody(): string {
        return this.article.textBody;
    }

    getMetadata(): string {
        return `Author: ${this.article.author}`;
    }
}

class BlogAdapter implements IStandardContent {
    private blog: ExternalBlog;

    constructor(blog: ExternalBlog) {
        this.blog = blog;
    }

    // Mapping: topic -> title
    getTitle(): string {
        return this.blog.topic;
    }

    // Mapping: content -> body (ตรงกันไม่ต้องแปลงมาก)
    getBody(): string {
        return this.blog.content;
    }

    // Mapping: tags array -> string metadata
    getMetadata(): string {
        return `Tags: ${this.blog.tags.join(', ')}`;
    }
}

// --- 4. Client Code (ส่วนแสดงผล) ---
// ส่วนนี้จะเป็น Clean Code มาก เพราะมันไม่รู้เลยว่าข้อมูลมาจาก Article หรือ Blog
// มันรู้แค่ว่าทุกตัวคือ IStandardContent

function renderContentList(contents: IStandardContent[]) {
    contents.forEach(item => {
        console.log(`[Display] ${item.getTitle()}`);
        console.log(`   > ${item.getBody().substring(0, 20)}...`);
        console.log(`   > ${item.getMetadata()}`);
        console.log("-------------------------------");
    });
}

// Usage
const myArticle = new LegacyArticle("Design Patterns 101", "Adapter is useful...", "Dev A");
const myBlog = new ExternalBlog("My Day", "Coding is fun...", ["Diary", "Tech"]);

// Wrap ด้วย Adapter ก่อนส่งไปใช้งาน
const contentList: IStandardContent[] = [
    new ArticleAdapter(myArticle),
    new BlogAdapter(myBlog)
];

renderContentList(contentList);