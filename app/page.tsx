"use client";
import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Code, FileText, User, Briefcase, Menu, X, 
  Github, Linkedin, ExternalLink, ChevronRight, Calendar, 
  Tag, LayoutGrid, List, Clock, PlayCircle, Rss, 
  Palette, Moon, Sun, Monitor // Icons for Style & Theme
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
interface UnifiedContentItem { id: string; type: 'project' | 'blog' | 'video' | 'article'; title: string; description: string; date: string; imageUrl?: string; meta: string[]; actionLink?: string; }

// --- 2. MOCK DATA (UNCHANGED) ---
const MOCK_ARTICLES: Article[] = [
  { id: '1', title: 'Understanding React Server Components', slug: 'react-server-components', excerpt: 'Deep dive into how RSC works under the hood and why it changes everything.', content: 'Full content...', publishedAt: '2023-10-15', tags: ['React', 'Next.js'], readTime: '8 min', author: { name: 'Dev', avatar: '' } },
  { id: '2', title: 'Advanced TypeScript Patterns', slug: 'advanced-typescript', excerpt: 'Generic types, Utility types, and how to write cleaner code.', content: 'Full content...', publishedAt: '2023-11-02', tags: ['TypeScript'], readTime: '12 min', author: { name: 'Dev', avatar: '' } }
];
const MOCK_BLOGS: Blog[] = [
  { id: '1', title: 'My Journey into Tech', slug: 'my-journey', summary: 'How I started coding...', date: '2023-01-20', category: 'Personal' },
  { id: '2', title: 'Why I love Coffee', slug: 'coffee-coding', summary: 'A look at caffeine...', date: '2023-05-10', category: 'Lifestyle' }
];
const MOCK_PROJECTS: Project[] = [
  { id: '1', title: 'E-Commerce Dashboard', description: 'Comprehensive dashboard using Next.js.', techStack: ['Next.js', 'Supabase'], githubUrl: '#', featured: true, date: '2023-08-15', thumbnail: '' },
  { id: '2', title: 'AI Chat Interface', description: 'Chat app leveraging OpenAI API.', techStack: ['React', 'Node.js'], githubUrl: '#', featured: true, date: '2023-06-10', thumbnail: '' }
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
  { id: '1', title: 'Getting Started', slug: 'start', section: 'Intro', content: 'Setup guide and installation steps.', lastUpdated: '2024-01-10' },
  { id: '2', title: 'Authentication', slug: 'auth', section: 'Core', content: 'How to implement user login.', lastUpdated: '2024-02-15' }
];

// --- 3. ADAPTERS (UNCHANGED) ---
const adaptProjectToUnified = (p: Project): UnifiedContentItem => ({ id: `proj-${p.id}`, type: 'project', title: p.title, description: p.description, date: p.date, imageUrl: p.thumbnail, meta: p.techStack, actionLink: p.githubUrl });
const adaptBlogToUnified = (b: Blog): UnifiedContentItem => ({ id: `blog-${b.id}`, type: 'blog', title: b.title, description: b.summary, date: b.date, imageUrl: b.coverImage, meta: [b.category], actionLink: '#' });
const adaptVideoToUnified = (v: ExternalVideoData): UnifiedContentItem => ({ id: `vid-${v.videoId}`, type: 'video', title: v.headline, description: v.descriptionSnippet, date: new Date(v.published_timestamp).toISOString().split('T')[0], imageUrl: v.thumbnail_high, meta: [`${v.views} views`], actionLink: '#' });

// ==========================================
// === ABSTRACT FACTORY FOR STYLES ===
// ==========================================

interface StyleFactory {
  name: string;
  getMainLayoutClass(): string;
  getCardClass(): string;
  getButtonClass(variant?: 'primary' | 'secondary'): string;
  getNavbarClass(): string;
  getBadgeClass(type?: string): string;
  getFontFamily(): string;
  getSectionTitleClass(): string;
}

const ModernStyle: StyleFactory = {
  name: 'Modern',
  getMainLayoutClass: () => "bg-gray-50 dark:bg-gray-900 min-h-screen font-sans transition-colors duration-300",
  getCardClass: () => "bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden",
  getButtonClass: (variant) => variant === 'primary' 
    ? "px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all"
    : "px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all",
  getNavbarClass: () => "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50",
  getBadgeClass: () => "px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full",
  getFontFamily: () => "font-sans",
  getSectionTitleClass: () => "text-3xl font-bold text-gray-900 dark:text-white"
};

const MinimalStyle: StyleFactory = {
  name: 'Minimal',
  getMainLayoutClass: () => "bg-white dark:bg-black min-h-screen font-sans transition-colors duration-300",
  getCardClass: () => "bg-transparent border-b border-gray-200 dark:border-gray-800 py-6 hover:opacity-80 transition-opacity",
  getButtonClass: (variant) => variant === 'primary'
    ? "px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-none uppercase tracking-widest text-xs font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
    : "px-6 py-2 bg-transparent text-black dark:text-white border border-black dark:border-white rounded-none uppercase tracking-widest text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors",
  getNavbarClass: () => "bg-white dark:bg-black border-b-2 border-black dark:border-white sticky top-0 z-50",
  getBadgeClass: () => "px-2 py-1 border border-gray-400 text-gray-600 dark:text-gray-400 text-[10px] uppercase tracking-wider",
  getFontFamily: () => "font-mono",
  getSectionTitleClass: () => "text-2xl font-normal text-black dark:text-white uppercase tracking-[0.2em]"
};

const FutureStyle: StyleFactory = {
  name: 'Future',
  getMainLayoutClass: () => "bg-slate-900 dark:bg-black min-h-screen font-sans transition-colors duration-300",
  getCardClass: () => "bg-slate-800/50 dark:bg-gray-900/80 backdrop-blur border border-cyan-500/30 dark:border-cyan-500/50 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all duration-300 rounded-none skew-x-[-2deg]",
  getButtonClass: (variant) => variant === 'primary'
    ? "px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold uppercase tracking-wider clip-path-slant hover:brightness-110 transition-all shadow-[0_0_10px_rgba(6,182,212,0.5)]"
    : "px-6 py-2 bg-transparent text-cyan-400 border border-cyan-500/50 font-bold uppercase tracking-wider hover:bg-cyan-950/30 transition-all",
  getNavbarClass: () => "bg-slate-900/90 border-b border-cyan-500/30 sticky top-0 z-50 shadow-[0_0_20px_rgba(6,182,212,0.15)]",
  getBadgeClass: () => "px-2 py-1 bg-cyan-950/50 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase",
  getFontFamily: () => "font-sans",
  getSectionTitleClass: () => "text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 uppercase italic"
};

const AcademicStyle: StyleFactory = {
  name: 'Academic',
  getMainLayoutClass: () => "bg-[#fdfbf7] dark:bg-[#1a1a1a] min-h-screen font-serif transition-colors duration-300",
  getCardClass: () => "bg-white dark:bg-[#2a2a2a] p-1 border border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow",
  getButtonClass: (variant) => variant === 'primary'
    ? "px-5 py-2 bg-[#8b1e3f] dark:bg-[#d4af37] text-white dark:text-black font-serif italic hover:opacity-90 transition-opacity"
    : "px-5 py-2 bg-transparent text-[#8b1e3f] dark:text-[#d4af37] border border-[#8b1e3f] dark:border-[#d4af37] font-serif italic hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
  getNavbarClass: () => "bg-[#fdfbf7] dark:bg-[#1a1a1a] border-b-4 border-double border-gray-300 dark:border-gray-600 sticky top-0 z-50",
  getBadgeClass: () => "px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs font-serif italic border border-gray-400",
  getFontFamily: () => "font-serif",
  getSectionTitleClass: () => "text-3xl font-bold text-gray-900 dark:text-gray-100 border-b-2 border-gray-300 dark:border-gray-600 pb-2 inline-block"
};

const STYLES: Record<string, StyleFactory> = {
  'modern': ModernStyle,
  'minimal': MinimalStyle,
  'future': FutureStyle,
  'academic': AcademicStyle
};

// --- 4. LAYOUT SYSTEM ---

type LayoutType = 'grid' | 'list' | 'timeline';
interface GenericLayoutProps<T> {
  items: T[];
  renderItem: (item: T, layout: LayoutType, style: StyleFactory) => React.ReactNode;
  getDate?: (item: T) => string;
  currentStyle: StyleFactory;
}

const GridLayout = <T,>({ items, renderItem, currentStyle }: GenericLayoutProps<T>) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {items.map((item, index) => <div key={index} className="h-full">{renderItem(item, 'grid', currentStyle)}</div>)}
  </div>
);

const ListLayout = <T,>({ items, renderItem, currentStyle }: GenericLayoutProps<T>) => (
  <div className="flex flex-col space-y-6 max-w-4xl mx-auto">
    {items.map((item, index) => <div key={index} className="w-full">{renderItem(item, 'list', currentStyle)}</div>)}
  </div>
);

const TimelineLayout = <T,>({ items, renderItem, getDate, currentStyle }: GenericLayoutProps<T>) => (
  <div className={`max-w-3xl mx-auto border-l-2 ${currentStyle.name === 'Future' ? 'border-cyan-500' : 'border-gray-300'} ml-4 md:ml-8 pl-8 py-4 space-y-12`}>
    {items.map((item, index) => (
      <div key={index} className="relative">
        <div className={`absolute -left-[41px] top-0 h-5 w-5 rounded-full border-4 ${currentStyle.name === 'Future' ? 'border-black bg-cyan-500' : 'border-white bg-gray-400'} shadow-sm`} />
        {getDate && <span className={`absolute -top-7 left-0 text-xs font-bold px-2 py-1 rounded ${currentStyle.name === 'Future' ? 'text-cyan-400 bg-black' : 'text-gray-500 bg-gray-100'}`}>{getDate(item)}</span>}
        {renderItem(item, 'timeline', currentStyle)}
      </div>
    ))}
  </div>
);

const ContentLayoutFactory = <T,>({ layout, items, renderItem, getDate, currentStyle }: { layout: LayoutType } & GenericLayoutProps<T>) => {
  const LayoutStrategies = { grid: GridLayout, list: ListLayout, timeline: TimelineLayout };
  const SelectedLayout = LayoutStrategies[layout] || GridLayout;
  return <SelectedLayout items={items} renderItem={renderItem} getDate={getDate} currentStyle={currentStyle} />;
};

// --- 5. UI COMPONENTS ---

const LayoutSwitcher = ({ current, onChange, currentStyle }: { current: LayoutType, onChange: (l: LayoutType) => void, currentStyle: StyleFactory }) => (
  <div className={`flex p-1 rounded-lg border ${currentStyle.name === 'Future' ? 'border-cyan-500/30 bg-black/50' : 'border-gray-200 bg-gray-100'} inline-flex mb-6`}>
    {['grid', 'list', 'timeline'].map((l) => (
      <button 
        key={l}
        onClick={() => onChange(l as LayoutType)}
        className={`p-2 rounded-md transition-all ${current === l 
          ? (currentStyle.name === 'Future' ? 'bg-cyan-900/50 text-cyan-400 shadow-sm' : 'bg-white text-blue-600 shadow') 
          : 'text-gray-400 hover:text-gray-600'}`}
      >
        {l === 'grid' ? <LayoutGrid size={18} /> : l === 'list' ? <List size={18} /> : <Clock size={18} />}
      </button>
    ))}
  </div>
);

const ThemeControls = ({ currentStyleKey, setStyleKey, isDark, toggleDark }: { currentStyleKey: string, setStyleKey: (k: string) => void, isDark: boolean, toggleDark: () => void }) => (
  <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
    <button onClick={toggleDark} className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:scale-110 transition-transform">
      {isDark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-slate-700" />}
    </button>
    <div className="bg-white dark:bg-gray-800 p-2 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 flex flex-col gap-2">
      <div className="text-[10px] uppercase font-bold text-gray-400 text-center">Style</div>
      {Object.keys(STYLES).map(key => (
        <button key={key} onClick={() => setStyleKey(key)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${currentStyleKey === key ? 'bg-blue-600 text-white scale-110' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200'}`} title={STYLES[key].name}>
          {key === 'modern' ? <Monitor size={14} /> : key === 'minimal' ? <X size={14} /> : key === 'future' ? <Code size={14} /> : <BookOpen size={14} />}
        </button>
      ))}
    </div>
  </div>
);

// --- 6. SECTIONS (RESTORED & UPDATED) ---

const HeroSection = ({ currentStyle }: { currentStyle: StyleFactory }) => (
  <div className={`flex flex-col items-center justify-center min-h-[80vh] text-center px-4 ${currentStyle.getFontFamily()}`}>
    <div className={`w-32 h-32 rounded-full mb-8 flex items-center justify-center text-4xl font-bold animate-pulse ${currentStyle.name === 'Future' ? 'bg-cyan-900 text-cyan-400 shadow-[0_0_50px_rgba(6,182,212,0.5)]' : currentStyle.name === 'Minimal' ? 'bg-black text-white dark:bg-white dark:text-black border-4 border-double' : 'bg-gradient-to-tr from-blue-400 to-indigo-500 text-white shadow-xl'}`}>AD</div>
    <h1 className={`mb-4 ${currentStyle.name === 'Future' ? 'text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600' : 'text-5xl font-extrabold text-gray-900 dark:text-white'}`}>
      Building the <span className={currentStyle.name === 'Academic' ? 'italic text-[#8b1e3f]' : 'text-blue-600'}>Future</span>
    </h1>
    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-8 leading-relaxed">Full Stack Developer crafting scalable applications in {currentStyle.name} style.</p>
    <div className="flex space-x-4">
      <button className={currentStyle.getButtonClass('primary')}>View Projects</button>
      <button className={currentStyle.getButtonClass('secondary')}>Read Articles</button>
    </div>
  </div>
);

const UnifiedFeedSection = ({ currentStyle }: { currentStyle: StyleFactory }) => {
  const [layout, setLayout] = useState<LayoutType>('grid');
  const unifiedItems = [...MOCK_PROJECTS.map(adaptProjectToUnified), ...MOCK_BLOGS.map(adaptBlogToUnified), ...MOCK_VIDEOS.map(adaptVideoToUnified)].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const renderItem = (item: UnifiedContentItem, currentLayout: LayoutType, style: StyleFactory) => {
    const isList = currentLayout === 'list';
    return (
      <div className={`${style.getCardClass()} h-full flex ${isList ? 'flex-row items-center' : 'flex-col'}`}>
        <div className={`${isList ? 'w-48 h-32' : 'h-48'} bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 relative overflow-hidden`}>
           <span className="text-gray-400 font-medium opacity-50">{item.type.toUpperCase()}</span>
           <div className={`absolute top-2 right-2 ${style.getBadgeClass()}`}>{item.type}</div>
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center text-xs text-gray-400 mb-2 space-x-2">
            <Calendar size={12} /><span>{item.date}</span>
          </div>
          <h3 className={`text-xl font-bold mb-2 ${style.name === 'Future' ? 'text-cyan-400' : 'text-gray-900 dark:text-gray-100'}`}>{item.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 text-sm">{item.description}</p>
          <div className="flex flex-wrap gap-2 mt-auto">
            {item.meta.slice(0, 3).map((tag, i) => <span key={i} className={style.getBadgeClass()}>{tag}</span>)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`py-12 px-4 max-w-7xl mx-auto ${currentStyle.getFontFamily()}`}>
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 border-b border-gray-200 dark:border-gray-700 pb-4">
        <div><h2 className={currentStyle.getSectionTitleClass()}>Unified Feed</h2><p className="text-gray-500 mt-2">All content in <span className="font-bold">{currentStyle.name}</span> style.</p></div>
        <div className="mt-4 md:mt-0"><LayoutSwitcher current={layout} onChange={setLayout} currentStyle={currentStyle} /></div>
      </div>
      <ContentLayoutFactory layout={layout} items={unifiedItems} renderItem={renderItem} getDate={(item) => item.date} currentStyle={currentStyle} />
    </div>
  );
};

// --- RESTORED SECTIONS ---

const ProjectsSection = ({ currentStyle }: { currentStyle: StyleFactory }) => {
  const [layout, setLayout] = useState<LayoutType>('grid');

  const renderProjectItem = (project: Project, currentLayout: LayoutType, style: StyleFactory) => {
    const isList = currentLayout === 'list';
    return (
      <div className={`${style.getCardClass()} h-full flex ${isList ? 'flex-row' : 'flex-col'}`}>
        <div className={`${isList ? 'md:w-48 h-48 md:h-auto' : 'h-48'} bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0`}>
          <span className="text-gray-400 font-medium">Image</span>
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h3 className={`text-xl font-bold ${style.name === 'Future' ? 'text-cyan-400' : 'text-gray-900 dark:text-gray-100'}`}>{project.title}</h3>
            <div className="flex space-x-2">
              {project.githubUrl && <Github size={18} className="text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer" />}
              {project.liveUrl && <ExternalLink size={18} className="text-gray-400 hover:text-blue-600 cursor-pointer" />}
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 flex-1">{project.description}</p>
          <div className="flex flex-wrap gap-2 mt-auto">
            {project.techStack.map((tech) => (
              <span key={tech} className={style.getBadgeClass()}>{tech}</span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`py-12 px-4 max-w-7xl mx-auto ${currentStyle.getFontFamily()}`}>
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 border-b border-gray-200 dark:border-gray-700 pb-4">
        <div><h2 className={currentStyle.getSectionTitleClass()}>Projects</h2></div>
        <div className="mt-4 md:mt-0"><LayoutSwitcher current={layout} onChange={setLayout} currentStyle={currentStyle} /></div>
      </div>
      <ContentLayoutFactory layout={layout} items={MOCK_PROJECTS} renderItem={renderProjectItem} getDate={(item) => item.date} currentStyle={currentStyle} />
    </div>
  );
};

const ArticlesSection = ({ currentStyle }: { currentStyle: StyleFactory }) => {
  const [layout, setLayout] = useState<LayoutType>('list');

  const renderArticleItem = (article: Article, currentLayout: LayoutType, style: StyleFactory) => {
    return (
      <div className={`${style.getCardClass()} p-6`}>
        <div className="flex items-center text-sm text-gray-500 mb-2 space-x-2">
          <Calendar size={14} /><span>{article.publishedAt}</span><span>•</span><span>{article.readTime}</span>
        </div>
        <h3 className={`text-2xl font-bold mb-2 ${style.name === 'Future' ? 'text-cyan-400' : 'text-gray-900 dark:text-gray-100'}`}>{article.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{article.excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">{article.tags.map(tag => <span key={tag} className={style.getBadgeClass()}>{tag}</span>)}</div>
          <span className={`${style.name === 'Future' ? 'text-cyan-500' : 'text-blue-600'} font-medium text-sm flex items-center`}>Read more <ChevronRight size={16} /></span>
        </div>
      </div>
    );
  };

  return (
    <div className={`py-12 px-4 max-w-7xl mx-auto ${currentStyle.getFontFamily()}`}>
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 border-b border-gray-200 dark:border-gray-700 pb-4">
        <div><h2 className={currentStyle.getSectionTitleClass()}>Articles</h2></div>
        <div className="mt-4 md:mt-0"><LayoutSwitcher current={layout} onChange={setLayout} currentStyle={currentStyle} /></div>
      </div>
      <div className={layout === 'list' ? 'max-w-4xl mx-auto' : ''}>
        <ContentLayoutFactory layout={layout} items={MOCK_ARTICLES} renderItem={renderArticleItem} getDate={(item) => item.publishedAt} currentStyle={currentStyle} />
      </div>
    </div>
  );
};

const BlogSection = ({ currentStyle }: { currentStyle: StyleFactory }) => {
  const [layout, setLayout] = useState<LayoutType>('grid');

  const renderBlogItem = (blog: Blog, currentLayout: LayoutType, style: StyleFactory) => {
    return (
      <div className={`${style.getCardClass()} p-6 h-full`}>
        <div className="mb-4"><span className={style.getBadgeClass()}>{blog.category}</span></div>
        <h3 className={`text-xl font-bold mb-2 ${style.name === 'Future' ? 'text-cyan-400' : 'text-gray-800 dark:text-gray-100'}`}>{blog.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{blog.summary}</p>
        <span className="text-xs text-gray-400">{blog.date}</span>
      </div>
    );
  };

  return (
    <div className={`py-12 px-4 max-w-7xl mx-auto ${currentStyle.getFontFamily()}`}>
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 border-b border-gray-200 dark:border-gray-700 pb-4">
        <div><h2 className={currentStyle.getSectionTitleClass()}>Blog</h2></div>
        <div className="mt-4 md:mt-0"><LayoutSwitcher current={layout} onChange={setLayout} currentStyle={currentStyle} /></div>
      </div>
      <ContentLayoutFactory layout={layout} items={MOCK_BLOGS} renderItem={renderBlogItem} getDate={(item) => item.date} currentStyle={currentStyle} />
    </div>
  );
};

const DocsSection = ({ currentStyle }: { currentStyle: StyleFactory }) => {
  const [activeDoc, setActiveDoc] = useState(MOCK_DOCS[0]);
  const sections = Array.from(new Set(MOCK_DOCS.map(d => d.section)));

  return (
    <div className={`flex flex-col md:flex-row max-w-7xl mx-auto pt-8 min-h-[80vh] px-4 ${currentStyle.getFontFamily()}`}>
      <div className="w-full md:w-64 flex-shrink-0 mb-8 md:mb-0 md:border-r border-gray-200 dark:border-gray-700 md:pr-4">
        <h3 className={`text-lg font-bold mb-4 ${currentStyle.name === 'Future' ? 'text-cyan-400' : 'text-gray-900 dark:text-gray-100'}`}>Documentation</h3>
        {sections.map(section => (
          <div key={section} className="mb-6">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{section}</h4>
            <ul className="space-y-1">
              {MOCK_DOCS.filter(d => d.section === section).map(doc => (
                <li key={doc.id}>
                  <button onClick={() => setActiveDoc(doc)} className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${activeDoc.id === doc.id ? (currentStyle.name === 'Future' ? 'bg-cyan-900/50 text-cyan-400' : 'bg-blue-50 text-blue-700 dark:bg-gray-800 dark:text-blue-300') : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                    {doc.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex-1 md:pl-12">
        <div className="prose dark:prose-invert max-w-none">
          <h1 className={currentStyle.getSectionTitleClass()}>{activeDoc.title}</h1>
          <div className={`p-4 mb-6 border-l-4 ${currentStyle.name === 'Future' ? 'bg-cyan-950/30 border-cyan-500 text-cyan-200' : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400 text-yellow-800 dark:text-yellow-200'}`}>
            <p className="text-sm">Last updated on {activeDoc.lastUpdated}</p>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{activeDoc.content}</p>
        </div>
      </div>
    </div>
  );
};

const ResumeSection = ({ currentStyle }: { currentStyle: StyleFactory }) => (
  <div className={`py-12 px-4 max-w-4xl mx-auto ${currentStyle.getFontFamily()}`}>
    <div className={`${currentStyle.getCardClass()} p-8 print:shadow-none print:border-none`}>
      <div className="border-b border-gray-200 dark:border-gray-700 pb-8 mb-8 flex justify-between items-start">
        <div>
          <h1 className={`text-4xl font-bold mb-2 ${currentStyle.name === 'Future' ? 'text-cyan-400' : 'text-gray-900 dark:text-white'}`}>{MOCK_RESUME.name}</h1>
          <h2 className={`text-xl font-medium mb-4 ${currentStyle.name === 'Future' ? 'text-purple-400' : 'text-blue-600 dark:text-blue-400'}`}>{MOCK_RESUME.title}</h2>
          <div className="flex flex-col sm:flex-row gap-4 text-gray-500 text-sm"><span>{MOCK_RESUME.contact.location}</span><span>{MOCK_RESUME.contact.email}</span></div>
        </div>
        <button className={currentStyle.getButtonClass('secondary')}><FileText size={16} /> PDF</button>
      </div>

      <div className="mb-8">
        <h3 className={`text-lg font-bold uppercase tracking-wide mb-4 border-b pb-2 ${currentStyle.name === 'Future' ? 'text-cyan-400 border-cyan-900' : 'text-gray-900 dark:text-white border-gray-100 dark:border-gray-700'}`}>Summary</h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{MOCK_RESUME.summary}</p>
      </div>

      <div className="mb-8">
        <h3 className={`text-lg font-bold uppercase tracking-wide mb-4 border-b pb-2 ${currentStyle.name === 'Future' ? 'text-cyan-400 border-cyan-900' : 'text-gray-900 dark:text-white border-gray-100 dark:border-gray-700'}`}>Experience</h3>
        <div className="space-y-8">
          {MOCK_RESUME.experience.map(exp => (
            <div key={exp.id}>
              <div className="flex justify-between items-baseline mb-2">
                <h4 className="text-xl font-bold text-gray-800 dark:text-gray-200">{exp.role}</h4>
                <span className="text-sm text-gray-500 font-medium">{exp.period}</span>
              </div>
              <div className={`${currentStyle.name === 'Future' ? 'text-purple-400' : 'text-blue-600 dark:text-blue-400'} font-medium mb-3`}>{exp.company}</div>
              <ul className="list-disc list-outside ml-5 space-y-1 text-gray-600 dark:text-gray-400">
                {exp.description.map((desc, i) => <li key={i}>{desc}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className={`text-lg font-bold uppercase tracking-wide mb-4 border-b pb-2 ${currentStyle.name === 'Future' ? 'text-cyan-400 border-cyan-900' : 'text-gray-900 dark:text-white border-gray-100 dark:border-gray-700'}`}>Skills</h3>
        <div className="flex flex-wrap gap-2">
          {MOCK_RESUME.skills.map(skill => <span key={skill} className={currentStyle.getBadgeClass()}>{skill}</span>)}
        </div>
      </div>
    </div>
  </div>
);

// --- 7. MAIN APP COMPONENT ---

export default function PersonalWebsite() {
  const [activeTab, setActiveTab] = useState('home');
  const [styleKey, setStyleKey] = useState('modern');
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const currentStyle = STYLES[styleKey];

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HeroSection currentStyle={currentStyle} />;
      case 'feed': return <UnifiedFeedSection currentStyle={currentStyle} />;
      case 'projects': return <ProjectsSection currentStyle={currentStyle} />;
      case 'articles': return <ArticlesSection currentStyle={currentStyle} />;
      case 'blog': return <BlogSection currentStyle={currentStyle} />;
      case 'docs': return <DocsSection currentStyle={currentStyle} />;
      case 'resume': return <ResumeSection currentStyle={currentStyle} />;
      default: return <HeroSection currentStyle={currentStyle} />;
    }
  };

  const navItems = [
    { name: 'Home', id: 'home', icon: <User size={18} /> },
    { name: 'Feed', id: 'feed', icon: <Rss size={18} /> },
    { name: 'Projects', id: 'projects', icon: <Code size={18} /> },
    { name: 'Articles', id: 'articles', icon: <BookOpen size={18} /> },
    { name: 'Blog', id: 'blog', icon: <FileText size={18} /> },
    { name: 'Docs', id: 'docs', icon: <FileText size={18} /> },
    { name: 'Resume', id: 'resume', icon: <Briefcase size={18} /> },
  ];

  return (
    <div className={currentStyle.getMainLayoutClass()}>
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

      <ThemeControls currentStyleKey={styleKey} setStyleKey={setStyleKey} isDark={isDark} toggleDark={() => setIsDark(!isDark)} />
    </div>
  );
}