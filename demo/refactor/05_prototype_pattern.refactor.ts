// Prototype
interface Prototype<T> {
    clone(): T;
}

// Concrete Prototype
class SDLCProjectDocument implements Prototype<SDLCProjectDocument> {
    public name: string = "";
    public version: string = "";
    public lastUpdated: Date = new Date();
    public problemStatement: string = "";
    public stakeholders: string[] = [];
    public functionalRequirements: string[] = []
    public techStack: string[] = [];
    public description: string = "";

    constructor(name: string, version: string, lastUpdated: Date, problemStatement: string, stakeholders: string[], functionalRequirements: string[], techStack: string[], description: string) {
        this.name = name;
        this.version = version;
        this.lastUpdated = lastUpdated;
        this.problemStatement = problemStatement;
        this.stakeholders = stakeholders;
        this.functionalRequirements = functionalRequirements;
        this.techStack = techStack;
        this.description = description;
        console.log(`[System] Initializing heavy document: ${this.name}`);
    }

    public clone(): SDLCProjectDocument {
        const clonedSections = [...this.functionalRequirements];
        const clonedTechStack = [...this.techStack];

        return new SDLCProjectDocument(
            `Copy of ${this.name}`,
            this.version,
            this.lastUpdated,
            this.problemStatement,
            [...this.stakeholders],
            clonedSections,
            clonedTechStack,
            this.description
        );
    }

    public setTechStack(newStack: string[]): void {
        this.techStack = newStack;
    }

    public toString(): string {
        return `Doc: ${this.name} | Stack: [${this.techStack.join(', ')}] | Content Length: ${this.functionalRequirements.length}`;
    }
}

// Step 1: สร้าง Master Template (Costly Operation)
const masterTemplate = new SDLCProjectDocument(
    "Standard Web App SDLC",
    "1.0.0",
    new Date(),
    "Standard web application development lifecycle",
    ["Project Manager", "Developers", "QA"],
    ["Intro", "Requirement Analysis", "System Design", "Testing"],
    ["Java", "Spring Boot", "MySQL"] // Default Stack
    , "This document outlines the standard phases and best practices for web application development."
);

console.log("--- Original ---");
console.log(masterTemplate.toString());
console.log()

// const nodeProject = masterTemplate.clone();
// nodeProject.setTechStack(["Node.js", "Express", "Elysia", "MongoDB"]);

// const pythonProject = masterTemplate.clone();
// pythonProject.setTechStack(["Python", "Django", "PostgreSQL"]);
// console.log()

// console.log("--- Cloned & Modified ---");
// console.log(nodeProject.toString());
// console.log(pythonProject.toString());
// console.log()

// // Verify: ต้นฉบับต้องไม่เปลี่ยน (Proof of Deep Copy)
// console.log("--- Verify Original ---");
// console.log(masterTemplate.toString());

const projectList: SDLCProjectDocument[] = []

for (let i = 1; i <= 5; i++) {
    const project = masterTemplate.clone();
    project.setTechStack([`TechStack-${i}-A`, `TechStack-${i}-B`]);
    projectList.push(project);
}

for (const proj of projectList) {
    console.log(proj.toString());
}