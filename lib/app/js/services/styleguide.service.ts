import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SocketService } from './socket.service';

interface ResponseData {
  config: any;
  variables: any;
  sections: any;
}

interface StyleguideStatus {
  hasError: boolean;
  error: any;
  errType: string;
}

@Injectable({
  providedIn: 'root'
})
export class StyleguideService {
  // Data observables
  private sectionsSubject = new BehaviorSubject<any>({});
  private configSubject = new BehaviorSubject<any>({});
  private variablesSubject = new BehaviorSubject<any>({});
  private statusSubject = new BehaviorSubject<StyleguideStatus>({
    hasError: false,
    error: {},
    errType: ''
  });
  
  // Public observables
  sections$ = this.sectionsSubject.asObservable();
  config$ = this.configSubject.asObservable();
  variables$ = this.variablesSubject.asObservable();
  status$ = this.statusSubject.asObservable();
  
  // Legacy properties for AngularJS compatibility
  sections: any = {};
  config: any = {};
  variables: any = {};
  status: StyleguideStatus = {
    hasError: false,
    error: {},
    errType: ''
  };
  
  private refreshSubject = new Subject<void>();
  
  constructor(
    private http: HttpClient,
    private socketService: SocketService,
    @Inject('$rootScope') private $rootScope: any
  ) {
    this.setupSocketListeners();
    this.setupRefreshDebounce();
    this.setupAngularJSCompatibility();
    
    // Get initial data
    this.get();
  }
  
  get(): Promise<void> {
    return this.http.get<ResponseData>('styleguide.json').toPromise()
      .then((response) => {
        // Update observables
        this.configSubject.next(response.config);
        this.variablesSubject.next(response.variables);
        this.sectionsSubject.next(response.sections);
        
        // Update legacy properties for AngularJS compatibility
        this.config.data = response.config;
        this.variables.data = response.variables;
        this.sections.data = response.sections;
        
        if (!this.socketService.isConnected()) {
          this.socketService.connect();
        }
      });
  }
  
  refresh(): void {
    this.refreshSubject.next();
  }
  
  private setupRefreshDebounce(): void {
    this.refreshSubject.pipe(
      debounceTime(800)
    ).subscribe(() => {
      this.get();
    });
  }
  
  private setupSocketListeners(): void {
    this.socketService.on('styleguide compile error', (err: any) => {
      const newStatus: StyleguideStatus = {
        hasError: true,
        error: err,
        errType: 'compile'
      };
      this.statusSubject.next(newStatus);
      this.status = newStatus;
    });
    
    this.socketService.on('styleguide validation error', (err: any) => {
      const newStatus: StyleguideStatus = {
        hasError: true,
        error: err,
        errType: 'validation'
      };
      this.statusSubject.next(newStatus);
      this.status = newStatus;
    });
    
    this.socketService.on('styleguide compile success', () => {
      const newStatus: StyleguideStatus = {
        hasError: false,
        error: {},
        errType: ''
      };
      this.statusSubject.next(newStatus);
      this.status = newStatus;
    });
  }
  
  private setupAngularJSCompatibility(): void {
    // Listen to AngularJS events
    this.$rootScope.$on('styles changed', () => {
      this.refresh();
    });
    
    this.$rootScope.$on('progress end', () => {
      this.refresh();
    });
  }
}

// Factory function to downgrade Angular service for AngularJS
export function styleguideServiceFactory(i: any) {
  return i.get('StyleguideService');
}

// Provider for downgraded service
export const styleguideServiceProvider = {
  provide: 'Styleguide',
  useFactory: styleguideServiceFactory,
  deps: ['$injector']
};