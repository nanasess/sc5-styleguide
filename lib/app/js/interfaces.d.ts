// filepath: /home/nanasess/git-repos/sc5-styleguide/lib/app/js/interfaces.d.ts
// 共通インターフェース定義
interface Section {
  reference: string;
  header?: string;
  renderMarkup?: string;
  modifiers?: any[];
  parentReference?: string;
  variables?: string[];
  markup?: string;
  className?: string;
}

interface StyleguideService {
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

interface Variable {
  name: string;
  file: string;
  value: string;
  line?: number;
  fileHash?: string;
  dirty?: boolean;
}

interface VariablesService {
  variables: Variable[];
  saveVariables: () => void;
  resetLocal: () => void;
}
