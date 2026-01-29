// --- 1. Implementor Interface (Driver การเก็บข้อมูล) ---
interface IBackgroundStorage {
    upload(fileName: string, data: string): string; // return URL
    getFileUrl(fileName: string): string;
}

// --- 2. Concrete Implementors (ระบบเก็บข้อมูลจริง) ---

// แบบ Local (ใช้ตอน Dev)
class LocalDiskStorage implements IBackgroundStorage {
    upload(fileName: string, data: string): string {
        console.log(`   💾 [Local Disk] Writing '${fileName}' to /var/www/uploads...`);
        return `http://localhost:3000/uploads/${fileName}`;
    }
    getFileUrl(fileName: string): string {
        return `http://localhost:3000/uploads/${fileName}`;
    }
}

// แบบ Cloud (ใช้ตอน Production - จำลอง AWS S3)
class AmazonS3Storage implements IBackgroundStorage {
    upload(fileName: string, data: string): string {
        console.log(`   ☁️ [AWS S3] Uploading '${fileName}' to Bucket 'my-cms-bucket'...`);
        return `https://s3.amazonaws.com/my-cms-bucket/${fileName}`;
    }
    getFileUrl(fileName: string): string {
        return `https://s3.amazonaws.com/my-cms-bucket/${fileName}`;
    }
}

// --- 3. Abstraction (ไฟล์แนบ) ---
abstract class MediaAttachment {
    // 🔥 สะพานเชื่อม (Bridge) อยู่ตรงนี้!
    protected storage: IBackgroundStorage;

    constructor(storage: IBackgroundStorage) {
        this.storage = storage;
    }

    abstract save(fileName: string, data: string): void;
    abstract display(): void;
}

// --- 4. Refined Abstractions (ประเภทไฟล์ต่างๆ) ---

class ImageAttachment extends MediaAttachment {
    private url: string = "";

    save(fileName: string, data: string): void {
        console.log("Processing Image (Resizing/Compressing)...");
        // โยนงานเก็บข้อมูลไปให้ Implementation ทำ
        this.url = this.storage.upload(fileName, data);
    }

    display(): void {
        console.log(`🖼️ Display Image: <img src="${this.url}" />`);
    }
}

class PDFDocument extends MediaAttachment {
    private downloadLink: string = "";

    save(fileName: string, data: string): void {
        console.log("Scanning PDF for malware...");
        this.downloadLink = this.storage.upload(fileName, data);
    }

    display(): void {
        console.log(`📄 Download PDF: [Click Here](${this.downloadLink})`);
    }
}

class User{
    id:string;
    name:string;
    constructor(id:string,name:string) {
        this.id = id
        this.name = name
    }
    uploadContent(attachment: MediaAttachment, fileName: string, data: string) {
        attachment.save(fileName, data);
        attachment.display();
    }
}

// ==========================================
// Scenario 1: น้องฝึกงาน Dev บนเครื่องตัวเอง (Local Disk)
// ==========================================
console.log("--- Development Environment ---");
const localStorage = new LocalDiskStorage(); // เลือก Driver

const user1 = new User("u1000","Bob");

user1.uploadContent(new ImageAttachment(localStorage), "profile_pic.png", "binary_data_...");

user1.uploadContent(new PDFDocument(localStorage), "manual.pdf", "pdf_data_...");

// อัปโหลดรูปโปรไฟล์
const userProfilePic = new ImageAttachment(localStorage);
userProfilePic.save("avatar.png", "binary_data_...");
userProfilePic.display();
// Output: 
// Processing Image...
// 💾 [Local Disk] Writing 'avatar.png'...
// 🖼️ Display Image: <img src="http://localhost:3000/uploads/avatar.png" />


// ==========================================
// Scenario 2: Deploy ขึ้น Server จริง (AWS S3)
// ==========================================
console.log("\n--- Production Environment ---");
const cloudStorage = new AmazonS3Storage(); // เปลี่ยน Driver ง่ายๆ

const user2 = new User("u1001","Alice");

user2.uploadContent(new ImageAttachment(cloudStorage), "cover_photo.jpg", "binary_data_...");

user2.uploadContent(new PDFDocument(cloudStorage), "ebook_2026.pdf", "pdf_data_...");

// อัปโหลดเอกสารสำคัญ (PDF)
const annualReport = new PDFDocument(cloudStorage);
annualReport.save("report_2026.pdf", "pdf_data_...");
annualReport.display();
// Output:
// Scanning PDF for malware...
// ☁️ [AWS S3] Uploading 'report_2026.pdf'...
// 📄 Download PDF: [Click Here](https://s3.amazonaws.com/...)

// IDea Plateform คือ 
// ไม่สน content ที่จะ upload on plateform จะเป็นเเบบไหน implementor จะเป็นแบบไหน ก็สามารถเปลี่ยนได้ง่ายๆ โดยไม่กระทบ code อื่นๆ เลย
// ไม่สน ว่าจะถูกจัดเก็บอย่างไรที่ไหน Local เเบบไหน / Cloud เเบบไหน abstraction

// ในอนาคต เเม้จะมี content จะ upload ต่างกัน User ก็ไม่จำเป็นต้องสนว่าถูกจัดเก็บที่อย่างไร เเบบไหน
// ในอนาคต อยากเปลี่ยนการจัดเก็บ จาก local เป็น cloud หรือ เปลี่ยนจาก AWS S3 เป็น Google Cloud Storage ก็สามารถทำได้ง่ายๆ โดยไม่กระทบ code อื่นๆ เลย