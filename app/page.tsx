"use client";
import React, { useState, useEffect, useRef, createContext, useContext, useMemo } from 'react';
import {
  BookOpen, Code, FileText, User, Briefcase, Menu, X,
  Github, Linkedin, ExternalLink, ChevronRight, ChevronDown, Calendar,
  Tag, LayoutGrid, List, Clock, PlayCircle, Rss,
  Palette, Moon, Sun, Monitor, Globe, Type, Layers, Box, Folder, ArrowRight,
  Star, Zap, Flame, Award, Wrench, PieChart, BarChart3, Filter, Search, Terminal,
  Bell, CheckCircle, AlertTriangle, Info, RotateCcw, Lock, Unlock, UserCheck, ArrowUpDown,
  Play, Pause, SkipForward, SkipBack, StopCircle, FastForward, HelpCircle, Command as CommandIcon
} from 'lucide-react';

// ==========================================
// === 0. MISSING UTILITIES & CONTEXTS ===
// ==========================================

// --- Notification System ---
type ToastType = 'INFO' | 'SUCCESS' | 'ERROR' | 'WARNING';
const listeners: Function[] = [];
const notify = {
  notify: (message: string, type: ToastType) => {
    listeners.forEach(l => l(message, type));
  },
  subscribe: (fn: Function) => {
    listeners.push(fn);
    return () => { const idx = listeners.indexOf(fn); if (idx > -1) listeners.splice(idx, 1); };
  }
};

// --- Contexts ---
const TourContext = createContext<{ activeNodeId: string | null; setActiveNodeId: (id: string | null) => void }>({ activeNodeId: null, setActiveNodeId: () => { } });
const UserContext = createContext<{ isAdmin: boolean; toggleRole: () => void }>({ isAdmin: false, toggleRole: () => { } });

// --- Interfaces ---
interface TourStep { type: 'NAV' | 'EXPAND' | 'RESET_EXPAND'; targetId?: string; label: string; }

// --- Command Pattern Base ---
interface ICommand { execute(): void; undo(): void; label: string; icon: React.ReactNode; id: string; }

class HistoryManager {
  private stack: ICommand[] = [];
  push(cmd: ICommand) { this.stack.push(cmd); }
  pop() { return this.stack.pop(); }
}
const historyManager = new HistoryManager();

// --- Command Implementations ---
class NavigateCommand implements ICommand {
  private prevTab: string = '';
  constructor(public id: string, public label: string, public icon: React.ReactNode, private targetTab: string, private setTab: Function, private getTab: Function) { }
  execute() { this.prevTab = this.getTab(); this.setTab(this.targetTab); historyManager.push(this); }
  undo() { this.setTab(this.prevTab); }
}

class ToggleThemeCommand implements ICommand {
  constructor(private toggle: Function) { }
  id = 'toggle-theme'; label = 'Toggle Theme'; icon = <Moon size={16} />;
  execute() { this.toggle(); historyManager.push(this); }
  undo() { this.toggle(); }
}

class SwitchStyleCommand implements ICommand {
  private prevStyle: string = '';
  constructor(public id: string, public label: string, public icon: React.ReactNode, private targetStyle: string, private setStyle: Function, private getStyle: Function) { }
  execute() { this.prevStyle = this.getStyle(); this.setStyle(this.targetStyle); historyManager.push(this); }
  undo() { this.setStyle(this.prevStyle); }
}

class ToggleRoleCommand implements ICommand {
  constructor(private toggle: Function) { }
  id = 'toggle-role'; label = 'Toggle Admin Role'; icon = <UserCheck size={16} />;
  execute() { this.toggle(); historyManager.push(this); }
  undo() { this.toggle(); }
}

class StartTourCommand implements ICommand {
  constructor(private start: Function) { }
  id = 'start-tour'; label = 'Start Tour'; icon = <PlayCircle size={16} />;
  execute() { this.start(); }
  undo() { /* No undo for starting tour */ }
}

// --- Tour Iterator ---
class TourIterator {
  private index = -1;
  constructor(private steps: TourStep[]) { }
  hasNext() { return this.index < this.steps.length - 1; }
  hasPrev() { return this.index > 0; }
  next() { if (this.hasNext()) return this.steps[++this.index]; return null; }
  prev() { if (this.hasPrev()) return this.steps[--this.index]; return null; }
  reset() { this.index = -1; }
  current() { return this.index >= 0 && this.index < this.steps.length ? this.steps[this.index] : null; }
  get progress() { return { current: this.index + 1, total: this.steps.length }; }
}

// ==========================================
// === 1. DATA STRUCTURE DEFINITIONS ===
// ==========================================
interface Article { id: string; title: string; slug: string; excerpt: string; content: string; publishedAt: string; tags: string[]; readTime: string; author: { name: string; avatar: string; }; }
interface Blog { id: string; title: string; slug: string; summary: string; date: string; category: 'Personal' | 'Lifestyle' | 'DevLog'; coverImage?: string; }
interface Doc { id: string; title: string; slug: string; section: string; content: string; lastUpdated: string; }
interface Project { id: string; title: string; description: string; techStack: string[]; githubUrl?: string; liveUrl?: string; thumbnail: string; featured: boolean; date: string; }
interface Experience { id: string; role: string; company: string; period: string; description: string[]; }
interface Education { id: string; degree: string; institution: string; year: string; }
interface ResumeData { name: string; title: string; summary: string; skills: string[]; experience: Experience[]; education: Education[]; contact: { email: string; location: string; }; }
interface ExternalVideoData { videoId: string; headline: string; descriptionSnippet: string; published_timestamp: number; thumbnail_high: string; views: number; tags: string[]; }

type DecorationType = 'new' | 'featured' | 'sponsor' | 'hot' | 'popular';
interface UnifiedContentItem {
  id: string;
  type: 'project' | 'blog' | 'video' | 'article' | 'doc';
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
  meta: string[];
  actionLink?: string;
  decorations?: DecorationType[];
  isLocked?: boolean;
}

// ==========================================
// === 2. MOCK DATA ===
// ==========================================
const MOCK_ARTICLES_FLAT: Article[] = [
  { id: '1', title: 'Understanding React Server Components', slug: 'react-server-components', excerpt: 'Deep dive into how RSC works under the hood and why it changes everything.', content: 'Full content...', publishedAt: '2023-10-15', tags: ['React', 'Next.js'], readTime: '8 min', author: { name: 'Dev', avatar: '' } },
  { id: '2', title: 'Advanced TypeScript Patterns', slug: 'advanced-typescript', excerpt: 'Generic types, Utility types, and how to write cleaner code.', content: 'Full content...', publishedAt: '2023-11-02', tags: ['TypeScript'], readTime: '12 min', author: { name: 'Dev', avatar: '' } }
];
const MOCK_BLOGS: Blog[] = [
  { id: '1', title: 'My Journey into Tech', slug: 'my-journey', summary: 'How I started coding...', date: '2023-01-20', category: 'Personal' },
  { id: '2', title: 'Why I love Coffee', slug: 'coffee-coding', summary: 'A look at caffeine...', date: '2023-05-10', category: 'Lifestyle' }
];
const MOCK_PROJECTS: Project[] = [
  { id: '1', title: 'E-Commerce Super App', description: 'A massive e-commerce ecosystem.', techStack: ['Next.js', 'Supabase'], githubUrl: '#', featured: true, date: '2023-08-15', thumbnail: '' },
  { id: '1-1', title: 'Merchant Dashboard', description: 'Admin panel for sellers.', techStack: ['React', 'Tailwind'], githubUrl: '#', featured: false, date: '2023-09-01', thumbnail: '' },
  { id: '1-2', title: 'Mobile Customer App', description: 'React Native app for buyers.', techStack: ['React Native', 'Expo'], githubUrl: '#', featured: false, date: '2023-09-15', thumbnail: '' },
  { id: '2', title: 'AI Chat System', description: 'Chat app leveraging OpenAI API.', techStack: ['React', 'Node.js'], githubUrl: '#', featured: true, date: '2023-06-10', thumbnail: '' },
  { id: '2-1', title: 'Socket Server', description: 'Real-time message handling.', techStack: ['Node.js', 'Socket.io'], githubUrl: '#', featured: false, date: '2023-06-12', thumbnail: '' }
];
const MOCK_VIDEOS: ExternalVideoData[] = [
  { videoId: 'v1', headline: 'Building SaaS', descriptionSnippet: 'Live coding...', published_timestamp: 1696118400000, thumbnail_high: '', views: 15000, tags: ['SaaS'] }
];
const MOCK_RESUME: ResumeData = {
  name: 'Alex Developer', title: 'Full Stack Engineer', summary: 'Passionate developer building scalable apps.', skills: ['React', 'Node.js', 'AWS', 'Docker', 'GraphQL', 'Tailwind CSS'],
  experience: [{ id: '1', role: 'Senior Dev', company: 'Tech Co', period: '2021-Present', description: ['Led migration.', 'Optimized performance.', 'Mentored juniors.'] }, { id: '2', role: 'Web Dev', company: 'Agency XY', period: '2019-2021', description: ['Built client sites.', 'Implemented UI designs.'] }],
  education: [{ id: '1', degree: 'B.Sc. CS', institution: 'Bangkok Uni', year: '2014-2018' }],
  contact: { email: 'alex@example.com', location: 'Bangkok' }
};
const MOCK_DOCS: Doc[] = [
  { id: '1', title: 'Getting Started', slug: 'start', section: 'Intro', content: 'Welcome to the documentation.', lastUpdated: '2024-01-10' },
  { id: '2', title: 'Authentication', slug: 'auth', section: 'Core Concepts', content: 'We use JWT for authentication.', lastUpdated: '2024-02-15' },
  { id: '3', title: 'Database Schema', slug: 'db', section: 'Core Concepts', content: 'The database consists of 5 main tables.', lastUpdated: '2024-03-01' }
];

// ==========================================
// === 3. ADAPTERS ===
// ==========================================
const adaptProjectToUnified = (p: Project): UnifiedContentItem => ({
  id: `proj-${p.id}`, type: 'project', title: p.title, description: p.description, date: p.date, imageUrl: p.thumbnail, meta: p.techStack, actionLink: p.githubUrl,
  decorations: p.featured ? ['featured'] : [],
  isLocked: p.title.includes('Merchant')
});
const adaptBlogToUnified = (b: Blog): UnifiedContentItem => ({ id: `blog-${b.id}`, type: 'blog', title: b.title, description: b.summary, date: b.date, imageUrl: b.coverImage, meta: [b.category], actionLink: '#' });
const adaptVideoToUnified = (v: ExternalVideoData): UnifiedContentItem => ({ id: `vid-${v.videoId}`, type: 'video', title: v.headline, description: v.descriptionSnippet, date: new Date(v.published_timestamp).toISOString().split('T')[0], imageUrl: v.thumbnail_high, meta: [`${v.views} views`], actionLink: '#', decorations: v.views > 10000 ? ['popular', 'hot'] : [] });
const adaptArticleToUnified = (a: Article): UnifiedContentItem => ({
  id: `art-${a.id}`, type: 'article', title: a.title, description: a.excerpt, date: a.publishedAt, meta: a.tags, actionLink: '#',
  isLocked: a.tags.includes('Advanced')
});
const adaptDocToUnified = (d: Doc): UnifiedContentItem => ({ id: `doc-${d.id}`, type: 'doc', title: d.title, description: d.content.substring(0, 100) + '...', date: d.lastUpdated, meta: [d.section], actionLink: '#' });

// ==========================================
// === 4. PATTERN DEFINITIONS (Composite, Builder, etc.) ===
// ==========================================

// --- Composite & Builder ---
type ComponentType = 'container' | 'item';
type LayoutStyleType = 'grid' | 'list' | 'timeline' | 'column' | 'row';

interface LayoutNode { id: string; type: ComponentType; }
interface LeafNode extends LayoutNode { type: 'item'; data: UnifiedContentItem; }
interface CompositeNode extends LayoutNode { type: 'container'; layoutStyle: LayoutStyleType; children: Array<LayoutNode | CompositeNode | LeafNode>; title?: string; colSpan?: number; data?: UnifiedContentItem; }

class ContentBuilder {
  private root: CompositeNode;
  private currentContainer: CompositeNode;
  private stack: CompositeNode[] = [];

  constructor(id: string, layoutStyle: LayoutStyleType = 'column', title?: string, data?: UnifiedContentItem) {
    this.root = { id, type: 'container', layoutStyle, title, children: [], data };
    this.currentContainer = this.root;
    this.stack.push(this.root);
  }
  addContainer(id: string, layoutStyle: LayoutStyleType, title?: string, data?: UnifiedContentItem): ContentBuilder {
    const newContainer: CompositeNode = { id, type: 'container', layoutStyle, title, children: [], data };
    this.currentContainer.children.push(newContainer);
    this.stack.push(this.currentContainer);
    this.currentContainer = newContainer;
    return this;
  }
  addItem(item: UnifiedContentItem): ContentBuilder {
    const leaf: LeafNode = { id: `leaf-${item.id}`, type: 'item', data: item };
    this.currentContainer.children.push(leaf);
    return this;
  }
  up(): ContentBuilder {
    if (this.stack.length > 0) this.currentContainer = this.stack.pop()!;
    return this;
  }
  build(): CompositeNode { return this.root; }
}

// Generate Hierarchical Data
const PROJECTS_TREE = new ContentBuilder('proj-root', 'column', 'All Projects')
  .addContainer('super-app', 'grid', 'E-Commerce Super App', { ...adaptProjectToUnified(MOCK_PROJECTS[0]), decorations: ['featured'] })
  .addItem(adaptProjectToUnified(MOCK_PROJECTS[1]))
  .addItem(adaptProjectToUnified(MOCK_PROJECTS[2]))
  .up()
  .addContainer('ai-chat', 'list', 'AI Chat System', { ...adaptProjectToUnified(MOCK_PROJECTS[3]), decorations: ['sponsor'] })
  .addItem(adaptProjectToUnified(MOCK_PROJECTS[4]))
  .build();

const BLOGS_TREE = new ContentBuilder('blog-root', 'column', 'My Writings')
  .addContainer('journey', 'timeline', 'Tech Journey', { ...adaptBlogToUnified(MOCK_BLOGS[0]), decorations: ['featured'] })
  .addItem({ ...adaptArticleToUnified(MOCK_ARTICLES_FLAT[0]), title: 'First Framework I Learned' })
  .addItem({ ...adaptProjectToUnified(MOCK_PROJECTS[0]), title: 'My First Big Failure' })
  .up()
  .addContainer('lifestyle', 'list', 'Lifestyle', adaptBlogToUnified(MOCK_BLOGS[1]))
  .addItem({ ...adaptVideoToUnified(MOCK_VIDEOS[0]), title: 'Vlog: A Day in Life', decorations: ['new'] })
  .build();

const ARTICLES_TREE = new ContentBuilder('art-root', 'grid', 'Knowledge Base')
  .addContainer('rsc-master', 'grid', 'RSC Mastery', { ...adaptArticleToUnified(MOCK_ARTICLES_FLAT[0]), decorations: ['hot'] })
  .addItem({ ...adaptBlogToUnified(MOCK_BLOGS[0]), title: 'Why I moved to RSC' })
  .addItem({ ...adaptVideoToUnified(MOCK_VIDEOS[0]), title: 'Video Demo' })
  .up()
  .addContainer('ts-master', 'list', 'TypeScript Zone', adaptArticleToUnified(MOCK_ARTICLES_FLAT[1]))
  .addItem({ ...adaptProjectToUnified(MOCK_PROJECTS[1]), title: 'Utility Types' })
  .build();

// --- Interpreter & Chain of Responsibility (Filters) ---
interface Expression { interpret(context: UnifiedContentItem): boolean; }
class TypeExpression implements Expression { constructor(private type: string) { } interpret(context: UnifiedContentItem): boolean { return context.type.toLowerCase() === this.type.toLowerCase(); } }
class DecorationExpression implements Expression { constructor(private decoration: string) { } interpret(context: UnifiedContentItem): boolean { return context.decorations?.includes(this.decoration as any) || false; } }
class LockedExpression implements Expression { constructor(private isLocked: boolean) { } interpret(context: UnifiedContentItem): boolean { return !!context.isLocked === this.isLocked; } }
class KeywordExpression implements Expression { constructor(private keyword: string) { } interpret(context: UnifiedContentItem): boolean { return context.title.toLowerCase().includes(this.keyword) || context.description.toLowerCase().includes(this.keyword); } }
class AndExpression implements Expression { constructor(private expr1: Expression, private expr2: Expression) { } interpret(context: UnifiedContentItem): boolean { return this.expr1.interpret(context) && this.expr2.interpret(context); } }

class SearchQueryParser {
  static parse(query: string): Expression {
    const tokens = query.trim().split(/\s+/);
    let expression: Expression | null = null;
    tokens.forEach(token => {
      let subExpr: Expression;
      const lowerToken = token.toLowerCase();
      if (lowerToken.startsWith('type:')) subExpr = new TypeExpression(lowerToken.split(':')[1]);
      else if (lowerToken.startsWith('is:')) {
        const val = lowerToken.split(':')[1];
        if (val === 'locked') subExpr = new LockedExpression(true);
        else if (val === 'unlocked') subExpr = new LockedExpression(false);
        else subExpr = new DecorationExpression(val);
      } else if (lowerToken === '') return;
      else subExpr = new KeywordExpression(lowerToken);
      expression = expression ? new AndExpression(expression, subExpr) : subExpr;
    });
    return expression || { interpret: () => true };
  }
}

interface FilterRequest { query: string; typeFilter: string | 'all'; tags: string[]; }
abstract class FilterHandler { protected next: FilterHandler | null = null; public setNext(handler: FilterHandler): FilterHandler { this.next = handler; return handler; } public handle(item: UnifiedContentItem, request: FilterRequest): boolean { if (this.next) { return this.next.handle(item, request); } return true; } }
class SearchFilter extends FilterHandler { public handle(item: UnifiedContentItem, request: FilterRequest): boolean { if (request.query) { const expression = SearchQueryParser.parse(request.query); if (!expression.interpret(item)) return false; } return super.handle(item, request); } }
class TypeFilter extends FilterHandler { public handle(item: UnifiedContentItem, request: FilterRequest): boolean { if (request.typeFilter !== 'all') { if (item.type !== request.typeFilter) return false; } return super.handle(item, request); } }
class TagFilter extends FilterHandler { public handle(item: UnifiedContentItem, request: FilterRequest): boolean { if (request.tags.length > 0) { const hasTag = item.meta?.some(tag => request.tags.includes(tag)); if (!hasTag) return false; } return super.handle(item, request); } }

// --- Strategy Pattern (Sorting) ---
interface ISortStrategy { label: string; sort(items: UnifiedContentItem[]): UnifiedContentItem[]; }
class DateSortStrategy implements ISortStrategy { label = 'Date (Newest)'; sort(items: UnifiedContentItem[]): UnifiedContentItem[] { return [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); } }
class TitleSortStrategy implements ISortStrategy { label = 'Title (A-Z)'; sort(items: UnifiedContentItem[]): UnifiedContentItem[] { return [...items].sort((a, b) => a.title.localeCompare(b.title)); } }
class LengthSortStrategy implements ISortStrategy { label = 'Length (Longest)'; sort(items: UnifiedContentItem[]): UnifiedContentItem[] { return [...items].sort((a, b) => b.description.length - a.description.length); } }
const SORT_STRATEGIES: ISortStrategy[] = [new DateSortStrategy(), new TitleSortStrategy(), new LengthSortStrategy()];

// --- Visitor Pattern ---
interface IVisitor { visitLeaf(leaf: LeafNode): void; visitComposite(composite: CompositeNode): void; }
const traverse = (node: LayoutNode | CompositeNode | LeafNode, visitor: IVisitor) => { if (node.type === 'item') { visitor.visitLeaf(node as LeafNode); } else if (node.type === 'container') { const composite = node as CompositeNode; visitor.visitComposite(composite); composite.children.forEach(child => traverse(child, visitor)); } };
class MetricsVisitor implements IVisitor { counts: Record<string, number> = { project: 0, blog: 0, article: 0, video: 0, doc: 0, total: 0 }; visitLeaf(leaf: LeafNode): void { this.countItem(leaf.data); } visitComposite(composite: CompositeNode): void { if (composite.data) this.countItem(composite.data); } private countItem(item: UnifiedContentItem) { if (this.counts[item.type] !== undefined) { this.counts[item.type]++; this.counts.total++; } } }
class TagsVisitor implements IVisitor { tags = new Set<string>(); visitLeaf(leaf: LeafNode): void { leaf.data.meta?.forEach(tag => this.tags.add(tag)); } visitComposite(composite: CompositeNode): void { composite.data?.meta?.forEach(tag => this.tags.add(tag)); } }

// ==========================================
// === 5. LOCALIZATION & STYLE FACTORIES ===
// ==========================================
interface UILabels {
  nav: { home: string; feed: string; projects: string; articles: string; blog: string; docs: string; resume: string; dashboard: string; };
  hero: { titlePrefix: string; titleHighlight: string; description: string; btnProjects: string; btnArticles: string; };
  sections: { feed: string; feedDesc: string; projects: string; projectsDesc: string; articles: string; articlesDesc: string; blog: string; blogDesc: string; docs: string; docsDesc: string; resume: string; experience: string; skills: string; education: string; summary: string; dashboard: string; dashboardDesc: string; };
  actions: { readMore: string; downloadPdf: string; view: string; expand: string; collapse: string; related: string; search: string; filterBy: string; undo: string; locked: string; unlock: string; sortBy: string; tour: string; tourNext: string; tourPrev: string; tourEnd: string; tourPause: string; tourPlay: string; tourSpeed: string; searchPlaceholder: string; };
}
interface LocalizationFactory { code: string; getLabels(): UILabels; }
const EnglishLocalization: LocalizationFactory = {
  code: 'EN',
  getLabels: () => ({
    nav: { home: 'Home', feed: 'Feed', projects: 'Projects', articles: 'Articles', blog: 'Blog', docs: 'Docs', resume: 'Resume', dashboard: 'Analytics' },
    hero: { titlePrefix: 'Building the', titleHighlight: 'Future', description: 'Full Stack Developer crafting scalable applications.', btnProjects: 'View Projects', btnArticles: 'Read Articles' },
    sections: {
      feed: 'Unified Feed', feedDesc: 'All content in one place.',
      projects: 'Projects', projectsDesc: 'Super Projects and their related sub-modules.',
      articles: 'Technical Articles', articlesDesc: 'Drill down into topics to see related content.',
      blog: 'Personal Blog', blogDesc: 'Main stories and related thoughts.',
      docs: 'Documentation', docsDesc: 'Guides and References in a structured view.',
      resume: 'Resume', experience: 'Experience', skills: 'Skills', education: 'Education', summary: 'Summary',
      dashboard: 'Content Analytics', dashboardDesc: 'Insights generated dynamically from the content tree using Visitor Pattern.'
    },
    actions: { readMore: 'Read more', downloadPdf: 'PDF', view: 'View', expand: 'Show Related', collapse: 'Hide Related', related: 'Related Items', search: 'Search...', filterBy: 'Filter by', undo: 'Undo Last Action', locked: 'Premium Content', unlock: 'Unlock Access', sortBy: 'Sort by', tour: 'Start Guided Tour', tourNext: 'Next Section', tourPrev: 'Previous', tourEnd: 'End Tour', tourPause: 'Pause Tour', tourPlay: 'Resume Tour', tourSpeed: 'Speed', searchPlaceholder: 'Type "is:featured" or "type:video"...' }
  })
};
const ThaiLocalization: LocalizationFactory = {
  code: 'TH',
  getLabels: () => ({
    nav: { home: 'หน้าหลัก', feed: 'ฟีดรวม', projects: 'โปรเจกต์', articles: 'บทความ', blog: 'บล็อก', docs: 'เอกสาร', resume: 'เรซูเม่', dashboard: 'สถิติ' },
    hero: { titlePrefix: 'สร้างสรรค์', titleHighlight: 'อนาคต', description: 'นักพัฒนา Full Stack ผู้หลงใหลในการสร้างแอปพลิเคชันที่ขยายตัวได้จริง', btnProjects: 'ดูผลงาน', btnArticles: 'อ่านบทความ' },
    sections: {
      feed: 'ฟีดรวมเนื้อหา', feedDesc: 'รวมทุกความเคลื่อนไหวไว้ที่เดียว',
      projects: 'โปรเจกต์', projectsDesc: 'โปรเจกต์หลักและโมดูลย่อยที่เกี่ยวข้อง',
      articles: 'บทความเชิงลึก', articlesDesc: 'คลิกเพื่ออ่านหรือดูเนื้อหาที่เกี่ยวข้องเพิ่มเติม',
      blog: 'บล็อกส่วนตัว', blogDesc: 'เรื่องราวหลักและเกร็ดเล็กเกร็ดน้อยที่เกี่ยวข้อง',
      docs: 'เอกสารคู่มือ', docsDesc: 'คู่มือและอ้างอิงในรูปแบบโครงสร้าง',
      resume: 'ประวัติย่อ', experience: 'ประสบการณ์ทำงาน', skills: 'ทักษะ', education: 'การศึกษา', summary: 'สรุปข้อมูล',
      dashboard: 'สถิติเนื้อหา', dashboardDesc: 'ข้อมูลเชิงลึกที่สร้างขึ้นจากการวิเคราะห์โครงสร้าง Tree ด้วย Visitor Pattern'
    },
    actions: { readMore: 'อ่านต่อ', downloadPdf: 'ดาวน์โหลด PDF', view: 'ดู', expand: 'ดูที่เกี่ยวข้อง', collapse: 'ซ่อน', related: 'เนื้อหาที่เกี่ยวข้อง', search: 'ค้นหา...', filterBy: 'กรองตาม', undo: 'ยกเลิกคำสั่งล่าสุด', locked: 'เนื้อหาพรีเมียม', unlock: 'ปลดล็อก', sortBy: 'เรียงตาม', tour: 'เริ่มการนำชม', tourNext: 'ถัดไป', tourPrev: 'ย้อนกลับ', tourEnd: 'จบการนำชม', tourPause: 'หยุดชั่วคราว', tourPlay: 'เล่นต่อ', tourSpeed: 'ความเร็ว', searchPlaceholder: 'ลองพิมพ์ "is:featured" หรือ "type:video"...' }
  })
};

interface TypographyFactory { name: string; getFontClass(): string; }
const PrimaryFont: TypographyFactory = { name: 'Sans', getFontClass: () => 'font-sans' };
const SecondaryFont: TypographyFactory = { name: 'Serif', getFontClass: () => 'font-serif' };

interface StyleFactory {
  name: string;
  getMainLayoutClass(): string;
  getCardClass(): string;
  getButtonClass(variant?: 'primary' | 'secondary' | 'text'): string;
  getNavbarClass(): string;
  getBadgeClass(type?: string): string;
  getSectionTitleClass(): string;
  getContainerClass(type: string): string;
  getModalClass(): string;
  getToastClass(type: string): string;
  getLockedOverlayClass(): string;
  getTourOverlayClass(): string;
}
const ModernStyle: StyleFactory = {
  name: 'Modern',
  getMainLayoutClass: () => "bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300",
  getCardClass: () => "bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative",
  getButtonClass: (variant) => { if (variant === 'primary') return "px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all"; if (variant === 'text') return "px-3 py-1 text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-all"; return "px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"; },
  getNavbarClass: () => "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50",
  getBadgeClass: () => "px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full",
  getSectionTitleClass: () => "text-3xl font-bold text-gray-900 dark:text-white",
  getContainerClass: (type) => "rounded-2xl p-4 md:p-6 bg-gray-100/50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 backdrop-blur-sm mt-4",
  getModalClass: () => "bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden",
  getToastClass: (type) => `fixed bottom-4 left-4 z-[100] px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 ${type === 'SUCCESS' ? 'bg-green-600 text-white' : 'bg-gray-800 text-white dark:bg-white dark:text-black'}`,
  getLockedOverlayClass: () => "absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4 z-20",
  getTourOverlayClass: () => "fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-full px-6 py-3 flex items-center gap-6 animate-in slide-in-from-bottom-10"
};
const MinimalStyle: StyleFactory = {
  name: 'Minimal',
  getMainLayoutClass: () => "bg-white dark:bg-black min-h-screen transition-colors duration-300",
  getCardClass: () => "bg-transparent border-b border-gray-200 dark:border-gray-800 py-6 hover:opacity-80 transition-opacity relative",
  getButtonClass: (variant) => { if (variant === 'primary') return "px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-none uppercase tracking-widest text-xs font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"; if (variant === 'text') return "px-3 py-1 text-black dark:text-white uppercase tracking-wider text-xs font-bold hover:underline transition-all"; return "px-6 py-2 bg-transparent text-black dark:text-white border border-black dark:border-white rounded-none uppercase tracking-widest text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"; },
  getNavbarClass: () => "bg-white dark:bg-black border-b-2 border-black dark:border-white sticky top-0 z-50",
  getBadgeClass: () => "px-2 py-1 border border-gray-400 text-gray-600 dark:text-gray-400 text-[10px] uppercase tracking-wider",
  getSectionTitleClass: () => "text-2xl font-normal text-black dark:text-white uppercase tracking-[0.2em]",
  getContainerClass: (type) => "p-0 border-l border-black dark:border-white pl-4 mt-4",
  getModalClass: () => "bg-white dark:bg-black border-2 border-black dark:border-white shadow-none",
  getToastClass: (type) => `fixed bottom-4 left-4 z-[100] px-4 py-3 border-2 border-black dark:border-white flex items-center gap-3 bg-white dark:bg-black text-black dark:text-white uppercase tracking-widest text-xs font-bold`,
  getLockedOverlayClass: () => "absolute inset-0 bg-white/90 dark:bg-black/90 flex flex-col items-center justify-center text-center p-4 z-20 border-2 border-black dark:border-white m-2",
  getTourOverlayClass: () => "fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-black border-2 border-black dark:border-white px-6 py-3 flex items-center gap-6 shadow-none"
};
const FutureStyle: StyleFactory = {
  name: 'Future',
  getMainLayoutClass: () => "bg-slate-900 dark:bg-black min-h-screen transition-colors duration-300",
  getCardClass: () => "bg-slate-800/50 dark:bg-gray-900/80 backdrop-blur border border-cyan-500/30 dark:border-cyan-500/50 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all duration-300 rounded-none skew-x-[-2deg] relative",
  getButtonClass: (variant) => { if (variant === 'primary') return "px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold uppercase tracking-wider clip-path-slant hover:brightness-110 transition-all shadow-[0_0_10px_rgba(6,182,212,0.5)]"; if (variant === 'text') return "px-3 py-1 text-cyan-400 font-bold uppercase tracking-wider hover:text-cyan-200 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all"; return "px-6 py-2 bg-transparent text-cyan-400 border border-cyan-500/50 font-bold uppercase tracking-wider hover:bg-cyan-950/30 transition-all"; },
  getNavbarClass: () => "bg-slate-900/90 border-b border-cyan-500/30 sticky top-0 z-50 shadow-[0_0_20px_rgba(6,182,212,0.15)]",
  getBadgeClass: () => "px-2 py-1 bg-cyan-950/50 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase",
  getSectionTitleClass: () => "text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 uppercase italic",
  getContainerClass: (type) => "p-4 border border-cyan-900/50 bg-slate-900/50 mt-4",
  getModalClass: () => "bg-slate-900 border border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.2)] rounded-none",
  getToastClass: (type) => `fixed bottom-4 left-4 z-[100] px-4 py-3 bg-slate-900 border border-cyan-500 text-cyan-400 flex items-center gap-3 shadow-[0_0_15px_rgba(6,182,212,0.4)]`,
  getLockedOverlayClass: () => "absolute inset-0 bg-slate-900/90 border border-cyan-500/50 flex flex-col items-center justify-center text-center p-4 z-20",
  getTourOverlayClass: () => "fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-cyan-500 text-cyan-400 px-6 py-3 flex items-center gap-6 shadow-[0_0_20px_rgba(6,182,212,0.5)]"
};
const AcademicStyle: StyleFactory = {
  name: 'Academic',
  getMainLayoutClass: () => "bg-[#fdfbf7] dark:bg-[#1a1a1a] min-h-screen transition-colors duration-300",
  getCardClass: () => "bg-white dark:bg-[#2a2a2a] p-1 border border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow relative",
  getButtonClass: (variant) => { if (variant === 'primary') return "px-5 py-2 bg-[#8b1e3f] dark:bg-[#d4af37] text-white dark:text-black font-serif italic hover:opacity-90 transition-opacity"; if (variant === 'text') return "px-3 py-1 text-[#8b1e3f] dark:text-[#d4af37] font-serif italic hover:underline transition-all"; return "px-5 py-2 bg-transparent text-[#8b1e3f] dark:text-[#d4af37] border border-[#8b1e3f] dark:border-[#d4af37] font-serif italic hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"; },
  getNavbarClass: () => "bg-[#fdfbf7] dark:bg-[#1a1a1a] border-b-4 border-double border-gray-300 dark:border-gray-600 sticky top-0 z-50",
  getBadgeClass: () => "px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs font-serif italic border border-gray-400",
  getSectionTitleClass: () => "text-3xl font-bold text-gray-900 dark:text-gray-100 border-b-2 border-gray-300 dark:border-gray-600 pb-2 inline-block",
  getContainerClass: (type) => "p-6 border-2 border-double border-gray-300 dark:border-gray-600 mt-4",
  getModalClass: () => "bg-[#fdfbf7] dark:bg-[#1a1a1a] border-4 border-double border-gray-300 dark:border-gray-600 rounded-sm",
  getToastClass: (type) => `fixed bottom-4 left-4 z-[100] px-6 py-3 bg-[#fdfbf7] dark:bg-[#1a1a1a] border-2 border-double border-gray-400 text-gray-800 dark:text-gray-200 font-serif italic shadow-md`,
  getLockedOverlayClass: () => "absolute inset-0 bg-[#fdfbf7]/90 dark:bg-[#1a1a1a]/90 flex flex-col items-center justify-center text-center p-4 z-20 border-2 border-double border-gray-400",
  getTourOverlayClass: () => "fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-[#fdfbf7] dark:bg-[#1a1a1a] border-2 border-double border-gray-400 px-6 py-3 flex items-center gap-6 shadow-md"
};
const STYLES: Record<string, StyleFactory> = { 'modern': ModernStyle, 'minimal': MinimalStyle, 'future': FutureStyle, 'academic': AcademicStyle };
const LOCALES: Record<string, LocalizationFactory> = { 'en': EnglishLocalization, 'th': ThaiLocalization };
const FONTS: Record<string, TypographyFactory> = { 'sans': PrimaryFont, 'serif': SecondaryFont };

// ==========================================
// === 6. HELPER COMPONENTS (Missing Definitions) ===
// ==========================================

const AccessControlProxy = ({ isLocked, children, style, labels }: { isLocked?: boolean, children: React.ReactNode, style: StyleFactory, labels: UILabels }) => {
  const { isAdmin, toggleRole } = useContext(UserContext);
  if (!isLocked || isAdmin) return <>{children}</>;
  return (
    <div className="relative overflow-hidden group">
      <div className="blur-sm select-none pointer-events-none">{children}</div>
      <div className={style.getLockedOverlayClass()}>
        <Lock size={32} className="mb-2 text-gray-500" />
        <h3 className="font-bold mb-2">{labels.actions.locked}</h3>
        <button onClick={toggleRole} className={style.getButtonClass('primary')}>
          {labels.actions.unlock}
        </button>
      </div>
    </div>
  );
};

const ContentDecorator = ({ decorations, children, style }: { decorations?: DecorationType[], children: React.ReactNode, style: StyleFactory }) => {
  if (!decorations || decorations.length === 0) return <>{children}</>;
  return (
    <div className="relative">
      {children}
      <div className="absolute -top-2 -right-2 flex flex-col gap-1 z-10">
        {decorations.map(d => {
          let colorClass = "bg-gray-500";
          let icon = <Star size={12} />;
          if (d === 'featured') { colorClass = "bg-yellow-500 text-black"; icon = <Star size={12} />; }
          if (d === 'new') { colorClass = "bg-green-500 text-white"; icon = <Zap size={12} />; }
          if (d === 'hot') { colorClass = "bg-red-500 text-white"; icon = <Flame size={12} />; }
          if (d === 'popular') { colorClass = "bg-blue-500 text-white"; icon = <Award size={12} />; }
          return (
            <div key={d} className={`${colorClass} shadow-md px-2 py-0.5 rounded-full text-[10px] uppercase font-bold flex items-center gap-1`}>
              {icon} {d}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const LayoutSwitcher = ({ current, onChange, currentStyle, labels }: { current: LayoutStyleType, onChange: (l: LayoutStyleType) => void, currentStyle: StyleFactory, labels: UILabels }) => (
  <div className="flex gap-2">
    {(['grid', 'list', 'column'] as LayoutStyleType[]).map(l => (
      <button key={l} onClick={() => onChange(l)} className={`p-2 rounded-lg transition-all ${current === l ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
        {l === 'grid' ? <LayoutGrid size={18} /> : l === 'list' ? <List size={18} /> : <Layers size={18} />}
      </button>
    ))}
  </div>
);

const ContentLayoutFactory = ({ layout, items, renderItem, currentStyle, labels }: { layout: string, items: UnifiedContentItem[], renderItem: Function, getDate: Function, currentStyle: StyleFactory, labels: UILabels }) => {
  if (layout === 'list') {
    return <div className="space-y-4">{items.map(item => <div key={item.id}>{renderItem(item, 'list', currentStyle, labels)}</div>)}</div>;
  }
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{items.map(item => <div key={item.id}>{renderItem(item, 'grid', currentStyle, labels)}</div>)}</div>;
};

const ToastContainer = ({ style }: { style: StyleFactory }) => {
  const [toasts, setToasts] = useState<{ id: number, msg: string, type: string }[]>([]);
  useEffect(() => {
    return notify.subscribe((msg: string, type: string) => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, msg, type }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    });
  }, []);
  return (
    <div className="fixed bottom-4 left-4 flex flex-col gap-2 z-[100] pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className={`${style.getToastClass(t.type)} pointer-events-auto`}>
          {t.type === 'SUCCESS' ? <CheckCircle size={16} /> : t.type === 'INFO' ? <Info size={16} /> : <AlertTriangle size={16} />}
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
};

const CommandPalette = ({ commands, isOpen, onClose, style }: { commands: ICommand[], isOpen: boolean, onClose: () => void, style: StyleFactory }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className={`${style.getModalClass()} w-full max-w-lg p-0`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
          <CommandIcon className="text-gray-400" />
          <input autoFocus type="text" placeholder="Type a command..." className="flex-1 bg-transparent focus:outline-none text-lg" />
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <div className="max-h-96 overflow-y-auto p-2">
          {commands.map((cmd) => (
            <button key={cmd.id} onClick={() => { cmd.execute(); onClose(); }} className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex items-center gap-3 transition-colors">
              <div className="text-gray-500">{cmd.icon}</div>
              <span className="font-medium">{cmd.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const ThemeControls = ({ currentStyleKey, setStyleKey, isDark, toggleDark, langKey, setLangKey, fontKey, setFontKey, openCommandPalette, undoLastAction, isAdmin, toggleRole, startTour }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {isOpen && (
        <div className="bg-white dark:bg-gray-900 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-2 min-w-[200px] animate-in slide-in-from-bottom-5">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Style</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {Object.keys(STYLES).map(k => (
                  <button key={k} onClick={() => setStyleKey(k)} className={`text-xs px-2 py-1 rounded border ${currentStyleKey === k ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-gray-200 hover:bg-gray-50'}`}>{k}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">Language</label>
              <div className="flex gap-2 mt-1">
                {Object.keys(LOCALES).map(k => (
                  <button key={k} onClick={() => setLangKey(k)} className={`text-xs px-2 py-1 rounded border ${langKey === k ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-gray-200'}`}>{k.toUpperCase()}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 border-t pt-3">
              <button onClick={toggleDark} className="p-2 rounded bg-gray-100 dark:bg-gray-800" title="Toggle Dark Mode">{isDark ? <Sun size={16} /> : <Moon size={16} />}</button>
              <button onClick={undoLastAction} className="p-2 rounded bg-gray-100 dark:bg-gray-800" title="Undo"><RotateCcw size={16} /></button>
              <button onClick={toggleRole} className={`p-2 rounded ${isAdmin ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`} title="Toggle Admin"><UserCheck size={16} /></button>
              <button onClick={openCommandPalette} className="p-2 rounded bg-gray-100 dark:bg-gray-800" title="Command Palette"><CommandIcon size={16} /></button>
            </div>
            <button onClick={startTour} className="w-full py-2 bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2"><PlayCircle size={14} /> Start Tour</button>
          </div>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} className="h-12 w-12 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform">
        <Wrench size={20} />
      </button>
    </div>
  );
};

const TourControls = ({ iterator, isActive, onStop, onExecuteStep, style, labels }: { iterator: TourIterator, isActive: boolean, onStop: () => void, onExecuteStep: (step: TourStep) => void, style: StyleFactory, labels: UILabels }) => {
  const [step, setStep] = useState<TourStep | null>(null);

  useEffect(() => {
    if (isActive && !step) {
      const first = iterator.next();
      if (first) {
        setStep(first);
        onExecuteStep(first);
      }
    }
  }, [isActive]);

  if (!isActive || !step) return null;

  const handleNext = () => {
    const next = iterator.next();
    if (next) {
      setStep(next);
      onExecuteStep(next);
    } else {
      onStop();
    }
  };

  const handlePrev = () => {
    const prev = iterator.prev();
    if (prev) {
      setStep(prev);
      onExecuteStep(prev);
    }
  };

  return (
    <div className={style.getTourOverlayClass()}>
      <div className="flex flex-col">
        <span className="text-[10px] uppercase font-bold text-gray-400">Guided Tour</span>
        <span className="font-bold whitespace-nowrap">{step.label}</span>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={handlePrev} disabled={!iterator.hasPrev()} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-30"><SkipBack size={20} /></button>
        <button onClick={onStop} className="p-1 hover:bg-red-100 text-red-500 rounded"><StopCircle size={20} /></button>
        <button onClick={handleNext} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"><SkipForward size={20} /></button>
      </div>
    </div>
  );
};

// ==========================================
// === 8. CORE COMPONENTS (MOVED BEFORE SECTIONS) ===
// ==========================================

const InteractiveContentNode = ({ node, style, labels, level = 0 }: { node: LayoutNode | CompositeNode | LeafNode, style: StyleFactory, labels: UILabels, level?: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLayout, setCurrentLayout] = useState<LayoutStyleType>('grid');

  const { activeNodeId } = useContext(TourContext);
  const isComposite = (n: LayoutNode): n is CompositeNode => n.type === 'container';
  const hasChildren = isComposite(node) && node.children && node.children.length > 0;

  useEffect(() => { if (isComposite(node)) setCurrentLayout(node.layoutStyle); }, [node]);

  useEffect(() => {
    if (activeNodeId === node.id) {
      setIsOpen(true);
      const el = document.getElementById(`node-${node.id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeNodeId, node.id]);

  const contentItem = (node as any).data as UnifiedContentItem | undefined;

  const renderContentCard = () => {
    if (!contentItem && !isComposite(node)) return null;
    if (!contentItem && isComposite(node)) {
      return (
        <div id={`node-${node.id}`} className="flex items-center justify-between mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          <h3 className={`text-lg font-bold opacity-70 flex items-center gap-2 ${style.name === 'Future' ? 'text-cyan-200' : 'text-gray-500 dark:text-gray-400'}`}>
            <Folder size={18} /> {node.title || 'Section'}
          </h3>
          <div className="flex gap-2">
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded p-1 scale-75 origin-right">
              {(['grid', 'list', 'timeline'] as LayoutStyleType[]).map(l => (
                <button key={l} onClick={(e) => { e.stopPropagation(); setCurrentLayout(l); }} className={`p-1 rounded ${currentLayout === l ? 'bg-white shadow text-blue-600' : 'text-gray-400'}`}>{l === 'grid' ? <LayoutGrid size={14} /> : l === 'list' ? <List size={14} /> : <Clock size={14} />}</button>
              ))}
            </div>
            {hasChildren && (
              <button onClick={() => setIsOpen(!isOpen)} className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-transform ${isOpen ? 'rotate-180' : ''}`}><ChevronDown size={20} /></button>
            )}
          </div>
        </div>
      );
    }

    return (
      <AccessControlProxy isLocked={contentItem!.isLocked} style={style} labels={labels}>
        <ContentDecorator decorations={contentItem!.decorations} style={style}>
          <div id={`node-${node.id}`} className={`${style.getCardClass()} p-6 ${activeNodeId === node.id ? 'ring-2 ring-blue-500 dark:ring-blue-400 shadow-xl scale-[1.01]' : ''} transition-all duration-500`}>
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <span className={style.getBadgeClass()}>{contentItem!.type}</span>
                <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={12} /> {contentItem!.date}</span>
              </div>
              {hasChildren && (
                <button onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }} className={`flex items-center gap-1 text-xs font-bold uppercase tracking-wider transition-colors ${style.name === 'Future' ? 'text-cyan-400' : 'text-blue-600 dark:text-blue-400'}`}>
                  {isOpen ? labels.actions.collapse : labels.actions.expand} ({isComposite(node) ? node.children.length : 0}) <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>
            <h3 className={`text-2xl font-bold mb-2 cursor-pointer hover:underline ${style.name === 'Future' ? 'text-cyan-400' : 'text-gray-900 dark:text-gray-100'}`} onClick={() => notify.notify(`Opened: ${contentItem!.title}`, 'INFO')}>{contentItem!.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed">{contentItem!.description}</p>
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex gap-2">{contentItem!.meta && contentItem!.meta.slice(0, 3).map((tag, i) => <span key={i} className="text-[10px] px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-gray-500">#{tag}</span>)}</div>
              <button className={style.getButtonClass('text')}>{labels.actions.readMore} <ChevronRight size={14} className="inline ml-1" /></button>
            </div>
          </div>
        </ContentDecorator>
      </AccessControlProxy>
    );
  };

  const renderChildren = () => {
    if (!isComposite(node)) return null;
    useEffect(() => { if (!contentItem && isComposite(node)) setIsOpen(true); }, []);
    const shouldRender = contentItem ? isOpen : (isOpen || true);
    if (!shouldRender) return null;
    return (
      <div className={`${style.getContainerClass(currentLayout)} animate-in fade-in slide-in-from-top-4 duration-300`}>
        {contentItem && (
          <div className="flex justify-between items-center mb-4 px-2">
            <span className="text-xs font-bold uppercase text-gray-400 flex items-center gap-2"><Layers size={14} /> {labels.actions.related}</span>
            <div className="flex gap-1 bg-gray-200 dark:bg-gray-700 rounded p-0.5">
              {(['grid', 'list', 'timeline'] as LayoutStyleType[]).map(l => (
                <button key={l} onClick={() => setCurrentLayout(l)} className={`p-1.5 rounded text-xs transition-all ${currentLayout === l ? 'bg-white dark:bg-gray-600 shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} title={l}>
                  {l === 'grid' ? <LayoutGrid size={12} /> : l === 'list' ? <List size={12} /> : <Clock size={12} />}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className={currentLayout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : currentLayout === 'list' ? 'flex flex-col space-y-4' : currentLayout === 'timeline' ? `border-l-2 ${style.name === 'Future' ? 'border-cyan-500' : 'border-gray-300'} ml-2 pl-4 space-y-6` : 'flex flex-col gap-4'}>
          {node.children.map((child, idx) => (
            <div key={child.id} className={currentLayout === 'timeline' ? 'relative' : ''}>
              {currentLayout === 'timeline' && <div className={`absolute -left-[23px] top-6 h-3 w-3 rounded-full border-2 ${style.name === 'Future' ? 'border-black bg-cyan-500' : 'border-white bg-gray-400'} shadow-sm`} />}
              <InteractiveContentNode node={child} style={style} labels={labels} level={level + 1} />
            </div>
          ))}
        </div>
      </div>
    );
  };
  return (<div className={`w-full ${level > 0 ? 'mb-0' : 'mb-8'}`}>{renderContentCard()}{renderChildren()}</div>);
};

// --- 6. PAGE SECTIONS (Moved after InteractiveContentNode) ---

const HeroSection = ({ currentStyle, labels }: { currentStyle: StyleFactory, labels: UILabels }) => (<div className={`flex flex-col items-center justify-center min-h-[80vh] text-center px-4`}><div className={`w-32 h-32 rounded-full mb-8 flex items-center justify-center text-4xl font-bold animate-pulse ${currentStyle.name === 'Future' ? 'bg-cyan-900 text-cyan-400 shadow-[0_0_50px_rgba(6,182,212,0.5)]' : currentStyle.name === 'Minimal' ? 'bg-black text-white dark:bg-white dark:text-black border-4 border-double' : 'bg-gradient-to-tr from-blue-400 to-indigo-500 text-white shadow-xl'}`}>AD</div><h1 className={`mb-4 ${currentStyle.name === 'Future' ? 'text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600' : 'text-5xl font-extrabold text-gray-900 dark:text-white'}`}>{labels.hero.titlePrefix} <span className={currentStyle.name === 'Academic' ? 'italic text-[#8b1e3f]' : 'text-blue-600'}>{labels.hero.titleHighlight}</span></h1><p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-8 leading-relaxed">{labels.hero.description}</p><div className="flex space-x-4"><button className={currentStyle.getButtonClass('primary')} onClick={() => notify.notify('Navigating to Projects...', 'INFO')}>{labels.hero.btnProjects}</button><button className={currentStyle.getButtonClass('secondary')}>{labels.hero.btnArticles}</button></div></div>);
const ArticlesSection = ({ currentStyle, labels }: { currentStyle: StyleFactory, labels: UILabels }) => (<div className={`py-12 px-4 max-w-7xl mx-auto`}><div className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4"><h2 className={currentStyle.getSectionTitleClass()}>{labels.sections.articles}</h2><p className="text-gray-500 mt-2">{labels.sections.articlesDesc}</p></div><div className="space-y-4">{ARTICLES_TREE.children.map((node) => <InteractiveContentNode key={node.id} node={node} style={currentStyle} labels={labels} />)}</div></div>);
const ProjectsSection = ({ currentStyle, labels }: { currentStyle: StyleFactory, labels: UILabels }) => (<div className={`py-12 px-4 max-w-7xl mx-auto`}><div className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4"><h2 className={currentStyle.getSectionTitleClass()}>{labels.sections.projects}</h2><p className="text-gray-500 mt-2">{labels.sections.projectsDesc}</p></div><div className="space-y-4">{PROJECTS_TREE.children.map((node) => <InteractiveContentNode key={node.id} node={node} style={currentStyle} labels={labels} />)}</div></div>);
const BlogSection = ({ currentStyle, labels }: { currentStyle: StyleFactory, labels: UILabels }) => (<div className={`py-12 px-4 max-w-7xl mx-auto`}><div className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4"><h2 className={currentStyle.getSectionTitleClass()}>{labels.sections.blog}</h2><p className="text-gray-500 mt-2">{labels.sections.blogDesc}</p></div><div className="space-y-4">{BLOGS_TREE.children.map((node) => <InteractiveContentNode key={node.id} node={node} style={currentStyle} labels={labels} />)}</div></div>);
const DocsSection = ({ currentStyle, labels }: { currentStyle: StyleFactory, labels: UILabels }) => { const [activeDoc, setActiveDoc] = useState(MOCK_DOCS[0]); const sections = Array.from(new Set(MOCK_DOCS.map(d => d.section))); return (<div className={`flex flex-col md:flex-row max-w-7xl mx-auto pt-8 min-h-[80vh] px-4`}><div className="w-full md:w-64 flex-shrink-0 mb-8 md:mb-0 md:border-r border-gray-200 dark:border-gray-700 md:pr-4"><h3 className={`text-lg font-bold mb-4 ${currentStyle.name === 'Future' ? 'text-cyan-400' : 'text-gray-900 dark:text-gray-100'}`}>{labels.sections.docs}</h3>{sections.map(section => (<div key={section} className="mb-6"><h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{section}</h4><ul className="space-y-1">{MOCK_DOCS.filter(d => d.section === section).map(doc => (<li key={doc.id}><button onClick={() => setActiveDoc(doc)} className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${activeDoc.id === doc.id ? (currentStyle.name === 'Future' ? 'bg-cyan-900/50 text-cyan-400' : 'bg-blue-50 text-blue-700 dark:bg-gray-800 dark:text-blue-300 font-medium') : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>{doc.title}</button></li>))}</ul></div>))}</div><div className="flex-1 md:pl-12"><div className="prose dark:prose-invert max-w-none"><h1 className={currentStyle.getSectionTitleClass()}>{activeDoc.title}</h1><div className={`p-4 my-6 border-l-4 ${currentStyle.name === 'Future' ? 'bg-cyan-950/30 border-cyan-500 text-cyan-200' : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400 text-yellow-800 dark:text-yellow-200'}`}><p className="text-sm">Last updated on {activeDoc.lastUpdated}</p></div><div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{activeDoc.content}</div></div></div></div>); };
const UnifiedFeedSection = ({ currentStyle, labels }: { currentStyle: StyleFactory, labels: UILabels }) => { const [layout, setLayout] = useState<LayoutType>('grid'); const [searchQuery, setSearchQuery] = useState(''); const [filterType, setFilterType] = useState('all'); const [currentSortStrategy, setCurrentSortStrategy] = useState<ISortStrategy>(SORT_STRATEGIES[0]); const allItems = [...MOCK_PROJECTS.map(adaptProjectToUnified), ...MOCK_BLOGS.map(adaptBlogToUnified), ...MOCK_VIDEOS.map(adaptVideoToUnified)]; const searchFilter = new SearchFilter(); const typeFilter = new TypeFilter(); const tagFilter = new TagFilter(); typeFilter.setNext(searchFilter).setNext(tagFilter); const filteredItems = allItems.filter(item => { const request: FilterRequest = { query: searchQuery, typeFilter: filterType, tags: [] }; return typeFilter.handle(item, request); }); const sortedItems = currentSortStrategy.sort(filteredItems); const renderItem = (item: UnifiedContentItem, currentLayout: LayoutType, style: StyleFactory, labels: UILabels) => { const isList = currentLayout === 'list'; return (<AccessControlProxy isLocked={item.isLocked} style={style} labels={labels}> <ContentDecorator decorations={item.decorations} style={style}> <div className={`${style.getCardClass()} h-full flex ${isList ? 'flex-row items-center' : 'flex-col'}`}> <div className={`${isList ? 'w-48 h-32' : 'h-48'} bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 relative overflow-hidden`}><span className="text-gray-400 font-medium opacity-50">{item.type.toUpperCase()}</span><div className={`absolute top-2 right-2 ${style.getBadgeClass()}`}>{item.type}</div></div> <div className="p-6 flex-1 flex flex-col"><div className="flex items-center text-xs text-gray-400 mb-2 space-x-2"><Calendar size={12} /><span>{item.date}</span></div><h3 className={`text-xl font-bold mb-2 ${style.name === 'Future' ? 'text-cyan-400' : 'text-gray-900 dark:text-gray-100'}`} onClick={() => notify.notify(`Viewing details for: ${item.title}`, 'INFO')}>{item.title}</h3><p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 text-sm">{item.description}</p><div className="flex flex-wrap gap-2 mt-auto">{item.meta.slice(0, 3).map((tag, i) => <span key={i} className={style.getBadgeClass()}>{tag}</span>)}</div></div> </div> </ContentDecorator> </AccessControlProxy>); }; return (<div className={`py-12 px-4 max-w-7xl mx-auto`}> <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 border-b border-gray-200 dark:border-gray-700 pb-4"> <div> <h2 className={currentStyle.getSectionTitleClass()}>{labels.sections.feed}</h2> <p className="text-gray-500 mt-2">{labels.sections.feedDesc}</p> </div> <div className="mt-4 md:mt-0"><LayoutSwitcher current={layout} onChange={setLayout} currentStyle={currentStyle} labels={labels} /></div> </div> <div className={`mb-8 p-4 rounded-xl ${currentStyle.name === 'Future' ? 'bg-slate-800/50 border border-cyan-900' : 'bg-gray-100 dark:bg-gray-800'}`}> <div className="flex flex-col md:flex-row gap-4 items-center mb-4"> <div className="relative flex-1 w-full"> <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /> <input type="text" placeholder={labels.actions.searchPlaceholder} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" /> <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" title="Advanced Search Syntax: type:video, is:featured"><HelpCircle size={14} /></div></div> <div className="relative group"> <button className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentStyle.getButtonClass('secondary')}`}> <ArrowUpDown size={16} /> <span>{currentSortStrategy.label}</span> <ChevronDown size={16} /> </button> <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 hidden group-hover:block z-10 p-1"> {SORT_STRATEGIES.map((strategy, idx) => (<button key={idx} onClick={() => { setCurrentSortStrategy(strategy); notify.notify(`Sorted by ${strategy.label}`, 'INFO'); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" > {strategy.label} </button>))} </div> </div> </div> <div className="flex items-center gap-2 w-full overflow-x-auto"> <Filter size={18} className="text-gray-500" /> <span className="text-sm font-bold text-gray-500 whitespace-nowrap">{labels.actions.filterBy}:</span> {['all', 'project', 'blog', 'video', 'article'].map(type => (<button key={type} onClick={() => { setFilterType(type); notify.notify(`Filtered by ${type}`, 'INFO'); }} className={`px-3 py-1.5 rounded-md text-sm capitalize transition-all ${filterType === type ? currentStyle.getButtonClass('primary') : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`} > {type} </button>))} </div> </div> <ContentLayoutFactory layout={layout} items={sortedItems} renderItem={renderItem} getDate={(item) => item.date} currentStyle={currentStyle} labels={labels} /> </div>); };
const DashboardSection = ({ currentStyle, labels }: { currentStyle: StyleFactory, labels: UILabels }) => { const metricsVisitor = new MetricsVisitor(); const tagsVisitor = new TagsVisitor(); traverse(PROJECTS_TREE, metricsVisitor); traverse(PROJECTS_TREE, tagsVisitor); traverse(BLOGS_TREE, metricsVisitor); traverse(BLOGS_TREE, tagsVisitor); traverse(ARTICLES_TREE, metricsVisitor); traverse(ARTICLES_TREE, tagsVisitor); const stats = metricsVisitor.counts; const tags = Array.from(tagsVisitor.tags); return (<div className={`py-12 px-4 max-w-7xl mx-auto`}><div className="mb-10 border-b border-gray-200 dark:border-gray-700 pb-4"><h2 className={currentStyle.getSectionTitleClass()}>{labels.sections.dashboard}</h2><p className="text-gray-500 mt-2">{labels.sections.dashboardDesc}</p></div><div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"><div className={`${currentStyle.getCardClass()} p-6`}><div className="flex items-center gap-3 mb-6"><div className={`p-3 rounded-lg ${currentStyle.name === 'Future' ? 'bg-cyan-900/30 text-cyan-400' : 'bg-blue-100 text-blue-600'}`}><BarChart3 size={24} /></div><h3 className="text-xl font-bold dark:text-white">Content Overview</h3></div><div className="grid grid-cols-2 gap-4"><div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-center"><div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</div><div className="text-xs uppercase tracking-wider text-gray-500 mt-1">Total Items</div></div><div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-center"><div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.project}</div><div className="text-xs uppercase tracking-wider text-gray-500 mt-1">Projects</div></div><div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-center"><div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.blog}</div><div className="text-xs uppercase tracking-wider text-gray-500 mt-1">Blog Posts</div></div><div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-center"><div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.article}</div><div className="text-xs uppercase tracking-wider text-gray-500 mt-1">Articles</div></div></div></div><div className={`${currentStyle.getCardClass()} p-6`}><div className="flex items-center gap-3 mb-6"><div className={`p-3 rounded-lg ${currentStyle.name === 'Future' ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'}`}><PieChart size={24} /></div><h3 className="text-xl font-bold dark:text-white">Topic Cloud</h3></div><div className="flex flex-wrap gap-2">{tags.map(tag => (<span key={tag} className={`${currentStyle.getBadgeClass()} text-sm py-1.5 px-3`} onClick={() => notify.notify(`Tag selected: ${tag}`, 'INFO')}>#{tag}</span>))}</div></div></div></div>); };
const ResumeSection = ({ currentStyle, labels }: { currentStyle: StyleFactory, labels: UILabels }) => (<div className={`py-12 px-4 max-w-4xl mx-auto`}><div className={`${currentStyle.getCardClass()} p-8 print:shadow-none print:border-none`}><div className="border-b border-gray-200 dark:border-gray-700 pb-8 mb-8 flex justify-between items-start"><div><h1 className={`text-4xl font-bold mb-2 ${currentStyle.name === 'Future' ? 'text-cyan-400' : 'text-gray-900 dark:text-white'}`}>{MOCK_RESUME.name}</h1><h2 className={`text-xl font-medium mb-4 ${currentStyle.name === 'Future' ? 'text-purple-400' : 'text-blue-600 dark:text-blue-400'}`}>{MOCK_RESUME.title}</h2><div className="flex flex-col sm:flex-row gap-4 text-gray-500 text-sm"><span>{MOCK_RESUME.contact.location}</span><span>{MOCK_RESUME.contact.email}</span></div></div><button className={currentStyle.getButtonClass('secondary')} onClick={() => notify.notify('Downloading Resume...', 'SUCCESS')}><FileText size={16} /> {labels.actions.downloadPdf}</button></div><div className="mb-8"><h3 className={`text-lg font-bold uppercase tracking-wide mb-4 border-b pb-2 ${currentStyle.name === 'Future' ? 'text-cyan-400 border-cyan-900' : 'text-gray-900 dark:text-white border-gray-100 dark:border-gray-700'}`}>{labels.sections.summary}</h3><p className="text-gray-600 dark:text-gray-300 leading-relaxed">{MOCK_RESUME.summary}</p></div><div className="mb-8"><h3 className={`text-lg font-bold uppercase tracking-wide mb-4 border-b pb-2 ${currentStyle.name === 'Future' ? 'text-cyan-400 border-cyan-900' : 'text-gray-900 dark:text-white border-gray-100 dark:border-gray-700'}`}>{labels.sections.experience}</h3><div className="space-y-8">{MOCK_RESUME.experience.map(exp => (<div key={exp.id}><div className="flex justify-between items-baseline mb-2"><h4 className="text-xl font-bold text-gray-800 dark:text-gray-200">{exp.role}</h4><span className="text-sm text-gray-500 font-medium">{exp.period}</span></div><div className={`${currentStyle.name === 'Future' ? 'text-purple-400' : 'text-blue-600 dark:text-blue-400'} font-medium mb-3`}>{exp.company}</div><ul className="list-disc list-outside ml-5 space-y-1 text-gray-600 dark:text-gray-400">{exp.description.map((desc, i) => <li key={i}>{desc}</li>)}</ul></div>))}</div></div><div><h3 className={`text-lg font-bold uppercase tracking-wide mb-4 border-b pb-2 ${currentStyle.name === 'Future' ? 'text-cyan-400 border-cyan-900' : 'text-gray-900 dark:text-white border-gray-100 dark:border-gray-700'}`}>{labels.sections.skills}</h3><div className="flex flex-wrap gap-2">{MOCK_RESUME.skills.map(skill => <span key={skill} className={currentStyle.getBadgeClass()}>{skill}</span>)}</div></div></div></div>);

// ==========================================
// === 9. MAIN APP COMPONENT ===
// ==========================================

export default function PersonalWebsite() {
  const [activeTab, setActiveTab] = useState('home');
  const [styleKey, setStyleKey] = useState('modern');
  const [langKey, setLangKey] = useState('en');
  const [fontKey, setFontKey] = useState('sans');
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isTourActive, setIsTourActive] = useState(false);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  useEffect(() => {
    if (isDark) { document.documentElement.classList.add('dark'); } else { document.documentElement.classList.remove('dark'); }
  }, [isDark]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setIsCommandOpen(prev => !prev); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentStyle = STYLES[styleKey];
  const currentLang = LOCALES[langKey];
  const currentFont = FONTS[fontKey];
  const labels = currentLang.getLabels();

  const navItems = [
    { name: labels.nav.home, id: 'home', icon: <User size={18} /> },
    { name: labels.nav.dashboard, id: 'dashboard', icon: <PieChart size={18} /> },
    { name: labels.nav.feed, id: 'feed', icon: <Rss size={18} /> },
    { name: labels.nav.projects, id: 'projects', icon: <Code size={18} /> },
    { name: labels.nav.articles, id: 'articles', icon: <BookOpen size={18} /> },
    { name: labels.nav.blog, id: 'blog', icon: <FileText size={18} /> },
    { name: labels.nav.docs, id: 'docs', icon: <FileText size={18} /> },
    { name: labels.nav.resume, id: 'resume', icon: <Briefcase size={18} /> },
  ];

  const TOUR_SEQUENCE: TourStep[] = [
    { type: 'NAV', targetId: 'home', label: 'Start' },
    { type: 'NAV', targetId: 'dashboard', label: 'Stats' },
    { type: 'NAV', targetId: 'projects', label: 'Projects' },
    { type: 'EXPAND', targetId: 'super-app', label: 'Deep Dive' },
    { type: 'RESET_EXPAND', label: 'Reset' },
    { type: 'NAV', targetId: 'feed', label: 'Feed' },
    { type: 'NAV', targetId: 'articles', label: 'Articles' },
    { type: 'NAV', targetId: 'blog', label: 'Blog' },
    { type: 'NAV', targetId: 'docs', label: 'Docs' },
    { type: 'NAV', targetId: 'resume', label: 'Resume' },
  ];

  const [tourIterator] = useState(() => new TourIterator(TOUR_SEQUENCE));

  const getCurrentTab = () => activeTab;
  const getCurrentStyle = () => styleKey;

  const commands: ICommand[] = [
    new NavigateCommand('nav-home', 'Go to Home', <User size={16} />, 'home', setActiveTab, getCurrentTab),
    new NavigateCommand('nav-projects', 'Go to Projects', <Code size={16} />, 'projects', setActiveTab, getCurrentTab),
    new NavigateCommand('nav-dashboard', 'Go to Analytics', <PieChart size={16} />, 'dashboard', setActiveTab, getCurrentTab),
    new ToggleThemeCommand(() => setIsDark(prev => !prev)),
    new SwitchStyleCommand('style-modern', 'Style: Modern', <Monitor size={16} />, 'modern', setStyleKey, getCurrentStyle),
    new SwitchStyleCommand('style-future', 'Style: Future', <Code size={16} />, 'future', setStyleKey, getCurrentStyle),
    new SwitchStyleCommand('style-minimal', 'Style: Minimal', <X size={16} />, 'minimal', setStyleKey, getCurrentStyle),
    new ToggleRoleCommand(() => setIsAdmin(prev => !prev)),
    new StartTourCommand(() => { setIsTourActive(true); setActiveTab('home'); tourIterator.reset(); })
  ];

  const handleUndo = () => {
    const lastCommand = historyManager.pop();
    if (lastCommand) { lastCommand.undo(); } else { notify.notify('Nothing to undo', 'INFO'); }
  };

  const handleTourStep = (step: TourStep) => {
    if (step.type === 'NAV' && step.targetId) {
      setActiveTab(step.targetId);
      setActiveNodeId(null);
    } else if (step.type === 'EXPAND' && step.targetId) {
      setActiveNodeId(step.targetId);
    } else if (step.type === 'RESET_EXPAND') {
      setActiveNodeId(null);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HeroSection currentStyle={currentStyle} labels={labels} />;
      case 'dashboard': return <DashboardSection currentStyle={currentStyle} labels={labels} />;
      case 'feed': return <UnifiedFeedSection currentStyle={currentStyle} labels={labels} />;
      case 'projects': return <ProjectsSection currentStyle={currentStyle} labels={labels} />;
      case 'articles': return <ArticlesSection currentStyle={currentStyle} labels={labels} />;
      case 'blog': return <BlogSection currentStyle={currentStyle} labels={labels} />;
      case 'docs': return <DocsSection currentStyle={currentStyle} labels={labels} />;
      case 'resume': return <ResumeSection currentStyle={currentStyle} labels={labels} />;
      default: return <HeroSection currentStyle={currentStyle} labels={labels} />;
    }
  };

  return (
    <UserContext.Provider value={{ isAdmin, toggleRole: () => setIsAdmin(!isAdmin) }}>
      <TourContext.Provider value={{ activeNodeId, setActiveNodeId }}>
        <div className={`${currentStyle.getMainLayoutClass()} ${currentFont.getFontClass()}`}>
          <nav className={currentStyle.getNavbarClass()}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center cursor-pointer" onClick={() => setActiveTab('home')}>
                  <span className={`text-xl font-bold ${currentStyle.name === 'Future' ? 'text-cyan-400' : 'text-gray-900 dark:text-white'}`}>Alex.Dev</span>
                </div>
                <div className="hidden lg:flex space-x-6 items-center">
                  {navItems.map((item) => (
                    <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors ${activeTab === item.id ? (currentStyle.name === 'Future' ? 'text-cyan-400' : 'text-blue-600 dark:text-blue-400') : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}>{item.icon}<span>{item.name}</span></button>
                  ))}
                </div>
                <div className="lg:hidden flex items-center">
                  <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 dark:text-gray-300">
                    {isMenuOpen ? <X /> : <Menu />}
                  </button>
                </div>
              </div>
            </div>
            {isMenuOpen && (<div className="lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"><div className="px-2 pt-2 pb-3 space-y-1">{navItems.map(item => (<button key={item.id} onClick={() => { setActiveTab(item.id); setIsMenuOpen(false) }} className="block w-full text-left px-3 py-2 text-gray-600 dark:text-gray-300">{item.name}</button>))}</div></div>)}
          </nav>

          <main className="pt-8 min-h-screen">
            {renderContent()}
          </main>

          <ThemeControls
            currentStyleKey={styleKey} setStyleKey={setStyleKey}
            isDark={isDark} toggleDark={() => setIsDark(!isDark)}
            langKey={langKey} setLangKey={setLangKey}
            fontKey={fontKey} setFontKey={setFontKey}
            openCommandPalette={() => setIsCommandOpen(true)}
            undoLastAction={handleUndo}
            isAdmin={isAdmin}
            toggleRole={() => setIsAdmin(!isAdmin)}
            startTour={() => { setIsTourActive(true); setActiveTab('home'); tourIterator.reset(); }}
          />

          <TourControls
            iterator={tourIterator}
            isActive={isTourActive}
            onStop={() => { setIsTourActive(false); setActiveNodeId(null); }}
            onExecuteStep={handleTourStep}
            style={currentStyle}
            labels={labels}
          />

          <ToastContainer style={currentStyle} />
          <CommandPalette commands={commands} isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} style={currentStyle} />
        </div>
      </TourContext.Provider>
    </UserContext.Provider>
  );
}