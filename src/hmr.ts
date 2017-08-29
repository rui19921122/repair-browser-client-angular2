import {NgModuleRef, ApplicationRef} from '@angular/core';
import {StoreModule, Store} from '@ngrx/store';
import {createNewHosts} from '@angularclass/hmr';


export const hmrBootstrap = (module: any, bootstrap: () => Promise<NgModuleRef<any>>) => {
  let ngModule: NgModuleRef<any>;
  module.hot.accept();
  bootstrap().then(mod => {
    ngModule = mod;
  });
  module.hot.dispose(() => {
    const appRef: ApplicationRef = ngModule.injector.get(ApplicationRef);
    const elements = appRef.components.map(c => c.location.nativeElement);
    const makeVisible = createNewHosts(elements);
    const sub = ngModule.injector.get<Store<any>>(Store).subscribe(v => {
      let state;
      state = v;
      ngModule.destroy();
      makeVisible();
      console.log('I will dispatch {type:\'SET_ROOT_STATE\',payload:');
      console.log(state);
      ngModule.injector.get(Store).dispatch({type: 'SET_ROOT_STATE', payload: state});
    });
    sub.unsubscribe();
  });
};
