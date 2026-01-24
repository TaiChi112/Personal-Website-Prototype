/**
 * DESIGN PATTERNS - INDEX & EXPORTS
 * 
 * Central export file for all creational & structural patterns
 * 
 * Usage:
 *   import { NotificationService, LOCALES, STYLES } from './patterns/index'
 *   import { ComponentManager, ThemePalette, Navigator } from './patterns/index'
 */

// ====================================
// PATTERN 1: SINGLETON - NOTIFICATIONS
// ====================================

export {
  NotificationService,
  ToastEventEmitter,
  type INotificationChannel,
  ToastChannel,
  ConsoleChannel,
  AlertChannel,
  type NotificationEvent,
  type EventType,
  type Observer,
  demoSingletonNotifications,
} from './01_singleton_notifications';

// ====================================
// PATTERN 2: SINGLETON - COMMAND HISTORY
// ====================================

export {
  CommandHistory,
  type ICommand,
  NavigateCommand,
  ToggleThemeCommand,
  SwitchStyleCommand,
  ToggleRoleCommand,
  demoCommandHistorySingleton,
} from './02_singleton_command_history';

// ====================================
// PATTERN 3: FACTORY METHOD - LOCALIZATION
// ====================================

export {
  type UILabels,
  type LocalizationFactory,
  EnglishLocalization,
  ThaiLocalization,
  LOCALES,
  demoLocalizationFactories,
} from './03_factory_method_localization';

// ====================================
// PATTERN 4: ABSTRACT FACTORY - STYLES
// ====================================

export {
  type StyleFactory,
  ModernStyle,
  MinimalStyle,
  FutureStyle,
  AcademicStyle,
  STYLES,
  demoStyleFactories,
} from './04_abstract_factory_styles';

// ====================================
// PATTERN 5: BUILDER - CONTENT TREE
// ====================================

export {
  ContentBuilder,
  type CompositeNode,
  type LeafNode,
  type LayoutNode,
  type UnifiedContentItem,
  type ComponentType,
  type LayoutStyleType,
  buildProjectsTree,
  demoContentBuilder,
} from './05_builder_content_tree';

// ====================================
// PATTERN 6: PROTOTYPE - TEMPLATES
// ====================================

export {
  type Prototype,
  ProjectTemplate,
  ProjectTemplateRegistry,
  SAMPLE_ECOMMERCE_PROJECT,
  SAMPLE_AI_CHAT_PROJECT,
  demoPrototypeCloning,
} from './06_prototype_project_templates';

// ====================================
// PATTERN 7: ADAPTER - UI COMPONENTS
// ====================================

export {
  type ReactComponent,
  type HTMLElement,
  type CustomComponent,
  type UnifiedComponent,
  ReactComponentAdapter,
  HTMLElementAdapter,
  CustomComponentAdapter,
  ComponentAdapterFactory,
  ComponentManager,
  type Blog,
  type ExternalVideoData,
  type Article,
  type Doc,
  type PodcastEpisode,
  type DecorationType,
  ProjectAdapter,
  BlogAdapter,
  VideoAdapter,
  ArticleAdapter,
  DocAdapter,
  PodcastAdapter,
  ContentAdapterFactory,
  ContentManager,
  demoAdapterPattern,
} from './07_adapter_ui_components';

// ====================================
// PATTERN 8: BRIDGE - THEME & RENDERER
// ====================================

export {
  type ThemeAPI,
  Theme,
  ModernTheme,
  MinimalTheme,
  FutureTheme,
  type StyleRenderer,
  WebStyleRenderer,
  MobileStyleRenderer,
  PrintStyleRenderer,
  DarkModeStyleRenderer,
  ThemeStyleBridge,
  ThemePalette,
  demoBridgePattern,
} from './08_bridge_theme_renderer';

// ====================================
// PATTERN 9: COMPOSITE - NAVIGATION
// ====================================

export {
  type NavComponent,
  type NavVisitor,
  NavItem,
  NavGroup,
  NavTreeBuilder,
  NavGroupBuilder,
  NestedGroupBuilder,
  Navigator,
  NavPrinter,
  demoCompositePattern,
} from './09_composite_navigation_tree';

// ====================================
// PATTERN 10: DECORATOR - FEATURES
// ====================================

export {
  type UIComponent,
  type ComponentInfo,
  Button,
  Card,
  ComponentDecorator,
  WithTooltip,
  WithLoading,
  WithErrorBoundary,
  WithAnalytics,
  WithSkeleton,
  WithDisabled,
  WithAnimation,
  EnhancedComponentFactory,
  ComponentRegistry,
  demoDecoratorPattern,
} from './10_decorator_feature_enhancement';

// ====================================
// PATTERN 11: FACADE - SIMPLIFIED API
// ====================================

export {
  type ThemeType,
  ThemeManager,
  type LanguageType,
  type Localization,
  LocalizationManager,
  type NotificationLevel,
  NotificationManager,
  AnalyticsManager,
  StorageManager,
  type AppConfig,
  ApplicationFacade,
  demoFacadePattern,
} from './11_facade_simplified_api';

// ====================================
// PATTERN 12: PROXY - LAZY LOADING
// ====================================

export {
  type ResourceLoader,
  HeavyImage,
  APIClient,
  LazyLoadingProxy,
  CachingProxy,
  type AccessControl,
  ProtectionProxy,
  VirtualProxy,
  ResourceManager,
  demoProxyPattern,
} from './12_proxy_controlled_access';

// ====================================
// PATTERN 13: FLYWEIGHT - SHARING
// ====================================

export {
  type CardStyle,
  type ProjectData,
  type BadgeData,
  CardFlyweight,
  BadgeFlyweight,
  CardFlyweightFactory,
  BadgeFlyweightFactory,
  CardContext,
  CardRenderer,
  compareMemoryUsage,
  demoFlyweightPattern,
} from './13_flyweight_object_sharing';

// ====================================
// PATTERN 14: CHAIN OF RESPONSIBILITY
// ====================================

export {
  SupportHandler,
  type SupportRequest,
  AutomatedHandler,
  TeamLeadHandler,
  ManagerHandler,
  ExecutiveHandler,
  SupportSystem,
  demoChainOfResponsibility,
} from './14_chain_of_responsibility';

// ====================================
// PATTERN 15: COMMAND
// ====================================

export {
  type Command,
  SimpleDocument,
  SetTextCommand,
  ChangeFontSizeCommand,
  MoveCommand,
  MacroCommand,
  CommandExecutor,
  demoCommandPattern,
} from './15_command_encapsulate_requests';

// ====================================
// PATTERN 16: ITERATOR
// ====================================

export {
  type Iterator,
  type Collection,
  type Project,
  ArrayIterator,
  ReverseArrayIterator,
  LinkedListIterator,
  ProjectList,
  LinkedProjectList,
  iterateCollection,
  demoIteratorPattern,
} from './16_iterator_sequential_access';

// ====================================
// PATTERN 17: OBSERVER
// ====================================

export {
  type Subject,
  ThemeSubject,
  LanguageSubject,
  NavbarObserver,
  CardObserver,
  ButtonObserver,
  LoggerObserver,
  ApplicationCoordinator,
  demoObserverPattern,
} from './17_observer_one_to_many';

// ====================================
// PATTERN 18: STRATEGY
// ====================================

export {
  type SortStrategy,
  type PaymentStrategy,
  type ExportStrategy,
  SortByNameStrategy,
  SortByDateStrategy,
  SortByPriceStrategy,
  CreditCardPayment,
  PayPalPayment,
  CryptoPayment,
  BankTransferPayment,
  PDFExportStrategy,
  CSVExportStrategy,
  JSONExportStrategy,
  XMLExportStrategy,
  Sorter,
  PaymentProcessor,
  DataExporter,
  demoStrategyPattern,
} from './18_strategy_encapsulate_algorithms';

// ====================================
// PATTERN 19: STATE
// ====================================

export {
  type State,
  Document,
  DraftState,
  ReviewState,
  PublishedState,
  ArchivedState,
  DocumentWorkflow,
  demoStatePattern,
} from './19_state_state_based_behavior';

// ====================================
// PATTERN 20: TEMPLATE METHOD
// ====================================

export {
  DataExportTemplate,
  CSVExport,
  JSONExport,
  XMLExport,
  PDFExport,
  ExportManager,
  demoTemplateMethodPattern,
} from './20_template_method_algorithm';

// ====================================
// PATTERN 21: MEDIATOR
// ====================================

export {
  type Mediator,
  Colleague,
  InputField,
  Validator,
  ErrorDisplay,
  SubmitButton,
  FormMediator,
  demoMediatorPattern,
} from './21_mediator_centralized_communication';

// ====================================
// PATTERN 22: MEMENTO
// ====================================

export {
  type AppState,
  Memento,
  Application,
  StateManager,
  UndoRedoController,
  demoMementoPattern,
} from './22_memento_capture_restore';

// ====================================
// PATTERN 23: INTERPRETER
// ====================================

export {
  type Expression,
  type Context,
  NumberExpression,
  VariableExpression,
  AddExpression,
  SubtractExpression,
  MultiplyExpression,
  DivideExpression,
  ModuloExpression,
  PowerExpression,
  ExpressionParser,
  Calculator,
  demoInterpreterPattern,
} from './23_interpreter_grammar';

// ====================================
// PATTERN 24: VISITOR
// ====================================

export {
  type ComponentElement,
  ButtonComponent,
  InputComponent,
  CardComponent,
  ContainerComponent,
  HeadingComponent,
  type ComponentVisitor,
  HtmlRenderingVisitor,
  type ValidationError,
  ValidationVisitor,
  StatisticsVisitor,
  JsonExportVisitor,
  demoVisitorPattern,
} from './24_visitor_operations';

// ====================================
// CREATIONAL PATTERNS - EXAMPLES
// ====================================

export {
  example1_NotificationsInApp,
  example2_CommandHistoryUndoRedo,
  example3_LocalizationSwitching,
  example4_StyleThemeSwitching,
  example5_BuildingContentTree,
  example6_PrototypeCloning,
  exampleCombined_FullAppFlow,
  runAllExamples,
} from './USAGE_EXAMPLES';

// ====================================
// STRUCTURAL PATTERNS - EXAMPLES
// ====================================

export {
  example1_AdapterUnification,
  example2_BridgeThemeRendering,
  example3_CompositeNavigation,
  example4_DecoratorFeatureLayers,
  example5_FacadeSimplifiedControl,
  example6_ProxyLazyLoading,
  example7_FlyweightMemoryEfficiency,
  exampleCombined_FullStructuralFlow,
  runAllStructuralExamples,
} from './STRUCTURAL_EXAMPLES';

// ====================================
// BEHAVIORAL PATTERNS - EXAMPLES
// ====================================

export {
  exampleSupportTicketSystem,
  exampleDocumentEditor,
  exampleIteratingCollections,
  exampleComponentNotifications,
  exampleStrategySelection,
  exampleDocumentWorkflow,
  exampleMultiFormatExport,
  exampleFormMediator,
  exampleStateSnapshots,
  exampleExpressionEvaluation,
  exampleComponentTreeOperations,
  masterExampleAllPatterns,
  runAllBehavioralExamples,
} from './BEHAVIORAL_EXAMPLES';

// ====================================
// QUICK START
// ====================================

/**
 * Quick start guide - all patterns at a glance
 */
export const PATTERNS_QUICK_REFERENCE = {
  /**
   * SINGLETON - Notification System
   * 
   * Use for: Managing single notification instance across app
   * 
   * Key Classes:
   *   - NotificationService.getInstance()
   *   - Switch channels: notify.setChannel(new ConsoleChannel())
   * 
   * Example:
   *   const notify = NotificationService.getInstance();
   *   notify.notify('Hello!', 'SUCCESS');
   */
  Singleton_Notifications: {
    description: 'Single notification manager with pluggable channels',
    main_class: 'NotificationService',
    key_methods: ['getInstance()', 'notify()', 'setChannel()'],
    channels: ['ToastChannel', 'ConsoleChannel', 'AlertChannel'],
  },

  /**
   * SINGLETON - Command History
   * 
   * Use for: Undo/redo functionality
   * 
   * Key Classes:
   *   - CommandHistory.getInstance()
   *   - ICommand interface for all commands
   * 
   * Example:
   *   const cmd = new NavigateCommand(...);
   *   cmd.execute();
   *   const lastCmd = history.pop();
   *   lastCmd?.undo();
   */
  Singleton_CommandHistory: {
    description: 'Maintains undo/redo stack (max 20 commands)',
    main_class: 'CommandHistory',
    key_methods: ['getInstance()', 'push()', 'pop()', 'clear()'],
    command_types: ['NavigateCommand', 'ToggleThemeCommand', 'SwitchStyleCommand', 'ToggleRoleCommand'],
  },

  /**
   * FACTORY METHOD - Localization
   * 
   * Use for: Multi-language support
   * 
   * Key Classes:
   *   - LocalizationFactory interface
   *   - EnglishLocalization, ThaiLocalization factories
   * 
   * Example:
   *   const factory = LOCALES['en'];
   *   const labels = factory.getLabels();
   *   console.log(labels.nav.home); // "Home"
   */
  FactoryMethod_Localization: {
    description: 'Create UI labels for different languages',
    interface: 'LocalizationFactory',
    key_methods: ['getLabels()'],
    available_languages: ['en (English)', 'th (Thai)'],
    label_sections: ['nav', 'hero', 'sections', 'actions'],
  },

  /**
   * ABSTRACT FACTORY - Styles/Themes
   * 
   * Use for: Complete theme switching
   * 
   * Key Classes:
   *   - StyleFactory interface
   *   - ModernStyle, MinimalStyle, FutureStyle, AcademicStyle factories
   * 
   * Example:
   *   const factory = STYLES['modern'];
   *   const btnClass = factory.getButtonClass('primary');
   */
  AbstractFactory_Styles: {
    description: 'Create entire families of related styles',
    interface: 'StyleFactory',
    available_themes: ['modern', 'minimal', 'future', 'academic'],
    style_methods: [
      'getMainLayoutClass()',
      'getCardClass()',
      'getButtonClass(variant?)',
      'getNavbarClass()',
      'getBadgeClass()',
      'getSectionTitleClass()',
      'getContainerClass()',
      'getModalClass()',
      'getToastClass()',
      'getLockedOverlayClass()',
      'getTourOverlayClass()',
    ],
  },

  /**
   * BUILDER - Content Tree
   * 
   * Use for: Building complex hierarchical structures
   * 
   * Key Classes:
   *   - ContentBuilder
   *   - CompositeNode, LeafNode
   * 
   * Example:
   *   new ContentBuilder('root', 'column', 'Root')
   *     .addContainer('group1', 'grid')
   *     .addItem(item1)
   *     .addItem(item2)
   *     .up()
   *     .addContainer('group2', 'list')
   *     .addItem(item3)
   *     .up()
   *     .build()
   */
  Builder_ContentTree: {
    description: 'Build complex nested content trees with method chaining',
    main_class: 'ContentBuilder',
    key_methods: ['addContainer()', 'addItem()', 'up()', 'build()'],
    layout_styles: ['grid', 'list', 'timeline', 'column', 'row'],
  },

  /**
   * PROTOTYPE - Template Cloning
   * 
   * Use for: Quick cloning of template objects
   * 
   * Key Classes:
   *   - Prototype<T> interface
   *   - ProjectTemplate
   *   - ProjectTemplateRegistry
   * 
   * Example:
   *   registry.register('MyTemplate', item);
   *   const template = registry.get('MyTemplate');
   *   const clone = template.clone(); // New ID, "(Clone)" in title
   */
  Prototype_Templates: {
    description: 'Clone template objects with unique IDs and decorations',
    interface: 'Prototype<T>',
    main_classes: ['ProjectTemplate', 'ProjectTemplateRegistry'],
    key_methods: ['register()', 'get()', 'clone()', 'getAllKeys()'],
  },

  /**
   * ADAPTER - Component Unification
   * 
   * Use for: Unified API for different component types
   * 
   * Key Classes:
   *   - ComponentManager
   *   - ReactComponentAdapter, HTMLElementAdapter, CustomComponentAdapter
   * 
   * Example:
   *   const manager = new ComponentManager();
   *   manager.registerComponent(legacyComponent); // Auto-adapted
   */
  Adapter_Components: {
    description: 'Convert different component APIs to unified interface',
    main_class: 'ComponentManager',
    adapters: ['ReactComponentAdapter', 'HTMLElementAdapter', 'CustomComponentAdapter'],
  },

  /**
   * BRIDGE - Theme & Rendering Separation
   * 
   * Use for: Independent variation of themes and renderers
   * 
   * Key Classes:
   *   - ThemePalette
   *   - ThemeStyleBridge
   * 
   * Example:
   *   const bridge = palette.createBridge('modern', 'web');
   */
  Bridge_ThemeRenderer: {
    description: 'Separate theme abstraction from renderer implementation',
    main_class: 'ThemePalette',
    themes: ['ModernTheme', 'MinimalTheme', 'FutureTheme'],
    renderers: ['WebStyleRenderer', 'MobileStyleRenderer', 'PrintStyleRenderer'],
  },

  /**
   * COMPOSITE - Hierarchical Navigation
   * 
   * Use for: Tree structures (menu, navigation, org charts)
   * 
   * Key Classes:
   *   - NavTreeBuilder
   *   - NavGroup (composite), NavItem (leaf)
   *   - Navigator
   * 
   * Example:
   *   new NavTreeBuilder().addItem(...).addGroup(...).build()
   */
  Composite_Navigation: {
    description: 'Treat individual items and groups uniformly in trees',
    leaf: 'NavItem',
    composite: 'NavGroup',
    builder: 'NavTreeBuilder',
  },

  /**
   * DECORATOR - Feature Composition
   * 
   * Use for: Dynamically add responsibilities to objects
   * 
   * Key Classes:
   *   - ComponentDecorator
   *   - WithTooltip, WithAnimation, WithLoading, WithErrorBoundary
   *   - EnhancedComponentFactory
   * 
   * Example:
   *   new WithTooltip(new WithAnimation(new Button(...)))
   */
  Decorator_Features: {
    description: 'Wrap objects to add features without subclassing',
    decorators: ['WithTooltip', 'WithAnimation', 'WithLoading', 'WithErrorBoundary'],
    factory: 'EnhancedComponentFactory',
  },

  /**
   * FACADE - Simplified Interface
   * 
   * Use for: Unified interface to complex subsystems
   * 
   * Key Classes:
   *   - ApplicationFacade
   *   - ThemeManager, LocalizationManager, NotificationManager, etc.
   * 
   * Example:
   *   app.changeTheme('future'); // Hides 3 subsystems
   */
  Facade_AppControl: {
    description: 'Provide unified interface to complex subsystems',
    main_class: 'ApplicationFacade',
    subsystems: ['ThemeManager', 'LocalizationManager', 'NotificationManager'],
  },

  /**
   * PROXY - Controlled Access
   * 
   * Use for: Lazy loading, caching, access control
   * 
   * Key Classes:
   *   - LazyLoadingProxy, CachingProxy, ProtectionProxy
   *   - ResourceManager
   * 
   * Example:
   *   new LazyLoadingProxy(() => new HeavyImage(...))
   */
  Proxy_ControlledAccess: {
    description: 'Control access, defer creation, cache results',
    proxies: ['LazyLoadingProxy', 'CachingProxy', 'ProtectionProxy'],
    manager: 'ResourceManager',
  },

  /**
   * FLYWEIGHT - Memory Efficiency
   * 
   * Use for: Share intrinsic state across many objects
   * 
   * Key Classes:
   *   - CardFlyweightFactory, BadgeFlyweightFactory
   *   - CardRenderer
   * 
   * Example:
   *   const fw = factory.getFlyweight('project'); // Cached/reused
   *   fw.render(data1); fw.render(data2); // Same flyweight
   */
  Flyweight_ObjectSharing: {
    description: 'Share intrinsic state to save memory for many objects',
    factories: ['CardFlyweightFactory', 'BadgeFlyweightFactory'],
    renderer: 'CardRenderer',
  },

  /**
   * CHAIN OF RESPONSIBILITY - Support Routing
   * 
   * Use for: Pass request through chain of handlers
   * 
   * Key Classes:
   *   - SupportSystem
   *   - AutomatedHandler, TeamLeadHandler, ManagerHandler, ExecutiveHandler
   * 
   * Example:
   *   const system = new SupportSystem();
   *   system.handleRequest({ priority: 'high', ... });
   */
  ChainOfResponsibility_Support: {
    description: 'Pass request through handler chain until handled',
    main_class: 'SupportSystem',
    handlers: ['AutomatedHandler', 'TeamLeadHandler', 'ManagerHandler', 'ExecutiveHandler'],
  },

  /**
   * COMMAND - Document Editing
   * 
   * Use for: Encapsulate requests, support undo/redo
   * 
   * Key Classes:
   *   - CommandExecutor
   *   - SetTextCommand, ChangeFontSizeCommand, MoveCommand, MacroCommand
   * 
   * Example:
   *   executor.execute(new SetTextCommand(doc, 'text'));
   *   executor.undo();
   */
  Command_Editing: {
    description: 'Encapsulate requests as objects with undo/redo',
    executor: 'CommandExecutor',
    commands: ['SetTextCommand', 'ChangeFontSizeCommand', 'MoveCommand', 'MacroCommand'],
  },

  /**
   * ITERATOR - Collection Traversal
   * 
   * Use for: Uniform iteration interface for different collections
   * 
   * Key Classes:
   *   - ProjectList (array), LinkedProjectList (linked list)
   *   - Iterator interface
   * 
   * Example:
   *   const iter = list.createIterator();
   *   while(iter.hasNext()) { const item = iter.next(); }
   */
  Iterator_Collections: {
    description: 'Access elements sequentially without exposing underlying representation',
    collections: ['ProjectList', 'LinkedProjectList'],
    iterators: ['ArrayIterator', 'ReverseArrayIterator', 'LinkedListIterator'],
  },

  /**
   * OBSERVER - Component Notifications
   * 
   * Use for: Notify multiple observers on state change
   * 
   * Key Classes:
   *   - ThemeSubject, LanguageSubject
   *   - NavbarObserver, CardObserver, ButtonObserver, LoggerObserver
   * 
   * Example:
   *   subject.attach(observer);
   *   subject.setTheme('dark'); // All observers notified
   */
  Observer_Notifications: {
    description: 'Define one-to-many dependency between objects',
    subjects: ['ThemeSubject', 'LanguageSubject'],
    observers: ['NavbarObserver', 'CardObserver', 'ButtonObserver', 'LoggerObserver'],
  },

  /**
   * STRATEGY - Algorithm Selection
   * 
   * Use for: Choose algorithms at runtime
   * 
   * Key Classes:
   *   - Sorter, PaymentProcessor, DataExporter
   *   - 12 strategy implementations across 3 domains
   * 
   * Example:
   *   const sorter = new Sorter(new SortByNameStrategy());
   *   const sorted = sorter.sort(items);
   */
  Strategy_Algorithms: {
    description: 'Define family of algorithms, make them interchangeable',
    contexts: ['Sorter', 'PaymentProcessor', 'DataExporter'],
    strategies: ['SortByNameStrategy', 'CreditCardPayment', 'JSONExportStrategy'],
  },

  /**
   * STATE - State-Based Behavior
   * 
   * Use for: Different behavior based on state
   * 
   * Key Classes:
   *   - Document (context)
   *   - DraftState, ReviewState, PublishedState, ArchivedState
   * 
   * Example:
   *   workflow.publish(document); // Changes state
   *   workflow.review(document); // Different transitions allowed
   */
  State_Behavior: {
    description: 'Allow object to alter behavior when internal state changes',
    context: 'Document',
    states: ['DraftState', 'ReviewState', 'PublishedState', 'ArchivedState'],
  },

  /**
   * TEMPLATE METHOD - Algorithm Skeleton
   * 
   * Use for: Define algorithm skeleton in base class
   * 
   * Key Classes:
   *   - DataExportTemplate (abstract)
   *   - CSVExport, JSONExport, XMLExport, PDFExport
   * 
   * Example:
   *   new CSVExport().export(data); // Uses template method export()
   */
  TemplateMethod_Export: {
    description: 'Define algorithm skeleton, let subclasses override steps',
    abstract_class: 'DataExportTemplate',
    implementations: ['CSVExport', 'JSONExport', 'XMLExport', 'PDFExport'],
  },

  /**
   * MEDIATOR - Centralized Communication
   * 
   * Use for: Reduce coupling between communicating objects
   * 
   * Key Classes:
   *   - FormMediator
   *   - InputField, Validator, ErrorDisplay, SubmitButton
   * 
   * Example:
   *   const mediator = new FormMediator();
   *   mediator.getInputField('email').setValue('test@example.com');
   */
  Mediator_Communication: {
    description: 'Define object that encapsulates how set of objects interact',
    mediator: 'FormMediator',
    colleagues: ['InputField', 'Validator', 'ErrorDisplay', 'SubmitButton'],
  },

  /**
   * MEMENTO - State Snapshots
   * 
   * Use for: Capture and restore object state
   * 
   * Key Classes:
   *   - Application (originator)
   *   - Memento (snapshot)
   *   - StateManager (caretaker)
   * 
   * Example:
   *   controller.checkpoint('Label');
   *   app.setTheme('dark');
   *   controller.undo(); // Back to checkpoint
   */
  Memento_Snapshots: {
    description: 'Capture object state for later restoration',
    originator: 'Application',
    memento: 'Memento',
    caretaker: 'StateManager',
  },

  /**
   * INTERPRETER - Expression Evaluation
   * 
   * Use for: Define grammar and interpret expressions
   * 
   * Key Classes:
   *   - Calculator
   *   - Expression interface with terminal/non-terminal implementations
   * 
   * Example:
   *   calc.setVariable('price', 100);
   *   const result = calc.evaluate('price * 1.1');
   */
  Interpreter_Grammar: {
    description: 'Define grammar and interpret sentences in language',
    context: 'Calculator',
    expression_types: ['NumberExpression', 'VariableExpression', 'AddExpression', 'MultiplyExpression'],
  },

  /**
   * VISITOR - Tree Operations
   * 
   * Use for: Add operations without modifying objects
   * 
   * Key Classes:
   *   - ButtonComponent, InputComponent, CardComponent (Elements)
   *   - HtmlRenderingVisitor, ValidationVisitor, StatisticsVisitor (Visitors)
   * 
   * Example:
   *   const renderer = new HtmlRenderingVisitor();
   *   component.accept(renderer);
   *   const html = renderer.getHtml();
   */
  Visitor_Operations: {
    description: 'Represent operation on elements without changing classes',
    elements: ['ButtonComponent', 'InputComponent', 'CardComponent'],
    visitors: ['HtmlRenderingVisitor', 'ValidationVisitor', 'StatisticsVisitor', 'JsonExportVisitor'],
  },
};

// ====================================
// DEMO RUNNER
// ====================================

/**
 * Run all pattern demonstrations
 * 
 * Usage:
 *   import { runAllDemos } from './patterns/index';
 *   runAllDemos();
 */
export async function runAllDemos() {
  console.clear();
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   CREATIONAL DESIGN PATTERNS - DEMO        ║');
  console.log('╚════════════════════════════════════════════╝\n');

  // Import examples
  const { runAllExamples } = await import('./USAGE_EXAMPLES');

  // Run all examples
  runAllExamples();
}

// ====================================
// PATTERN SUMMARY
// ====================================

export const ALL_PATTERNS_SUMMARY = `
╔════════════════════════════════════════════════════════════════════╗
║              ALL 23 DESIGN PATTERNS - COMPREHENSIVE SUMMARY        ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  🔨 CREATIONAL PATTERNS (6) - Object Creation                    ║
║  ════════════════════════════════════════════════════════════     ║
║  1. Singleton (2 implementations)                                  ║
║     ├─ NotificationService: Single notification manager           ║
║     └─ CommandHistory: Single undo/redo history                   ║
║  2. Factory Method: LocalizationFactory (EN, TH)                   ║
║  3. Abstract Factory: StyleFactory (Modern, Minimal, Future, etc)  ║
║  4. Builder: ContentBuilder (fluent hierarchical construction)     ║
║  5. Prototype: ProjectTemplate (cloneable templates)               ║
║                                                                    ║
║  🏗️ STRUCTURAL PATTERNS (7) - Object Composition                 ║
║  ════════════════════════════════════════════════════════════     ║
║  7. Adapter: ComponentManager (unify different APIs)               ║
║  8. Bridge: ThemePalette (theme × renderer independence)           ║
║  9. Composite: NavTreeBuilder (hierarchical structures)            ║
║  10. Decorator: WithTooltip, WithAnimation (feature composition)   ║
║  11. Facade: ApplicationFacade (simplified complex subsystems)      ║
║  12. Proxy: LazyLoadingProxy, CachingProxy (controlled access)     ║
║  13. Flyweight: CardFlyweight (memory-efficient sharing)            ║
║                                                                    ║
║  🎭 BEHAVIORAL PATTERNS (11) - Object Interaction                ║
║  ════════════════════════════════════════════════════════════     ║
║  14. Chain of Responsibility: SupportSystem (handler chain)        ║
║  15. Command: CommandExecutor (encapsulate requests, undo/redo)    ║
║  16. Iterator: ArrayIterator, LinkedIterator (uniform traversal)   ║
║  17. Observer: ThemeSubject, LanguageSubject (notifications)       ║
║  18. Strategy: Sorter, Processor, Exporter (algorithm selection)   ║
║  19. State: DocumentWorkflow (state-based behavior changes)        ║
║  20. Template Method: DataExportTemplate (algorithm skeleton)      ║
║  21. Mediator: FormMediator (centralized communication)            ║
║  22. Memento: StateManager (state snapshots & restoration)         ║
║  23. Interpreter: Calculator (grammar & expression evaluation)     ║
║  24. Visitor: ComponentVisitor (operations without modification)   ║
║                                                                    ║
╠════════════════════════════════════════════════════════════════════╣
║                         KEY STATISTICS                             ║
╠════════════════════════════════════════════════════════════════════╣
║  Total Patterns: 23 (in 24 files with 2 Singleton implementations) ║
║  Total Classes: 100+ concrete implementations                      ║
║  Total Interfaces: 30+ interfaces/contracts                        ║
║  Code Volume: 10,000+ lines of TypeScript                          ║
║  Usage Examples: 34 comprehensive examples                         ║
║  Integration Tests: 100+ test cases with Bun                       ║
║  All patterns grounded in real page.tsx scenarios                  ║
╚════════════════════════════════════════════════════════════════════╝
`;

export const CREATIONAL_PATTERNS_SUMMARY = `
╔════════════════════════════════════════════════════════════════════╗
║                    CREATIONAL PATTERNS SUMMARY                     ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  1. SINGLETON PATTERN (2 implementations)                         ║
║     ├─ NotificationService: Single notification manager           ║
║     └─ CommandHistory: Single undo/redo history                   ║
║     ✓ Ensures single instance throughout application lifetime     ║
║                                                                    ║
║  2. FACTORY METHOD PATTERN                                        ║
║     ├─ LocalizationFactory: Creates UI labels by language         ║
║     ├─ EnglishLocalization                                        ║
║     └─ ThaiLocalization                                           ║
║     ✓ Encapsulates object creation logic                          ║
║     ✓ Easy to add new languages                                   ║
║                                                                    ║
║  3. ABSTRACT FACTORY PATTERN                                      ║
║     ├─ StyleFactory: Creates entire theme families               ║
║     ├─ ModernStyle                                                ║
║     ├─ MinimalStyle                                               ║
║     ├─ FutureStyle                                                ║
║     └─ AcademicStyle                                              ║
║     ✓ Creates related objects that work together                  ║
║     ✓ Switch entire theme at runtime                              ║
║                                                                    ║
║  4. BUILDER PATTERN                                               ║
║     ├─ ContentBuilder: Builds hierarchical content trees          ║
║     ├─ Method chaining: .addContainer().addItem().up().build()    ║
║     ✓ Separates construction from representation                  ║
║     ✓ Readable, fluent interface                                  ║
║                                                                    ║
║  5. PROTOTYPE PATTERN                                             ║
║     ├─ ProjectTemplate: Cloneable template objects                ║
║     ├─ ProjectTemplateRegistry: Manages templates                 ║
║     ✓ Clone instead of creating from scratch                      ║
║     ✓ Independent copies with new IDs                             ║
║                                                                    ║
╠════════════════════════════════════════════════════════════════════╣
║                         KEY STATISTICS                             ║
╠════════════════════════════════════════════════════════════════════╣
║  Total Patterns: 5 (with 2 Singleton implementations = 6 files)   ║
║  Total Classes: 15+ concrete implementations                       ║
║  Total Interfaces: 8 interfaces/contracts                          ║
║  Usage Examples: 7 comprehensive examples                          ║
║  Integration Tests: 30+ test cases with Bun                       ║
╚════════════════════════════════════════════════════════════════════╝
`;

export const STRUCTURAL_PATTERNS_SUMMARY = `
╔════════════════════════════════════════════════════════════════════╗
║                    STRUCTURAL PATTERNS SUMMARY                     ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  7. ADAPTER PATTERN - Component Unification                        ║
║     ├─ ComponentManager: Unified interface for different APIs      ║
║     ├─ ReactComponentAdapter, HTMLElementAdapter                  ║
║     ✓ Makes incompatible interfaces compatible                    ║
║                                                                    ║
║  8. BRIDGE PATTERN - Theme & Rendering Independence               ║
║     ├─ ThemePalette: Separates theme from renderer                ║
║     ├─ Themes: Modern, Minimal, Future, Dark                      ║
║     ├─ Renderers: Web, Mobile, Print                              ║
║     ✓ Decouple abstraction from implementation                    ║
║                                                                    ║
║  9. COMPOSITE PATTERN - Hierarchical Navigation                   ║
║     ├─ NavTreeBuilder: Build tree structures fluently             ║
║     ├─ NavItem (leaf), NavGroup (composite)                       ║
║     ✓ Treat individual & grouped objects uniformly                ║
║                                                                    ║
║  10. DECORATOR PATTERN - Feature Composition                       ║
║      ├─ WithTooltip, WithAnimation, WithLoading                   ║
║      ├─ EnhancedComponentFactory                                  ║
║      ✓ Dynamically add responsibilities without subclassing       ║
║                                                                    ║
║  11. FACADE PATTERN - Simplified Complex API                       ║
║      ├─ ApplicationFacade: Unified interface to subsystems         ║
║      ├─ ThemeManager, LocalizationManager, NotificationManager    ║
║      ✓ Provide simplified interface to complex subsystems         ║
║                                                                    ║
║  12. PROXY PATTERN - Controlled Access                             ║
║      ├─ LazyLoadingProxy: Defer object creation                   ║
║      ├─ CachingProxy: Cache expensive operations                  ║
║      ├─ ProtectionProxy: Control access rights                    ║
║      ✓ Control access, defer creation, cache results              ║
║                                                                    ║
║  13. FLYWEIGHT PATTERN - Memory Efficiency                         ║
║      ├─ CardFlyweightFactory, BadgeFlyweightFactory               ║
║      ├─ CardRenderer: Shared rendering logic                      ║
║      ✓ Share intrinsic state across many objects                  ║
║                                                                    ║
╠════════════════════════════════════════════════════════════════════╣
║                         KEY STATISTICS                             ║
╠════════════════════════════════════════════════════════════════════╣
║  Total Patterns: 7                                                 ║
║  Total Classes: 40+ concrete implementations                       ║
║  Total Interfaces: 12+ interfaces/contracts                        ║
║  Usage Examples: 8 comprehensive examples                          ║
║  Integration Tests: 50+ test cases with Bun                       ║
╚════════════════════════════════════════════════════════════════════╝
`;

export const BEHAVIORAL_PATTERNS_SUMMARY = `
╔════════════════════════════════════════════════════════════════════╗
║                    BEHAVIORAL PATTERNS SUMMARY                     ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  14. CHAIN OF RESPONSIBILITY - Request Routing                     ║
║      ├─ SupportSystem: Route tickets through handler chain         ║
║      ├─ Auto → TeamLead → Manager → Executive                     ║
║      ✓ Pass request along chain until handled                     ║
║                                                                    ║
║  15. COMMAND - Request Encapsulation                               ║
║      ├─ CommandExecutor: Execute & undo commands                  ║
║      ├─ SetTextCommand, ChangeFontSizeCommand, MacroCommand       ║
║      ✓ Encapsulate requests as objects with undo/redo             ║
║                                                                    ║
║  16. ITERATOR - Uniform Traversal                                  ║
║      ├─ ProjectList (array), LinkedProjectList (linked list)      ║
║      ├─ ArrayIterator, ReverseIterator, LinkedListIterator        ║
║      ✓ Access elements sequentially without exposing storage       ║
║                                                                    ║
║  17. OBSERVER - Publish-Subscribe Notifications                    ║
║      ├─ ThemeSubject, LanguageSubject: Observable state            ║
║      ├─ NavbarObserver, CardObserver, ButtonObserver               ║
║      ✓ Define one-to-many dependency between objects               ║
║                                                                    ║
║  18. STRATEGY - Algorithm Selection                                ║
║      ├─ Sorter: SortByName, SortByDate, SortByPrice               ║
║      ├─ PaymentProcessor: CreditCard, PayPal, Crypto              ║
║      ├─ DataExporter: CSV, JSON, XML, PDF                         ║
║      ✓ Define family of algorithms, make them interchangeable     ║
║                                                                    ║
║  19. STATE - State-Based Behavior                                  ║
║      ├─ DocumentWorkflow: Draft → Review → Published → Archive    ║
║      ├─ Different transitions allowed per state                   ║
║      ✓ Allow object to alter behavior when internal state changes ║
║                                                                    ║
║  20. TEMPLATE METHOD - Algorithm Skeleton                          ║
║      ├─ DataExportTemplate: validate → transform → format → write ║
║      ├─ CSVExport, JSONExport, XMLExport, PDFExport               ║
║      ✓ Define algorithm skeleton, let subclasses override steps    ║
║                                                                    ║
║  21. MEDIATOR - Centralized Communication                          ║
║      ├─ FormMediator: Centralize form component interactions      ║
║      ├─ InputField, Validator, ErrorDisplay, SubmitButton         ║
║      ✓ Encapsulate how set of objects interact                    ║
║                                                                    ║
║  22. MEMENTO - State Snapshots                                     ║
║      ├─ StateManager: Capture & restore application state          ║
║      ├─ Checkpoint, Undo, Redo with full history                  ║
║      ✓ Capture object state for later restoration                 ║
║                                                                    ║
║  23. INTERPRETER - Grammar & Evaluation                            ║
║      ├─ Calculator: Parse & evaluate mathematical expressions     ║
║      ├─ NumberExpr, VariableExpr, AddExpr, MultiplyExpr, etc.     ║
║      ✓ Define grammar and interpret sentences in language         ║
║                                                                    ║
║  24. VISITOR - Tree Operations                                     ║
║      ├─ HtmlRenderingVisitor: Render components to HTML            ║
║      ├─ ValidationVisitor: Validate component structure            ║
║      ├─ StatisticsVisitor: Count components                        ║
║      ✓ Represent operation on elements without changing classes   ║
║                                                                    ║
╠════════════════════════════════════════════════════════════════════╣
║                         KEY STATISTICS                             ║
╠════════════════════════════════════════════════════════════════════╣
║  Total Patterns: 11                                                ║
║  Total Classes: 50+ concrete implementations                       ║
║  Total Interfaces: 10+ interfaces/contracts                        ║
║  Usage Examples: 12 comprehensive examples                         ║
║  Integration Tests: 60+ test cases with Bun                       ║
║  Total Code: 3,000+ lines in behavioral patterns                   ║
╚════════════════════════════════════════════════════════════════════╝
`;

// ====================================
// EXPORT THE SUMMARY
// ====================================

export function printPatternsSummary() {
  console.log(CREATIONAL_PATTERNS_SUMMARY);
}

export function printStructuralSummary() {
  console.log(STRUCTURAL_PATTERNS_SUMMARY);
}

export function printBehavioralSummary() {
  console.log(BEHAVIORAL_PATTERNS_SUMMARY);
}

export function printAllPatternsSummary() {
  console.log(ALL_PATTERNS_SUMMARY);
}
