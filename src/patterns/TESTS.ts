/**
 * CREATIONAL PATTERNS - INTEGRATION TESTS
 * 
 * Using Bun's built-in test runner
 * Run with: bun test src/patterns/TESTS.ts
 */

import { describe, it, expect, beforeEach } from 'bun:test';

import {
  NotificationService,
  ToastEventEmitter,
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
  EnglishLocalization,
  ThaiLocalization,
} from './03_factory_method_localization';

import {
  STYLES,
  ModernStyle,
  MinimalStyle,
  FutureStyle,
  AcademicStyle,
} from './04_abstract_factory_styles';

import {
  ContentBuilder,
  CompositeNode,
  LeafNode,
} from './05_builder_content_tree';

import {
  ProjectTemplate,
  ProjectTemplateRegistry,
} from './06_prototype_project_templates';

// ====================================
// TEST SUITE 1: SINGLETON NOTIFICATIONS
// ====================================

describe('Singleton Pattern - Notifications', () => {
  let notify: NotificationService;

  beforeEach(() => {
    notify = NotificationService.getInstance();
    notify.setChannel(new ToastChannel());
  });

  it('should return the same instance on multiple calls', () => {
    const notify1 = NotificationService.getInstance();
    const notify2 = NotificationService.getInstance();
    expect(notify1).toBe(notify2);
  });

  it('should switch notification channels', () => {
    notify.setChannel(new ConsoleChannel());
    expect(notify.getChannelName()).toBe('ConsoleChannel');

    notify.setChannel(new AlertChannel());
    expect(notify.getChannelName()).toBe('AlertChannel');
  });

  it('should emit notifications to observers', () => {
    const emitter = ToastEventEmitter.getInstance();
    let receivedEvent: { message: string; type: string; id: number } | null = null;

    const unsubscribe = emitter.subscribe((event) => {
      receivedEvent = event;
    });

    emitter.emit('Test message', 'INFO');

    expect(receivedEvent).not.toBeNull();
    if (receivedEvent !== null) {
      expect((receivedEvent as { message: string; type: string; id: number }).message).toBe('Test message');
      expect((receivedEvent as { message: string; type: string; id: number }).type).toBe('INFO');
    }

    unsubscribe();
  });

  it('should generate unique IDs for events', () => {
    const emitter = ToastEventEmitter.getInstance();
    const ids: number[] = [];

    emitter.subscribe((event) => {
      ids.push(event.id);
    });

    emitter.emit('First', 'INFO');
    emitter.emit('Second', 'SUCCESS');
    emitter.emit('Third', 'WARNING');

    expect(ids.length).toBe(3);
    expect(ids[0]).not.toBe(ids[1]);
    expect(ids[1]).not.toBe(ids[2]);
  });

  it('should allow observer unsubscription', () => {
    const emitter = ToastEventEmitter.getInstance();
    let callCount = 0;

    const unsubscribe = emitter.subscribe(() => {
      callCount++;
    });

    emitter.emit('Message 1', 'INFO');
    expect(callCount).toBe(1);

    unsubscribe();

    emitter.emit('Message 2', 'INFO');
    expect(callCount).toBe(1); // Should not increment after unsubscribe
  });
});

// ====================================
// TEST SUITE 2: SINGLETON COMMAND HISTORY
// ====================================

describe('Singleton Pattern - Command History', () => {
  let history: CommandHistory;
  let appState: { tab: string; isDark: boolean; style: string };

  beforeEach(() => {
    history = CommandHistory.getInstance();
    history.clear();
    appState = { tab: 'home', isDark: false, style: 'modern' };
  });

  it('should return the same instance on multiple calls', () => {
    const h1 = CommandHistory.getInstance();
    const h2 = CommandHistory.getInstance();
    expect(h1).toBe(h2);
  });

  it('should add commands to history', () => {
    const cmd = new NavigateCommand(
      'nav-1',
      'Go Home',
      'home',
      (tab) => { appState.tab = tab; },
      () => appState.tab
    );

    expect(history.isEmpty()).toBe(true);
    cmd.execute();
    expect(history.isEmpty()).toBe(false);
    expect(history.size()).toBe(1);
  });

  it('should pop and undo commands', () => {
    const cmd = new NavigateCommand(
      'nav-1',
      'Go Projects',
      'projects',
      (tab) => { appState.tab = tab; },
      () => appState.tab
    );

    cmd.execute();
    expect(appState.tab).toBe('projects');

    const popped = history.pop();
    expect(popped).toBe(cmd);
    popped?.undo();
    expect(appState.tab).toBe('home');
  });

  it('should maintain max history size', () => {
    // Add 25 commands (max is 20)
    for (let i = 0; i < 25; i++) {
      const cmd = new ToggleThemeCommand(() => {
        appState.isDark = !appState.isDark;
      });
      cmd.execute();
    }

    expect(history.size()).toBe(20); // Should keep only last 20
  });

  it('should execute and undo toggle commands', () => {
    const toggleCmd = new ToggleThemeCommand(() => {
      appState.isDark = !appState.isDark;
    });

    expect(appState.isDark).toBe(false);
    toggleCmd.execute();
    expect(appState.isDark).toBe(true);

    history.pop()?.undo();
    expect(appState.isDark).toBe(false);
  });

  it('should match commands by query', () => {
    const toggleCmd = new ToggleThemeCommand(() => {});
    const switchCmd = new SwitchStyleCommand(
      'style-future',
      'Switch to Future',
      'future',
      () => {},
      () => 'modern'
    );

    expect(toggleCmd.matches('dark')).toBe(true);
    expect(toggleCmd.matches('mode')).toBe(true);
    expect(toggleCmd.matches('random')).toBe(false);

    expect(switchCmd.matches('future')).toBe(true);
    expect(switchCmd.matches('style')).toBe(true);
  });
});

// ====================================
// TEST SUITE 3: FACTORY METHOD LOCALIZATION
// ====================================

describe('Factory Method Pattern - Localization', () => {
  it('should return English labels', () => {
    const factory = LOCALES['en'];
    expect(factory.code).toBe('EN');

    const labels = factory.getLabels();
    expect(labels.nav.home).toBe('Home');
    expect(labels.nav.feed).toBe('Feed');
    expect(labels.nav.projects).toBe('Projects');
  });

  it('should return Thai labels', () => {
    const factory = LOCALES['th'];
    expect(factory.code).toBe('TH');

    const labels = factory.getLabels();
    expect(labels.nav.home).toBe('หน้าหลัก');
    expect(labels.nav.feed).toBe('ฟีดรวม');
    expect(labels.nav.projects).toBe('โปรเจกต์');
  });

  it('should have all required label sections', () => {
    const factory = EnglishLocalization;
    const labels = factory.getLabels();

    expect(labels.nav).toBeDefined();
    expect(labels.hero).toBeDefined();
    expect(labels.sections).toBeDefined();
    expect(labels.actions).toBeDefined();
  });

  it('should have matching structure in all languages', () => {
    const enLabels = LOCALES['en'].getLabels();
    const thLabels = LOCALES['th'].getLabels();

    // Both should have same structure
    expect(Object.keys(enLabels.nav)).toEqual(Object.keys(thLabels.nav));
    expect(Object.keys(enLabels.sections)).toEqual(Object.keys(thLabels.sections));
  });

  it('should switch languages dynamically', () => {
    let currentLang = 'en';
    const labels1 = LOCALES[currentLang].getLabels();
    expect(labels1.nav.home).toBe('Home');

    currentLang = 'th';
    const labels2 = LOCALES[currentLang].getLabels();
    expect(labels2.nav.home).toBe('หน้าหลัก');
  });
});

// ====================================
// TEST SUITE 4: ABSTRACT FACTORY STYLES
// ====================================

describe('Abstract Factory Pattern - Styles', () => {
  it('should have all required style methods', () => {
    const factory = ModernStyle;

    expect(typeof factory.getMainLayoutClass).toBe('function');
    expect(typeof factory.getCardClass).toBe('function');
    expect(typeof factory.getButtonClass).toBe('function');
    expect(typeof factory.getNavbarClass).toBe('function');
    expect(typeof factory.getBadgeClass).toBe('function');
    expect(typeof factory.getSectionTitleClass).toBe('function');
  });

  it('should return different styles for different variants', () => {
    const factory = ModernStyle;

    const primary = factory.getButtonClass('primary');
    const secondary = factory.getButtonClass('secondary');
    const text = factory.getButtonClass('text');

    expect(primary).not.toBe(secondary);
    expect(secondary).not.toBe(text);
    expect(primary.includes('primary')).toBe(false); // Check different content
  });

  it('should have all 4 style themes', () => {
    expect(STYLES['modern']).toBeDefined();
    expect(STYLES['minimal']).toBeDefined();
    expect(STYLES['future']).toBeDefined();
    expect(STYLES['academic']).toBeDefined();
  });

  it('should switch themes completely', () => {
    const modern = STYLES['modern'];
    const future = STYLES['future'];

    expect(modern.name).toBe('Modern');
    expect(future.name).toBe('Future');

    // Styles should be different
    expect(modern.getMainLayoutClass()).not.toBe(future.getMainLayoutClass());
    expect(modern.getCardClass()).not.toBe(future.getCardClass());
  });

  it('should generate valid CSS class strings', () => {
    const factory = MinimalStyle;
    const btnClass = factory.getButtonClass('primary');

    expect(btnClass).toContain('px-');
    expect(btnClass).toContain('py-');
    expect(btnClass).toContain('bg-');
  });
});

// ====================================
// TEST SUITE 5: BUILDER PATTERN
// ====================================

describe('Builder Pattern - Content Tree', () => {
  it('should build a simple tree', () => {
    const tree = new ContentBuilder('root', 'column', 'Root')
      .addItem({
        id: '1',
        type: 'project',
        title: 'Project 1',
        description: 'desc',
        date: '2023-01-01',
        meta: [],
      })
      .build();

    expect(tree.id).toBe('root');
    expect(tree.type).toBe('container');
    expect(tree.children.length).toBe(1);
  });

  it('should build nested containers', () => {
    const tree = new ContentBuilder('root', 'column', 'Root')
      .addContainer('child1', 'grid', 'Child 1')
      .addItem({
        id: '1',
        type: 'article',
        title: 'Item 1',
        description: 'desc',
        date: '2023-01-01',
        meta: [],
      })
      .up()
      .build();

    expect(tree.children.length).toBe(1);
    const child = tree.children[0] as CompositeNode;
    expect(child.type).toBe('container');
    expect(child.children.length).toBe(1);
  });

  it('should support method chaining', () => {
    const tree = new ContentBuilder('root', 'column')
      .addContainer('c1', 'grid')
      .addItem({ id: '1', type: 'project', title: 'P1', description: '', date: '', meta: [] })
      .addItem({ id: '2', type: 'blog', title: 'B1', description: '', date: '', meta: [] })
      .up()
      .addContainer('c2', 'list')
      .addItem({ id: '3', type: 'article', title: 'A1', description: '', date: '', meta: [] })
      .up()
      .build();

    expect(tree.children.length).toBe(2);
  });

  it('should maintain correct hierarchy with up() navigation', () => {
    const tree = new ContentBuilder('root', 'column', 'Root')
      .addContainer('parent', 'grid', 'Parent')
      .addContainer('nested', 'list', 'Nested') // 2 levels deep
      .addItem({ id: '1', type: 'project', title: 'Deep Item', description: '', date: '', meta: [] })
      .up() // Go back to parent
      .up() // Go back to root
      .addContainer('sibling', 'grid', 'Sibling') // At root level
      .addItem({ id: '2', type: 'blog', title: 'Sibling Item', description: '', date: '', meta: [] })
      .up()
      .build();

    expect(tree.children.length).toBe(2); // parent and sibling
    const parent = tree.children[0] as CompositeNode;
    expect(parent.children.length).toBe(1); // nested container
  });

  it('should create leaf nodes correctly', () => {
    const item = {
      id: 'item1',
      type: 'project' as const,
      title: 'My Project',
      description: 'A test project',
      date: '2023-01-01',
      meta: ['React', 'TypeScript'],
    };

    const tree = new ContentBuilder('root', 'column')
      .addItem(item)
      .build();

    const leaf = tree.children[0] as LeafNode;
    expect(leaf.type).toBe('item');
    expect(leaf.data.title).toBe('My Project');
    expect(leaf.data.meta.length).toBe(2);
  });
});

// ====================================
// TEST SUITE 6: PROTOTYPE PATTERN
// ====================================

describe('Prototype Pattern - Project Templates', () => {
  let registry: ProjectTemplateRegistry;

  beforeEach(() => {
    registry = new ProjectTemplateRegistry();
  });

  it('should register templates', () => {
    const item = {
      id: 'p1',
      type: 'project' as const,
      title: 'Test Project',
      description: 'Test',
      date: '2023-01-01',
      meta: ['React'],
    };

    registry.register('Test Template', item);
    expect(registry.has('Test Template')).toBe(true);
    expect(registry.size()).toBe(1);
  });

  it('should clone templates with new IDs', () => {
    const item = {
      id: 'original-id',
      type: 'project' as const,
      title: 'Original Title',
      description: 'Original',
      date: '2023-01-01',
      meta: [],
    };

    registry.register('Template', item);
    const template = registry.get('Template');
    const clone = template!.clone();

    expect(clone.id).not.toBe(item.id);
    expect(clone.id).toContain('proj-copy');
    expect(clone.title).toContain('(Clone)');
  });

  it('should add new decoration to clones', () => {
    const item = {
      id: 'p1',
      type: 'project' as const,
      title: 'Project',
      description: 'Test',
      date: '2023-01-01',
      meta: [],
      decorations: ['featured' as const],
    };

    registry.register('Template', item);
    const clone = registry.get('Template')!.clone();

    expect(clone.decorations).toContain('new');
  });

  it('should create independent clones', () => {
    const item = {
      id: 'p1',
      type: 'project' as const,
      title: 'Project',
      description: 'Original',
      date: '2023-01-01',
      meta: ['React'],
    };

    registry.register('Template', item);
    const template = registry.get('Template')!;

    const clone1 = template.clone();
    const clone2 = template.clone();

    // Clones should have different IDs (timestamps)
    expect(clone1.id).not.toBe(clone2.id);

    // Modifying one shouldn't affect the other
    clone1.description = 'Modified';
    expect(clone2.description).toBe('Original');
  });

  it('should list all template keys', () => {
    const items = [
      { id: '1', type: 'project' as const, title: 'P1', description: '', date: '', meta: [] },
      { id: '2', type: 'project' as const, title: 'P2', description: '', date: '', meta: [] },
      { id: '3', type: 'project' as const, title: 'P3', description: '', date: '', meta: [] },
    ];

    items.forEach((item, i) => {
      registry.register(`Template ${i + 1}`, item);
    });

    const keys = registry.getAllKeys();
    expect(keys.length).toBe(3);
    expect(keys).toContain('Template 1');
    expect(keys).toContain('Template 2');
    expect(keys).toContain('Template 3');
  });
});
