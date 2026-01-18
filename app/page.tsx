"use client";
import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Code, FileText, User, Briefcase, Menu, X, 
  Github, Linkedin, ExternalLink, ChevronRight, ChevronDown, Calendar, 
  Tag, LayoutGrid, List, Clock, PlayCircle, Rss, 
  Palette, Moon, Sun, Monitor, Globe, Type, Layers, Box, Folder, ArrowRight
} from 'lucide-react';

// --- 1. DATA STRUCTURE DEFINITIONS (UNCHANGED) ---
interface Article { id: string; title: string; slug: string; excerpt: string; content: string; publishedAt: string; tags: string[]; readTime: string; author: { name: string; avatar: string; }; }
interface Blog { id: string; title: string; slug: string; summary: string; date: string; category: 'Personal' | 'Lifestyle' | 'DevLog'; coverImage?: string; }
interface Doc { id: string; title: string; slug: string; section: string; content: string; lastUpdated: string; }
interface Project { id: string; title: string; description: string; techStack: string[]; githubUrl?: string; liveUrl?: string; thumbnail: string; featured: boolean; date: string; }
interface Experience { id: string; role: string; company: string; period: string; description: string[]; }
interface Education { id: string; degree: string; institution: string; year: string; }
interface ResumeData { name: string; title: string; summary: string; skills: string[]; experience: Experience[]; education: Education[]; contact: { email: string; location: string; }; }
interface ExternalVideoData { videoId: string; headline: string; descriptionSnippet: string; published_timestamp: number; thumbnail_high: string; views: number; tags: string[]; }
interface UnifiedContentItem { id: string; type: 'project' | 'blog' | 'video' | 'article' | 'doc'; title: string; description: string; date: string; imageUrl?: string; meta: string[]; actionLink?: string; }

// --- 2. MOCK DATA (EXISTING UNCHANGED) ---
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
  { id: '1', title: 'Getting Started', slug: 'start', section: 'Introduction', content: 'Welcome to the documentation. This guide will help you get started with the project installation and basic configuration. \n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', lastUpdated: '2024-01-10' },
  { id: '2', title: 'Authentication', slug: 'auth', section: 'Core Concepts', content: 'We use JWT for authentication. Here is how you can implement the login flow... \n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', lastUpdated: '2024-02-15' },
  { id: '3', title: 'Database Schema', slug: 'db', section: 'Core Concepts', content: 'The database consists of 5 main tables: Users, Products, Orders... \n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.', lastUpdated: '2024-03-01' }
];

// --- 3. ADAPTERS (UNCHANGED) ---
const adaptProjectToUnified = (p: Project): UnifiedContentItem => ({ id: `proj-${p.id}`, type: 'project', title: p.title, description: p.description, date: p.date, imageUrl: p.thumbnail, meta: p.techStack, actionLink: p.githubUrl });
const adaptBlogToUnified = (b: Blog): UnifiedContentItem => ({ id: `blog-${b.id}`, type: 'blog', title: b.title, description: b.summary, date: b.date, imageUrl: b.coverImage, meta: [b.category], actionLink: '#' });
const adaptVideoToUnified = (v: ExternalVideoData): UnifiedContentItem => ({ id: `vid-${v.videoId}`, type: 'video', title: v.headline, description: v.descriptionSnippet, date: new Date(v.published_timestamp).toISOString().split('T')[0], imageUrl: v.thumbnail_high, meta: [`${v.views} views`], actionLink: '#' });
const adaptArticleToUnified = (a: Article): UnifiedContentItem => ({ id: `art-${a.id}`, type: 'article', title: a.title, description: a.excerpt, date: a.publishedAt, meta: a.tags, actionLink: '#' });
const adaptDocToUnified = (d: Doc): UnifiedContentItem => ({ id: `doc-${d.id}`, type: 'doc', title: d.title, description: d.content.substring(0, 100) + '...', date: d.lastUpdated, meta: [d.section], actionLink: '#' });

// ==========================================
// === 1. LOCALIZATION ABSTRACT FACTORY ===
// ==========================================
interface UILabels {
  nav: { home: string; feed: string; projects: string; articles: string; blog: string; docs: string; resume: string; };
  hero: { titlePrefix: string; titleHighlight: string; description: string; btnProjects: string; btnArticles: string; };
  sections: { feed: string; feedDesc: string; projects: string; projectsDesc: string; articles: string; articlesDesc: string; blog: string; blogDesc: string; docs: string; resume: string; experience: string; skills: string; education: string; summary: string; };
  actions: { readMore: string; downloadPdf: string; view: string; expand: string; collapse: string; related: string };
}

interface LocalizationFactory { code: string; getLabels(): UILabels; }

const EnglishLocalization: LocalizationFactory = {
  code: 'EN',
  getLabels: () => ({
    nav: { home: 'Home', feed: 'Feed', projects: 'Projects', articles: 'Articles', blog: 'Blog', docs: 'Docs', resume: 'Resume' },
    hero: { titlePrefix: 'Building the', titleHighlight: 'Future', description: 'Full Stack Developer crafting scalable applications.', btnProjects: 'View Projects', btnArticles: 'Read Articles' },
    sections: {
      feed: 'Unified Feed', feedDesc: 'All content in one place.',
      projects: 'Projects', projectsDesc: 'Super Projects and their related sub-modules.',
      articles: 'Technical Articles', articlesDesc: 'Drill down into topics to see related content.',
      blog: 'Personal Blog', blogDesc: 'Main stories and related thoughts.',
      docs: 'Documentation',
      resume: 'Resume', experience: 'Experience', skills: 'Skills', education: 'Education', summary: 'Summary'
    },
    actions: { readMore: 'Read more', downloadPdf: 'PDF', view: 'View', expand: 'Show Related', collapse: 'Hide Related', related: 'Related Items' }
  })
};

const ThaiLocalization: LocalizationFactory = {
  code: 'TH',
  getLabels: () => ({
    nav: { home: 'หน้าหลัก', feed: 'ฟีดรวม', projects: 'โปรเจกต์', articles: 'บทความ', blog: 'บล็อก', docs: 'เอกสาร', resume: 'เรซูเม่' },
    hero: { titlePrefix: 'สร้างสรรค์', titleHighlight: 'อนาคต', description: 'นักพัฒนา Full Stack ผู้หลงใหลในการสร้างแอปพลิเคชันที่ขยายตัวได้จริง', btnProjects: 'ดูผลงาน', btnArticles: 'อ่านบทความ' },
    sections: {
      feed: 'ฟีดรวมเนื้อหา', feedDesc: 'รวมทุกความเคลื่อนไหวไว้ที่เดียว',
      projects: 'โปรเจกต์', projectsDesc: 'โปรเจกต์หลักและโมดูลย่อยที่เกี่ยวข้อง',
      articles: 'บทความเชิงลึก', articlesDesc: 'คลิกเพื่ออ่านหรือดูเนื้อหาที่เกี่ยวข้องเพิ่มเติม',
      blog: 'บล็อกส่วนตัว', blogDesc: 'เรื่องราวหลักและเกร็ดเล็กเกร็ดน้อยที่เกี่ยวข้อง',
      docs: 'เอกสารคู่มือ',
      resume: 'ประวัติย่อ', experience: 'ประสบการณ์ทำงาน', skills: 'ทักษะ', education: 'การศึกษา', summary: 'สรุปข้อมูล'
    },
    actions: { readMore: 'อ่านต่อ', downloadPdf: 'ดาวน์โหลด PDF', view: 'ดู', expand: 'ดูที่เกี่ยวข้อง', collapse: 'ซ่อน', related: 'เนื้อหาที่เกี่ยวข้อง' }
  })
};

// ==========================================
// === 2. TYPOGRAPHY & STYLE FACTORIES ===
// ==========================================
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
}

const ModernStyle: StyleFactory = {
  name: 'Modern',
  getMainLayoutClass: () => "bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300",
  getCardClass: () => "bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative",
  getButtonClass: (variant) => {
    if (variant === 'primary') return "px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all";
    if (variant === 'text') return "px-3 py-1 text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-all";
    return "px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all";
  },
  getNavbarClass: () => "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50",
  getBadgeClass: () => "px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full",
  getSectionTitleClass: () => "text-3xl font-bold text-gray-900 dark:text-white",
  getContainerClass: (type) => "rounded-2xl p-4 md:p-6 bg-gray-100/50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 backdrop-blur-sm mt-4"
};

const MinimalStyle: StyleFactory = {
  name: 'Minimal',
  getMainLayoutClass: () => "bg-white dark:bg-black min-h-screen transition-colors duration-300",
  getCardClass: () => "bg-transparent border-b border-gray-200 dark:border-gray-800 py-6 hover:opacity-80 transition-opacity relative",
  getButtonClass: (variant) => {
    if (variant === 'primary') return "px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-none uppercase tracking-widest text-xs font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors";
    if (variant === 'text') return "px-3 py-1 text-black dark:text-white uppercase tracking-wider text-xs font-bold hover:underline transition-all";
    return "px-6 py-2 bg-transparent text-black dark:text-white border border-black dark:border-white rounded-none uppercase tracking-widest text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors";
  },
  getNavbarClass: () => "bg-white dark:bg-black border-b-2 border-black dark:border-white sticky top-0 z-50",
  getBadgeClass: () => "px-2 py-1 border border-gray-400 text-gray-600 dark:text-gray-400 text-[10px] uppercase tracking-wider",
  getSectionTitleClass: () => "text-2xl font-normal text-black dark:text-white uppercase tracking-[0.2em]",
  getContainerClass: (type) => "p-0 border-l border-black dark:border-white pl-4 mt-4"
};

const FutureStyle: StyleFactory = {
  name: 'Future',
  getMainLayoutClass: () => "bg-slate-900 dark:bg-black min-h-screen transition-colors duration-300",
  getCardClass: () => "bg-slate-800/50 dark:bg-gray-900/80 backdrop-blur border border-cyan-500/30 dark:border-cyan-500/50 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all duration-300 rounded-none skew-x-[-2deg] relative",
  getButtonClass: (variant) => {
    if (variant === 'primary') return "px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold uppercase tracking-wider clip-path-slant hover:brightness-110 transition-all shadow-[0_0_10px_rgba(6,182,212,0.5)]";
    if (variant === 'text') return "px-3 py-1 text-cyan-400 font-bold uppercase tracking-wider hover:text-cyan-200 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all";
    return "px-6 py-2 bg-transparent text-cyan-400 border border-cyan-500/50 font-bold uppercase tracking-wider hover:bg-cyan-950/30 transition-all";
  },
  getNavbarClass: () => "bg-slate-900/90 border-b border-cyan-500/30 sticky top-0 z-50 shadow-[0_0_20px_rgba(6,182,212,0.15)]",
  getBadgeClass: () => "px-2 py-1 bg-cyan-950/50 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase",
  getSectionTitleClass: () => "text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 uppercase italic",
  getContainerClass: (type) => "p-4 border border-cyan-900/50 bg-slate-900/50 mt-4"
};

const AcademicStyle: StyleFactory = {
  name: 'Academic',
  getMainLayoutClass: () => "bg-[#fdfbf7] dark:bg-[#1a1a1a] min-h-screen transition-colors duration-300",
  getCardClass: () => "bg-white dark:bg-[#2a2a2a] p-1 border border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow relative",
  getButtonClass: (variant) => {
    if (variant === 'primary') return "px-5 py-2 bg-[#8b1e3f] dark:bg-[#d4af37] text-white dark:text-black font-serif italic hover:opacity-90 transition-opacity";
    if (variant === 'text') return "px-3 py-1 text-[#8b1e3f] dark:text-[#d4af37] font-serif italic hover:underline transition-all";
    return "px-5 py-2 bg-transparent text-[#8b1e3f] dark:text-[#d4af37] border border-[#8b1e3f] dark:border-[#d4af37] font-serif italic hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors";
  },
  getNavbarClass: () => "bg-[#fdfbf7] dark:bg-[#1a1a1a] border-b-4 border-double border-gray-300 dark:border-gray-600 sticky top-0 z-50",
  getBadgeClass: () => "px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs font-serif italic border border-gray-400",
  getSectionTitleClass: () => "text-3xl font-bold text-gray-900 dark:text-gray-100 border-b-2 border-gray-300 dark:border-gray-600 pb-2 inline-block",
  getContainerClass: (type) => "p-6 border-2 border-double border-gray-300 dark:border-gray-600 mt-4"
};

const STYLES: Record<string, StyleFactory> = { 'modern': ModernStyle, 'minimal': MinimalStyle, 'future': FutureStyle, 'academic': AcademicStyle };
const LOCALES: Record<string, LocalizationFactory> = { 'en': EnglishLocalization, 'th': ThaiLocalization };
const FONTS: Record<string, TypographyFactory> = { 'sans': PrimaryFont, 'serif': SecondaryFont };

// ==========================================
// === 4. COMPOSITE PATTERN IMPLEMENTATION ===
// ==========================================

// 4.1 Define Component Interfaces
type ComponentType = 'container' | 'item';
type LayoutStyleType = 'grid' | 'list' | 'timeline' | 'column' | 'row';

interface LayoutNode {
  id: string;
  type: ComponentType;
}

interface LeafNode extends LayoutNode {
  type: 'item';
  data: UnifiedContentItem;
}

interface CompositeNode extends LayoutNode {
  type: 'container';
  layoutStyle: LayoutStyleType;
  children: Array<LayoutNode | CompositeNode | LeafNode>;
  title?: string;
  colSpan?: number;
  data?: UnifiedContentItem;
}

// 4.2 MOCK HIERARCHICAL DATA (UPDATED)

// 1. ARTICLES: Parent has Data + Children
const HIERARCHICAL_ARTICLES: CompositeNode[] = [
  {
    id: 'rsc-master',
    type: 'container',
    layoutStyle: 'grid', 
    data: adaptArticleToUnified(MOCK_ARTICLES_FLAT[0]),
    children: [
      { id: 'sub-1', type: 'item', data: { ...adaptBlogToUnified(MOCK_BLOGS[0]), type: 'blog', title: 'Why I moved to RSC (Blog Log)' } } as LeafNode,
      { id: 'sub-2', type: 'item', data: { ...adaptVideoToUnified(MOCK_VIDEOS[0]), type: 'video', title: 'Video Demo: RSC in Action' } } as LeafNode,
    ]
  },
  {
    id: 'ts-master',
    type: 'container',
    layoutStyle: 'list',
    data: adaptArticleToUnified(MOCK_ARTICLES_FLAT[1]),
    children: [
      { id: 'sub-3', type: 'item', data: { ...adaptProjectToUnified(MOCK_PROJECTS[1]), type: 'article', title: 'Utility Types Cheatsheet' } } as LeafNode
    ]
  }
];

// 2. PROJECTS: Parent has Data (Super Project) + Children (Sub Projects)
const HIERARCHICAL_PROJECTS: CompositeNode[] = [
  {
    id: 'super-app',
    type: 'container',
    layoutStyle: 'grid',
    data: adaptProjectToUnified(MOCK_PROJECTS[0]), // "E-Commerce Super App" as parent
    children: [
      { id: 'sub-p1', type: 'item', data: adaptProjectToUnified(MOCK_PROJECTS[1]) } as LeafNode, // "Merchant Dashboard"
      { id: 'sub-p2', type: 'item', data: adaptProjectToUnified(MOCK_PROJECTS[2]) } as LeafNode  // "Mobile App"
    ]
  },
  {
    id: 'ai-chat',
    type: 'container',
    layoutStyle: 'list',
    data: adaptProjectToUnified(MOCK_PROJECTS[3]), // "AI Chat System" as parent
    children: [
       { id: 'sub-p3', type: 'item', data: adaptProjectToUnified(MOCK_PROJECTS[4]) } as LeafNode // "Socket Server"
    ]
  }
];

// 3. BLOGS: Parent has Data (Main Story) + Children (Related Thoughts)
const HIERARCHICAL_BLOGS: CompositeNode[] = [
  {
    id: 'journey-main',
    type: 'container',
    layoutStyle: 'timeline',
    data: adaptBlogToUnified(MOCK_BLOGS[0]), // "My Journey into Tech"
    children: [
      { id: 'rel-b1', type: 'item', data: { ...adaptArticleToUnified(MOCK_ARTICLES_FLAT[0]), type: 'blog', title: 'First Framework I Learned' } } as LeafNode,
      { id: 'rel-b2', type: 'item', data: { ...adaptProjectToUnified(MOCK_PROJECTS[0]), type: 'blog', title: 'My First Big Failure' } } as LeafNode
    ]
  },
  {
    id: 'coffee-life',
    type: 'container',
    layoutStyle: 'list',
    data: adaptBlogToUnified(MOCK_BLOGS[1]), // "Why I love Coffee"
    children: [
       { id: 'rel-b3', type: 'item', data: { ...adaptVideoToUnified(MOCK_VIDEOS[0]), type: 'video', title: 'Vlog: A Day in Life' } } as LeafNode
    ]
  }
];

// 4.3 Interactive Recursive Renderer
const InteractiveContentNode = ({ node, style, labels, level = 0 }: { node: LayoutNode | CompositeNode | LeafNode, style: StyleFactory, labels: UILabels, level?: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLayout, setCurrentLayout] = useState<LayoutStyleType>('grid');

  const isComposite = (n: LayoutNode): n is CompositeNode => n.type === 'container';
  const hasChildren = isComposite(node) && node.children && node.children.length > 0;
  
  useEffect(() => {
    if (isComposite(node)) setCurrentLayout(node.layoutStyle);
  }, [node]);

  const contentItem = (node as any).data as UnifiedContentItem | undefined;

  const renderContentCard = () => {
    if (!contentItem && !isComposite(node)) return null;

    // Plain Container Header (if no data)
    if (!contentItem && isComposite(node)) {
      return (
        <div className="flex items-center justify-between mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          <h3 className={`text-lg font-bold opacity-70 flex items-center gap-2 ${style.name === 'Future' ? 'text-cyan-200' : 'text-gray-500 dark:text-gray-400'}`}>
            <Folder size={18} /> {node.title || 'Section'}
          </h3>
          <div className="flex gap-2">
             <div className="flex bg-gray-100 dark:bg-gray-800 rounded p-1 scale-75 origin-right">
                {(['grid', 'list', 'timeline'] as LayoutStyleType[]).map(l => (
                  <button key={l} onClick={(e) => { e.stopPropagation(); setCurrentLayout(l); }} className={`p-1 rounded ${currentLayout === l ? 'bg-white shadow text-blue-600' : 'text-gray-400'}`}>
                    {l === 'grid' ? <LayoutGrid size={14}/> : l === 'list' ? <List size={14}/> : <Clock size={14}/>}
                  </button>
                ))}
             </div>
             {hasChildren && (
                <button onClick={() => setIsOpen(!isOpen)} className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown size={20} />
                </button>
             )}
          </div>
        </div>
      );
    }

    // Interactive Card
    return (
      <div className={`${style.getCardClass()} p-6`}>
        <div className="flex justify-between items-start mb-3">
           <div className="flex items-center gap-2">
             <span className={style.getBadgeClass()}>{contentItem!.type}</span>
             <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={12}/> {contentItem!.date}</span>
           </div>
           {hasChildren && (
             <button 
               onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
               className={`flex items-center gap-1 text-xs font-bold uppercase tracking-wider transition-colors ${style.name === 'Future' ? 'text-cyan-400' : 'text-blue-600 dark:text-blue-400'}`}
             >
               {isOpen ? labels.actions.collapse : labels.actions.expand} ({isComposite(node) ? node.children.length : 0})
               <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
             </button>
           )}
        </div>
        <h3 className={`text-2xl font-bold mb-2 cursor-pointer hover:underline ${style.name === 'Future' ? 'text-cyan-400' : 'text-gray-900 dark:text-gray-100'}`}>
           {contentItem!.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed">
           {contentItem!.description}
        </p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
           <div className="flex gap-2">
             {contentItem!.meta && contentItem!.meta.slice(0, 3).map((tag, i) => <span key={i} className="text-[10px] px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-gray-500">#{tag}</span>)}
           </div>
           <button className={style.getButtonClass('text')}>
             {labels.actions.readMore} <ChevronRight size={14} className="inline ml-1"/>
           </button>
        </div>
      </div>
    );
  };

  const renderChildren = () => {
    if (!isComposite(node)) return null;
    
    // Auto-open containers without data to show sections
    useEffect(() => {
        if (!contentItem && isComposite(node)) setIsOpen(true);
    }, []);

    const shouldRender = contentItem ? isOpen : (isOpen || true);
    if (!shouldRender) return null;

    return (
      <div className={`${style.getContainerClass(currentLayout)} animate-in fade-in slide-in-from-top-4 duration-300`}>
        {contentItem && (
          <div className="flex justify-between items-center mb-4 px-2">
             <span className="text-xs font-bold uppercase text-gray-400 flex items-center gap-2">
               <Layers size={14}/> {labels.actions.related}
             </span>
             <div className="flex gap-1 bg-gray-200 dark:bg-gray-700 rounded p-0.5">
                {(['grid', 'list', 'timeline'] as LayoutStyleType[]).map(l => (
                  <button key={l} onClick={() => setCurrentLayout(l)} className={`p-1.5 rounded text-xs transition-all ${currentLayout === l ? 'bg-white dark:bg-gray-600 shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`} title={l}>
                    {l === 'grid' ? <LayoutGrid size={12}/> : l === 'list' ? <List size={12}/> : <Clock size={12}/>}
                  </button>
                ))}
             </div>
          </div>
        )}
        <div className={
          currentLayout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 
          currentLayout === 'list' ? 'flex flex-col space-y-4' : 
          currentLayout === 'timeline' ? `border-l-2 ${style.name === 'Future' ? 'border-cyan-500' : 'border-gray-300'} ml-2 pl-4 space-y-6` : 'flex flex-col gap-4'
        }>
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

  return (
    <div className={`w-full ${level > 0 ? 'mb-0' : 'mb-8'}`}>
      {renderContentCard()}
      {renderChildren()}
    </div>
  );
};

// --- 5. EXISTING LAYOUT SYSTEM (UNCHANGED for UnifiedFeed) ---
type LayoutType = 'grid' | 'list' | 'timeline';
interface GenericLayoutProps<T> { items: T[]; renderItem: (item: T, layout: LayoutType, style: StyleFactory, labels: UILabels) => React.ReactNode; getDate?: (item: T) => string; currentStyle: StyleFactory; labels: UILabels; }
const GridLayout = <T,>({ items, renderItem, currentStyle, labels }: GenericLayoutProps<T>) => (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{items.map((item, index) => <div key={index} className="h-full">{renderItem(item, 'grid', currentStyle, labels)}</div>)}</div>);
const ListLayout = <T,>({ items, renderItem, currentStyle, labels }: GenericLayoutProps<T>) => (<div className="flex flex-col space-y-6 max-w-4xl mx-auto">{items.map((item, index) => <div key={index} className="w-full">{renderItem(item, 'list', currentStyle, labels)}</div>)}</div>);
const TimelineLayout = <T,>({ items, renderItem, getDate, currentStyle, labels }: GenericLayoutProps<T>) => (<div className={`max-w-3xl mx-auto border-l-2 ${currentStyle.name === 'Future' ? 'border-cyan-500' : 'border-gray-300'} ml-4 md:ml-8 pl-8 py-4 space-y-12`}>{items.map((item, index) => (<div key={index} className="relative"><div className={`absolute -left-[41px] top-0 h-5 w-5 rounded-full border-4 ${currentStyle.name === 'Future' ? 'border-black bg-cyan-500' : 'border-white bg-gray-400'} shadow-sm`} />{getDate && <span className={`absolute -top-7 left-0 text-xs font-bold px-2 py-1 rounded ${currentStyle.name === 'Future' ? 'text-cyan-400 bg-black' : 'text-gray-500 bg-gray-100'}`}>{getDate(item)}</span>}{renderItem(item, 'timeline', currentStyle, labels)}</div>))}</div>);
const ContentLayoutFactory = <T,>({ layout, items, renderItem, getDate, currentStyle, labels }: { layout: LayoutType } & GenericLayoutProps<T>) => { const LayoutStrategies = { grid: GridLayout, list: ListLayout, timeline: TimelineLayout }; const SelectedLayout = LayoutStrategies[layout] || GridLayout; return <SelectedLayout items={items} renderItem={renderItem} getDate={getDate} currentStyle={currentStyle} labels={labels} />; };
const LayoutSwitcher = ({ current, onChange, currentStyle, labels }: { current: LayoutType, onChange: (l: LayoutType) => void, currentStyle: StyleFactory, labels: UILabels }) => (<div className={`flex p-1 rounded-lg border ${currentStyle.name === 'Future' ? 'border-cyan-500/30 bg-black/50' : 'border-gray-200 bg-gray-100'} inline-flex mb-6`}>{['grid', 'list', 'timeline'].map((l) => (<button key={l} onClick={() => onChange(l as LayoutType)} className={`p-2 rounded-md transition-all ${current === l ? (currentStyle.name === 'Future' ? 'bg-cyan-900/50 text-cyan-400 shadow-sm' : 'bg-white text-blue-600 shadow') : 'text-gray-400 hover:text-gray-600'}`} title={labels.actions.view}>{l === 'grid' ? <LayoutGrid size={18} /> : l === 'list' ? <List size={18} /> : <Clock size={18} />}</button>))}</div>);
const ThemeControls = ({ currentStyleKey, setStyleKey, isDark, toggleDark, langKey, setLangKey, fontKey, setFontKey }: { currentStyleKey: string, setStyleKey: (k: string) => void, isDark: boolean, toggleDark: () => void, langKey: string, setLangKey: (k: string) => void, fontKey: string, setFontKey: (k: string) => void }) => (<div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end"><button onClick={toggleDark} className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:scale-110 transition-transform" title="Toggle Dark Mode">{isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-700" />}</button><button onClick={() => setLangKey(langKey === 'en' ? 'th' : 'en')} className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:scale-110 transition-transform font-bold text-xs" title="Switch Language">{langKey.toUpperCase()}</button><button onClick={() => setFontKey(fontKey === 'sans' ? 'serif' : 'sans')} className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:scale-110 transition-transform" title="Switch Font"><Type size={20} className="text-gray-600 dark:text-gray-300" /></button><div className="bg-white dark:bg-gray-800 p-2 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 flex flex-col gap-2"><div className="text-[10px] uppercase font-bold text-gray-400 text-center">Style</div>{Object.keys(STYLES).map(key => (<button key={key} onClick={() => setStyleKey(key)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${currentStyleKey === key ? 'bg-blue-600 text-white scale-110' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200'}`} title={STYLES[key].name}>{key === 'modern' ? <Monitor size={14} /> : key === 'minimal' ? <X size={14} /> : key === 'future' ? <Code size={14} /> : <BookOpen size={14} />}</button>))}</div></div>);

// --- 6. SECTIONS ---

const HeroSection = ({ currentStyle, labels }: { currentStyle: StyleFactory, labels: UILabels }) => (
  <div className={`flex flex-col items-center justify-center min-h-[80vh] text-center px-4`}>
    <div className={`w-32 h-32 rounded-full mb-8 flex items-center justify-center text-4xl font-bold animate-pulse ${currentStyle.name === 'Future' ? 'bg-cyan-900 text-cyan-400 shadow-[0_0_50px_rgba(6,182,212,0.5)]' : currentStyle.name === 'Minimal' ? 'bg-black text-white dark:bg-white dark:text-black border-4 border-double' : 'bg-gradient-to-tr from-blue-400 to-indigo-500 text-white shadow-xl'}`}>AD</div>
    <h1 className={`mb-4 ${currentStyle.name === 'Future' ? 'text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600' : 'text-5xl font-extrabold text-gray-900 dark:text-white'}`}>{labels.hero.titlePrefix} <span className={currentStyle.name === 'Academic' ? 'italic text-[#8b1e3f]' : 'text-blue-600'}>{labels.hero.titleHighlight}</span></h1>
    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-8 leading-relaxed">{labels.hero.description}</p>
    <div className="flex space-x-4"><button className={currentStyle.getButtonClass('primary')}>{labels.hero.btnProjects}</button><button className={currentStyle.getButtonClass('secondary')}>{labels.hero.btnArticles}</button></div>
  </div>
);

// Unified Articles Section
const ArticlesSection = ({ currentStyle, labels }: { currentStyle: StyleFactory, labels: UILabels }) => (
  <div className={`py-12 px-4 max-w-7xl mx-auto`}>
    <div className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
      <h2 className={currentStyle.getSectionTitleClass()}>{labels.sections.articles}</h2>
      <p className="text-gray-500 mt-2">{labels.sections.articlesDesc}</p>
    </div>
    <div className="space-y-4">{HIERARCHICAL_ARTICLES.map((node) => <InteractiveContentNode key={node.id} node={node} style={currentStyle} labels={labels} />)}</div>
  </div>
);

// Updated Projects Section (Now Hierarchical)
const ProjectsSection = ({ currentStyle, labels }: { currentStyle: StyleFactory, labels: UILabels }) => (
  <div className={`py-12 px-4 max-w-7xl mx-auto`}>
    <div className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
      <h2 className={currentStyle.getSectionTitleClass()}>{labels.sections.projects}</h2>
      <p className="text-gray-500 mt-2">{labels.sections.projectsDesc}</p>
    </div>
    <div className="space-y-4">{HIERARCHICAL_PROJECTS.map((node) => <InteractiveContentNode key={node.id} node={node} style={currentStyle} labels={labels} />)}</div>
  </div>
);

// Updated Blog Section (Now Hierarchical)
const BlogSection = ({ currentStyle, labels }: { currentStyle: StyleFactory, labels: UILabels }) => (
  <div className={`py-12 px-4 max-w-7xl mx-auto`}>
    <div className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
      <h2 className={currentStyle.getSectionTitleClass()}>{labels.sections.blog}</h2>
      <p className="text-gray-500 mt-2">{labels.sections.blogDesc}</p>
    </div>
    <div className="space-y-4">{HIERARCHICAL_BLOGS.map((node) => <InteractiveContentNode key={node.id} node={node} style={currentStyle} labels={labels} />)}</div>
  </div>
);

// RESTORED Original Docs Section (Sidebar + Content)
const DocsSection = ({ currentStyle, labels }: { currentStyle: StyleFactory, labels: UILabels }) => {
  const [activeDoc, setActiveDoc] = useState(MOCK_DOCS[0]);
  const sections = Array.from(new Set(MOCK_DOCS.map(d => d.section)));

  return (
    <div className={`flex flex-col md:flex-row max-w-7xl mx-auto pt-8 min-h-[80vh] px-4`}>
      {/* Sidebar */}
      <div className="w-full md:w-64 flex-shrink-0 mb-8 md:mb-0 md:border-r border-gray-200 dark:border-gray-700 md:pr-4">
        <h3 className={`text-lg font-bold mb-4 ${currentStyle.name === 'Future' ? 'text-cyan-400' : 'text-gray-900 dark:text-gray-100'}`}>{labels.sections.docs}</h3>
        {sections.map(section => (
          <div key={section} className="mb-6">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{section}</h4>
            <ul className="space-y-1">
              {MOCK_DOCS.filter(d => d.section === section).map(doc => (
                <li key={doc.id}>
                  <button onClick={() => setActiveDoc(doc)} className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${activeDoc.id === doc.id ? (currentStyle.name === 'Future' ? 'bg-cyan-900/50 text-cyan-400' : 'bg-blue-50 text-blue-700 dark:bg-gray-800 dark:text-blue-300 font-medium') : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                    {doc.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {/* Main Content */}
      <div className="flex-1 md:pl-12">
        <div className="prose dark:prose-invert max-w-none">
          <h1 className={currentStyle.getSectionTitleClass()}>{activeDoc.title}</h1>
          <div className={`p-4 my-6 border-l-4 ${currentStyle.name === 'Future' ? 'bg-cyan-950/30 border-cyan-500 text-cyan-200' : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400 text-yellow-800 dark:text-yellow-200'}`}>
            <p className="text-sm">Last updated on {activeDoc.lastUpdated}</p>
          </div>
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {activeDoc.content}
          </div>
        </div>
      </div>
    </div>
  );
};

const UnifiedFeedSection = ({ currentStyle, labels }: { currentStyle: StyleFactory, labels: UILabels }) => {
  const [layout, setLayout] = useState<LayoutType>('grid');
  const unifiedItems = [...MOCK_PROJECTS.map(adaptProjectToUnified), ...MOCK_BLOGS.map(adaptBlogToUnified), ...MOCK_VIDEOS.map(adaptVideoToUnified)].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const renderItem = (item: UnifiedContentItem, currentLayout: LayoutType, style: StyleFactory, labels: UILabels) => {
    const isList = currentLayout === 'list';
    return (<div className={`${style.getCardClass()} h-full flex ${isList ? 'flex-row items-center' : 'flex-col'}`}><div className={`${isList ? 'w-48 h-32' : 'h-48'} bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 relative overflow-hidden`}><span className="text-gray-400 font-medium opacity-50">{item.type.toUpperCase()}</span><div className={`absolute top-2 right-2 ${style.getBadgeClass()}`}>{item.type}</div></div><div className="p-6 flex-1 flex flex-col"><div className="flex items-center text-xs text-gray-400 mb-2 space-x-2"><Calendar size={12} /><span>{item.date}</span></div><h3 className={`text-xl font-bold mb-2 ${style.name === 'Future' ? 'text-cyan-400' : 'text-gray-900 dark:text-gray-100'}`}>{item.title}</h3><p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 text-sm">{item.description}</p><div className="flex flex-wrap gap-2 mt-auto">{item.meta.slice(0, 3).map((tag, i) => <span key={i} className={style.getBadgeClass()}>{tag}</span>)}</div></div></div>);
  };
  return (<div className={`py-12 px-4 max-w-7xl mx-auto`}><div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 border-b border-gray-200 dark:border-gray-700 pb-4"><div><h2 className={currentStyle.getSectionTitleClass()}>{labels.sections.feed}</h2><p className="text-gray-500 mt-2">{labels.sections.feedDesc}</p></div><div className="mt-4 md:mt-0"><LayoutSwitcher current={layout} onChange={setLayout} currentStyle={currentStyle} labels={labels} /></div></div><ContentLayoutFactory layout={layout} items={unifiedItems} renderItem={renderItem} getDate={(item) => item.date} currentStyle={currentStyle} labels={labels} /></div>);
};

const ResumeSection = ({ currentStyle, labels }: { currentStyle: StyleFactory, labels: UILabels }) => (<div className={`py-12 px-4 max-w-4xl mx-auto`}><div className={`${currentStyle.getCardClass()} p-8 print:shadow-none print:border-none`}><div className="border-b border-gray-200 dark:border-gray-700 pb-8 mb-8 flex justify-between items-start"><div><h1 className={`text-4xl font-bold mb-2 ${currentStyle.name === 'Future' ? 'text-cyan-400' : 'text-gray-900 dark:text-white'}`}>{MOCK_RESUME.name}</h1><h2 className={`text-xl font-medium mb-4 ${currentStyle.name === 'Future' ? 'text-purple-400' : 'text-blue-600 dark:text-blue-400'}`}>{MOCK_RESUME.title}</h2><div className="flex flex-col sm:flex-row gap-4 text-gray-500 text-sm"><span>{MOCK_RESUME.contact.location}</span><span>{MOCK_RESUME.contact.email}</span></div></div><button className={currentStyle.getButtonClass('secondary')}><FileText size={16} /> {labels.actions.downloadPdf}</button></div><div className="mb-8"><h3 className={`text-lg font-bold uppercase tracking-wide mb-4 border-b pb-2 ${currentStyle.name === 'Future' ? 'text-cyan-400 border-cyan-900' : 'text-gray-900 dark:text-white border-gray-100 dark:border-gray-700'}`}>{labels.sections.summary}</h3><p className="text-gray-600 dark:text-gray-300 leading-relaxed">{MOCK_RESUME.summary}</p></div><div className="mb-8"><h3 className={`text-lg font-bold uppercase tracking-wide mb-4 border-b pb-2 ${currentStyle.name === 'Future' ? 'text-cyan-400 border-cyan-900' : 'text-gray-900 dark:text-white border-gray-100 dark:border-gray-700'}`}>{labels.sections.experience}</h3><div className="space-y-8">{MOCK_RESUME.experience.map(exp => (<div key={exp.id}><div className="flex justify-between items-baseline mb-2"><h4 className="text-xl font-bold text-gray-800 dark:text-gray-200">{exp.role}</h4><span className="text-sm text-gray-500 font-medium">{exp.period}</span></div><div className={`${currentStyle.name === 'Future' ? 'text-purple-400' : 'text-blue-600 dark:text-blue-400'} font-medium mb-3`}>{exp.company}</div><ul className="list-disc list-outside ml-5 space-y-1 text-gray-600 dark:text-gray-400">{exp.description.map((desc, i) => <li key={i}>{desc}</li>)}</ul></div>))}</div></div><div><h3 className={`text-lg font-bold uppercase tracking-wide mb-4 border-b pb-2 ${currentStyle.name === 'Future' ? 'text-cyan-400 border-cyan-900' : 'text-gray-900 dark:text-white border-gray-100 dark:border-gray-700'}`}>{labels.sections.skills}</h3><div className="flex flex-wrap gap-2">{MOCK_RESUME.skills.map(skill => <span key={skill} className={currentStyle.getBadgeClass()}>{skill}</span>)}</div></div></div></div>);

// --- 7. MAIN APP COMPONENT ---

export default function PersonalWebsite() {
  const [activeTab, setActiveTab] = useState('home');
  const [styleKey, setStyleKey] = useState('modern');
  const [langKey, setLangKey] = useState('en');
  const [fontKey, setFontKey] = useState('sans');
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isDark) { document.documentElement.classList.add('dark'); } else { document.documentElement.classList.remove('dark'); }
  }, [isDark]);

  const currentStyle = STYLES[styleKey];
  const currentLang = LOCALES[langKey];
  const currentFont = FONTS[fontKey];
  const labels = currentLang.getLabels();

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HeroSection currentStyle={currentStyle} labels={labels} />;
      case 'feed': return <UnifiedFeedSection currentStyle={currentStyle} labels={labels} />;
      case 'projects': return <ProjectsSection currentStyle={currentStyle} labels={labels} />;
      case 'articles': return <ArticlesSection currentStyle={currentStyle} labels={labels} />;
      case 'blog': return <BlogSection currentStyle={currentStyle} labels={labels} />;
      case 'docs': return <DocsSection currentStyle={currentStyle} labels={labels} />;
      case 'resume': return <ResumeSection currentStyle={currentStyle} labels={labels} />;
      default: return <HeroSection currentStyle={currentStyle} labels={labels} />;
    }
  };

  const navItems = [
    { name: labels.nav.home, id: 'home', icon: <User size={18} /> },
    { name: labels.nav.feed, id: 'feed', icon: <Rss size={18} /> },
    { name: labels.nav.projects, id: 'projects', icon: <Code size={18} /> },
    { name: labels.nav.articles, id: 'articles', icon: <BookOpen size={18} /> },
    { name: labels.nav.blog, id: 'blog', icon: <FileText size={18} /> },
    { name: labels.nav.docs, id: 'docs', icon: <FileText size={18} /> },
    { name: labels.nav.resume, id: 'resume', icon: <Briefcase size={18} /> },
  ];

  return (
    <div className={`${currentStyle.getMainLayoutClass()} ${currentFont.getFontClass()}`}>
      <nav className={currentStyle.getNavbarClass()}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => setActiveTab('home')}>
              <span className={`text-xl font-bold ${currentStyle.name === 'Future' ? 'text-cyan-400' : 'text-gray-900 dark:text-white'}`}>Alex.Dev</span>
            </div>
            <div className="hidden lg:flex space-x-6 items-center">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors ${
                    activeTab === item.id 
                      ? (currentStyle.name === 'Future' ? 'text-cyan-400' : 'text-blue-600 dark:text-blue-400') 
                      : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
                >
                  {item.icon}<span>{item.name}</span>
                </button>
              ))}
            </div>
            <div className="lg:hidden flex items-center">
               <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 dark:text-gray-300">
                 {isMenuOpen ? <X /> : <Menu />}
               </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
             <div className="px-2 pt-2 pb-3 space-y-1">
               {navItems.map(item => (
                 <button key={item.id} onClick={() => {setActiveTab(item.id); setIsMenuOpen(false)}} className="block w-full text-left px-3 py-2 text-gray-600 dark:text-gray-300">{item.name}</button>
               ))}
             </div>
          </div>
        )}
      </nav>
      
      <main className="pt-8 min-h-screen">
        {renderContent()}
      </main>

      <ThemeControls 
        currentStyleKey={styleKey} setStyleKey={setStyleKey} 
        isDark={isDark} toggleDark={() => setIsDark(!isDark)}
        langKey={langKey} setLangKey={setLangKey}
        fontKey={fontKey} setFontKey={setFontKey}
      />
    </div>
  );
}