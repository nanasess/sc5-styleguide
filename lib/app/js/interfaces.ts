// filepath: /home/nanasess/git-repos/sc5-styleguide/lib/app/js/interfaces.ts
'use strict';

// 共通インターフェース定義
export interface Section {
  reference: string;
  header?: string;
  renderMarkup?: string;
  modifiers?: any[];
  parentReference?: string;
  variables?: string[];
}

export interface StyleguideService {
  sections: {
    data: Section[];
  };
  config: {
    data: any;
  };
  variables: any;
  status: {
    hasError: boolean;
    error: any;
    errType: string;
  };
  get(): angular.IPromise<void>;
  refresh(): void;
}

export interface Variable {
  name: string;
  file: string;
  value: string;
  line?: number;
  fileHash?: string;
  dirty?: boolean;
}

export interface VariablesService {
  variables: Variable[];
  saveVariables: () => void;
  resetLocal: () => void;
}
