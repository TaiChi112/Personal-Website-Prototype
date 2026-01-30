// --- 1. The Abstract Class (แม่แบบ) ---
abstract class DataMiner {

    // นี่คือ "Template Method" (พระเอกของเรา)
    // กำหนด Skeleton ของ Algorithm ว่าต้องทำอะไรก่อนหลัง
    // สังเกตว่า method นี้เป็น public เพื่อให้ client เรียกใช้
    public mineData(path: string): void {
        console.log(`\n--- Mining Process for: ${path} ---`);

        const rawData = this.openFile(path);       // Step 1: เหมือนกันหมด (หรืออาจจะต่างก็ได้)
        const cleanData = this.extractData(rawData); // Step 2: ต่างกัน (ลูกต้องทำเอง)
        const analysis = this.analyzeData(cleanData); // Step 3: เหมือนกัน (Logic กลาง)

        this.sendReport(analysis);                 // Step 4: เหมือนกัน

        // Step 5: Hook (ลูกจะ override หรือไม่ก็ได้)
        this.onMiningFinished();

        this.closeFile();                          // Step 6: เหมือนกัน
    }

    // --- Concrete Methods (Logic ที่ใช้ร่วมกันได้เลย เขียนครั้งเดียวจบ) ---
    protected openFile(path: string): string {
        console.log(`1. Opening file from disk...`);
        return "Raw File Handle";
    }

    protected analyzeData(data: string): string {
        console.log(`3. Analyzing data using standard AI Model...`);
        return `Report: Data looks good (${data.length} chars)`;
    }

    protected sendReport(report: string): void {
        console.log(`4. Sending report to Admin: "${report}"`);
    }

    protected closeFile(): void {
        console.log(`6. Closing file resource.`);
    }

    // --- Abstract Methods (ช่องว่างที่ลูก "ต้อง" เติมคำในช่องว่าง) ---
    protected abstract extractData(file: unknown): string;

    // --- Hooks (ช่องว่างที่ลูก "เลือก" ที่จะเติมหรือไม่ก็ได้) ---
    // Default คือว่างเปล่า ไม่ทำอะไร
    protected onMiningFinished(): void { }
}

// --- 2. Concrete Class 1 (จัดการไฟล์ CSV) ---
class CsvDataMiner extends DataMiner {
    // ต้อง Implement abstract method
    protected extractData(file: unknown): string {
        console.log("2. [CSV Logic] Splitting by commas (,) and parsing rows.");
        return "Clean CSV Data";
    }

    // CSV ไม่ได้ Override Hook (onMiningFinished) ก็จะใช้แบบว่างๆ ของแม่
}

// --- 3. Concrete Class 2 (จัดการไฟล์ PDF) ---
class PdfDataMiner extends DataMiner {
    // ต้อง Implement abstract method
    protected extractData(file: unknown): string {
        console.log("2. [PDF Logic] Using OCR to extract text from image.");
        return "Clean PDF Text";
    }

    // PDF ขอ Override Hook เพื่อแจ้งเตือนเพิ่มเติม
    protected onMiningFinished(): void {
        console.log("5. [Hook] PDF processing took a long time. Alerting user.");
    }
}

// --- Client Usage ---

// Client ไม่ต้องรู้ลำดับการทำงาน รู้แค่เรียก mineData()
console.log(">>> Client selects CSV <<<");
const csvWorker = new CsvDataMiner();
csvWorker.mineData("data.csv");

console.log("\n>>> Client selects PDF <<<");
const pdfWorker = new PdfDataMiner();
pdfWorker.mineData("document.pdf");