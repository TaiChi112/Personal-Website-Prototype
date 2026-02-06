// Context
class UserAccount {
    id: string;
    username: string;
    subscriptionStatus: "free" | "subscribed" | "active";  
    hasPaid: boolean;

    constructor(id: string, username: string) {
        this.id = id;
        this.username = username;
        this.subscriptionStatus = "free";
        this.hasPaid = false;
    }

    subscribe(): void {
        if (this.subscriptionStatus === "free") {
            this.subscriptionStatus = "subscribed";
            console.log(`\n✅ ${this.username} subscribed to Premium!`);
            console.log(`   Status: PENDING PAYMENT`);
        } else {
            console.log(`\n⚠️  ${this.username} is already subscribed.`);
        }
    }

    makePayment(amount: number): boolean {
        console.log(`💳 ${this.username} is processing payment of $${amount}...`);

        if (this.subscriptionStatus !== "subscribed") {
            console.log(`   ❌ Please subscribe first before making payment!`);
            return false;
        }

        console.log(`   Processing...`);
        this.hasPaid = true;
        this.subscriptionStatus = "active";
        console.log(`   ✅ Payment successful! You are now a Premium member.`);
        return true;
    }
}

// Subject
interface IProjectDisplay {
    showContent(user: UserAccount): void;
}
// Real Subject
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
// Proxy
class SubscriptionProxy implements IProjectDisplay {
    private realProject: SecretProject;
    private accessLogs: { timestamp: Date, user: string, result: string }[] = [];

    constructor(realProject: SecretProject) {
        this.realProject = realProject;
    }

    public showContent(user: UserAccount): void {
        console.log(`┌─────────────────────────────────────┐`);
        console.log(`│  🛡️  ACCESS CONTROL SYSTEM          │`);
        console.log(`└─────────────────────────────────────┘`);
        console.log(`User: ${user.username}`);
        console.log(`Checking payment status...`);

        if (!user.hasPaid) {
            this.logAccess(user, "DENIED");

            console.log(`💳 Payment Status: ❌ NOT PAID`);
            console.log(`\n⛔ ACCESS DENIED!`);
            console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            console.log(`This is premium content. Please pay to access.`);
            console.log(`💡 Action required:`);
            console.log(`   1. Call user.subscribe()`);
            console.log(`   2. Call user.makePayment(9.99)`);
            console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
            return;
        }

        this.logAccess(user, "GRANTED");

        console.log(`💳 Payment Status: ✅ PAID`);
        console.log(`\n✨ ACCESS GRANTED!`);
        console.log(`Welcome, premium member!\n`);
        this.realProject.showContent(user);
    }
    private logAccess(user: UserAccount, result: string): void {
        this.accessLogs.push({
            timestamp: new Date(),
            user: user.username,
            result: result
        });
    }
    public getHistory(): void {
        console.log("\n📜 [Admin] Access Logs History:");
        console.table(this.accessLogs);
    }

}

// Client Code
const AITradingProject = new SecretProject(
    "AI Trading Bot Pro",
    "Python, TensorFlow, AWS Lambda, Redis"
);

const protectedContent = new SubscriptionProxy(AITradingProject);

const alice = new UserAccount("u001", "Alice");
protectedContent.showContent(alice);

const bob = new UserAccount("u002", "Bob");
bob.subscribe();
bob.makePayment(9.99);
protectedContent.showContent(bob);

protectedContent.getHistory();

// 1. Proxy เช็คเงื่อนไขเดียว: hasPaid (จ่ายเงินหรือยัง)
// 2. ไม่จ่าย = ไม่ให้เข้า | จ่ายแล้ว = เข้าได้
// 3. Proxy ป้องกัน RealObject จากการเข้าถึงโดยตรง
// 4. เก็บ log ทุกครั้งที่มีการพยายามเข้าถึง