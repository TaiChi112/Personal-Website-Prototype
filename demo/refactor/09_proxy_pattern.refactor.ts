// --- 1. User & Subscription Management ---

// User Account Class
class UserAccount {
    id: string;
    username: string;
    subscriptionStatus: "free" | "subscribed" | "active"; // free -> subscribed (รอจ่าย) -> active (จ่ายแล้ว)
    hasPaid: boolean;

    constructor(id: string, username: string) {
        this.id = id;
        this.username = username;
        this.subscriptionStatus = "free";
        this.hasPaid = false;
    }

    // 📝 Step 1: User สมัคร subscription (แต่ยังไม่จ่ายเงิน)
    subscribe(): void {
        if (this.subscriptionStatus === "free") {
            this.subscriptionStatus = "subscribed";
            console.log(`\n✅ ${this.username} subscribed to Premium!`);
            console.log(`   Status: PENDING PAYMENT`);
        } else {
            console.log(`\n⚠️  ${this.username} is already subscribed.`);
        }
    }

    // 💳 Step 2: User ชำระเงิน
    makePayment(amount: number): boolean {
        console.log(`\n💳 ${this.username} is processing payment of $${amount}...`);
        
        if (this.subscriptionStatus !== "subscribed") {
            console.log(`   ❌ Please subscribe first before making payment!`);
            return false;
        }

        // จำลองการจ่ายเงิน
        console.log(`   Processing...`);
        this.hasPaid = true;
        this.subscriptionStatus = "active";
        console.log(`   ✅ Payment successful! You are now a Premium member.`);
        return true;
    }
}

// สัญญามาตรฐาน: ไม่ว่าจะผ่าน Proxy หรือเรียกตรงๆ ต้องมี method นี้
interface IProjectDisplay {
    showContent(user: UserAccount): void;
}

// --- 2. The Real Subject (เนื้อหาลับสุดยอด) ---
// Class นี้สนใจแค่ "การแสดงผล" ไม่สนใจเรื่องเงินหรือสิทธิ์
class SecretProject implements IProjectDisplay {
    private title: string;
    private deepTechStack: string;
    private secretData: string[];

    constructor(title: string, tech: string) {
        this.title = title;
        this.deepTechStack = tech;
        this.secretData = [
            "🔐 Proprietary Algorithm: Advanced ML Model v2.5",
            "📊 Database Schema: Complete architecture blueprints",
            "🧪 Test Data: 1M+ production samples",
            "💎 Source Code: Full implementation with comments"
        ];
    }

    public showContent(user: UserAccount): void {
        console.log(`\n┌─────────────────────────────────────┐`);
        console.log(`│  🔓 PREMIUM CONTENT ACCESS          │`);
        console.log(`└─────────────────────────────────────┘`);
        console.log(`\nProject: ${this.title}`);
        console.log(`User: ${user.username}`);
        console.log(`Subscription: ${user.subscriptionStatus.toUpperCase()}`);
        console.log(`\n📚 Content Details:`);
        console.log(`   Tech Stack: ${this.deepTechStack}`);
        console.log(`\n🎁 Exclusive Content:`);
        this.secretData.forEach(data => console.log(`   ${data}`));
        console.log(`\n✨ Thank you for being a Premium member!\n`);
    }
}

// --- 3. The Proxy (ผู้คุมกฎ Paywall + Payment Verification) ---
// หน้าที่: Protection Proxy - เช็คว่าจ่ายเงินหรือยัง (hasPaid)
class SubscriptionProxy implements IProjectDisplay {
    private realProject: SecretProject;
    private accessLog: { user: string; timestamp: Date; granted: boolean }[];

    constructor(realProject: SecretProject) {
        this.realProject = realProject;
        this.accessLog = [];
    }

    public showContent(user: UserAccount): void {
        console.log(`┌─────────────────────────────────────┐`);
        console.log(`│  🛡️  ACCESS CONTROL SYSTEM          │`);
        console.log(`└─────────────────────────────────────┘`);
        console.log(`User: ${user.username}`);
        console.log(`Checking payment status...\n`);

        // 🔍 เช็คเงื่อนไขเดียว: จ่ายเงินหรือยัง?
        if (!user.hasPaid) {
            console.log(`💳 Payment Status: ❌ NOT PAID`);
            console.log(`\n⛔ ACCESS DENIED!`);
            console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            console.log(`This is premium content. Please pay to access.`);
            console.log(`💡 Action required:`);
            console.log(`   1. Call user.subscribe()`);
            console.log(`   2. Call user.makePayment(9.99)`);
            console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
            this.logAccess(user, false);
            return;
        }

        // ✅ จ่ายเงินแล้ว - อนุญาตให้เข้าถึง!
        console.log(`💳 Payment Status: ✅ PAID`);
        console.log(`\n✨ ACCESS GRANTED!`);
        console.log(`Welcome, premium member!\n`);
        this.logAccess(user, true);
        this.realProject.showContent(user);
    }

    private logAccess(user: UserAccount, granted: boolean): void {
        this.accessLog.push({
            user: user.username,
            timestamp: new Date(),
            granted
        });
    }
}

// --- 4. Client Usage - Simple Payment Check ---

// สร้างเนื้อหาลับ (Real Object)
const aiTradingProject = new SecretProject(
    "AI Trading Bot Pro",
    "Python, TensorFlow, AWS Lambda, Redis"
);

// สร้าง Proxy มาคุ้มกันเนื้อหาไว้ (Protection Proxy)
const protectedContent = new SubscriptionProxy(aiTradingProject);

// ========================================
// 📖 USE CASE 1: User ที่ไม่ได้จ่ายเงิน
// ========================================
console.log("USE CASE 1: User Without Payment (Free User)");

const alice = new UserAccount("u001", "Alice");
console.log(`👤 User: ${alice.username}`);
console.log(`   Initial Status is paid: ${alice.hasPaid ? "Yes" : "No"}`);

// พยายามเข้าถึง -> ควรถูกบล็อก
protectedContent.showContent(alice);

// ========================================
// 📖 USE CASE 2: User ที่จ่ายเงินแล้ว
// ========================================
console.log("USE CASE 2: User With Payment (Paid User)");

const bob = new UserAccount("u002", "Bob");
console.log(`\n👤 User: ${bob.username}`);

// Bob ทำการ subscribe และจ่ายเงิน
bob.subscribe();
bob.makePayment(9.99);

console.log(`   Final Payment Status: PAID`);
console.log(`   hasPaid: ${bob.hasPaid}`);

// พยายามเข้าถึง -> ควรผ่าน!
protectedContent.showContent(bob);

// 💡 Key Takeaways:
// 1. Proxy เช็คเงื่อนไขเดียว: hasPaid (จ่ายเงินหรือยัง)
// 2. ไม่จ่าย = ไม่ให้เข้า | จ่ายแล้ว = เข้าได้
// 3. Proxy ป้องกัน RealObject จากการเข้าถึงโดยตรง
// 4. เก็บ log ทุกครั้งที่มีการพยายามเข้าถึง