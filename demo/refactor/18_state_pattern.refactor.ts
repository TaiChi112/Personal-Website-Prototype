// 1. Context: Content Page
class BlogPost {
    private state: IPostState;

    constructor(
        public title: string,
        public content: string,
        public author: string
    ) {
        // Default starts as Draft
        this.state = new DraftState(this);
    }

    public setState(state: IPostState): void {
        this.state = state;
        console.log(`   🔄 State Updated: [${this.state.getName()}]`);
    }

    // 🔥 Feature เด็ด: ให้ State เป็นคนตัดสินใจว่าจะ Render อะไรออกมา
    public render(viewerRole: "admin" | "guest" | "member"): string {
        return this.state.renderContent(viewerRole);
    }

    // Actions
    public publish(): void { this.state.publish(); }
    public schedule(date: Date): void { this.state.schedule(date); }
    public expire(): void { this.state.expire(); }
}

// 2. State Interface
interface IPostState {
    getName(): string;
    // Core Logic: การแสดงผลเปลี่ยนไปตามสถานะและคนดู
    renderContent(viewer: "admin" | "guest" | "member"): string;

    // Transitions
    publish(): void;
    schedule(date: Date): void;
    expire(): void;
}

// 3. Concrete States (Rendering Logic อยู่ที่นี่!)

// 📝 Draft: เห็นเฉพาะ Admin, คนอื่นเห็น 404
class DraftState implements IPostState {
    constructor(private post: BlogPost) { }
    getName() { return "Draft"; }

    renderContent(viewer: string): string {
        if (viewer === "admin") {
            return `[Preview Mode] ${this.post.title}\n${this.post.content}`;
        }
        return "❌ 404 Not Found";
    }

    publish() { this.post.setState(new LiveState(this.post)); }
    schedule(date: Date) { this.post.setState(new ScheduledState(this.post, date)); }
    expire() { console.log("⚠️ Draft cannot expire."); }
}

// ⏳ Scheduled: Admin เห็นของจริง, คนอื่นเห็น Countdown
class ScheduledState implements IPostState {
    constructor(private post: BlogPost, private publishDate: Date) { }
    getName() { return "Scheduled"; }

    renderContent(viewer: string): string {
        if (viewer === "admin") {
            return `[Scheduled: ${this.publishDate.toLocaleDateString()}] ${this.post.title}\n${this.post.content}`;
        }
        // คนทั่วไปเห็น Coming Soon
        const daysLeft = Math.ceil((this.publishDate.getTime() - Date.now()) / (1000 * 3600 * 24));
        return `⏳ Coming Soon: "${this.post.title}" (Available in ${daysLeft} days)`;
    }

    publish() {
        console.log("🚀 Force publishing now!");
        this.post.setState(new LiveState(this.post));
    }
    schedule(date: Date) { this.publishDate = date; console.log("📅 Rescheduled."); }
    expire() { this.post.setState(new DeprecatedState(this.post)); }
}

// 🔒 Paywalled: Member เห็นครบ, Guest เห็น Teaser
class PaywalledState implements IPostState {
    constructor(private post: BlogPost) { }
    getName() { return "Premium Content"; }

    renderContent(viewer: string): string {
        if (viewer === "member" || viewer === "admin") {
            return `💎 [Premium] ${this.post.title}\n${this.post.content}`;
        }
        // Guest เห็น Teaser
        return `🔒 ${this.post.title}\n${this.post.content.substring(0, 50)}...\n[Login to read more]`;
    }

    publish() { this.post.setState(new LiveState(this.post)); } // เปลี่ยนเป็น Free
    schedule(date: Date) { console.log("❌ Already live."); }
    expire() { this.post.setState(new DeprecatedState(this.post)); }
}

// ✅ Live: ทุกคนเห็นเนื้อหาปกติ
class LiveState implements IPostState {
    constructor(private post: BlogPost) { }
    getName() { return "Live"; }

    renderContent(viewer: string): string {
        return `✅ ${this.post.title}\n${this.post.content}`;
    }

    publish() { console.log("⚠️ Already live."); }
    schedule(date: Date) { console.log("❌ Cannot reschedule live post."); }
    expire() { this.post.setState(new DeprecatedState(this.post)); }
}

// 🏚️ Deprecated: เนื้อหาเก่า โชว์ Warning
class DeprecatedState implements IPostState {
    constructor(private post: BlogPost) { }
    getName() { return "Deprecated (Archived)"; }

    renderContent(viewer: string): string {
        return `⚠️ [Archived Content] This post is outdated.\n${this.post.title}\n${this.post.content}`;
    }

    publish() {
        console.log("♻️  Restoring content...");
        this.post.setState(new LiveState(this.post));
    }
    schedule(date: Date) { console.log("❌ Cannot schedule archived post."); }
    expire() { console.log("⚠️ Already archived."); }
}

// --- Usage Simulation ---

const myPost = new BlogPost("TypeScript Tricks", "Here is a deep secret of TS...", "Dev");

console.log("--- 1. View as Draft ---");
console.log("Admin sees:", myPost.render("admin"));
console.log("Guest sees:", myPost.render("guest"));

console.log("\n--- 2. Schedule the Post ---");
// ตั้งเวลาล่วงหน้า 5 วัน
const futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 5);
myPost.schedule(futureDate);

console.log("Guest sees:", myPost.render("guest")); // Coming Soon

console.log("\n--- 3. Change to Premium (Paywall) ---");
myPost.setState(new PaywalledState(myPost)); // Manual switch (e.g. by admin)

console.log("Guest sees:", myPost.render("guest")); // Teaser
console.log("Member sees:", myPost.render("member")); // Full content

console.log("\n--- 4. Mark as Deprecated ---");
myPost.expire();
console.log("Everyone sees:", myPost.render("guest")); // Warning banner