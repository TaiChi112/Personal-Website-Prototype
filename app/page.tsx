"use client";
import React, { useState, useEffect, useRef, createContext, useContext, useMemo } from 'react';
import {
  BookOpen, Code, FileText, User, Briefcase, Menu, X,
  Github, Linkedin, ExternalLink, ChevronRight, ChevronDown, Calendar,
  Tag, LayoutGrid, List, Clock, PlayCircle, Rss,
  Palette, Moon, Sun, Monitor, Globe, Type, Layers, Box, Folder, ArrowRight,
  Star, Zap, Flame, Award, Wrench, PieChart, BarChart3, Filter, Search, Terminal,
  Bell, CheckCircle, AlertTriangle, Info, RotateCcw, Lock, Unlock, UserCheck, ArrowUpDown,
  Play, Pause, SkipForward, SkipBack, StopCircle, FastForward, Save, DownloadCloud, RotateCw,
  Mic, Headphones, Volume2, Square
} from 'lucide-react';

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
interface PodcastEpisode { id: string; title: string; duration: string; description: string; date: string; tags: string[]; }

type DecorationType = 'new' | 'featured' | 'sponsor' | 'hot' | 'popular';
interface UnifiedContentItem {
  id: string;
  type: 'project' | 'blog' | 'video' | 'article' | 'doc' | 'podcast';
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
const MOCK_PODCASTS: PodcastEpisode[] = [
  { id: 'p1', title: 'Ep.1: The Future of Frontend', duration: '45:20', description: 'Discussing the latest trends in frontend development.', date: '2023-11-10', tags: ['Tech', 'Frontend'] },
  { id: 'p2', title: 'Ep.2: Burnout & Mental Health', duration: '32:15', description: 'How to manage stress as a developer.', date: '2023-11-17', tags: ['Health', 'Career'] },
  { id: 'p3', title: 'Ep.3: Interview with AI', duration: '50:00', description: 'Can AI replace junior developers? We ask ChatGPT.', date: '2023-11-24', tags: ['AI', 'Career'] }
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
const adaptPodcastToUnified = (p: PodcastEpisode): UnifiedContentItem => ({ id: `pod-${p.id}`, type: 'podcast', title: p.title, description: p.description, date: p.date, meta: [p.duration, ...p.tags], actionLink: '#', decorations: ['new'] });

// ==========================================
// === 4. COMPOSITE & BUILDER PATTERN (Defined BEFORE Usage) ===
// ==========================================
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
    if (this.stack.length > 0) {
      this.currentContainer = this.stack.pop()!;
    }
    return this;
  }

  build(): CompositeNode {
    return this.root;
  }
}

// Generate Hierarchical Data (Defined AFTER ContentBuilder)
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


// ==========================================
// === 5. LOCALIZATION & STYLE FACTORIES ===
// ==========================================
interface UILabels {
  nav: { home: string; feed: string; projects: string; articles: string; blog: string; docs: string; resume: string; dashboard: string; podcast: string; };
  hero: { titlePrefix: string; titleHighlight: string; description: string; btnProjects: string; btnArticles: string; };
  sections: { feed: string; feedDesc: string; projects: string; projectsDesc: string; articles: string; articlesDesc: string; blog: string; blogDesc: string; docs: string; docsDesc: string; resume: string; experience: string; skills: string; education: string; summary: string; dashboard: string; dashboardDesc: string; podcast: string; podcastDesc: string; };
  actions: { readMore: string; downloadPdf: string; view: string; expand: string; collapse: string; related: string; search: string; filterBy: string; undo: string; locked: string; unlock: string; sortBy: string; tour: string; tourNext: string; tourPrev: string; tourEnd: string; tourPause: string; tourPlay: string; tourSpeed: string; snapshotSave: string; snapshotLoad: string; snapshotPlaceholder: string; listen: string; playing: string; };
}
interface LocalizationFactory { code: string; getLabels(): UILabels; }
const EnglishLocalization: LocalizationFactory = {
  code: 'EN',
  getLabels: () => ({
    nav: { home: 'Home', feed: 'Feed', projects: 'Projects', articles: 'Articles', blog: 'Blog', docs: 'Docs', resume: 'Resume', dashboard: 'Analytics', podcast: 'Podcast' },
    hero: { titlePrefix: 'Building the', titleHighlight: 'Future', description: 'Full Stack Developer crafting scalable applications.', btnProjects: 'View Projects', btnArticles: 'Read Articles' },
    sections: {
      feed: 'Unified Feed', feedDesc: 'All content in one place.',
      projects: 'Projects', projectsDesc: 'Super Projects and their related sub-modules.',
      articles: 'Technical Articles', articlesDesc: 'Drill down into topics to see related content.',
      blog: 'Personal Blog', blogDesc: 'Main stories and related thoughts.',
      docs: 'Documentation', docsDesc: 'Guides and References in a structured view.',
      resume: 'Resume', experience: 'Experience', skills: 'Skills', education: 'Education', summary: 'Summary',
      dashboard: 'Content Analytics', dashboardDesc: 'Insights generated dynamically from the content tree using Visitor Pattern.',
      podcast: 'Tech Talks Podcast', podcastDesc: 'Listen to my latest thoughts on technology and career.',
    },
    actions: { readMore: 'Read more', downloadPdf: 'PDF', view: 'View', expand: 'Show Related', collapse: 'Hide Related', related: 'Related Items', search: 'Search content...', filterBy: 'Filter by', undo: 'Undo Last Action', locked: 'Premium Content', unlock: 'Unlock Access', sortBy: 'Sort by', tour: 'Start Guided Tour', tourNext: 'Next Section', tourPrev: 'Previous', tourEnd: 'End Tour', tourPause: 'Pause Tour', tourPlay: 'Resume Tour', tourSpeed: 'Speed', snapshotSave: 'Save View', snapshotLoad: 'Load View', snapshotPlaceholder: 'Snapshot name...', listen: 'Listen', playing: 'Now Playing' }
  })
};
const ThaiLocalization: LocalizationFactory = {
  code: 'TH',
  getLabels: () => ({
    nav: { home: 'หน้าหลัก', feed: 'ฟีดรวม', projects: 'โปรเจกต์', articles: 'บทความ', blog: 'บล็อก', docs: 'เอกสาร', resume: 'เรซูเม่', dashboard: 'สถิติ', podcast: 'พอดแคสต์' },
    hero: { titlePrefix: 'สร้างสรรค์', titleHighlight: 'อนาคต', description: 'นักพัฒนา Full Stack ผู้หลงใหลในการสร้างแอปพลิเคชันที่ขยายตัวได้จริง', btnProjects: 'ดูผลงาน', btnArticles: 'อ่านบทความ' },
    sections: {
      feed: 'ฟีดรวมเนื้อหา', feedDesc: 'รวมทุกความเคลื่อนไหวไว้ที่เดียว',
      projects: 'โปรเจกต์', projectsDesc: 'โปรเจกต์หลักและโมดูลย่อยที่เกี่ยวข้อง',
      articles: 'บทความเชิงลึก', articlesDesc: 'คลิกเพื่ออ่านหรือดูเนื้อหาที่เกี่ยวข้องเพิ่มเติม',
      blog: 'บล็อกส่วนตัว', blogDesc: 'เรื่องราวหลักและเกร็ดเล็กเกร็ดน้อยที่เกี่ยวข้อง',
      docs: 'เอกสารคู่มือ', docsDesc: 'คู่มือและอ้างอิงในรูปแบบโครงสร้าง',
      resume: 'ประวัติย่อ', experience: 'ประสบการณ์ทำงาน', skills: 'ทักษะ', education: 'การศึกษา', summary: 'สรุปข้อมูล',
      dashboard: 'สถิติเนื้อหา', dashboardDesc: 'ข้อมูลเชิงลึกที่สร้างขึ้นจากการวิเคราะห์โครงสร้าง Tree ด้วย Visitor Pattern',
      podcast: 'รายการพอดแคสต์', podcastDesc: 'ฟังความคิดเห็นล่าสุดเกี่ยวกับเทคโนโลยีและอาชีพ',
    },
    actions: { readMore: 'อ่านต่อ', downloadPdf: 'ดาวน์โหลด PDF', view: 'ดู', expand: 'ดูที่เกี่ยวข้อง', collapse: 'ซ่อน', related: 'เนื้อหาที่เกี่ยวข้อง', search: 'ค้นหาเนื้อหา...', filterBy: 'กรองตาม', undo: 'ยกเลิกคำสั่งล่าสุด', locked: 'เนื้อหาพรีเมียม', unlock: 'ปลดล็อก', sortBy: 'เรียงตาม', tour: 'เริ่มการนำชม', tourNext: 'ถัดไป', tourPrev: 'ย้อนกลับ', tourEnd: 'จบการนำชม', tourPause: 'หยุดชั่วคราว', tourPlay: 'เล่นต่อ', tourSpeed: 'ความเร็ว', snapshotSave: 'บันทึกมุมมอง', snapshotLoad: 'โหลดมุมมอง', snapshotPlaceholder: 'ตั้งชื่อ...', listen: 'รับฟัง', playing: 'กำลังเล่น' }
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
// === 5. HELPER COMPONENTS & PATTERN IMPLEMENTATIONS ===
// ==========================================

// --- MEMENTO PATTERN IMPLEMENTATION ---
// 1. Memento State Interface
interface FeedViewState {
  layout: LayoutType;
  searchQuery: string;
  filterType: string;
  sortLabel: string;
}

// 2. Memento (Stores State)
class FeedStateMemento {
  constructor(private readonly state: FeedViewState) { }
  getState(): FeedViewState { return this.state; }
}

// 3. Caretaker (Manages Mementos)
class FeedStateCaretaker {
  private snapshots: Map<string, FeedStateMemento> = new Map();

  saveSnapshot(name: string, memento: FeedStateMemento) {
    this.snapshots.set(name, memento);
    notify.notify(`Snapshot "${name}" saved!`, 'SUCCESS');
  }

  getSnapshot(name: string): FeedStateMemento | undefined {
    return this.snapshots.get(name);
  }

  getSnapshotNames(): string[] {
    return Array.from(this.snapshots.keys());
  }
}

// Global instance for demo purposes (in a real app, this could be in a Context)
const feedCaretaker = new FeedStateCaretaker();

// --- STATE PATTERN IMPLEMENTATION (AUDIO PLAYER) ---

interface IAudioPlayerState {
  name: string;
  play(): void;
  pause(): void;
  stop(): void;
}

class AudioPlayerContext {
  private state: IAudioPlayerState;
  private currentTrack: PodcastEpisode | null = null;
  // Callback to update React UI
  private uiCallback: (stateName: string, track: PodcastEpisode | null) => void;

  constructor(uiCallback: (stateName: string, track: PodcastEpisode | null) => void) {
    this.uiCallback = uiCallback;
    this.state = new StoppedState(this); // Initial state
  }

  changeState(state: IAudioPlayerState) {
    this.state = state;
    this.uiCallback(state.name, this.currentTrack);
  }

  setTrack(track: PodcastEpisode) {
    this.currentTrack = track;
    // When track is set, we stop previous and auto-play
    this.state = new StoppedState(this);
    this.play();
  }

  play() { this.state.play(); }
  pause() { this.state.pause(); }
  stop() { this.state.stop(); }

  getTrack() { return this.currentTrack; }
}

class StoppedState implements IAudioPlayerState {
  name = 'STOPPED';
  constructor(private player: AudioPlayerContext) { }
  play() {
    if (this.player.getTrack()) {
      notify.notify('Starting Podcast...', 'INFO');
      // Simulate loading state if needed, or go straight to Playing
      this.player.changeState(new PlayingState(this.player));
    } else {
      notify.notify('Select a track to play', 'WARNING');
    }
  }
  pause() { /* Cannot pause if stopped */ }
  stop() { /* Already stopped */ }
}

class PlayingState implements IAudioPlayerState {
  name = 'PLAYING';
  constructor(private player: AudioPlayerContext) { }
  play() { /* Already playing */ }
  pause() {
    this.player.changeState(new PausedState(this.player));
    notify.notify('Podcast Paused', 'INFO');
  }
  stop() {
    this.player.changeState(new StoppedState(this.player));
  }
}

class PausedState implements IAudioPlayerState {
  name = 'PAUSED';
  constructor(private player: AudioPlayerContext) { }
  play() {
    this.player.changeState(new PlayingState(this.player));
    notify.notify('Podcast Resumed', 'SUCCESS');
  }
  pause() { /* Already paused */ }
  stop() {
    this.player.changeState(new StoppedState(this.player));
  }
}


const ContentDecorator = ({ children, decorations, style }: { children: React.ReactNode, decorations?: DecorationType[], style: StyleFactory }) => {
  if (!decorations || decorations.length === 0) return <>{children}</>;
  const getDecoratorStyle = (type: DecorationType) => {
    switch (type) {
      case 'new': return 'bg-emerald-500 text-white shadow-emerald-500/30';
      case 'featured': return 'bg-amber-400 text-amber-900 shadow-amber-400/30';
      case 'hot': return 'bg-rose-500 text-white shadow-rose-500/30';
      case 'sponsor': return 'bg-indigo-500 text-white shadow-indigo-500/30';
      case 'popular': return 'bg-blue-500 text-white shadow-blue-500/30';
      default: return 'bg-gray-500 text-white';
    }
  };
  const getIcon = (type: DecorationType) => {
    switch (type) {
      case 'featured': return <Star size={10} fill="currentColor" />;
      case 'hot': return <Flame size={10} />;
      case 'sponsor': return <Award size={10} />;
      case 'new': return <Zap size={10} />;
      case 'popular': return <Globe size={10} />;
      default: return null;
    }
  };
  return (
    <div className="relative group h-full">
      {children}
      <div className={`absolute -top-2 -right-1 flex flex-col items-end gap-1 z-10 pointer-events-none transition-transform duration-300 group-hover:-translate-y-1`}>
        {decorations.map(d => (
          <span key={d} className={`flex items-center gap-1 px-2 py-1 text-[10px] uppercase font-bold tracking-wider shadow-sm ${getDecoratorStyle(d)} ${style.name === 'Future' ? 'clip-path-slant' : 'rounded-full'} ${style.name === 'Minimal' ? 'border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white' : ''}`}>
            {getIcon(d)} {d}
          </span>
        ))}
      </div>
    </div>
  );
};

const UserContext = createContext({ isAdmin: false, toggleRole: () => { } });
const AccessControlProxy = ({ isLocked, children, style, labels }: { isLocked?: boolean, children: React.ReactNode, style: StyleFactory, labels: UILabels }) => {
  const { isAdmin } = useContext(UserContext);
  if (!isLocked || isAdmin) { return <>{children}</>; }
  return (<div className={`${style.getCardClass()} h-full min-h-[200px] overflow-hidden group`}><div className="p-6 opacity-20 blur-sm select-none pointer-events-none filter grayscale"><div className="h-6 w-3/4 bg-gray-400 rounded mb-4"></div><div className="h-4 w-full bg-gray-300 rounded mb-2"></div><div className="h-4 w-5/6 bg-gray-300 rounded mb-2"></div><div className="h-4 w-4/6 bg-gray-300 rounded"></div></div><div className={style.getLockedOverlayClass()}><div className={`p-4 rounded-full mb-3 ${style.name === 'Future' ? 'bg-cyan-900 text-cyan-400' : 'bg-gray-100 text-gray-600'}`}><Lock size={24} /></div><h3 className="text-lg font-bold mb-1">{labels.actions.locked}</h3><p className="text-sm opacity-70 mb-4 max-w-[200px]">This content is restricted to admin users.</p><button onClick={() => notify.notify('Please ask Admin for access', 'WARNING')} className={style.getButtonClass('primary')}>{labels.actions.unlock}</button></div></div>);
};

type EventType = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
interface NotificationEvent { message: string; type: EventType; id: number; }
type Observer = (event: NotificationEvent) => void;
class NotificationService {
  private observers: Observer[] = [];
  private static instance: NotificationService;
  private constructor() { }
  static getInstance(): NotificationService { if (!NotificationService.instance) { NotificationService.instance = new NotificationService(); } return NotificationService.instance; }
  subscribe(observer: Observer): () => void { this.observers.push(observer); return () => { this.observers = this.observers.filter(obs => obs !== observer); }; }
  notify(message: string, type: EventType = 'INFO') { const event: NotificationEvent = { message, type, id: Date.now() }; this.observers.forEach(obs => obs(event)); }
}
const notify = NotificationService.getInstance();
const ToastContainer = ({ style }: { style: StyleFactory }) => {
  const [toasts, setToasts] = useState<NotificationEvent[]>([]);
  useEffect(() => { const unsubscribe = notify.subscribe((event) => { setToasts(prev => [...prev, event]); setTimeout(() => { setToasts(prev => prev.filter(t => t.id !== event.id)); }, 3000); }); return unsubscribe; }, []);
  if (toasts.length === 0) return null;
  return (<> {toasts.map(toast => (<div key={toast.id} className={style.getToastClass(toast.type)}>{toast.type === 'SUCCESS' ? <CheckCircle size={18} /> : toast.type === 'WARNING' ? <AlertTriangle size={18} /> : <Info size={18} />}<span>{toast.message}</span></div>))} </>);
};

class CommandHistory {
  private history: ICommand[] = [];
  private static instance: CommandHistory;
  private constructor() { }
  static getInstance(): CommandHistory { if (!CommandHistory.instance) { CommandHistory.instance = new CommandHistory(); } return CommandHistory.instance; }
  push(command: ICommand) { this.history.push(command); if (this.history.length > 20) this.history.shift(); }
  pop(): ICommand | undefined { return this.history.pop(); }
  isEmpty(): boolean { return this.history.length === 0; }
}
const historyManager = CommandHistory.getInstance();

const TourContext = createContext<{
  activeNodeId: string | null;
  setActiveNodeId: (id: string | null) => void;
}>({
  activeNodeId: null,
  setActiveNodeId: () => { },
});

interface TourStep {
  type: 'NAV' | 'EXPAND' | 'RESET_EXPAND';
  targetId?: string;
  label?: string;
}

interface IIterator<T> {
  next(): T | null;
  prev(): T | null;
  hasNext(): boolean;
  hasPrev(): boolean;
  current(): T;
  reset(): void;
  jumpTo(item: T): void;
}

class TourIterator implements IIterator<TourStep> {
  private position = 0;
  constructor(private steps: TourStep[]) { }
  next(): TourStep | null { if (this.hasNext()) { this.position++; return this.steps[this.position]; } return null; }
  prev(): TourStep | null { if (this.hasPrev()) { this.position--; return this.steps[this.position]; } return null; }
  hasNext(): boolean { return this.position < this.steps.length - 1; }
  hasPrev(): boolean { return this.position > 0; }
  current(): TourStep { return this.steps[this.position]; }
  reset(): void { this.position = 0; }
  jumpTo(step: TourStep) { this.position = 0; }
}

const TourControls = ({ iterator, isActive, onStop, onExecuteStep, style, labels }: { iterator: IIterator<TourStep>, isActive: boolean, onStop: () => void, onExecuteStep: (step: TourStep) => void, style: StyleFactory, labels: UILabels }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && isActive) {
      interval = setInterval(() => {
        const nextStep = iterator.next();
        if (nextStep) { onExecuteStep(nextStep); } else { setIsPlaying(false); }
      }, 3000 / speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isActive, iterator, onExecuteStep, speed]);

  if (!isActive) return null;
  const currentStep = iterator.current();

  return (
    <div className={style.getTourOverlayClass()}>
      <div className="flex items-center gap-2 pr-4 border-r border-gray-300 dark:border-gray-600">
        <span className="text-xs font-bold uppercase tracking-wider animate-pulse flex items-center gap-2"><PlayCircle size={14} className="text-green-500" /> Live Tour</span>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => setSpeed(s => s === 1 ? 2 : s === 2 ? 0.5 : 1)} className="px-2 py-1 text-xs font-bold border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-800 w-12" title={labels.actions.tourSpeed}>{speed}x</button>
        <button onClick={() => { setIsPlaying(false); const p = iterator.prev(); if (p) onExecuteStep(p); }} disabled={!iterator.hasPrev()} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-30 transition-colors" title={labels.actions.tourPrev}><SkipBack size={20} /></button>
        <button onClick={() => setIsPlaying(!isPlaying)} className={`p-2 rounded transition-all ${isPlaying ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`} title={isPlaying ? labels.actions.tourPause : labels.actions.tourPlay}>{isPlaying ? <Pause size={20} /> : <Play size={20} />}</button>
        <div className="text-sm font-bold min-w-[120px] text-center truncate px-2">{currentStep.label || currentStep.targetId}</div>
        <button onClick={() => { setIsPlaying(false); const n = iterator.next(); if (n) onExecuteStep(n); else onStop(); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors" title={labels.actions.tourNext}>{iterator.hasNext() ? <SkipForward size={20} /> : <StopCircle size={20} className="text-red-500" />}</button>
      </div>
      <button onClick={() => { setIsPlaying(false); onStop(); }} className="ml-4 p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-full transition-colors" title={labels.actions.tourEnd}><X size={16} /></button>
      {isPlaying && (<div className="absolute bottom-0 left-0 h-1 bg-blue-500" style={{ width: '100%', transition: `width ${3000 / speed}ms linear` }}></div>)}
    </div>
  );
};

interface ICommand { id: string; label: string; icon: React.ReactNode; execute(): void; undo(): void; matches(query: string): boolean; }
class NavigateCommand implements ICommand { private previousTab: string; constructor(public id: string, public label: string, public icon: React.ReactNode, private targetTab: string, private setTab: (t: string) => void, private getCurrentTab: () => string) { this.previousTab = ''; } execute(): void { this.previousTab = this.getCurrentTab(); this.setTab(this.targetTab); historyManager.push(this); notify.notify(`Mapsd to ${this.label}`, 'INFO'); } undo(): void { this.setTab(this.previousTab); notify.notify(`Undo: Returned to previous tab`, 'WARNING'); } matches(query: string): boolean { return this.label.toLowerCase().includes(query.toLowerCase()); } }
class ToggleThemeCommand implements ICommand { id = 'toggle-theme'; label = 'Toggle Dark Mode'; icon = <Moon size={16} />; constructor(private toggle: () => void) { } execute(): void { this.toggle(); historyManager.push(this); notify.notify('Theme toggled', 'SUCCESS'); } undo(): void { this.toggle(); notify.notify('Undo: Theme reverted', 'WARNING'); } matches(query: string): boolean { return this.label.toLowerCase().includes(query.toLowerCase()) || 'dark'.includes(query.toLowerCase()); } }
class SwitchStyleCommand implements ICommand { private previousStyle: string; constructor(public id: string, public label: string, public icon: React.ReactNode, private styleKey: string, private setStyle: (s: string) => void, private getCurrentStyle: () => string) { this.previousStyle = ''; } execute(): void { this.previousStyle = this.getCurrentStyle(); this.setStyle(this.styleKey); historyManager.push(this); notify.notify(`Switched to ${this.styleKey} style`, 'SUCCESS'); } undo(): void { this.setStyle(this.previousStyle); notify.notify(`Undo: Style reverted to ${this.previousStyle}`, 'WARNING'); } matches(query: string): boolean { return this.label.toLowerCase().includes(query.toLowerCase()); } }
class ToggleRoleCommand implements ICommand { id = 'toggle-role'; label = 'Toggle Admin Role'; icon = <UserCheck size={16} />; constructor(private toggle: () => void) { } execute(): void { this.toggle(); historyManager.push(this); notify.notify('User Role Switched', 'INFO'); } undo(): void { this.toggle(); notify.notify('Undo: Role reverted', 'WARNING'); } matches(query: string): boolean { return this.label.toLowerCase().includes(query.toLowerCase()) || 'admin'.includes(query.toLowerCase()); } }
class StartTourCommand implements ICommand { id = 'start-tour'; label = 'Start Guided Tour'; icon = <PlayCircle size={16} />; constructor(private start: () => void) { } execute(): void { this.start(); notify.notify('Tour Started', 'SUCCESS'); } undo(): void { notify.notify('Tour stopped', 'INFO'); } matches(query: string): boolean { return this.label.toLowerCase().includes(query.toLowerCase()) || 'tour'.includes(query.toLowerCase()); } }

const CommandPalette = ({ commands, isOpen, onClose, style }: { commands: ICommand[], isOpen: boolean, onClose: () => void, style: StyleFactory }) => { const [query, setQuery] = useState(''); const [selectedIndex, setSelectedIndex] = useState(0); const inputRef = useRef<HTMLInputElement>(null); const filteredCommands = commands.filter(cmd => cmd.matches(query)); useEffect(() => { if (isOpen) { setTimeout(() => inputRef.current?.focus(), 100); setQuery(''); setSelectedIndex(0); } }, [isOpen]); useEffect(() => { const handleKeyDown = (e: KeyboardEvent) => { if (!isOpen) return; if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(prev => (prev + 1) % filteredCommands.length); } else if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length); } else if (e.key === 'Enter') { e.preventDefault(); if (filteredCommands[selectedIndex]) { filteredCommands[selectedIndex].execute(); onClose(); } } else if (e.key === 'Escape') { onClose(); } }; window.addEventListener('keydown', handleKeyDown); return () => window.removeEventListener('keydown', handleKeyDown); }, [isOpen, filteredCommands, selectedIndex, onClose]); if (!isOpen) return null; return (<div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4 bg-black/50 backdrop-blur-sm transition-opacity"> <div className={`w-full max-w-lg flex flex-col ${style.getModalClass()} animate-in zoom-in-95 duration-200`}> <div className="flex items-center px-4 border-b border-gray-200 dark:border-gray-700"> <Search size={20} className="text-gray-400 mr-3" /> <input ref={inputRef} type="text" className="flex-1 py-4 bg-transparent outline-none text-lg text-gray-900 dark:text-gray-100 placeholder-gray-400" placeholder="Type a command..." value={query} onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }} /> <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"><span className="text-xs font-bold text-gray-400 border border-gray-300 dark:border-gray-600 rounded px-1.5 py-0.5">ESC</span></button> </div> <div className="max-h-[300px] overflow-y-auto py-2"> {filteredCommands.length === 0 ? (<div className="px-4 py-8 text-center text-gray-500">No commands found.</div>) : (filteredCommands.map((cmd, idx) => (<button key={cmd.id} onClick={() => { cmd.execute(); onClose(); }} className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${idx === selectedIndex ? (style.name === 'Future' ? 'bg-cyan-900/30 text-cyan-400' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300') : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>{cmd.icon}<span className="flex-1 font-medium">{cmd.label}</span>{idx === selectedIndex && <ArrowRight size={16} className="opacity-50" />}</button>)))} </div> <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 flex justify-between items-center"><span>Select <b className="font-bold">↑↓</b></span><span>Execute <b className="font-bold">Enter</b></span></div> </div> </div>); };

// Sorting Strategy Classes (Must be defined before usage)
interface ISortStrategy { label: string; sort(items: UnifiedContentItem[]): UnifiedContentItem[]; }
class DateSortStrategy implements ISortStrategy { label = 'Date (Newest)'; sort(items: UnifiedContentItem[]): UnifiedContentItem[] { return [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); } }
class TitleSortStrategy implements ISortStrategy { label = 'Title (A-Z)'; sort(items: UnifiedContentItem[]): UnifiedContentItem[] { return [...items].sort((a, b) => a.title.localeCompare(b.title)); } }
class LengthSortStrategy implements ISortStrategy { label = 'Length (Longest)'; sort(items: UnifiedContentItem[]): UnifiedContentItem[] { return [...items].sort((a, b) => b.description.length - a.description.length); } }

// Define strategies after classes
const SORT_STRATEGIES: ISortStrategy[] = [
  new DateSortStrategy(),
  new TitleSortStrategy(),
  new LengthSortStrategy()
];

interface FilterRequest { query: string; typeFilter: string | 'all'; tags: string[]; }
abstract class FilterHandler { protected next: FilterHandler | null = null; public setNext(handler: FilterHandler): FilterHandler { this.next = handler; return handler; } public handle(item: UnifiedContentItem, request: FilterRequest): boolean { if (this.next) { return this.next.handle(item, request); } return true; } }
class SearchFilter extends FilterHandler { public handle(item: UnifiedContentItem, request: FilterRequest): boolean { if (request.query) { const q = request.query.toLowerCase(); const matches = item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q); if (!matches) return false; } return super.handle(item, request); } }
class TypeFilter extends FilterHandler { public handle(item: UnifiedContentItem, request: FilterRequest): boolean { if (request.typeFilter !== 'all') { if (item.type !== request.typeFilter) return false; } return super.handle(item, request); } }
class TagFilter extends FilterHandler { public handle(item: UnifiedContentItem, request: FilterRequest): boolean { if (request.tags.length > 0) { const hasTag = item.meta?.some(tag => request.tags.includes(tag)); if (!hasTag) return false; } return super.handle(item, request); } }

interface IVisitor { visitLeaf(leaf: LeafNode): void; visitComposite(composite: CompositeNode): void; }
const traverse = (node: LayoutNode | CompositeNode | LeafNode, visitor: IVisitor) => { if (node.type === 'item') { visitor.visitLeaf(node as LeafNode); } else if (node.type === 'container') { const composite = node as CompositeNode; visitor.visitComposite(composite); composite.children.forEach(child => traverse(child, visitor)); } };
class MetricsVisitor implements IVisitor { counts = { project: 0, blog: 0, article: 0, video: 0, doc: 0, podcast: 0, total: 0 }; visitLeaf(leaf: LeafNode): void { this.countItem(leaf.data); } visitComposite(composite: CompositeNode): void { if (composite.data) this.countItem(composite.data); } private countItem(item: UnifiedContentItem) { if (this.counts[item.type] !== undefined) { this.counts[item.type]++; this.counts.total++; } } }
class TagsVisitor implements IVisitor { tags = new Set<string>(); visitLeaf(leaf: LeafNode): void { leaf.data.meta?.forEach(tag => this.tags.add(tag)); } visitComposite(composite: CompositeNode): void { composite.data?.meta?.forEach(tag => this.tags.add(tag)); } }

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

// --- 5. LAYOUT SYSTEM & HELPERS (UNCHANGED) ---
type LayoutType = 'grid' | 'list' | 'timeline';
interface GenericLayoutProps<T> { items: T[]; renderItem: (item: T, layout: LayoutType, style: StyleFactory, labels: UILabels) => React.ReactNode; getDate?: (item: T) => string; currentStyle: StyleFactory; labels: UILabels; }
const GridLayout = <T,>({ items, renderItem, currentStyle, labels }: GenericLayoutProps<T>) => (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{items.map((item, index) => <div key={index} className="h-full">{renderItem(item, 'grid', currentStyle, labels)}</div>)}</div>);
const ListLayout = <T,>({ items, renderItem, currentStyle, labels }: GenericLayoutProps<T>) => (<div className="flex flex-col space-y-6 max-w-4xl mx-auto">{items.map((item, index) => <div key={index} className="w-full">{renderItem(item, 'list', currentStyle, labels)}</div>)}</div>);
const TimelineLayout = <T,>({ items, renderItem, getDate, currentStyle, labels }: GenericLayoutProps<T>) => (<div className={`max-w-3xl mx-auto border-l-2 ${currentStyle.name === 'Future' ? 'border-cyan-500' : 'border-gray-300'} ml-4 md:ml-8 pl-8 py-4 space-y-12`}>{items.map((item, index) => (<div key={index} className="relative"><div className={`absolute -left-[41px] top-0 h-5 w-5 rounded-full border-4 ${currentStyle.name === 'Future' ? 'border-black bg-cyan-500' : 'border-white bg-gray-400'} shadow-sm`} />{getDate && <span className={`absolute -top-7 left-0 text-xs font-bold px-2 py-1 rounded ${currentStyle.name === 'Future' ? 'text-cyan-400 bg-black' : 'text-gray-500 bg-gray-100'}`}>{getDate(item)}</span>}{renderItem(item, 'timeline', currentStyle, labels)}</div>))}</div>);
const ContentLayoutFactory = <T,>({ layout, items, renderItem, getDate, currentStyle, labels }: { layout: LayoutType } & GenericLayoutProps<T>) => { const LayoutStrategies = { grid: GridLayout, list: ListLayout, timeline: TimelineLayout }; const SelectedLayout = LayoutStrategies[layout] || GridLayout; return <SelectedLayout items={items} renderItem={renderItem} getDate={getDate} currentStyle={currentStyle} labels={labels} />; };
const LayoutSwitcher = ({ current, onChange, currentStyle, labels }: { current: LayoutType, onChange: (l: LayoutType) => void, currentStyle: StyleFactory, labels: UILabels }) => (<div className={`flex p-1 rounded-lg border ${currentStyle.name === 'Future' ? 'border-cyan-500/30 bg-black/50' : 'border-gray-200 bg-gray-100'} inline-flex mb-6`}>{['grid', 'list', 'timeline'].map((l) => (<button key={l} onClick={() => onChange(l as LayoutType)} className={`p-2 rounded-md transition-all ${current === l ? (currentStyle.name === 'Future' ? 'bg-cyan-900/50 text-cyan-400 shadow-sm' : 'bg-white text-blue-600 shadow') : 'text-gray-400 hover:text-gray-600'}`} title={labels.actions.view}>{l === 'grid' ? <LayoutGrid size={18} /> : l === 'list' ? <List size={18} /> : <Clock size={18} />}</button>))}</div>);

const ThemeControls = ({ currentStyleKey, setStyleKey, isDark, toggleDark, langKey, setLangKey, fontKey, setFontKey, openCommandPalette, undoLastAction, isAdmin, toggleRole, startTour }: { currentStyleKey: string, setStyleKey: (k: string) => void, isDark: boolean, toggleDark: () => void, langKey: string, setLangKey: (k: string) => void, fontKey: string, setFontKey: (k: string) => void, openCommandPalette: () => void, undoLastAction: () => void, isAdmin: boolean, toggleRole: () => void, startTour: () => void }) => (
  <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end">
    <div className="mb-2 bg-black/80 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm pointer-events-none opacity-50">Try <span className="font-mono font-bold">Cmd+K</span></div>

    <div className="flex gap-2">
      {/* EXPOSED START TOUR BUTTON */}
      <button onClick={startTour} className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:scale-110 transition-transform animate-bounce" title="Start Guided Tour">
        <Play size={20} fill="currentColor" />
      </button>
      <button onClick={toggleRole} className={`p-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:scale-110 transition-transform ${isAdmin ? 'bg-green-600 text-white border-green-700' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`} title="Toggle Admin Role">{isAdmin ? <Unlock size={20} /> : <Lock size={20} />}</button>
    </div>

    <div className="flex gap-2">
      <button onClick={undoLastAction} className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:scale-110 transition-transform" title="Undo Last Action"><RotateCcw size={20} className="text-gray-600 dark:text-gray-300" /></button>
      <button onClick={openCommandPalette} className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:scale-110 transition-transform" title="Command Palette"><Terminal size={20} className="text-gray-600 dark:text-gray-300" /></button>
    </div>

    <button onClick={toggleDark} className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:scale-110 transition-transform" title="Toggle Dark Mode">{isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-700" />}</button>
  </div>
);

// --- 6. PAGE SECTIONS (Moved after InteractiveContentNode) ---

const HeroSection = ({ currentStyle, labels }: { currentStyle: StyleFactory, labels: UILabels }) => (<div className={`flex flex-col items-center justify-center min-h-[80vh] text-center px-4`}><div className={`w-32 h-32 rounded-full mb-8 flex items-center justify-center text-4xl font-bold animate-pulse ${currentStyle.name === 'Future' ? 'bg-cyan-900 text-cyan-400 shadow-[0_0_50px_rgba(6,182,212,0.5)]' : currentStyle.name === 'Minimal' ? 'bg-black text-white dark:bg-white dark:text-black border-4 border-double' : 'bg-gradient-to-tr from-blue-400 to-indigo-500 text-white shadow-xl'}`}>AD</div><h1 className={`mb-4 ${currentStyle.name === 'Future' ? 'text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600' : 'text-5xl font-extrabold text-gray-900 dark:text-white'}`}>{labels.hero.titlePrefix} <span className={currentStyle.name === 'Academic' ? 'italic text-[#8b1e3f]' : 'text-blue-600'}>{labels.hero.titleHighlight}</span></h1><p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-8 leading-relaxed">{labels.hero.description}</p><div className="flex space-x-4"><button className={currentStyle.getButtonClass('primary')} onClick={() => notify.notify('Navigating to Projects...', 'INFO')}>{labels.hero.btnProjects}</button><button className={currentStyle.getButtonClass('secondary')}>{labels.hero.btnArticles}</button></div></div>);
const ArticlesSection = ({ currentStyle, labels }: { currentStyle: StyleFactory, labels: UILabels }) => (<div className={`py-12 px-4 max-w-7xl mx-auto`}><div className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4"><h2 className={currentStyle.getSectionTitleClass()}>{labels.sections.articles}</h2><p className="text-gray-500 mt-2">{labels.sections.articlesDesc}</p></div><div className="space-y-4">{ARTICLES_TREE.children.map((node) => <InteractiveContentNode key={node.id} node={node} style={currentStyle} labels={labels} />)}</div></div>);
const ProjectsSection = ({ currentStyle, labels }: { currentStyle: StyleFactory, labels: UILabels }) => (<div className={`py-12 px-4 max-w-7xl mx-auto`}><div className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4"><h2 className={currentStyle.getSectionTitleClass()}>{labels.sections.projects}</h2><p className="text-gray-500 mt-2">{labels.sections.projectsDesc}</p></div><div className="space-y-4">{PROJECTS_TREE.children.map((node) => <InteractiveContentNode key={node.id} node={node} style={currentStyle} labels={labels} />)}</div></div>);
const BlogSection = ({ currentStyle, labels }: { currentStyle: StyleFactory, labels: UILabels }) => (<div className={`py-12 px-4 max-w-7xl mx-auto`}><div className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4"><h2 className={currentStyle.getSectionTitleClass()}>{labels.sections.blog}</h2><p className="text-gray-500 mt-2">{labels.sections.blogDesc}</p></div><div className="space-y-4">{BLOGS_TREE.children.map((node) => <InteractiveContentNode key={node.id} node={node} style={currentStyle} labels={labels} />)}</div></div>);
const DocsSection = ({ currentStyle, labels }: { currentStyle: StyleFactory, labels: UILabels }) => { const [activeDoc, setActiveDoc] = useState(MOCK_DOCS[0]); const sections = Array.from(new Set(MOCK_DOCS.map(d => d.section))); return (<div className={`flex flex-col md:flex-row max-w-7xl mx-auto pt-8 min-h-[80vh] px-4`}><div className="w-full md:w-64 flex-shrink-0 mb-8 md:mb-0 md:border-r border-gray-200 dark:border-gray-700 md:pr-4"><h3 className={`text-lg font-bold mb-4 ${currentStyle.name === 'Future' ? 'text-cyan-400' : 'text-gray-900 dark:text-gray-100'}`}>{labels.sections.docs}</h3>{sections.map(section => (<div key={section} className="mb-6"><h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{section}</h4><ul className="space-y-1">{MOCK_DOCS.filter(d => d.section === section).map(doc => (<li key={doc.id}><button onClick={() => setActiveDoc(doc)} className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${activeDoc.id === doc.id ? (currentStyle.name === 'Future' ? 'bg-cyan-900/50 text-cyan-400' : 'bg-blue-50 text-blue-700 dark:bg-gray-800 dark:text-blue-300 font-medium') : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>{doc.title}</button></li>))}</ul></div>))}</div><div className="flex-1 md:pl-12"><div className="prose dark:prose-invert max-w-none"><h1 className={currentStyle.getSectionTitleClass()}>{activeDoc.title}</h1><div className={`p-4 my-6 border-l-4 ${currentStyle.name === 'Future' ? 'bg-cyan-950/30 border-cyan-500 text-cyan-200' : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400 text-yellow-800 dark:text-yellow-200'}`}><p className="text-sm">Last updated on {activeDoc.lastUpdated}</p></div><div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{activeDoc.content}</div></div></div></div>); };

// --- Podcast Section (Uses AudioPlayer Context & State Pattern) ---
const PodcastSection = ({ currentStyle, labels }: { currentStyle: StyleFactory, labels: UILabels }) => {
  // We use React state to force re-renders when the Pattern Context changes state
  const [playerStateName, setPlayerStateName] = useState('STOPPED');
  const [currentTrack, setCurrentTrack] = useState<PodcastEpisode | null>(null);

  // Initialize the Pattern Context (similar to a ViewModel)
  // useMemo ensures we keep the same instance of the context
  const playerContext = useMemo(() => new AudioPlayerContext((newStateName, track) => {
    setPlayerStateName(newStateName);
    setCurrentTrack(track);
  }), []);

  return (
    <div className={`py-12 px-4 max-w-7xl mx-auto`}>
      <div className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4 flex justify-between items-center">
        <div>
          <h2 className={currentStyle.getSectionTitleClass()}>{labels.sections.podcast}</h2>
          <p className="text-gray-500 mt-2">{labels.sections.podcastDesc}</p>
        </div>
        <div className="p-3 bg-purple-100 text-purple-600 rounded-full dark:bg-purple-900/20 dark:text-purple-300">
          <Headphones size={24} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Episode List */}
        <div className="flex-1 space-y-4">
          {MOCK_PODCASTS.map(ep => (
            <div key={ep.id} className={`${currentStyle.getCardClass()} p-4 flex items-center justify-between group hover:scale-[1.01] transition-transform`}>
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-full ${currentTrack?.id === ep.id && playerStateName === 'PLAYING' ? 'bg-green-100 text-green-600 animate-pulse' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                  {currentTrack?.id === ep.id && playerStateName === 'PLAYING' ? <Volume2 size={24} /> : <Mic size={24} />}
                </div>
                <div>
                  <h3 className="font-bold text-lg dark:text-white group-hover:text-blue-600 transition-colors">{ep.title}</h3>
                  <div className="flex gap-2 text-xs text-gray-500 mt-1">
                    <span className="flex items-center gap-1"><Clock size={12} /> {ep.duration}</span>
                    <span>•</span>
                    <span>{ep.date}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => playerContext.setTrack(ep)}
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${currentTrack?.id === ep.id && playerStateName === 'PLAYING' ? 'bg-green-600 text-white shadow-lg' : currentStyle.getButtonClass('secondary')}`}
              >
                {currentTrack?.id === ep.id && playerStateName === 'PLAYING' ? labels.actions.playing : labels.actions.listen}
                {currentTrack?.id === ep.id && playerStateName === 'PLAYING' ? <Volume2 size={16} /> : <PlayCircle size={16} />}
              </button>
            </div>
          ))}
        </div>

        {/* Player UI (Driven by State Pattern) */}
        <div className="lg:w-96">
          <div className={`sticky top-24 ${currentStyle.getCardClass()} p-6 border-t-4 ${playerStateName === 'PLAYING' ? 'border-green-500' : 'border-gray-300'} shadow-2xl`}>
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Now Playing</h3>
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${playerStateName === 'PLAYING' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                Status: {playerStateName}
              </span>
            </div>

            {currentTrack ? (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <div className="aspect-square bg-gradient-to-tr from-purple-500 to-blue-500 rounded-lg mb-6 flex items-center justify-center shadow-inner">
                  <Headphones size={64} className="text-white opacity-50" />
                </div>
                <h4 className="font-bold text-xl mb-1 dark:text-white line-clamp-1" title={currentTrack.title}>{currentTrack.title}</h4>
                <p className="text-sm text-gray-500 mb-6">{currentTrack.description}</p>

                {/* Progress Bar (Fake) */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-2 overflow-hidden">
                  <div className={`h-full bg-blue-600 ${playerStateName === 'PLAYING' ? 'animate-[width_20s_linear]' : ''}`} style={{ width: playerStateName === 'PLAYING' ? '100%' : '30%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mb-6">
                  <span>12:45</span>
                  <span>{currentTrack.duration}</span>
                </div>

                <div className="flex justify-center gap-4">
                  <button onClick={() => playerContext.stop()} className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Stop">
                    <Square size={20} fill="currentColor" />
                  </button>
                  <button
                    onClick={() => playerStateName === 'PLAYING' ? playerContext.pause() : playerContext.play()}
                    className={`p-4 rounded-full shadow-xl hover:scale-105 transition-transform ${playerStateName === 'PLAYING' ? 'bg-white text-blue-600 border border-gray-200' : 'bg-blue-600 text-white'}`}
                  >
                    {playerStateName === 'PLAYING' ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Headphones size={48} className="mx-auto mb-4 opacity-20" />
                <p>Select an episode to start listening</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


const UnifiedFeedSection = ({ currentStyle, labels }: { currentStyle: StyleFactory, labels: UILabels }) => {
  const [layout, setLayout] = useState<LayoutType>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentSortStrategy, setCurrentSortStrategy] = useState<ISortStrategy>(SORT_STRATEGIES[0]);

  // Memento UI State
  const [snapshotName, setSnapshotName] = useState('');
  const [showSnapshots, setShowSnapshots] = useState(false);

  // Memento Actions
  const saveSnapshot = () => {
    if (!snapshotName.trim()) return;
    const memento = new FeedStateMemento({
      layout,
      searchQuery,
      filterType,
      sortLabel: currentSortStrategy.label
    });
    feedCaretaker.saveSnapshot(snapshotName, memento);
    setSnapshotName('');
    setShowSnapshots(false);
  };

  const loadSnapshot = (name: string) => {
    const memento = feedCaretaker.getSnapshot(name);
    if (memento) {
      const state = memento.getState();
      setLayout(state.layout);
      setSearchQuery(state.searchQuery);
      setFilterType(state.filterType);
      const strategy = SORT_STRATEGIES.find(s => s.label === state.sortLabel);
      if (strategy) setCurrentSortStrategy(strategy);
      notify.notify(`Restored workspace: ${name}`, 'SUCCESS');
      setShowSnapshots(false);
    }
  };

  const allItems = [...MOCK_PROJECTS.map(adaptProjectToUnified), ...MOCK_BLOGS.map(adaptBlogToUnified), ...MOCK_VIDEOS.map(adaptVideoToUnified), ...MOCK_PODCASTS.map(adaptPodcastToUnified)];
  const searchFilter = new SearchFilter();
  const typeFilter = new TypeFilter();
  const tagFilter = new TagFilter();
  typeFilter.setNext(searchFilter).setNext(tagFilter);
  const filteredItems = allItems.filter(item => { const request: FilterRequest = { query: searchQuery, typeFilter: filterType, tags: [] }; return typeFilter.handle(item, request); });
  const sortedItems = currentSortStrategy.sort(filteredItems);
  const renderItem = (item: UnifiedContentItem, currentLayout: LayoutType, style: StyleFactory, labels: UILabels) => { const isList = currentLayout === 'list'; return (<AccessControlProxy isLocked={item.isLocked} style={style} labels={labels}> <ContentDecorator decorations={item.decorations} style={style}> <div className={`${style.getCardClass()} h-full flex ${isList ? 'flex-row items-center' : 'flex-col'}`}> <div className={`${isList ? 'w-48 h-32' : 'h-48'} bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 relative overflow-hidden`}><span className="text-gray-400 font-medium opacity-50">{item.type.toUpperCase()}</span><div className={`absolute top-2 right-2 ${style.getBadgeClass()}`}>{item.type}</div></div> <div className="p-6 flex-1 flex flex-col"><div className="flex items-center text-xs text-gray-400 mb-2 space-x-2"><Calendar size={12} /><span>{item.date}</span></div><h3 className={`text-xl font-bold mb-2 ${style.name === 'Future' ? 'text-cyan-400' : 'text-gray-900 dark:text-gray-100'}`} onClick={() => notify.notify(`Viewing details for: ${item.title}`, 'INFO')}>{item.title}</h3><p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 text-sm">{item.description}</p><div className="flex flex-wrap gap-2 mt-auto">{item.meta.slice(0, 3).map((tag, i) => <span key={i} className={style.getBadgeClass()}>{tag}</span>)}</div></div> </div> </ContentDecorator> </AccessControlProxy>); };

  return (
    <div className={`py-12 px-4 max-w-7xl mx-auto`}>
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 border-b border-gray-200 dark:border-gray-700 pb-4">
        <div>
          <h2 className={currentStyle.getSectionTitleClass()}>{labels.sections.feed}</h2>
          <p className="text-gray-500 mt-2">{labels.sections.feedDesc}</p>
        </div>
        <div className="mt-4 md:mt-0"><LayoutSwitcher current={layout} onChange={setLayout} currentStyle={currentStyle} labels={labels} /></div>
      </div>

      {/* SNAPSHOT CONTROLS (MEMENTO PATTERN UI) */}
      <div className={`mb-6 p-4 rounded-xl flex flex-wrap items-center gap-4 transition-all ${currentStyle.name === 'Future' ? 'bg-cyan-900/20 border border-cyan-500/30' : 'bg-gray-200/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700'}`}>
        <div className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
          <Save size={16} /> Workspace Snapshots
        </div>
        <div className="flex gap-2 relative">
          <input
            type="text"
            placeholder={labels.actions.snapshotPlaceholder}
            value={snapshotName}
            onChange={(e) => setSnapshotName(e.target.value)}
            className="px-3 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 w-32 md:w-48"
          />
          <button onClick={saveSnapshot} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded flex items-center gap-1 transition-colors">
            <Save size={12} /> {labels.actions.snapshotSave}
          </button>

          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>

          <div className="relative">
            <button onClick={() => setShowSnapshots(!showSnapshots)} className="px-3 py-1 bg-white dark:bg-gray-800 hover:bg-gray-50 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-xs font-bold rounded flex items-center gap-1 transition-colors">
              <DownloadCloud size={14} /> {labels.actions.snapshotLoad} <ChevronDown size={12} />
            </button>
            {showSnapshots && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20 py-1 max-h-48 overflow-y-auto animate-in fade-in zoom-in-95">
                {feedCaretaker.getSnapshotNames().length === 0 ? (
                  <div className="px-4 py-2 text-xs text-gray-400 italic text-center">No saved snapshots</div>
                ) : (
                  feedCaretaker.getSnapshotNames().map(name => (
                    <button key={name} onClick={() => loadSnapshot(name)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-between group">
                      <span>{name}</span>
                      <RotateCw size={12} className="opacity-0 group-hover:opacity-100 text-blue-500" />
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`mb-8 p-4 rounded-xl ${currentStyle.name === 'Future' ? 'bg-slate-800/50 border border-cyan-900' : 'bg-gray-100 dark:bg-gray-800'}`}>
        <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder={labels.actions.search} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="relative group">
            <button className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentStyle.getButtonClass('secondary')}`}>
              <ArrowUpDown size={16} /> <span>{currentSortStrategy.label}</span> <ChevronDown size={16} />
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 hidden group-hover:block z-10 p-1">
              {SORT_STRATEGIES.map((strategy, idx) => (<button key={idx} onClick={() => { setCurrentSortStrategy(strategy); notify.notify(`Sorted by ${strategy.label}`, 'INFO'); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" > {strategy.label} </button>))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full overflow-x-auto">
          <Filter size={18} className="text-gray-500" />
          <span className="text-sm font-bold text-gray-500 whitespace-nowrap">{labels.actions.filterBy}:</span>
          {['all', 'project', 'blog', 'video', 'article', 'podcast'].map(type => (<button key={type} onClick={() => { setFilterType(type); notify.notify(`Filtered by ${type}`, 'INFO'); }} className={`px-3 py-1.5 rounded-md text-sm capitalize transition-all ${filterType === type ? currentStyle.getButtonClass('primary') : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`} > {type} </button>))}
        </div>
      </div>
      <ContentLayoutFactory layout={layout} items={sortedItems} renderItem={renderItem} getDate={(item) => item.date} currentStyle={currentStyle} labels={labels} />
    </div>
  );
};
const DashboardSection = ({ currentStyle, labels }: { currentStyle: StyleFactory, labels: UILabels }) => { const metricsVisitor = new MetricsVisitor(); const tagsVisitor = new TagsVisitor(); traverse(PROJECTS_TREE, metricsVisitor); traverse(PROJECTS_TREE, tagsVisitor); traverse(BLOGS_TREE, metricsVisitor); traverse(BLOGS_TREE, tagsVisitor); traverse(ARTICLES_TREE, metricsVisitor); traverse(ARTICLES_TREE, tagsVisitor); const stats = metricsVisitor.counts; const tags = Array.from(tagsVisitor.tags); return (<div className={`py-12 px-4 max-w-7xl mx-auto`}><div className="mb-10 border-b border-gray-200 dark:border-gray-700 pb-4"><h2 className={currentStyle.getSectionTitleClass()}>{labels.sections.dashboard}</h2><p className="text-gray-500 mt-2">{labels.sections.dashboardDesc}</p></div><div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"><div className={`${currentStyle.getCardClass()} p-6`}><div className="flex items-center gap-3 mb-6"><div className={`p-3 rounded-lg ${currentStyle.name === 'Future' ? 'bg-cyan-900/30 text-cyan-400' : 'bg-blue-100 text-blue-600'}`}><BarChart3 size={24} /></div><h3 className="text-xl font-bold dark:text-white">Content Overview</h3></div><div className="grid grid-cols-2 gap-4"><div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-center"><div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</div><div className="text-xs uppercase tracking-wider text-gray-500 mt-1">Total Items</div></div><div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-center"><div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.project}</div><div className="text-xs uppercase tracking-wider text-gray-500 mt-1">Projects</div></div><div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-center"><div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.blog}</div><div className="text-xs uppercase tracking-wider text-gray-500 mt-1">Blog Posts</div></div><div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-center"><div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.podcast}</div><div className="text-xs uppercase tracking-wider text-gray-500 mt-1">Podcasts</div></div></div></div><div className={`${currentStyle.getCardClass()} p-6`}><div className="flex items-center gap-3 mb-6"><div className={`p-3 rounded-lg ${currentStyle.name === 'Future' ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'}`}><PieChart size={24} /></div><h3 className="text-xl font-bold dark:text-white">Topic Cloud</h3></div><div className="flex flex-wrap gap-2">{tags.map(tag => (<span key={tag} className={`${currentStyle.getBadgeClass()} text-sm py-1.5 px-3`} onClick={() => notify.notify(`Tag selected: ${tag}`, 'INFO')}>#{tag}</span>))}</div></div></div></div>); };
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
    { name: labels.nav.podcast, id: 'podcast', icon: <Mic size={18} /> },
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
    { type: 'NAV', targetId: 'podcast', label: 'Podcast' },
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
    new NavigateCommand('nav-podcast', 'Go to Podcast', <Mic size={16} />, 'podcast', setActiveTab, getCurrentTab),
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
      case 'podcast': return <PodcastSection currentStyle={currentStyle} labels={labels} />;
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