import { Injectable, Inject, NgZone } from '@angular/core';
import { Subject, Observable } from 'rxjs';

// Socket event listener interface
interface SocketEventListener {
  event: string;
  listener: Function;
}

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: any;
  private connected: boolean = false;
  private deferredEventListeners: SocketEventListener[] = [];
  
  // Event emitters for Angular
  private connectionStatus$ = new Subject<boolean>();
  private socketError$ = new Subject<any>();
  
  constructor(
    @Inject('$window') private $window: any,
    private ngZone: NgZone
  ) {
    this.setupEventListeners();
  }
  
  isAvailable(): boolean {
    return (typeof this.$window.io !== 'undefined');
  }
  
  on(eventName: string, listener: Function): void {
    const fn = (args: any) => {
      this.ngZone.run(() => {
        listener.apply(undefined, args);
      });
    };
    
    this.deferredEventListeners.push({
      event: eventName,
      listener: fn
    });
    
    if (this.isConnected()) {
      this.socket.on(eventName, fn);
    }
  }
  
  emit(eventName: string, data?: any, callback?: Function): void {
    if (this.socket) {
      this.socket.emit(eventName, data, (...args: any[]) => {
        this.ngZone.run(() => {
          if (callback) {
            callback.apply(undefined, args);
          }
        });
      });
    }
  }
  
  isConnected(): boolean {
    return this.socket !== undefined && this.connected === true;
  }
  
  connect(): void {
    if (this.isAvailable()) {
      if (this.connected && this.socket) {
        this.socket.disconnect();
      }
      
      // Socket.IO v4 preferred method
      this.socket = this.$window.io();
      
      this.deferredEventListeners.forEach((deferred: SocketEventListener) => {
        this.socket.on(deferred.event, deferred.listener);
      });
    }
  }
  
  // Observable for connection status
  getConnectionStatus(): Observable<boolean> {
    return this.connectionStatus$.asObservable();
  }
  
  // Observable for socket errors
  getSocketErrors(): Observable<any> {
    return this.socketError$.asObservable();
  }
  
  private setupEventListeners(): void {
    this.on('connect', () => {
      this.connected = true;
      this.connectionStatus$.next(true);
    });
    
    this.on('disconnect', () => {
      this.connected = false;
      this.connectionStatus$.next(false);
    });
    
    this.on('error', (err: any) => {
      this.socketError$.next(err);
    });
  }
}

// Factory function to downgrade Angular service for AngularJS
export function socketServiceFactory(i: any) {
  return i.get('SocketService');
}

// Provider for downgraded service
export const socketServiceProvider = {
  provide: 'Socket',
  useFactory: socketServiceFactory,
  deps: ['$injector']
};