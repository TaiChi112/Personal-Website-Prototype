// Product
class WebPage {
    public header?: string;
    public contents: string[] = [];
    public footer?: string;
    public metadata?: { title: string; description: string };

    public render(): string {
        const parts: string[] = [];
        if (this.header) parts.push(this.header);
        parts.push(...this.contents);
        if (this.footer) parts.push(this.footer);
        return parts.join('\n');
    }

    public validate(): boolean {
        return this.contents.length > 0; // At least one content section required
    }
}
// Builder
interface IPageBuilder {
    reset(): this;
    setHeader(title: string): this;
    addContent(content: string): this;
    setFooter(text: string): this;
    setMetadata(title: string, description: string): this;
    build(): WebPage;
}
// Concrete Builder
class HTMLPageBuilder implements IPageBuilder {
    private page: WebPage;

    constructor() {
        this.page = new WebPage();
    }

    reset(): this {
        this.page = new WebPage();
        return this;
    }

    setHeader(title: string): this {
        this.page.header = `<header><h1>${title}</h1></header>`;
        return this;
    }

    addContent(content: string): this {
        this.page.contents.push(`<main>${content}</main>`);
        return this;
    }

    setFooter(text: string): this {
        this.page.footer = `<footer>${text}</footer>`;
        return this;
    }

    setMetadata(title: string, description: string): this {
        this.page.metadata = { title, description };
        return this;
    }

    build(): WebPage {
        if (!this.page.validate()) {
            throw new Error('HTMLPageBuilder: Cannot build page without content');
        }
        const result = this.page;
        this.reset();
        return result;
    }
}

// Concrete Builder 2: Markdown
class MarkdownPageBuilder implements IPageBuilder {
    private page: WebPage;

    constructor() {
        this.page = new WebPage();
    }

    reset(): this {
        this.page = new WebPage();
        return this;
    }

    setHeader(title: string): this {
        this.page.header = `# ${title}\n`;
        return this;
    }

    addContent(content: string): this {
        this.page.contents.push(content);
        return this;
    }

    setFooter(text: string): this {
        this.page.footer = `\n---\n*${text}*`;
        return this;
    }

    setMetadata(title: string, description: string): this {
        this.page.metadata = { title, description };
        // Add as YAML front matter
        const frontMatter = `---\ntitle: ${title}\ndescription: ${description}\n---\n`;
        this.page.contents.unshift(frontMatter);
        return this;
    }

    build(): WebPage {
        if (!this.page.validate()) {
            throw new Error('MarkdownPageBuilder: Cannot build page without content');
        }
        const result = this.page;
        this.reset();
        return result;
    }
}

// Director
class PageDirector {
    public makeHomePage(builder: IPageBuilder): void {
        builder.reset()
            .setHeader("Welcome Home")
            .addContent("This is the main lobby.")
            .setFooter("Copyright 2026");
    }

    public makeAboutPage(builder: IPageBuilder): void {
        builder.reset()
            .setHeader("About Us")
            .addContent("We are a CS student team.");
    }

    public makeMinimalPage(builder: IPageBuilder, msg: string): void {
        builder.reset()
            .addContent(msg);
    }

    public makeDocumentationPage(builder: IPageBuilder): void {
        builder.reset()
            .setMetadata('API Documentation', 'Complete API reference guide')
            .setHeader('API Documentation')
            .addContent('## Getting Started')
            .addContent('Follow these steps to integrate our API...')
            .addContent('## Authentication')
            .addContent('Use Bearer token for authentication.')
            .setFooter('Last updated: Feb 2026');
    }
}
// Client Code
const htmlBuilder = new HTMLPageBuilder();
const mdBuilder = new MarkdownPageBuilder();
const director = new PageDirector();

console.log("=== HTML BUILDER EXAMPLES ===");

console.log("\n--- 1. HTML: Standard Home Page ---");
director.makeHomePage(htmlBuilder);
const htmlHome = htmlBuilder.build();
console.log(htmlHome.render());

console.log("\n--- 2. HTML: Custom About Page (No Footer) ---");
director.makeAboutPage(htmlBuilder);
const htmlAbout = htmlBuilder.build();
console.log(htmlAbout.render());

console.log("\n--- 3. HTML: Manual Build with Metadata ---");
htmlBuilder.reset()
    .setMetadata('Landing Page', 'Special promotion page')
    .setHeader("My Custom Landing")
    .addContent("Special Promotion!")
    .addContent("Click Here!")
    .setFooter("Limited time offer");
const htmlCustom = htmlBuilder.build();
console.log(htmlCustom.render());
console.log('Metadata:', htmlCustom.metadata);

console.log("\n\n=== MARKDOWN BUILDER EXAMPLES ===");

console.log("\n--- 4. Markdown: Documentation Page ---");
director.makeDocumentationPage(mdBuilder);
const mdDoc = mdBuilder.build();
console.log(mdDoc.render());

console.log("\n--- 5. Markdown: README Style ---");
mdBuilder.reset()
    .setHeader('Project README')
    .addContent('## Installation\n```bash\nnpm install\n```')
    .addContent('## Usage\nSimply import and use the builder pattern.')
    .setFooter('MIT License');
const mdReadme = mdBuilder.build();
console.log(mdReadme.render());

// Error handling demonstration
console.log("\n\n=== ERROR HANDLING ===");
try {
    htmlBuilder.reset().build(); // No content - should throw error
} catch (error) {
    console.log('✓ Validation works:', (error as Error).message);
}