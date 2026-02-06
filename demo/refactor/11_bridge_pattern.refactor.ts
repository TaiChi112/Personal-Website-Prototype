// Implementation
interface IBackgroundStorage {
    upload(fileName: string, data: string): string; // return URL
    getFileUrl(fileName: string): string;
}

// Concrete Implementation
class LocalDiskStorage implements IBackgroundStorage {
    upload(fileName: string, data: string): string {
        console.log(`  💾 [Local Disk] Writing '${fileName}' to /var/www/uploads...`);
        return `http://localhost:3000/uploads/${fileName}`;
    }
    getFileUrl(fileName: string): string {
        return `http://localhost:3000/uploads/${fileName}`;
    }
}

class AmazonS3Storage implements IBackgroundStorage {
    upload(fileName: string, data: string): string {
        console.log(`   ☁️ [AWS S3] Uploading '${fileName}' to Bucket 'my-cms-bucket'...`);
        return `https://s3.amazonaws.com/my-cms-bucket/${fileName}`;
    }
    getFileUrl(fileName: string): string {
        return `https://s3.amazonaws.com/my-cms-bucket/${fileName}`;
    }
}

// Abstraction
abstract class MediaAttachment {
    protected storage: IBackgroundStorage; // Bridge

    constructor(storage: IBackgroundStorage) {
        this.storage = storage;
    }

    abstract save(fileName: string, data: string): void;
    abstract display(): void;
}

// Refined Abstraction
class ImageAttachment extends MediaAttachment {
    private url: string = "";

    save(fileName: string, data: string): void {
        console.log("Processing Image (Resizing/Compressing)...");
        this.url = this.storage.upload(fileName, data);
    }

    display(): void {
        console.log(`🖼️ Display Image: <img src="${this.url}" />\n`);
    }
}

class PDFDocument extends MediaAttachment {
    private downloadLink: string = "";

    save(fileName: string, data: string): void {
        console.log("Scanning PDF for malware...");
        this.downloadLink = this.storage.upload(fileName, data);
    }

    display(): void {
        console.log(`📄 Download PDF: [Click Here](${this.downloadLink})\n`);
    }
}

class User{
    private id:string;
    private name:string;
    constructor(id:string,name:string) {
        this.id = id
        this.name = name
    }
    uploadContent(attachment: MediaAttachment, fileName: string, data: string) {
        attachment.save(fileName, data);
        attachment.display();
    }
}

console.log("--- Development Environment ---");
const localStorage = new LocalDiskStorage(); // เลือก Driver

const user1 = new User("u1000","Bob");

user1.uploadContent(new ImageAttachment(localStorage), "profile_pic.png", "binary_data_...");

user1.uploadContent(new PDFDocument(localStorage), "manual.pdf", "pdf_data_...");

const userProfilePic = new ImageAttachment(localStorage);
userProfilePic.save("avatar.png", "binary_data_...");
userProfilePic.display();

console.log("\n--- Production Environment ---");
const cloudStorage = new AmazonS3Storage(); 

const user2 = new User("u1001","Alice");

user2.uploadContent(new ImageAttachment(cloudStorage), "cover_photo.jpg", "binary_data_...");

user2.uploadContent(new PDFDocument(cloudStorage), "ebook_2026.pdf", "pdf_data_...");

const annualReport = new PDFDocument(cloudStorage);
annualReport.save("report_2026.pdf", "pdf_data_...");
annualReport.display();