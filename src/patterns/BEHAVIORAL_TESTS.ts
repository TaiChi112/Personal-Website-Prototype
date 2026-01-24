/**
 * BEHAVIORAL PATTERNS - COMPREHENSIVE TEST SUITE
 * Tests for all 11 behavioral patterns
 */

import { describe, it, expect, beforeEach } from 'bun:test';

// ====================================
// 1. CHAIN OF RESPONSIBILITY TESTS
// ====================================

describe('Chain of Responsibility', () => {
  it('should route low priority to automated handler', () => {
    const { SupportSystem } = await import('./14_chain_of_responsibility');
    const system = new SupportSystem();
    const request = { id: '1', priority: 'low', title: 'Test', description: 'Test' };
    
    expect(() => system.handleRequest(request)).not.toThrow();
  });

  it('should route high priority to executive', () => {
    const { SupportSystem } = await import('./14_chain_of_responsibility');
    const system = new SupportSystem();
    const request = { id: '1', priority: 'critical', title: 'Test', description: 'Test' };
    
    expect(() => system.handleRequest(request)).not.toThrow();
  });

  it('should handle medium priority', () => {
    const { SupportSystem } = await import('./14_chain_of_responsibility');
    const system = new SupportSystem();
    const request = { id: '1', priority: 'medium', title: 'Test', description: 'Test' };
    
    expect(() => system.handleRequest(request)).not.toThrow();
  });
});

// ====================================
// 2. COMMAND TESTS
// ====================================

describe('Command Pattern', () => {
  it('should set document text via command', async () => {
    const { SimpleDocument, SetTextCommand, CommandExecutor } = await import(
      './15_command_encapsulate_requests'
    );
    const doc = new SimpleDocument();
    const executor = new CommandExecutor(doc);

    executor.execute(new SetTextCommand(doc, 'Hello'));
    expect(doc.getContent()).toBe('Hello');
  });

  it('should support undo', async () => {
    const { SimpleDocument, SetTextCommand, CommandExecutor } = await import(
      './15_command_encapsulate_requests'
    );
    const doc = new SimpleDocument();
    const executor = new CommandExecutor(doc);

    executor.execute(new SetTextCommand(doc, 'Hello'));
    executor.execute(new SetTextCommand(doc, 'World'));
    executor.undo();

    expect(doc.getContent()).toBe('Hello');
  });

  it('should support redo', async () => {
    const { SimpleDocument, SetTextCommand, CommandExecutor } = await import(
      './15_command_encapsulate_requests'
    );
    const doc = new SimpleDocument();
    const executor = new CommandExecutor(doc);

    executor.execute(new SetTextCommand(doc, 'Hello'));
    executor.execute(new SetTextCommand(doc, 'World'));
    executor.undo();
    executor.redo();

    expect(doc.getContent()).toBe('World');
  });

  it('should handle font size changes', async () => {
    const { SimpleDocument, ChangeFontSizeCommand, CommandExecutor } = await import(
      './15_command_encapsulate_requests'
    );
    const doc = new SimpleDocument();
    const executor = new CommandExecutor(doc);

    executor.execute(new ChangeFontSizeCommand(doc, 16));
    expect(doc.getFontSize()).toBe(16);
  });
});

// ====================================
// 3. ITERATOR TESTS
// ====================================

describe('Iterator Pattern', () => {
  it('should iterate array collection forward', async () => {
    const { ProjectList } = await import('./16_iterator_sequential_access');
    const projects = [
      { id: 1, name: 'A', status: 'active' },
      { id: 2, name: 'B', status: 'active' },
    ];
    const list = new ProjectList(projects);
    const iter = list.createIterator();

    expect(iter.hasNext()).toBe(true);
    const first = iter.next();
    expect(first.id).toBe(1);
  });

  it('should iterate linked list collection', async () => {
    const { LinkedProjectList } = await import('./16_iterator_sequential_access');
    const projects = [
      { id: 1, name: 'A', status: 'active' },
      { id: 2, name: 'B', status: 'active' },
    ];
    const list = new LinkedProjectList(projects);
    const iter = list.createIterator();

    expect(iter.hasNext()).toBe(true);
    const first = iter.next();
    expect(first.name).toBe('A');
  });

  it('should iterate in reverse', async () => {
    const { ProjectList } = await import('./16_iterator_sequential_access');
    const projects = [
      { id: 1, name: 'A', status: 'active' },
      { id: 2, name: 'B', status: 'active' },
    ];
    const list = new ProjectList(projects);
    const iter = list.getReverseIterator();

    expect(iter.hasNext()).toBe(true);
    const last = iter.next();
    expect(last.id).toBe(2);
  });
});

// ====================================
// 4. OBSERVER TESTS
// ====================================

describe('Observer Pattern', () => {
  it('should notify observers on theme change', async () => {
    const { ThemeSubject, NavbarObserver } = await import('./17_observer_one_to_many');
    const subject = new ThemeSubject();
    const observer = new NavbarObserver('Test');

    subject.attach(observer);
    expect(() => subject.setTheme('dark')).not.toThrow();
  });

  it('should notify observers on language change', async () => {
    const { LanguageSubject, CardObserver } = await import('./17_observer_one_to_many');
    const subject = new LanguageSubject();
    const observer = new CardObserver('Test');

    subject.attach(observer);
    expect(() => subject.setLanguage('th')).not.toThrow();
  });

  it('should detach observers', async () => {
    const { ThemeSubject, NavbarObserver } = await import('./17_observer_one_to_many');
    const subject = new ThemeSubject();
    const observer = new NavbarObserver('Test');

    subject.attach(observer);
    subject.detach(observer);
    expect(() => subject.setTheme('light')).not.toThrow();
  });
});

// ====================================
// 5. STRATEGY TESTS
// ====================================

describe('Strategy Pattern', () => {
  it('should sort by name', async () => {
    const { Sorter, SortByNameStrategy } = await import('./18_strategy_encapsulate_algorithms');
    const items = [
      { name: 'C', price: 3, date: new Date() },
      { name: 'A', price: 1, date: new Date() },
      { name: 'B', price: 2, date: new Date() },
    ];

    const sorter = new Sorter(new SortByNameStrategy());
    const sorted = sorter.sort(items);

    expect(sorted[0].name).toBe('A');
    expect(sorted[1].name).toBe('B');
    expect(sorted[2].name).toBe('C');
  });

  it('should sort by price', async () => {
    const { Sorter, SortByPriceStrategy } = await import('./18_strategy_encapsulate_algorithms');
    const items = [
      { name: 'C', price: 3, date: new Date() },
      { name: 'A', price: 1, date: new Date() },
      { name: 'B', price: 2, date: new Date() },
    ];

    const sorter = new Sorter(new SortByPriceStrategy());
    const sorted = sorter.sort(items);

    expect(sorted[0].price).toBe(1);
    expect(sorted[2].price).toBe(3);
  });

  it('should process credit card payment', async () => {
    const { PaymentProcessor, CreditCardPayment } = await import(
      './18_strategy_encapsulate_algorithms'
    );
    const processor = new PaymentProcessor(new CreditCardPayment());

    expect(() => processor.process(100, '1234-5678-9012-3456')).not.toThrow();
  });

  it('should export as JSON', async () => {
    const { DataExporter, JSONExportStrategy } = await import(
      './18_strategy_encapsulate_algorithms'
    );
    const exporter = new DataExporter(new JSONExportStrategy());
    const data = [{ id: 1, name: 'Test' }];

    expect(() => exporter.export(data)).not.toThrow();
  });
});

// ====================================
// 6. STATE TESTS
// ====================================

describe('State Pattern', () => {
  it('should initialize as draft', async () => {
    const { Document } = await import('./19_state_state_based_behavior');
    const doc = new Document();

    expect(doc.getState()).toBe('draft');
  });

  it('should transition through states', async () => {
    const { Document, DocumentWorkflow } = await import('./19_state_state_based_behavior');
    const doc = new Document();
    const workflow = new DocumentWorkflow();

    workflow.publish(doc);
    expect(doc.getState()).toBe('published');

    workflow.review(doc);
    expect(doc.getState()).toBe('review');
  });

  it('should track state history', async () => {
    const { Document, DocumentWorkflow } = await import('./19_state_state_based_behavior');
    const doc = new Document();
    const workflow = new DocumentWorkflow();

    workflow.publish(doc);
    workflow.review(doc);
    const history = doc.getHistory();

    expect(history.length).toBeGreaterThan(0);
    expect(history.includes('draft')).toBe(true);
  });
});

// ====================================
// 7. TEMPLATE METHOD TESTS
// ====================================

describe('Template Method Pattern', () => {
  it('should export with validation', async () => {
    const { CSVExport } = await import('./20_template_method_algorithm');
    const exporter = new CSVExport();
    const data = [{ id: 1, name: 'Test' }];

    expect(() => exporter.export(data)).not.toThrow();
  });

  it('should handle empty data', async () => {
    const { CSVExport } = await import('./20_template_method_algorithm');
    const exporter = new CSVExport();
    const data: any[] = [];

    expect(() => exporter.export(data)).not.toThrow();
  });

  it('should register and use exporters in manager', async () => {
    const { ExportManager, CSVExport } = await import('./20_template_method_algorithm');
    const manager = new ExportManager();
    manager.registerExporter('csv', new CSVExport());

    expect(() => manager.export('csv', [{ id: 1 }])).not.toThrow();
  });
});

// ====================================
// 8. MEDIATOR TESTS
// ====================================

describe('Mediator Pattern', () => {
  it('should manage form input', async () => {
    const { FormMediator } = await import('./21_mediator_centralized_communication');
    const mediator = new FormMediator();
    const field = mediator.getInputField('email');

    expect(field).toBeDefined();
    expect(() => field.setValue('test@example.com')).not.toThrow();
  });

  it('should validate email input', async () => {
    const { FormMediator } = await import('./21_mediator_centralized_communication');
    const mediator = new FormMediator();
    const field = mediator.getInputField('email');
    const submitBtn = mediator.getSubmitButton('submit');

    field.setValue('test@example.com');
    expect(submitBtn.isEnabled()).toBe(true);

    field.setValue('invalid');
    expect(submitBtn.isEnabled()).toBe(false);
  });

  it('should get input field value', async () => {
    const { FormMediator } = await import('./21_mediator_centralized_communication');
    const mediator = new FormMediator();
    const field = mediator.getInputField('email');

    field.setValue('user@domain.com');
    expect(field.getValue()).toBe('user@domain.com');
  });
});

// ====================================
// 9. MEMENTO TESTS
// ====================================

describe('Memento Pattern', () => {
  it('should create snapshot of state', async () => {
    const { Application } = await import('./22_memento_capture_restore');
    const app = new Application();

    const memento = app.createMemento();
    expect(memento).toBeDefined();

    const state = memento.getState();
    expect(state.theme).toBe('light');
  });

  it('should restore from memento', async () => {
    const { Application } = await import('./22_memento_capture_restore');
    const app = new Application();

    app.setTheme('dark');
    const memento = app.createMemento();

    app.setTheme('light');
    app.restoreFromMemento(memento);

    expect(app.getState().theme).toBe('dark');
  });

  it('should manage undo/redo', async () => {
    const { Application, StateManager, UndoRedoController } = await import(
      './22_memento_capture_restore'
    );
    const app = new Application();
    const manager = new StateManager();
    const controller = new UndoRedoController(app, manager);

    controller.checkpoint('Initial');
    app.setTheme('dark');
    controller.checkpoint('Dark theme');

    controller.undo();
    expect(app.getState().theme).toBe('light');

    controller.redo();
    expect(app.getState().theme).toBe('dark');
  });

  it('should track snapshot history', async () => {
    const { Application, StateManager, UndoRedoController } = await import(
      './22_memento_capture_restore'
    );
    const app = new Application();
    const manager = new StateManager();
    const controller = new UndoRedoController(app, manager);

    controller.checkpoint('A');
    app.setTheme('dark');
    controller.checkpoint('B');

    const history = controller.getHistory();
    expect(history.length).toBe(2);
  });
});

// ====================================
// 10. INTERPRETER TESTS
// ====================================

describe('Interpreter Pattern', () => {
  it('should evaluate simple addition', async () => {
    const { Calculator } = await import('./23_interpreter_grammar');
    const calc = new Calculator();

    const result = calc.evaluate('2 + 3');
    expect(result).toBe(5);
  });

  it('should respect operator precedence', async () => {
    const { Calculator } = await import('./23_interpreter_grammar');
    const calc = new Calculator();

    const result = calc.evaluate('2 + 3 * 4');
    expect(result).toBe(14);
  });

  it('should handle parentheses', async () => {
    const { Calculator } = await import('./23_interpreter_grammar');
    const calc = new Calculator();

    const result = calc.evaluate('(2 + 3) * 4');
    expect(result).toBe(20);
  });

  it('should evaluate with variables', async () => {
    const { Calculator } = await import('./23_interpreter_grammar');
    const calc = new Calculator();

    calc.setVariable('x', 5);
    const result = calc.evaluate('x * 2');
    expect(result).toBe(10);
  });

  it('should handle power operator', async () => {
    const { Calculator } = await import('./23_interpreter_grammar');
    const calc = new Calculator();

    const result = calc.evaluate('2 ^ 3');
    expect(result).toBe(8);
  });

  it('should throw on division by zero', async () => {
    const { Calculator } = await import('./23_interpreter_grammar');
    const calc = new Calculator();

    expect(() => calc.evaluate('5 / 0')).toThrow();
  });

  it('should throw on undefined variable', async () => {
    const { Calculator } = await import('./23_interpreter_grammar');
    const calc = new Calculator();

    expect(() => calc.evaluate('undefined_var + 5')).toThrow();
  });
});

// ====================================
// 11. VISITOR TESTS
// ====================================

describe('Visitor Pattern', () => {
  it('should create component elements', async () => {
    const { ButtonComponent, InputComponent, CardComponent } = await import(
      './24_visitor_operations'
    );

    const button = new ButtonComponent('Click', 'primary');
    const input = new InputComponent('Email', 'email');
    const card = new CardComponent('Form');

    expect(button.text).toBe('Click');
    expect(input.placeholder).toBe('Email');
    expect(card.title).toBe('Form');
  });

  it('should render components to HTML', async () => {
    const { ButtonComponent, HtmlRenderingVisitor } = await import(
      './24_visitor_operations'
    );

    const button = new ButtonComponent('Click', 'primary');
    const renderer = new HtmlRenderingVisitor();
    button.accept(renderer);

    const html = renderer.getHtml();
    expect(html).toContain('button');
    expect(html).toContain('Click');
  });

  it('should validate components', async () => {
    const { ButtonComponent, ValidationVisitor } = await import(
      './24_visitor_operations'
    );

    const button = new ButtonComponent('Valid', 'primary');
    const validator = new ValidationVisitor();
    button.accept(validator);

    expect(validator.isValid()).toBe(true);
  });

  it('should detect invalid components', async () => {
    const { ButtonComponent, ValidationVisitor } = await import(
      './24_visitor_operations'
    );

    const button = new ButtonComponent('', 'invalid'); // Empty text, invalid color
    const validator = new ValidationVisitor();
    button.accept(validator);

    expect(validator.isValid()).toBe(false);
    expect(validator.getErrors().length).toBeGreaterThan(0);
  });

  it('should collect component statistics', async () => {
    const { ButtonComponent, InputComponent, StatisticsVisitor } = await import(
      './24_visitor_operations'
    );

    const button = new ButtonComponent('Click', 'primary');
    const input = new InputComponent('Email', 'email');

    const stats = new StatisticsVisitor();
    button.accept(stats);
    input.accept(stats);

    const componentStats = stats.getStats();
    expect(componentStats.buttons).toBe(1);
    expect(componentStats.inputs).toBe(1);
    expect(componentStats.total).toBe(2);
  });

  it('should export components to JSON', async () => {
    const { ButtonComponent, JsonExportVisitor } = await import(
      './24_visitor_operations'
    );

    const button = new ButtonComponent('Click', 'primary');
    const exporter = new JsonExportVisitor();
    button.accept(exporter);

    const json = exporter.getJson();
    expect(json).toContain('button');
    expect(json).toContain('Click');
  });

  it('should handle component tree', async () => {
    const { ContainerComponent, CardComponent, ButtonComponent, HtmlRenderingVisitor } =
      await import('./24_visitor_operations');

    const container = new ContainerComponent('main');
    const card = new CardComponent('Card');
    card.addChild(new ButtonComponent('Action', 'primary'));
    container.addChild(card);

    const renderer = new HtmlRenderingVisitor();
    container.accept(renderer);

    const html = renderer.getHtml();
    expect(html).toContain('container');
    expect(html).toContain('button');
  });
});
