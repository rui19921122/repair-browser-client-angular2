import {NgModuleRef, ApplicationRef} from '@angular/core';
import {StoreModule, Store} from '@ngrx/store';
import {createNewHosts} from '@angularclass/hmr';
import {MatDialog, MatDialogRef} from '@angular/material';
import {OverlayContainer} from '@angular/cdk/overlay';

export function get__HMR__state() {
    let state = {};
    if (window['__HMR__']) {
        const module = window['__HMR__'];
        const store = module.injector.get(Store);
        store.take(1).subscribe(s => state = s);
    }
    return state;
}


export const hmrBootstrap = (module: any, bootstrap: () => Promise<NgModuleRef<any>>) => {
    let ngModule: NgModuleRef<any>;
    module.hot.accept();
    bootstrap().then(mod => {
        ngModule = mod;
    });
    module.hot.dispose(() => {
        const appRef: ApplicationRef = ngModule.injector.get(ApplicationRef);
        const dialogRef: MatDialog = ngModule.injector.get(MatDialog);
        const overlayRef: OverlayContainer = ngModule.injector.get(OverlayContainer);
        const elements = appRef.components.map(c => c.location.nativeElement);
        elements.push(overlayRef.getContainerElement());
        const makeVisible = createNewHosts(elements);
        const sub = ngModule.injector.get<Store<any>>(Store).subscribe(v => {
            ngModule.destroy();
            makeVisible();
        });
        sub.unsubscribe();
    });
};

