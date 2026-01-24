/**
 * CREATIONAL PATTERNS - USAGE EXAMPLES
 * 
 * ไฟล์นี้แสดง real-world usage ของ creational patterns
 * โดยจำลองการใช้งานจริงในแอปพลิเคชัน
 */

import {
  NotificationService,
  ToastChannel,
  ConsoleChannel,
  AlertChannel,
} from './01_singleton_notifications';

import {
  CommandHistory,
  NavigateCommand,
  ToggleThemeCommand,
  SwitchStyleCommand,
} from './02_singleton_command_history';

import {
  LOCALES,
  LocalizationFactory,
} from './03_factory_method_localization';

import {
  STYLES,
  StyleFactory,
} from './04_abstract_factory_styles';

import {
  ContentBuilder,
  UnifiedContentItem,
} from './05_builder_content_tree';

import {
  ProjectTemplateRegistry,
} from './06_prototype_project_templates';

// ====================================
// EXAMPLE 1: Notification System Usage
// ====================================

/**
 * ตัวอย่าง: ใช้ Singleton Notifications ในแอปพลิเคชัน
 */
export function example1_NotificationsInApp() {
  console.log('\n========================================');
  console.log('EXAMPLE 1: Notification System');
  console.log('========================================\n');

  // ได้ singleton instance เดียวกันเสมอ
  const notify = NotificationService.getInstance();

  // Scenario: User performs action
  console.log('--- Scenario: User Uploads File ---');
  notify.notify('File uploading...', 'INFO');

  // Switch to console channel (for development)
  console.log('\n--- Dev Mode: Switch to Console ---');
  notify.setChannel(new ConsoleChannel());
  notify.notify('Switched to console for debugging', 'SUCCESS');

  // Switch back to toast for production
  console.log('\n--- Prod Mode: Switch to Toast ---');
  notify.setChannel(new ToastChannel());
  notify.notify('File uploaded successfully!', 'SUCCESS');

  // Error handling
  console.log('\n--- Error Case: Switch to Alert ---');
  notify.setChannel(new AlertChannel());
  notify.notify('Connection failed', 'ERROR');

  console.log('\n✓ Same notification instance used throughout\n');
}

// ====================================
// EXAMPLE 2: Command History & Undo
// ====================================

/**
 * ตัวอย่าง: ใช้ Command + History สำหรับ Undo/Redo
 */
export function example2_CommandHistoryUndoRedo() {
  console.log('\n========================================');
  console.log('EXAMPLE 2: Command History & Undo/Redo');
  console.log('========================================\n');

  const history = CommandHistory.getInstance();
  const notify = NotificationService.getInstance();
  notify.setChannel(new ConsoleChannel());

  // Simulate application state
  let currentTab = 'home';
  let isDarkMode = false;
  let currentStyle = 'modern';

  // Create commands
  const goToProjects = new NavigateCommand(
    'nav-projects',
    'Go to Projects',
    'projects',
    (tab) => { currentTab = tab; console.log(`✓ Navigated to: ${tab}`); },
    () => currentTab
  );

  const toggleDark = new ToggleThemeCommand(
    () => { isDarkMode = !isDarkMode; console.log(`✓ Dark mode: ${isDarkMode}`); }
  );

const switchToFuture = new SwitchStyleCommand(
    'style-future',
    'Switch to Future Style',
    '▌ Future Icon',
    (style: string) => { currentStyle = style; console.log(`✓ Style: ${style}`); },
    () => 'future'
);

  // Execute commands
  console.log('--- Executing Commands (Building History) ---');
  goToProjects.execute();
  toggleDark.execute();
  switchToFuture.execute();

  console.log(`\nHistory size: ${history.size()}`);
  console.log(`Current state: tab=${currentTab}, dark=${isDarkMode}, style=${currentStyle}`);

  // Undo last 2 commands
  console.log('\n--- Undo 2 Commands ---');
  for (let i = 0; i < 2; i++) {
    const cmd = history.pop();
    if (cmd) {
      cmd.undo();
    }
  }

  console.log(`After undo: tab=${currentTab}, dark=${isDarkMode}, style=${currentStyle}`);
  console.log(`History size: ${history.size()}`);

  console.log('\n✓ Complete undo/redo history maintained\n');
}

// ====================================
// EXAMPLE 3: Localization Factory
// ====================================

/**
 * ตัวอย่าง: ใช้ Factory สำหรับสลับภาษา
 */
export function example3_LocalizationSwitching() {
  console.log('\n========================================');
  console.log('EXAMPLE 3: Localization Factory');
  console.log('========================================\n');

  // Scenario: App supports multiple languages
  const supportedLanguages = ['en', 'th'];

  supportedLanguages.forEach(langCode => {
    console.log(`\n--- Language: ${langCode.toUpperCase()} ---`);

    const factory = LOCALES[langCode];
    const labels = factory.getLabels();

    // Display header
    console.log(`Title: ${labels.hero.titlePrefix} ${labels.hero.titleHighlight}`);
    console.log(`Description: ${labels.hero.description}`);

    // Display navigation
    console.log(`Navigation:`);
    console.log(`  • ${labels.nav.home}`);
    console.log(`  • ${labels.nav.projects}`);
    console.log(`  • ${labels.nav.articles}`);
    console.log(`  • ${labels.nav.contact}`);

    // Display section titles
    console.log(`Sections:`);
    console.log(`  • ${labels.sections.feed} - ${labels.sections.feedDesc}`);
    console.log(`  • ${labels.sections.projects} - ${labels.sections.projectsDesc}`);
  });

  // Scenario: Dynamically switch language
  console.log('\n--- Dynamic Language Switch (Runtime) ---');
  let currentLangCode = 'en';
  console.log(`Current language: ${currentLangCode}`);

  // User clicks language switcher
  currentLangCode = 'th';
  const newLabels = LOCALES[currentLangCode].getLabels();
  console.log(`Switched to: ${currentLangCode}`);
  console.log(`Now showing: ${newLabels.nav.home} (was "Home")`);

  console.log('\n✓ Easy language switching without code changes\n');
}

// ====================================
// EXAMPLE 4: Style Factory (Abstract Factory)
// ====================================

/**
 * ตัวอย่าง: ใช้ Abstract Factory สำหรับสลับ Theme
 */
export function example4_StyleThemeSwitching() {
  console.log('\n========================================');
  console.log('EXAMPLE 4: Style Factory (Themes)');
  console.log('========================================\n');

  const notify = NotificationService.getInstance();
  notify.setChannel(new ConsoleChannel());

  // Available themes
  const themes = ['modern', 'minimal', 'future', 'academic'];

  console.log('--- Available Themes ---');
  themes.forEach(themeName => {
    const factory = STYLES[themeName];
    console.log(`✓ ${factory.name} - ${themeName}`);
  });

  // Scenario: User selects Modern theme
  console.log('\n--- User Selects Modern Theme ---');
  let currentTheme = 'modern';
  const modernFactory = STYLES[currentTheme];

  console.log(`Active Theme: ${modernFactory.name}`);
  console.log(`Main layout class: ${modernFactory.getMainLayoutClass().substring(0, 40)}...`);
  console.log(`Card style: ${modernFactory.getCardClass().substring(0, 40)}...`);
  console.log(`Button (primary): ${modernFactory.getButtonClass('primary').substring(0, 40)}...`);
  console.log(`Toast style: ${modernFactory.getToastClass('SUCCESS').substring(0, 40)}...`);

  // Scenario: User switches to Future theme
  console.log('\n--- User Switches to Future Theme ---');
  currentTheme = 'future';
  const futureFactory = STYLES[currentTheme];

  console.log(`Active Theme: ${futureFactory.name}`);
  console.log(`Main layout: ${futureFactory.getMainLayoutClass().substring(0, 40)}...`);
  console.log(`Card style: ${futureFactory.getCardClass().substring(0, 40)}...`);
  console.log(`Section title: ${futureFactory.getSectionTitleClass().substring(0, 40)}...`);

  // Scenario: Theme switching in UI component
  console.log('\n--- Real UI Usage ---');
  function renderButton(themeName: string) {
    const factory = STYLES[themeName];
    const btnClass = factory.getButtonClass('primary');
    return `<button class="${btnClass}">Click Me</button>`;
  }

  console.log(`Modern Button: ${renderButton('modern').substring(0, 50)}...`);
  console.log(`Future Button: ${renderButton('future').substring(0, 50)}...`);
  console.log(`Academic Button: ${renderButton('academic').substring(0, 50)}...`);

  console.log('\n✓ Entire theme family switched at once\n');
}

// ====================================
// EXAMPLE 5: Content Builder
// ====================================

/**
 * ตัวอย่าง: ใช้ Builder สำหรับสร้าง hierarchical content
 */
export function example5_BuildingContentTree() {
  console.log('\n========================================');
  console.log('EXAMPLE 5: Content Builder');
  console.log('========================================\n');

  // Sample data
  const sampleProjects = [
    {
      id: 'p1',
      type: 'project' as const,
      title: 'E-Commerce App',
      description: 'Full stack e-commerce',
      date: '2023-08-15',
      meta: ['Next.js', 'Stripe'],
    },
    {
      id: 'p2',
      type: 'project' as const,
      title: 'Dashboard',
      description: 'Admin panel',
      date: '2023-09-01',
      meta: ['React', 'Tailwind'],
    },
    {
      id: 'p3',
      type: 'project' as const,
      title: 'Mobile App',
      description: 'React Native',
      date: '2023-09-15',
      meta: ['React Native'],
    },
  ];

  // Build complex hierarchy using Builder
  console.log('--- Building Project Hierarchy ---');
  const projectTree = new ContentBuilder('root', 'column', 'My Projects')
    // First group
    .addContainer('ecommerce-group', 'grid', 'E-Commerce Platform', sampleProjects[0])
    .addItem(sampleProjects[1]) // Dashboard under E-Commerce
    .addItem({
      ...sampleProjects[2],
      id: 'sub1',
      title: 'Customer App'
    })
    .up() // Back to root
    // Second group
    .addContainer('tools-group', 'list', 'Developer Tools')
    .addItem({
      ...sampleProjects[1],
      id: 'tool1',
      title: 'VS Code Extension'
    })
    .addItem({
      ...sampleProjects[1],
      id: 'tool2',
      title: 'CLI Tool'
    })
    .up() // Back to root
    .build();

  // Display structure
  console.log(`\nRoot: ${projectTree.title}`);
  console.log(`Children: ${projectTree.children.length}`);

  projectTree.children.forEach((child, i) => {
    if (child.type === 'container') {
      const container = child as { title: string; layoutStyle: string; children: { type: string; data: { title: string } }[] };
      console.log(`\n  [${i + 1}] ${container.title} (${container.layoutStyle})`);
      container.children.forEach((subchild) => {
        if (subchild.type === 'item') {
          console.log(`       └─ ${subchild.data.title}`);
        }
      });
    }
  });

  console.log('\n✓ Complex hierarchical structure built easily\n');
}

// ====================================
// EXAMPLE 6: Prototype Cloning
// ====================================

/**
 * ตัวอย่าง: ใช้ Prototype สำหรับ clone templates
 */
export function example6_PrototypeCloning() {
  console.log('\n========================================');
  console.log('EXAMPLE 6: Prototype Template Cloning');
  console.log('========================================\n');

  const notify = NotificationService.getInstance();
  notify.setChannel(new ConsoleChannel());

  const registry = new ProjectTemplateRegistry();

  // Register templates
  const ecommerceTemplate: UnifiedContentItem = {
    id: 'ecommerce',
    type: 'project',
    title: 'E-Commerce Starter Kit',
    description: 'Production-ready e-commerce',
    date: '2023-01-01',
    meta: ['Next.js', 'Stripe', 'PostgreSQL'],
  };

  registry.register('E-Commerce', ecommerceTemplate);

  console.log('--- Admin Clones Project Template ---');
  const template = registry.get('E-Commerce');
  if (template) {
    // Clone 1
    const clone1 = template.clone();
    console.log(`\nClone 1: ${clone1.title}`);
    console.log(`  ID: ${clone1.id}`);
    console.log(`  Date: ${clone1.date}`);
    console.log(`  Decorations: ${clone1.decorations?.join(', ')}`);

    // Clone 2 (different time)
    const clone2 = template.clone();
    console.log(`\nClone 2: ${clone2.title}`);
    console.log(`  ID: ${clone2.id}`);
    console.log(`  Date: ${clone2.date}`);

    // Clones are independent
    console.log('\n--- Clones are Independent ---');
    clone1.description = 'Modified for Restaurant';
    clone2.description = 'Modified for Marketplace';

    console.log(`Original: "${ecommerceTemplate.description}"`);
    console.log(`Clone 1: "${clone1.description}"`);
    console.log(`Clone 2: "${clone2.description}"`);

    console.log('\n✓ Clones created fast and independent from original\n');
  }
}

// ====================================
// COMBINED EXAMPLE: Full App Flow
// ====================================

/**
 * ตัวอย่าง: ใช้ multiple patterns together
 */
export function exampleCombined_FullAppFlow() {
  console.log('\n========================================');
  console.log('COMBINED EXAMPLE: Full App Flow');
  console.log('========================================\n');

  const notify = NotificationService.getInstance();
  notify.setChannel(new ConsoleChannel());

  // Initialize app
  console.log('--- App Initialization ---');
  notify.notify('Initializing app...', 'INFO');

  // Set language (Factory Method)
  const langFactory = LOCALES['en'];
  const labels = langFactory.getLabels();
  console.log(`Language: ${langFactory.code}`);

  // Set theme (Abstract Factory)
  const styleFactory = STYLES['modern'];
  console.log(`Theme: ${styleFactory.name}`);

  // Build content (Builder)
  console.log('\n--- Building Content ---');
  const contentTree = new ContentBuilder('app', 'column', 'My Portfolio')
    .addContainer('projects', 'grid', labels.sections.projects)
    .addItem({
      id: '1',
      type: 'project',
      title: 'Project 1',
      description: 'My first project',
      date: '2023-01-01',
      meta: ['React'],
    })
    .up()
    .addContainer('articles', 'list', labels.sections.articles)
    .addItem({
      id: 'a1',
      type: 'article',
      title: 'Article 1',
      description: 'Tech article',
      date: '2023-02-01',
      meta: ['TypeScript'],
    })
    .up()
    .build();

  console.log(`Content tree built: ${contentTree.children.length} sections`);

  // Create templates (Prototype)
  const registry = new ProjectTemplateRegistry();

  // Perform actions (Command)
  const history = CommandHistory.getInstance();

  console.log('\n--- User Actions ---');
  notify.notify('✓ App ready!', 'SUCCESS');
  console.log(`Notifications: ${notify.getChannelName()}`);
  console.log(`Content sections: ${contentTree.children.length}`);

  console.log('\n✓ All patterns working together!\n');
}

// ====================================
// RUN ALL EXAMPLES
// ====================================

export function runAllExamples() {
  example1_NotificationsInApp();
  example2_CommandHistoryUndoRedo();
  example3_LocalizationSwitching();
  example4_StyleThemeSwitching();
  example5_BuildingContentTree();
  example6_PrototypeCloning();
  exampleCombined_FullAppFlow();

  console.log('════════════════════════════════════════');
  console.log('✓ All examples completed!');
  console.log('════════════════════════════════════════\n');
}
