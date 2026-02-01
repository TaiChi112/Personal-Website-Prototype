/**
 * SINGLETON PATTERN - Creational
 * 
 * Purpose:
 * ให้มี instance เดียวของ class ตลอด application lifecycle
 * ใช้เมื่อต้องการควบคุมว่าสามารถมี instance เดียวเท่านั้น
 * 
 * Components:
 * - Singleton Class: class ที่มี private constructor และ static getInstance()
 * - Private Constructor: ป้องกันไม่ให้มีการ instantiate จากภายนอก
 * - Static Instance: เก็บ instance เดียวของ class ในระดับ class
 * - Static getInstance(): method ที่คืนค่า instance เดียวกันเสมอ
 */

// ============================================================
// SINGLETON ABSTRACTION
// ============================================================

class Singleton {
  // Private static instance - เก็บ instance เดียว
  private static instance: Singleton;

  // Private constructor - ป้องกันการ new Singleton() จากภายนอก
  private constructor() {}

  // Static method เพื่อ access instance
  public static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }
}

// ============================================================
// CLIENT CODE - การใช้งาน Singleton
// ============================================================

// CLIENT เรียก getInstance() เพื่อให้ได้ instance
const singletonInstance1 = Singleton.getInstance();
const singletonInstance2 = Singleton.getInstance();

// ตรวจสอบว่า instance เป็นอันเดียวกัน
console.log("singletonInstance1 === singletonInstance2:", singletonInstance1 === singletonInstance2); // true
