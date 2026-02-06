// 1. Context: เก็บข้อมูลไฟล์ภาพ
class ImageContext {
    public fileName: string;
    public fileSize: number; 
    public fileType: string;
    public imageData: string; 
    public processingLog: string[] = [];

    constructor(name: string, size: number, type: string, data: string) {
        this.fileName = name;
        this.fileSize = size;
        this.fileType = type;
        this.imageData = data;
    }

    addLog(msg: string) {
        this.processingLog.push(msg);
    }
}

// 2. Base Handler (Standard CoR)
interface IImageHandler {
    setNext(handler: IImageHandler): IImageHandler;
    handle(context: ImageContext): void;
}

abstract class BaseImageHandler implements IImageHandler {
    private next: IImageHandler | null = null;
    public setNext(handler: IImageHandler): IImageHandler {
        this.next = handler; return handler;
    }
    public handle(context: ImageContext): void {
        if (this.next) this.next.handle(context);
    }
}

// 3. Concrete Handlers (Strict Sequence!)

class FileTypeHandler extends BaseImageHandler {
    public handle(ctx: ImageContext): void {
        const allowed = ["image/jpeg", "image/png", "image/webp"];
        if (!allowed.includes(ctx.fileType)) {
            console.error(`❌ [Type] Invalid file type: ${ctx.fileType}. Aborting.`);
            return; 
        }
        ctx.addLog("✅ Type Verified");
        super.handle(ctx);
    }
}

class FileSizeHandler extends BaseImageHandler {
    public handle(ctx: ImageContext): void {
        if (ctx.fileSize > 5) { 
            console.error(`❌ [Size] File too large (${ctx.fileSize}MB). Limit is 5MB.`);
            return; 
        }
        ctx.addLog("✅ Size OK");
        super.handle(ctx);
    }
}

class ResizeHandler extends BaseImageHandler {
    public handle(ctx: ImageContext): void {
        console.log("📉 [Resize] Processing image dimensions...");
        if (ctx.fileSize > 2) {
            ctx.fileSize = 1;
            ctx.imageData = ctx.imageData + "[RESIZED]"; 
            ctx.addLog("✅ Resized to 1080p");
        } else {
            ctx.addLog("ℹ️ No resize needed");
        }
        super.handle(ctx);
    }
}

class WatermarkHandler extends BaseImageHandler {
    public handle(ctx: ImageContext): void {
        console.log("💧 [Watermark] Adding logo to bottom-right...");
        ctx.imageData = ctx.imageData + "[WATERMARKED]";
        ctx.addLog("✅ Watermark Added");
        super.handle(ctx);
    }
}

class StorageHandler extends BaseImageHandler {
    public handle(ctx: ImageContext): void {
        console.log(`💾 [Storage] Saving ${ctx.fileName} to /uploads...`);
        console.log(`   Final Data: ${ctx.imageData}`);
        console.log("🎉 UPLOAD COMPLETE!");
    }
}


// Sequence Chain: Type -> Size -> Resize -> Watermark -> Save
const typeCheck = new FileTypeHandler();
const sizeCheck = new FileSizeHandler();
const resizer = new ResizeHandler();
const watermark = new WatermarkHandler();
const storage = new StorageHandler();

// เชื่อม Chain
typeCheck.setNext(sizeCheck).setNext(resizer).setNext(watermark).setNext(storage);

console.log("--- 📸 Case 1: Valid Big Image ---");
const img1 = new ImageContext("photo.jpg", 4.5, "image/jpeg", "RAW_BINARY");
typeCheck.handle(img1);
console.log("Logs:", img1.processingLog);

console.log("\n--- 📄 Case 2: Invalid File (PDF) ---");
const pdf = new ImageContext("doc.pdf", 1.0, "application/pdf", "PDF_DATA");
typeCheck.handle(pdf); // stop at first handler wrong file type

console.log("\n--- 🐘 Case 3: Too Large Image ---");
const bigImg = new ImageContext("raw.png", 10.0, "image/png", "HUGE_DATA");
typeCheck.handle(bigImg); // stop at handler 2 size check

console.log("\n--- 🌟 Case 4: Small Valid Image ---");
typeCheck.setNext(sizeCheck).setNext(resizer).setNext(storage);
const image1  = new ImageContext("landscape.jpg", 3.0, "image/jpeg", "IMAGE_DATA_123");
typeCheck.handle(image1);
