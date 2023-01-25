import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

//Guards
import { AuthGuard,  } from '../guards/auth.guard';

//Components
import { PagesComponent } from './pages.component';




const routes: Routes = [
    {
        path: 'dashboard',
        component: PagesComponent,
        canActivate: [ AuthGuard ],
        loadChildren: () => import('./child-routes.module').then( m => m.ChildRoutesModule )
    },
];

@NgModule({
    imports: [ RouterModule.forChild(routes) ],
    exports: [ RouterModule ]
})
export class PagesRoutingModule {}


