// Variables.ts
// スタイルガイドの変数を管理するサービス

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
  socket: any;
  variableMatches(var1: Variable, var2: Variable): boolean;
  getLocalVar(variable: Variable): Variable | undefined;
  getLocalIndex(variable: Variable): number | undefined;
  getServerVar(variable: Variable): Variable | undefined;
  refreshDirtyStates(): boolean;
  refreshValues(): void;
  resetLocal(): void;
  setSocket(newSocket: any): VariablesService;
  addSocketListeners(): void;
  saveVariables(): void;
  getDirtyVariables(): Variable[];
  init(socket: any): void;
}

angular.module('sgApp')
  .service('Variables', ['Styleguide', '$q', '$rootScope', 'Socket', 
    function(
      Styleguide: any, 
      $q: angular.IQService, 
      $rootScope: angular.IRootScopeService, 
      Socket: any
    ): VariablesService {

      // Server data contains data initially load from the server
      const _this: VariablesService = this;
      let serverData: Variable[] = [];
      
      // variables contain the actual data passed outside the service
      // variables could not contain any keys that does not exist in the serverData object
      this.variables = [] as Variable[];

      $rootScope.$watch(function() {
        return _this.variables;
      }, function() {
        if (!_this.refreshDirtyStates() && Styleguide.status.hasError && Styleguide.status.errType === 'validation') {
          // Assume that if there isn't local changes there isn't any errors since data received from the server is always valid
          // Clear only validation errors
          Styleguide.status.hasError = false;
        }
      }, true);

      this.variableMatches = function(var1: Variable, var2: Variable): boolean {
        return var1.name === var2.name && var1.file === var2.file;
      };

      this.getLocalVar = function(variable: Variable): Variable | undefined {
        for (let i = this.variables.length - 1; i >= 0; i--) {
          if (this.variableMatches(this.variables[i], variable)) {
            return this.variables[i];
          }
        }
        return undefined;
      };

      this.getLocalIndex = function(variable: Variable): number | undefined {
        for (let i = this.variables.length - 1; i >= 0; i--) {
          if (this.variableMatches(this.variables[i], variable)) {
            return i;
          }
        }
        return undefined;
      };

      this.getServerVar = function(variable: Variable): Variable | undefined {
        for (let i = serverData.length - 1; i >= 0; i--) {
          if (this.variableMatches(serverData[i], variable)) {
            return serverData[i];
          }
        }
        return undefined;
      };

      this.refreshDirtyStates = function(): boolean {
        let hasDirtyVars = false;
        // Mark variables that differ from the server version as dirty
        angular.forEach(_this.variables, function(variable: Variable) {
          const serverVar = _this.getServerVar(variable);
          if (serverVar && serverVar.value !== variable.value) {
            variable.dirty = true;
            hasDirtyVars = true;
          } else if (serverVar && serverVar.value === variable.value && variable.dirty) {
            delete variable.dirty;
          }
        });
        return hasDirtyVars;
      };

      this.refreshValues = function(): void {
        let oldIndex: number | undefined;
        let oldValue: string;
        let newObject: Variable;
        
        if (serverData.length === 0) {
          this.variables = [];
        } else {
          for (let i = 0; i < serverData.length; i++) {
            if (this.variables[i] && !this.variableMatches(this.variables[i], serverData[i])) {
              if (!this.getServerVar(this.variables[i])) {
                // This variable does not exists anymore on the server. Remove it
                this.variables.splice(i, 1);
              } else if (this.getLocalVar(serverData[i]) && !this.getLocalVar(serverData[i])?.dirty) {
                // The variable already exists but in another position
                // It is not changed so we can just remove it
                oldIndex = this.getLocalIndex(serverData[i]);
                if (oldIndex !== undefined) {
                  this.variables.splice(oldIndex, 1);
                  this.variables.splice(i, 0, angular.copy(serverData[i]));
                }
              } else if (this.getLocalVar(serverData[i])) {
                // The variable already exists but in another position
                // It is changed so we need to keep the old values
                oldIndex = this.getLocalIndex(serverData[i]);
                if (oldIndex !== undefined) {
                  oldValue = this.variables[oldIndex].value;
                  this.variables.splice(oldIndex, 1);
                  newObject = angular.copy(serverData[i]);
                  newObject.value = oldValue;
                  this.variables.splice(i, 0, newObject);
                }
              } else {
                // The variable does not exists anywhere else. Just add it
                this.variables.splice(i, 0, angular.copy(serverData[i]));
              }
            } else if (this.variables[i] && this.variableMatches(this.variables[i], serverData[i])) {
              // The linenumber might have changed
              this.variables[i].line = serverData[i].line;

              // Variable exists already locally
              // Update value if variable does not have any local changes
              if (!this.variables[i].dirty) {
                this.variables[i].value = serverData[i].value;
              }
            } else if (!this.variables[i]) {
              // Add new local variable
              this.variables.push(angular.copy(serverData[i]));
            }
          }
        }
      };

      this.resetLocal = function(): void {
        // Reset every key to corresponding server value
        angular.forEach(this.variables, function(variable: Variable) {
          const serverVar = _this.getServerVar(variable);
          if (serverVar) {
            variable.value = serverVar.value;
          }
        });
      };

      this.setSocket = function(newSocket: any): VariablesService {
        this.socket = newSocket;
        if (this.socket) {
          this.addSocketListeners();
        }
        return this;
      };

      this.addSocketListeners = function(): void {
        this.socket.on('styleguide progress start', function() {
          $rootScope.$broadcast('progress start');
        });
        this.socket.on('styleguide progress end', function() {
          $rootScope.$broadcast('progress end');
        });
        this.socket.on('styleguide styles changed', function() {
          $rootScope.$broadcast('styles changed');
        });
      };

      this.saveVariables = function(): void {
        if (this.socket) {
          this.socket.emit('variables to server', this.getDirtyVariables());
        } else {
          throw new Error('Socket not available');
        }
      };

      this.getDirtyVariables = function(): Variable[] {
        return this.variables.filter(function(variable: Variable) {
          return variable.dirty && variable.dirty === true;
        });
      };

      // Start constructor
      this.init = function(socket: any): void {
        this.setSocket(socket);

        // Update new server data when it is available
        $rootScope.$watch(function() {
          return Styleguide.variables.data;
        }, function(newValue: Variable[]) {
          if (newValue) {
            serverData = newValue;
            _this.refreshValues();
            _this.refreshDirtyStates();
          }
        });
      };

      // Run constructor
      this.init(Socket);
      
      return this;
    }
  ]);
