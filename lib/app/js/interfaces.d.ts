/// <reference types="angular" />
/// <reference types="angular-ui-router" />

// AngularJS service type definitions
interface ISocketService {
  on(event: string, cb: Function): void;
  proxy(event: string, cb: Function): void;
  isConnected(): boolean;
}

interface IStyleguideService {
  sections: {
    data: Section[];
  };
  config: {
    data: StyleGuideConfig;
  };
  variables: {
    data: Variable[];
  };
  status: {
    hasError: boolean;
    error: any;
    errType: string;
  };
  get(callback?: Function): angular.IPromise<void>;
  refresh(): void;
  refreshMarkup(): void;
}

interface IVariablesService {
  variables: Variable[];
  socket?: any;
  get(callback?: Function): angular.IPromise<Variable[]>;
  getMaster(callback?: Function): angular.IPromise<Variable[]>;
  save(name: string): void;
  discard(name: string): void;
  discardAll(): void;
  dirty(varName?: string): boolean;
  saveVariables(): void;
  resetLocal(): void;
  variableMatches(var1: Variable, var2: Variable): boolean;
  getLocalVar(variable: Variable): Variable | undefined;
  getLocalIndex(variable: Variable): number | undefined;
  getServerVar(variable: Variable): Variable | undefined;
  refreshDirtyStates(): boolean;
  refreshValues(): void;
  setSocket(newSocket: any): IVariablesService;
  addSocketListeners(): void;
  getDirtyVariables(): Variable[];
  init(socket: any): void;
}

interface IProgressService {
  color(color: string): IProgressService;
  start(): IProgressService;
  height(height: string): IProgressService;
  complete(): IProgressService;
  stop(): IProgressService;
  set(value: number): IProgressService;
  status(): number;
}

// External library type definitions
interface ILocalStorageService {
  set(key: string, value: any): boolean;
  get(key: string): any;
  remove(key: string): boolean;
  clearAll(): boolean;
  keys(): string[];
  isSupported: boolean;
}

interface Hljs {
  highlightBlock(block: HTMLElement): void;
  configure(options: any): void;
  listLanguages(): string[];
  highlightAuto(code: string, languageSubset?: string[]): any;
  registerLanguage(name: string, language: any): void;
}

declare var hljs: Hljs;

// Application data structures
interface StyleGuideConfig {
  title?: string;
  extraHead?: string[];
  disableHtml5Mode?: boolean;
  disableEncapsulation?: boolean;
  showMarkupSection?: boolean;
  showReferenceNumbers?: boolean;
  hideSubsectionsOnMainSection?: boolean;
  sideNav?: boolean;
  appRoot?: string;
  customColors?: string[];
  styleguideProcessors?: any;
}

interface StyleGuide {
  config: StyleGuideConfig;
  sections: Section[];
  variables?: Variable[];
  overview?: string;
}

interface Section {
  id: number;
  reference: string;
  header: string;
  description: string;
  modifiers: Modifier[];
  markup: string;
  deprecated: boolean;
  experimental: boolean;
  wrapper: string;
  fullPath: string;
  partial: string;
  variables: Variable[];
  parentReference: string;
  childSections?: Section[];
  hasChildren?: boolean;
  depth?: number;
  className?: string;
  renderMarkup?: string;
  css?: string;
  syntax?: string;
}

interface Modifier {
  name: string;
  description: string;
  className: string;
  markup?: string;
}

interface Variable {
  name: string;
  file: string;
  value: string;
  line: number;
  fileHash?: string;
  dirty?: boolean;
  type?: string;
  compiledValue?: string;
}

// Controller scope interfaces
interface AppControllerScope extends angular.IScope {
  markupSection: {
    isVisible: boolean;
    isFullWindow: boolean;
  };
  designerTool: {
    isVisible: boolean;
  };
}

interface MainControllerScope extends angular.IScope {
  currentReference: {
    section: Section;
  };
  sections: Section[];
  variables: Variable[];
  markupSection: {
    isVisible: boolean;
  };
}

interface SectionsControllerScope extends angular.IScope {
  sections: Section[];
  currentReference: string;
}

interface VariablesControllerScope extends angular.IScope {
  variables: Variable[];
  editableVariables: Variable[];
  deletableVariables: Variable[];
  saveVariables(): void;
  resetLocal(): void;
}

interface ElementControllerScope extends angular.IScope {
  section: Section;
  variables: Variable[];
  onlyRenderer: boolean;
}

// Event types
interface StyleguideCompileErrorEvent {
  err: string;
  file: string;
  line: number;
  column: number;
  message: string;
}

interface StyleguideCompileSuccessEvent {
  duration: number;
  filesMatched: number;
}

interface StyleguideChangeEvent {
  type: string;
  data?: any;
}

// Module augmentations for third-party libraries
declare module 'angular' {
  interface IModule {
    factory(name: 'Socket', factory: Function): IModule;
    factory(name: 'Styleguide', factory: Function): IModule;
    factory(name: 'Variables', factory: Function): IModule;
  }
}

// Deprecated interfaces (for backward compatibility)
interface StyleguideService extends IStyleguideService {}
interface VariablesService extends IVariablesService {}