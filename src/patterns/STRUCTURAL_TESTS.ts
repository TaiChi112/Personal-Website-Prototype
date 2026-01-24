/**
 * STRUCTURAL PATTERNS - INTEGRATION TESTS
 * Using bun:test framework
 */

import { describe, it, expect, beforeEach } from 'bun:test';

import {
  ThemePalette,
  NavTreeBuilder,
  Navigator,
  Button,
  Card,
  WithTooltip,
  WithLoading,
  WithErrorBoundary,
  WithAnimation,
  EnhancedComponentFactory,
  ApplicationFacade,
  LazyLoadingProxy,
  CachingProxy,
  ProtectionProxy,
  HeavyImage,
  APIClient,
  CardFlyweightFactory,
  BadgeFlyweightFactory,
  CardRenderer,
  ComponentManager,
  ComponentAdapterFactory,
} from './index';

// ====================================
// ADAPTER PATTERN TESTS
// ====================================

describe('Adapter Pattern - UI Components', () => {
  let manager: ComponentManager;

  beforeEach(() => {
    manager = new ComponentManager();
  });

  it('should adapt React component to unified interface', () => {
    const legacyComponent = {
      componentName: 'HeroSection',
      props: { title: 'Test' },
      renderElement: function () {
        return { type: 'div', children: this.props.title };
      },
      getMeta: () => ({ category: 'hero', responsive: true }),
    };

    const id = manager.registerComponent(legacyComponent);
    const info = manager.getComponentInfo(id);

    expect(info?.name).toBe('HeroSection');
    expect(info?.category).toBe('hero');
    expect(info?.responsive).toBe(true);
  });

  it('should adapt HTML component to unified interface', () => {
    const htmlComponent = {
      tag: 'section',
      attributes: { id: 'features' },
      children: '<h2>Features</h2>',
      generate: function () {
        return `<${this.tag} id="${this.attributes.id}">${this.children}</${this.tag}>`;
      },
    };

    const id = manager.registerComponent(htmlComponent);
    const info = manager.getComponentInfo(id);

    expect(info?.name).toContain('SECTION');
    expect(info?.category).toBe('layout');
  });

  it('should manage multiple component types uniformly', () => {
    manager.registerComponent({
      componentName: 'Comp1',
      props: {},
      renderElement: () => ({ type: 'div', children: '1' }),
      getMeta: () => ({ category: 'hero' }),
    });

    manager.registerComponent({
      tag: 'section',
      attributes: {},
      children: 'content',
      generate: () => '<section>content</section>',
    });

    const components = manager.listComponents();
    expect(components.length).toBe(2);
    expect(components[0].type).toBe('react-component');
    expect(components[1].type).toBe('html-element');
  });

  it('should throw on unknown component type', () => {
    expect(() => {
      ComponentAdapterFactory.createAdapter({ unknown: true }, 'test-id');
    }).toThrow();
  });
});

// ====================================
// BRIDGE PATTERN TESTS
// ====================================

describe('Bridge Pattern - Theme & Renderer', () => {
  let palette: ThemePalette;

  beforeEach(() => {
    palette = new ThemePalette();
  });

  it('should create theme-renderer combinations', () => {
    const bridge = palette.createBridge('modern', 'web');
    expect(bridge.getInfo()).toContain('Modern');
    expect(bridge.getInfo()).toContain('Web');
  });

  it('should get different styles for different themes', () => {
    const modern = palette.createBridge('modern', 'web');
    const minimal = palette.createBridge('minimal', 'web');

    const modernButton = modern.getCompleteStyle().button;
    const minimalButton = minimal.getCompleteStyle().button;

    expect(modernButton).not.toEqual(minimalButton);
  });

  it('should get different renders for different renderers', () => {
    const web = palette.createBridge('modern', 'web');
    const mobile = palette.createBridge('modern', 'mobile');

    const webStyle = web.getCompleteStyle();
    const mobileStyle = mobile.getCompleteStyle();

    expect(webStyle.renderer).toBe('Web');
    expect(mobileStyle.renderer).toBe('Mobile');
  });

  it('should list all available combinations', () => {
    const combinations = palette.listAvailableCombinations();
    // 3 themes × 4 renderers = 12 combinations
    expect(combinations.length).toBe(12);
  });

  it('should throw on invalid theme/renderer', () => {
    expect(() => {
      palette.createBridge('invalid', 'web');
    }).toThrow();
  });
});

// ====================================
// COMPOSITE PATTERN TESTS
// ====================================

describe('Composite Pattern - Navigation Tree', () => {
  let navigator: Navigator;

  beforeEach(() => {
    const nav = new NavTreeBuilder('Root')
      .addItem('Home', '/')
      .addGroup('Services', '⚙️')
      .addItem('Design', '/services/design')
      .addItem('Dev', '/services/dev')
      .closeGroup()
      .addItem('About', '/about')
      .build();

    navigator = new Navigator(nav);
  });

  it('should create navigation tree', () => {
    const items = navigator.getAllItems();
    expect(items.length).toBe(4); // Home, Design, Dev, About
  });

  it('should navigate to valid paths', () => {
    expect(navigator.navigateTo('/')).toBe(true);
    expect(navigator.navigateTo('/services/design')).toBe(true);
    expect(navigator.navigateTo('/about')).toBe(true);
  });

  it('should handle invalid paths', () => {
    expect(navigator.navigateTo('/invalid')).toBe(false);
  });

  it('should track current path', () => {
    navigator.navigateTo('/services/dev');
    expect(navigator.getCurrentPath()).toBe('/services/dev');
  });

  it('should render HTML structure', () => {
    const html = navigator.render();
    expect(html).toContain('Home');
    expect(html).toContain('Services');
    expect(html).toContain('Design');
  });

  it('should support nested groups', () => {
    const nav = new NavTreeBuilder('Root')
      .addGroup('Level1')
      .addNestedGroup('Level2')
      .addItem('Level3', '/level3')
      .closeNested()
      .closeGroup()
      .build();

    const navigator2 = new Navigator(nav);
    expect(navigator2.navigateTo('/level3')).toBe(true);
  });
});

// ====================================
// DECORATOR PATTERN TESTS
// ====================================

describe('Decorator Pattern - Feature Enhancement', () => {
  it('should create simple button', () => {
    const btn = new Button('Click me');
    const meta = btn.getMetadata();

    expect(meta.type).toBe('Button');
    expect(meta.decorators.length).toBe(0);
  });

  it('should add single decorator', () => {
    const btn = new Button('Click me');
    const withTooltip = new WithTooltip(btn, 'Click to submit');
    const meta = withTooltip.getMetadata();

    expect(meta.decorators).toContain('WithTooltip');
  });

  it('should stack multiple decorators', () => {
    let btn: Button | WithTooltip | WithAnimation = new Button('Action');
    btn = new WithTooltip(btn, 'Do action');
    btn = new WithAnimation(btn, 'fade-in');

    const meta = btn.getMetadata();
    expect(meta.decorators.length).toBe(2);
    expect(meta.decorators).toContain('WithTooltip');
    expect(meta.decorators).toContain('WithAnimation');
  });

  it('should render with decorators applied', () => {
    const btn = new WithAnimation(new Button('Save'), 'pulse');
    const html = btn.render();

    expect(html).toContain('animated');
    expect(html).toContain('pulse');
  });

  it('should toggle loading state', () => {
    const withLoading = new WithLoading(new Button('Load'));
    const rendered1 = withLoading.render();

    withLoading.setLoading(true);
    const rendered2 = withLoading.render();

    expect(rendered1).toContain('button');
    expect(rendered2).toContain('Loading');
  });

  it('should display error when set', () => {
    const withError = new WithErrorBoundary(new Card('Title', 'Content'));
    const rendered1 = withError.render();

    withError.setError('Something went wrong');
    const rendered2 = withError.render();

    expect(rendered1).toContain('card');
    expect(rendered2).toContain('Error');
    expect(rendered2).toContain('Something went wrong');
  });

  it('should create buttons with factory', () => {
    const btn = EnhancedComponentFactory.createButton('Save', {
      tooltip: 'Save the file',
      animated: true,
    });

    const meta = btn.getMetadata();
    expect(meta.decorators).toContain('WithTooltip');
    expect(meta.decorators).toContain('WithAnimation');
  });
});

// ====================================
// FACADE PATTERN TESTS
// ====================================

describe('Facade Pattern - Simplified API', () => {
  let app: ApplicationFacade;

  beforeEach(() => {
    app = new ApplicationFacade();
    app.initialize();
  });

  it('should initialize application', () => {
    const config = app.getConfig();
    expect(config.theme).toBeDefined();
    expect(config.language).toBeDefined();
  });

  it('should change theme through facade', () => {
    app.changeTheme('future');
    expect(app.getConfig().theme).toBe('future');
  });

  it('should switch language through facade', () => {
    app.switchLanguage('th');
    expect(app.getConfig().language).toBe('th');
  });

  it('should get translations', () => {
    app.switchLanguage('en');
    const trans = app.getTranslations();

    expect(trans.nav).toBeDefined();
    expect(trans.hero).toBeDefined();
    expect(trans.nav.home).toBe('Home');
  });

  it('should get Thai translations', () => {
    app.switchLanguage('th');
    const trans = app.getTranslations();

    expect(trans.nav.home).toBe('หน้าแรก');
  });

  it('should get available themes', () => {
    const themes = app.getAvailableThemes();
    expect(themes).toContain('modern');
    expect(themes).toContain('future');
  });

  it('should reset to defaults', () => {
    app.changeTheme('future');
    app.switchLanguage('th');

    app.resetConfiguration();
    const config = app.getConfig();

    expect(config.theme).toBe('modern');
    expect(config.language).toBe('en');
  });

  it('should track notifications', () => {
    app.showNotification('Test message', 'info');
    const notifs = app.getNotifications();

    expect(notifs.length).toBeGreaterThan(0);
  });
});

// ====================================
// PROXY PATTERN TESTS
// ====================================

describe('Proxy Pattern - Lazy Loading & Control', () => {
  it('should create lazy proxy without loading', () => {
    const lazyImage = new LazyLoadingProxy(
      () => new HeavyImage('/test.jpg'),
      'Test Image'
    );

    expect((lazyImage as LazyLoadingProxy).isLoaded()).toBe(false);
  });

  it('should load on first access', async () => {
    const lazyAPI = new LazyLoadingProxy(
      () => new APIClient('/api/test'),
      'Test API'
    );

    await lazyAPI.load();
    expect((lazyAPI as LazyLoadingProxy).isLoaded()).toBe(true);
  });

  it('should cache data after load', () => {
    const real = new APIClient('/api/data');
    const cached = new CachingProxy(real);

    const data1 = cached.getData();
    const data2 = cached.getData();

    expect(data1).toBe(data2);
  });

  it('should track access with cache', () => {
    const real = new APIClient('/api/test');
    const cached = new CachingProxy(real);

    cached.getData();
    cached.getData();
    cached.getData();

    const stats = (cached as { getAccessStats(): { total: number; cacheHits: number } }).getAccessStats();
    expect(stats.total).toBe(3);
  });

  it('should clear cache', () => {
    const cached = new CachingProxy(new APIClient('/api/test'));
    cached.getData();
    (cached as CachingProxy).clearCache();

    const stats = (cached as CachingProxy).getAccessStats();
    expect(stats.cacheHits).toBe(0);
  });

  it('should enforce access control', () => {
    const control = {
      canAccess: (resource: string) => !resource.includes('admin'),
    };

    const adminAPI = new ProtectionProxy(
      new APIClient('/api/admin'),
      control
    );

    expect(() => {
      adminAPI.getData();
    }).toThrow();
  });
});

// ====================================
// FLYWEIGHT PATTERN TESTS
// ====================================

describe('Flyweight Pattern - Object Sharing', () => {
  let cardFactory: CardFlyweightFactory;
  let badgeFactory: BadgeFlyweightFactory;

  beforeEach(() => {
    cardFactory = new CardFlyweightFactory();
    badgeFactory = new BadgeFlyweightFactory();
  });

  it('should create and reuse card flyweights', () => {
    const fw1 = cardFactory.getFlyweight('project');
    const fw2 = cardFactory.getFlyweight('project');

    expect(fw1).toBe(fw2); // Same instance (cached)
  });

  it('should create different flyweights for different types', () => {
    const project = cardFactory.getFlyweight('project');
    const article = cardFactory.getFlyweight('article');

    expect(project).not.toBe(article);
  });

  it('should get factory stats', () => {
    cardFactory.getFlyweight('project');
    cardFactory.getFlyweight('article');
    cardFactory.getFlyweight('feature');

    const stats = (cardFactory as { getStats(): { cached: number } }).getStats();
    expect(stats.cached).toBe(3);
  });

  it('should render card with data', () => {
    const fw = cardFactory.getFlyweight('project');
    const data = {
      id: '1',
      title: 'Test Project',
      description: 'Test Description',
      tags: ['React'],
      imageUrl: '/img.jpg',
      url: '/project',
    };

    const html = fw.render(data);
    expect(html).toContain('Test Project');
    expect(html).toContain('React');
  });

  it('should render badges with factory', () => {
    const fw = badgeFactory.getFlyweight('medium');
    const badge = {
      id: 'b1',
      label: 'React',
      color: '#61dafb',
    };

    const html = fw.render(badge);
    expect(html).toContain('React');
    expect(html).toContain('#61dafb');
  });

  it('should render multiple items with single flyweight', () => {
    const renderer = new CardRenderer(cardFactory, badgeFactory);

    const projects = Array.from({ length: 100 }, (_, i) => ({
      id: `p${i}`,
      title: `Project ${i}`,
      description: `Desc ${i}`,
      tags: ['React'],
      imageUrl: '/img.jpg',
      url: `/p${i}`,
    }));

    renderer.renderCards(projects);

    const stats = renderer.getStats();
    expect(stats.cardFlyweights).toBe(1); // One shared flyweight for all 100 cards
  });

  it('should maintain separate flyweights for different sizes', () => {
    badgeFactory.getFlyweight('small');
    badgeFactory.getFlyweight('medium');
    badgeFactory.getFlyweight('large');

    // Flyweights should be cached and reused
    const fw1 = badgeFactory.getFlyweight('small');
    const fw2 = badgeFactory.getFlyweight('small');

    expect(fw1).toBe(fw2);
  });
});

// ====================================
// INTEGRATION TESTS
// ====================================

describe('Structural Patterns - Integration', () => {
  it('should compose multiple patterns', () => {
    // Facade coordinates everything
    const app = new ApplicationFacade();
    app.initialize();

    // Adapter unifies components
    const manager = new ComponentManager();
    manager.registerComponent({
      componentName: 'Test',
      props: {},
      renderElement: () => ({ type: 'div', children: 'Test' }),
    });

    // Decorator adds features
    const btn = EnhancedComponentFactory.createButton('Action', {
      tooltip: 'Do something',
      animated: true,
    });

    // Flyweight renders many cards
    const renderer = new CardRenderer(
      new CardFlyweightFactory(),
      new BadgeFlyweightFactory()
    );

    expect(app.getConfig()).toBeDefined();
    expect(manager.listComponents().length).toBe(1);
    expect(btn.getMetadata().decorators.length).toBe(2);
  });

  it('should handle complex decorator chains', () => {
    const card = EnhancedComponentFactory.createCard('Title', 'Content', {
      withErrorBoundary: true,
      withSkeleton: true,
      animated: true,
    });

    const meta = card.getMetadata();
    expect(meta.decorators.length).toBe(3);
  });
});
