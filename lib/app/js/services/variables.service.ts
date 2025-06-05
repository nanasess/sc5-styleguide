import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SocketService } from './socket.service';
import { StyleguideService } from './styleguide.service';

interface Variable {
  name: string;
  file: string;
  value: string;
  line?: number;
  fileHash?: string;
  dirty?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class VariablesService {
  // Server data contains data initially loaded from the server
  private serverData: Variable[] = [];
  
  // Observable for variables
  private variablesSubject = new BehaviorSubject<Variable[]>([]);
  public variables$ = this.variablesSubject.asObservable();
  
  // Legacy property for AngularJS compatibility
  public variables: Variable[] = [];
  
  constructor(
    private socketService: SocketService,
    private styleguideService: StyleguideService,
    @Inject('$rootScope') private $rootScope: any
  ) {
    this.init();
  }
  
  variableMatches(var1: Variable, var2: Variable): boolean {
    return var1.name === var2.name && var1.file === var2.file;
  }
  
  getLocalVar(variable: Variable): Variable | undefined {
    for (let i = this.variables.length - 1; i >= 0; i--) {
      if (this.variableMatches(this.variables[i], variable)) {
        return this.variables[i];
      }
    }
    return undefined;
  }
  
  getLocalIndex(variable: Variable): number | undefined {
    for (let i = this.variables.length - 1; i >= 0; i--) {
      if (this.variableMatches(this.variables[i], variable)) {
        return i;
      }
    }
    return undefined;
  }
  
  getServerVar(variable: Variable): Variable | undefined {
    for (let i = this.serverData.length - 1; i >= 0; i--) {
      if (this.variableMatches(this.serverData[i], variable)) {
        return this.serverData[i];
      }
    }
    return undefined;
  }
  
  refreshDirtyStates(): boolean {
    let hasDirtyVars = false;
    // Mark variables that differ from the server version as dirty
    this.variables.forEach((variable: Variable) => {
      const serverVar = this.getServerVar(variable);
      if (serverVar && serverVar.value !== variable.value) {
        variable.dirty = true;
        hasDirtyVars = true;
      } else if (serverVar && serverVar.value === variable.value && variable.dirty) {
        delete variable.dirty;
      }
    });
    return hasDirtyVars;
  }
  
  refreshValues(): void {
    let oldIndex: number | undefined;
    let oldValue: string;
    let newObject: Variable;
    
    if (this.serverData.length === 0) {
      this.variables = [];
    } else {
      for (let i = 0; i < this.serverData.length; i++) {
        if (this.variables[i] && !this.variableMatches(this.variables[i], this.serverData[i])) {
          if (!this.getServerVar(this.variables[i])) {
            // This variable does not exist anymore on the server. Remove it
            this.variables.splice(i, 1);
          } else if (this.getLocalVar(this.serverData[i]) && !this.getLocalVar(this.serverData[i])?.dirty) {
            // The variable already exists but in another position
            // It is not changed so we can just remove it
            oldIndex = this.getLocalIndex(this.serverData[i]);
            if (oldIndex !== undefined) {
              this.variables.splice(oldIndex, 1);
              this.variables.splice(i, 0, {...this.serverData[i]});
            }
          } else if (this.getLocalVar(this.serverData[i])) {
            // The variable already exists but in another position
            // It is changed so we need to keep the old values
            oldIndex = this.getLocalIndex(this.serverData[i]);
            if (oldIndex !== undefined) {
              oldValue = this.variables[oldIndex].value;
              this.variables.splice(oldIndex, 1);
              newObject = {...this.serverData[i]};
              newObject.value = oldValue;
              this.variables.splice(i, 0, newObject);
            }
          } else {
            // The variable does not exist anywhere else. Just add it
            this.variables.splice(i, 0, {...this.serverData[i]});
          }
        } else if (this.variables[i] && this.variableMatches(this.variables[i], this.serverData[i])) {
          // The line number might have changed
          this.variables[i].line = this.serverData[i].line;
          
          // Variable exists already locally
          // Update value if variable does not have any local changes
          if (!this.variables[i].dirty) {
            this.variables[i].value = this.serverData[i].value;
          }
        } else if (!this.variables[i]) {
          // Add new local variable
          this.variables.push({...this.serverData[i]});
        }
      }
    }
    
    // Emit the updated variables
    this.variablesSubject.next([...this.variables]);
  }
  
  resetLocal(): void {
    // Reset every key to corresponding server value
    this.variables.forEach((variable: Variable) => {
      const serverVar = this.getServerVar(variable);
      if (serverVar) {
        variable.value = serverVar.value;
      }
    });
    this.variablesSubject.next([...this.variables]);
  }
  
  saveVariables(): void {
    if (this.socketService.isConnected()) {
      this.socketService.emit('variables to server', this.getDirtyVariables());
    } else {
      throw new Error('Socket not available');
    }
  }
  
  getDirtyVariables(): Variable[] {
    return this.variables.filter((variable: Variable) => {
      return variable.dirty && variable.dirty === true;
    });
  }
  
  private init(): void {
    this.addSocketListeners();
    
    // Subscribe to styleguide variables updates
    this.styleguideService.variables$.subscribe((newVariables: any) => {
      if (newVariables && newVariables.data) {
        this.serverData = newVariables.data;
        this.refreshValues();
        this.refreshDirtyStates();
      }
    });
    
    // Watch for local changes (for AngularJS compatibility)
    this.$rootScope.$watch(() => this.variables, () => {
      const hasDirtyVars = this.refreshDirtyStates();
      if (!hasDirtyVars && this.styleguideService.status.hasError && 
          this.styleguideService.status.errType === 'validation') {
        // Clear validation errors if no local changes
        this.styleguideService.status.hasError = false;
      }
    }, true);
  }
  
  private addSocketListeners(): void {
    this.socketService.on('styleguide progress start', () => {
      this.$rootScope.$broadcast('progress start');
    });
    
    this.socketService.on('styleguide progress end', () => {
      this.$rootScope.$broadcast('progress end');
    });
    
    this.socketService.on('styleguide styles changed', () => {
      this.$rootScope.$broadcast('styles changed');
    });
  }
}

// Factory function to downgrade Angular service for AngularJS
export function variablesServiceFactory(i: any) {
  return i.get('VariablesService');
}

// Provider for downgraded service
export const variablesServiceProvider = {
  provide: 'Variables',
  useFactory: variablesServiceFactory,
  deps: ['$injector']
};