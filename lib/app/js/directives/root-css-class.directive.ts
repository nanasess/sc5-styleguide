import { Directive, ElementRef, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';

/**
 * ルート要素のCSSクラスを動的に管理するディレクティブ
 * UI-Routerの状態変化に応じてCSSクラスを追加/削除します
 */
@Directive({
  selector: '[routeCssClass]'
})
export class RootCssClassDirective implements OnInit, OnDestroy {
  private subscription?: Subscription;
  private currentClassname: string | null = null;

  constructor(
    private elementRef: ElementRef,
    @Inject('$rootScope') private $rootScope: any
  ) {}

  ngOnInit(): void {
    // AngularJS $rootScopeの$stateChangeSuccessイベントをリッスン
    this.$rootScope.$on('$stateChangeSuccess', 
      (event: any, toState: any, toParams: any, fromState: any) => {
        this.handleStateChange(fromState, toState);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private handleStateChange(fromState: any, toState: any): void {
    const fromClassnames: string | null = this.getStateClassName(fromState);
    const toClassnames: string | null = this.getStateClassName(toState);
    
    // クラス名が同じ場合は何もしない
    if (fromClassnames !== toClassnames) {
      // 前のクラスを削除
      if (fromClassnames) {
        this.elementRef.nativeElement.classList.remove(fromClassnames);
      }

      // 新しいクラスを追加
      if (toClassnames) {
        this.elementRef.nativeElement.classList.add(toClassnames);
      }

      this.currentClassname = toClassnames;
    }
  }

  private getStateClassName(state: any): string | null {
    if (state && state.viewClass) {
      return 'root-' + state.viewClass;
    }
    return null;
  }
}

// AngularJS互換性のためのファクトリー関数
export function rootCssClassDirectiveFactory() {
  return {
    restrict: 'A',
    scope: {},
    link: function (scope: any, elem: any, attrs: any, ctrl: any, $rootScope: any) {
      // Angularディレクティブが処理するため、空の実装
    }
  };
}